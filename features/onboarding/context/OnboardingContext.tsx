import { useToast } from "@chakra-ui/react";
import { useSession } from "contexts";
import { useRefreshToken } from "hooks";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import {
	masterOnboardingSteps,
	ONBOARDING_STEP_STATUS,
	type OnboardingStep,
	type PipelineResult,
} from "../constants";
import {
	useOnboardingState,
	type OnboardingStateHook,
} from "../hooks/useOnboardingState";
import {
	createStepLookupMap,
	executePipeline,
	extractStepConfiguration,
	generateInitialSteps,
} from "../utils";

/**
 * Extended context value with navigation and pipeline helpers.
 *
 * This is the single source of truth for all onboarding state and orchestration.
 * All state lives in `state` (managed by useOnboardingState reducer),
 * and all actions/mutations go through the methods exposed here.
 *
 * ## How to add new shared state:
 * 1. Add the field to `OnboardingState` in `useOnboardingState.ts`
 * 2. Add a new action type in `OnboardingAction` union type
 * 3. Handle the action in `onboardingReducer`
 * 4. Add a convenience action creator in `useOnboardingState` hook's `actions` object
 * 5. The new state is automatically available via `state.<field>` in all consumers
 *
 * ## How to pass new state to pipeline (API calls):
 * Add the field to `sharedState` in `handleSubmit` below (search MARK: SHARED_STATE)
 *
 * ## How to add new orchestration methods:
 * 1. Define the method inside `OnboardingProvider` using `useCallback`
 * 2. Add its signature to this interface
 * 3. Include it in the `contextValue` useMemo below
 */
export interface OnboardingContextValue extends OnboardingStateHook {
	// Pipeline results for smart retry (stores last result per step)
	pipelineResults: Record<number, PipelineResult>;
	setPipelineResult: (_stepId: number, _result: PipelineResult) => void;

	// Navigation & core state
	currentStepId: number | undefined;
	currentStepConfig: OnboardingStep | undefined;

	// Orchestration methods
	initializeSteps: () => void;
	advanceToNextStep: (_completedStepId: number) => Promise<void>;
	handleSkip: (_stepId: number) => void;
	handleSubmit: (_data: any) => Promise<void>;

	// Shared data (convenience getters passed as props to the Provider)
	userName: string;
	mobile: string;
	agreementId: string;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

interface OnboardingProviderProps {
	children: ReactNode;
	userName: string;
	mobile: string;
	agreementId: string;
	onboardingSteps?: Array<{ role: number; label?: string }>;
	roleList?: Array<number> | string;
	userType?: number;
	orgMetadataOnboarding?: any; // The raw config object from orgDetail.metadata.onboarding
	refreshAgentProfile?: () => Promise<void>;
	/** Optional: pass existing state from parent (for gradual migration) */
	externalState?: {
		state: any;
		dispatch: any;
		actions: any;
	};
}

/**
 * OnboardingProvider — The "Fat Context" (Option A)
 *
 * Central orchestrator for the entire onboarding flow. Responsibilities:
 * - Owns ALL onboarding state (via useOnboardingState reducer)
 * - Generates & initializes steps once on mount (pure function pipeline)
 * - Handles step submission (pipeline execution + smart retry)
 * - Handles step navigation (advance, skip)
 * - Triggers profile refresh after steps that modify the user's backend profile
 * - Provides shared data (userName, mobile, agreementId) to all child components
 *
 * Consumers should use `useOnboardingContext()` to access these values.
 * @param {OnboardingProviderProps} props
 * @returns {JSX.Element} Provider component wrapping children with onboarding context
 */
export const OnboardingProvider = ({
	children,
	userName,
	mobile,
	agreementId,
	onboardingSteps,
	roleList,
	userType,
	orgMetadataOnboarding,
	refreshAgentProfile,
	externalState,
}: OnboardingProviderProps) => {
	// Use external state if provided, otherwise create our own
	const internalStateHook = useOnboardingState();
	const { state, dispatch, actions } = externalState || internalStateHook;

	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	// Pipeline results for tracking API execution per step (used for smart retry)
	const [pipelineResults, setPipelineResults] = useState<
		Record<number, PipelineResult>
	>({});

	// Track active step centrally
	const [currentStepId, setCurrentStepId] = useState<number | undefined>(
		undefined
	);

	/**
	 * Set pipeline result for a specific step (used for smart retry)
	 * @param {number} stepId - Unique identifier of the onboarding step
	 * @param {PipelineResult} result - Pipeline result containing status and list of API responses
	 * @returns {void}
	 */
	const setPipelineResult = useCallback(
		(stepId: number, result: PipelineResult) => {
			setPipelineResults((prev) => ({
				...prev,
				[stepId]: result,
			}));
		},
		[]
	);

	/**
	 * Initializes all steps by running the pure-function pipeline:
	 *   masterSteps → visibility filter → role filter → disabled filter → skippable marking → resume logic
	 *
	 * This should only run once when user data is available.
	 * The result is stored in `state.stepperData` and `currentStepId` is set to the first pending step.
	 *
	 * To add a new filter stage, modify `generateInitialSteps()` in `utils/stepGenerator.ts`.
	 */
	const initializeSteps = useCallback(() => {
		if (!onboardingSteps || onboardingSteps.length === 0) return;

		const baseStepData = masterOnboardingSteps;

		// Parse org metadata to extract disabled/skippable step IDs
		// The raw metadata has shape: { [userType]: { [stepName]: { hide, optional } } }
		// extractStepConfiguration parses this into numeric step ID arrays
		const stepLookupMap = createStepLookupMap(baseStepData);
		const { disabledSteps, skippableSteps } = extractStepConfiguration(
			orgMetadataOnboarding,
			userType,
			stepLookupMap
		);

		// Apply the complete filter chain into a single pure function
		const initialSteps = generateInitialSteps({
			baseStepData,
			onboardingSteps,
			roleList,
			disabledSteps,
			skippableSteps,
		});

		// Check if we found steps
		if (initialSteps.length === 0) {
			console.warn(
				"[StepConfiguration] No base step data resulted from generation"
			);
			return;
		}

		actions.setStepperData(initialSteps);

		// Mark loading as complete now that steps are initialized
		actions.setIsLoading(false);

		// Initialize currentStepId based on the first pending item
		const firstPending = initialSteps.find(
			(step) =>
				step.applicableRoles?.length &&
				step.stepStatus !== ONBOARDING_STEP_STATUS.COMPLETED &&
				step.stepStatus !== ONBOARDING_STEP_STATUS.SKIPPED
		);

		setCurrentStepId(firstPending?.id);
	}, [onboardingSteps, roleList, userType, orgMetadataOnboarding, actions]);

	/**
	 * Get the current step config from state.stepperData
	 */
	const currentStepConfig = useMemo(() => {
		if (currentStepId === undefined) return undefined;
		return state.stepperData.find((step) => step.id === currentStepId);
	}, [currentStepId, state.stepperData]);

	/**
	 * Update the status of a specific onboarding step in state
	 */
	const updateStepStatus = useCallback(
		(id: number, status: number = ONBOARDING_STEP_STATUS.COMPLETED) => {
			const updatedStepperData = state.stepperData.map((step) =>
				step.id === id ? { ...step, stepStatus: status } : step
			);
			actions.setStepperData([...updatedStepperData]);
		},
		[state.stepperData, actions]
	);

	/**
	 * Advance to the next incomplete step in the onboarding flow.
	 */
	const advanceToNextStep = useCallback(
		async (completedStepId: number) => {
			console.log(
				"[OnboardingProvider] advanceToNextStep called for:",
				completedStepId
			);

			// Find next incomplete step
			const nextStep = state?.stepperData?.find(
				(step) =>
					step.id !== completedStepId &&
					step.applicableRoles?.length &&
					step.stepStatus !== ONBOARDING_STEP_STATUS.COMPLETED &&
					step.stepStatus !== ONBOARDING_STEP_STATUS.SKIPPED
			);

			// Always mark step as completed (even if it's the last step)
			updateStepStatus(completedStepId, ONBOARDING_STEP_STATUS.COMPLETED);

			// Find step config for post-submit actions
			const stepConfig = masterOnboardingSteps.find(
				(step) => step.id === completedStepId
			);

			// Refresh user profile if configured (important for last step too)
			if (stepConfig?.postSubmit?.refreshProfile && refreshAgentProfile) {
				await refreshAgentProfile();
			}

			// Only advance to next step if one exists
			if (nextStep) {
				setCurrentStepId(nextStep.id);
				console.log(
					`[OnboardingProvider] Advancing to next step: ${nextStep.name} (ID: ${nextStep.id})`
				);
			} else {
				console.log(
					"[OnboardingProvider] No next step found. This is the last step. Onboarding flow complete."
				);
			}
		},
		[
			state?.stepperData,
			updateStepStatus,
			setCurrentStepId,
			refreshAgentProfile,
		]
	);

	/**
	 * Handle skipping of an onboarding step.
	 */
	const handleSkip = useCallback(
		(stepId: number) => {
			console.log(
				`[OnboardingProvider] Skipping step with ID: ${stepId}`
			);

			// Store updated stepper data with skip applied
			const updatedStepperData = state.stepperData.map((step) => {
				if (step.id === stepId) {
					// Mark current step as skipped
					return {
						...step,
						stepStatus: ONBOARDING_STEP_STATUS.SKIPPED,
					};
				}
				return step;
			});

			// Find current step index
			const currentStepIndex = updatedStepperData.findIndex(
				(step) => step.id === stepId
			);

			if (currentStepIndex === -1) {
				console.warn(
					`[OnboardingProvider] Step with ID ${stepId} not found in stepperData`
				);
				return;
			}

			// Find next step (first step after current that is not skipped/completed)
			const nextStep = updatedStepperData
				.slice(currentStepIndex + 1)
				.find(
					(step) =>
						step.stepStatus !== ONBOARDING_STEP_STATUS.SKIPPED &&
						step.stepStatus !== ONBOARDING_STEP_STATUS.COMPLETED
				);

			if (nextStep) {
				// Update the next step to IN_PROGRESS
				const finalStepperData = updatedStepperData.map((step) => {
					if (step.id === nextStep.id) {
						return {
							...step,
							stepStatus: ONBOARDING_STEP_STATUS.IN_PROGRESS,
						};
					}
					return step;
				});

				// Set the updated stepper data at once and persist to session storage
				actions.setStepperData(finalStepperData);

				// Update currentStepId to trigger re-render with new step config
				setCurrentStepId(nextStep.id);

				console.log(
					`[OnboardingProvider] Skipped step ${stepId}, moving to next step: ${nextStep.name} (ID: ${nextStep.id})`
				);
			} else {
				// No next step, just update current as skipped and persist
				actions.setStepperData(updatedStepperData);
				console.log(
					"[OnboardingProvider] No more steps available after skip"
				);
			}
		},
		[state.stepperData, actions]
	);

	/**
	 * Handle submission of step data. Uses the pipeline executor.
	 */
	const handleSubmit = useCallback(
		async (data: any) => {
			// Find step config from masterOnboardingSteps
			const stepConfig = masterOnboardingSteps.find(
				(step) => step.id === data?.id
			);

			if (!stepConfig) {
				console.warn(
					`[OnboardingProvider] No step config found for step ID: ${data?.id}`
				);
				return;
			}

			console.log(
				`[OnboardingProvider] Executing pipeline for step: ${stepConfig.name}`
			);

			// PRE-EXECUTION STATE UPDATES
			// Call step's onPreSubmit if defined (declarative state updates)
			stepConfig?.onPreSubmit?.(data, actions);

			// Set API in progress
			actions.setApiInProgress(true);

			// Get existing result for smart retry (if previous attempt failed)
			const existingResult = pipelineResults[data.id];
			const isRetry = existingResult?.status === "failed";

			if (isRetry) {
				console.log(
					`[OnboardingProvider] Smart retry for step ${stepConfig.name}`,
					existingResult
				);
			}

			try {
				const pipelineResult = await executePipeline({
					stepConfig,
					formData: data,
					mobile: String(mobile || ""),
					accessToken,
					generateNewToken,
					// MARK: SHARED_STATE
					// This object is passed to every API call in the pipeline.
					// To share new state with pipeline APIs:
					//   1. Add the field to OnboardingState (useOnboardingState.ts)
					//   2. Add it here so executePipeline can access it
					//   3. Use it in the relevant API config's `buildPayload` function
					sharedState: {
						mobile: String(mobile || ""),
						latLong: state.latLong,
						aadhaar: {
							number: state.aadhaar?.number ?? undefined,
							accessKey: state.aadhaar?.accessKey ?? undefined,
							userCode: state.aadhaar?.userCode ?? undefined,
						},
						digilocker: state.digilocker,
					},
					existingResult: isRetry ? existingResult : undefined,
					onSuccess: async (result: PipelineResult) => {
						console.log(
							"[OnboardingProvider] Pipeline success:",
							result
						);
						// Store result for this step (enables smart retry + component watching)
						setPipelineResult(data.id, result);
					},
					onError: async (result: PipelineResult) => {
						console.error(
							"[OnboardingProvider] Pipeline error:",
							result
						);
						// Store result for smart retry
						setPipelineResult(data.id, result);
					},
				});

				console.log(
					"[OnboardingProvider] Pipeline result:",
					pipelineResult
				);
			} catch (error) {
				console.error(
					"[OnboardingProvider] Pipeline execution error:",
					error
				);
				toast({
					title: "Something went wrong",
					status: "error",
					duration: 3000,
				});
			} finally {
				actions.setApiInProgress(false);
			}
		},
		[
			actions,
			accessToken,
			generateNewToken,
			mobile,
			pipelineResults,
			setPipelineResult,
			state.aadhaar?.accessKey,
			state.aadhaar?.number,
			state.aadhaar?.userCode,
			state.digilocker,
			state.latLong,
			toast,
		]
	);

	const contextValue: OnboardingContextValue = useMemo(
		() => ({
			// Original hook values
			state,
			dispatch,
			actions,

			// Pipeline results for smart retry
			pipelineResults,
			setPipelineResult,

			// Navigation helpers
			currentStepId,
			currentStepConfig,
			initializeSteps,
			advanceToNextStep,
			handleSkip,
			handleSubmit,

			// Shared data
			userName,
			mobile,
			agreementId,
		}),
		[
			state,
			dispatch,
			actions,
			pipelineResults,
			setPipelineResult,
			currentStepId,
			currentStepConfig,
			initializeSteps,
			advanceToNextStep,
			handleSkip,
			handleSubmit,
			userName,
			mobile,
			agreementId,
		]
	);

	return (
		<OnboardingContext.Provider value={contextValue}>
			{children}
		</OnboardingContext.Provider>
	);
};

/**
 * Hook to consume the OnboardingContext.
 * Must be used within an <OnboardingProvider> tree.
 * @returns {OnboardingContextValue} The full onboarding context including:
 *   - `state` / `actions` — central reducer state and dispatchers
 *   - `currentStepId` / `currentStepConfig` — active step tracking
 *   - `handleSubmit` / `handleSkip` / `advanceToNextStep` — orchestration methods
 *   - `pipelineResults` — per-step API execution results (for smart retry)
 *   - `userName` / `mobile` / `agreementId` — shared user data
 * @throws {Error} If used outside of OnboardingProvider
 * @example
 * ```tsx
 * const { state, handleSubmit, advanceToNextStep } = useOnboardingContext();
 * ```
 */
export const useOnboardingContext = (): OnboardingContextValue => {
	const context = useContext(OnboardingContext);
	if (!context) {
		throw new Error(
			"useOnboardingContext must be used within an OnboardingProvider"
		);
	}
	return context;
};
