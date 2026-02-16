import {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import {
	ONBOARDING_STEP_STATUS,
	type OnboardingStep,
	type PipelineResult,
} from "../constants";
import {
	useOnboardingState,
	type OnboardingStateHook,
} from "../hooks/useOnboardingState";

/**
 * Extended context value with navigation and pipeline helpers
 */
export interface OnboardingContextValue extends OnboardingStateHook {
	// Pipeline results for smart retry (stores last result per step)
	pipelineResults: Record<number, PipelineResult>;
	setPipelineResult: (_stepId: number, _result: PipelineResult) => void;

	// Navigation helpers
	currentStepConfig: OnboardingStep | undefined;
	goToStep: (_stepId: number) => void;
	getNextIncompleteStep: () => OnboardingStep | undefined;
	getStepById: (_stepId: number) => OnboardingStep | undefined;

	// Shared data (convenience getters)
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
	/** Optional: pass existing state from parent (for gradual migration) */
	externalState?: {
		state: any;
		dispatch: any;
		actions: any;
	};
}

/**
 * OnboardingProvider
 *
 * Wraps the application to provide onboarding state context.
 * Extends useOnboardingState with navigation helpers and pipeline state tracking.
 * @param {OnboardingProviderProps} props - Component props including children, mobile, agreementId, and optional external state
 * @param {ReactNode} props.children - Child components to be wrapped by the provider
 * @param {string} props.mobile - User mobile number (shared across steps)
 * @param {string} props.agreementId - Agreement ID for esign steps
 * @param {object} [props.externalState] - Optional external state for gradual migration from parent component
 * @returns {JSX.Element} Provider component that wraps children with onboarding context
 */
export const OnboardingProvider = ({
	children,
	userName,
	mobile,
	agreementId,
	externalState,
}: OnboardingProviderProps) => {
	// Use external state if provided, otherwise create our own
	const internalStateHook = useOnboardingState();
	const { state, dispatch, actions } = externalState || internalStateHook;

	// Pipeline results for tracking API execution per step (used for smart retry)
	const [pipelineResults, setPipelineResults] = useState<
		Record<number, PipelineResult>
	>({});

	/**
	 * Set pipeline result for a specific step (used for smart retry)
	 * @param {number} stepId - Unique identifier of the onboarding step
	 * @param {PipelineResult} result - Pipeline result containing status and list of API responses
	 * @returns {void}
	 */
	const setPipelineResult = (stepId: number, result: PipelineResult) => {
		setPipelineResults((prev) => ({
			...prev,
			[stepId]: result,
		}));
	};

	/**
	 * Get current step configuration
	 */
	const currentStepConfig = useMemo(() => {
		return state.stepperData.find((step) => step.id === state.currentStep);
	}, [state.stepperData, state.currentStep]);

	/**
	 * Navigate to a specific step in the onboarding flow
	 * @param {number} stepId - Unique identifier of the target onboarding step
	 * @returns {void}
	 */
	const goToStep = (stepId: number) => {
		dispatch({ type: "SET_CURRENT_STEP", payload: stepId });
	};

	/**
	 * Get next incomplete step (first step that is not COMPLETED or SKIPPED)
	 * @returns {OnboardingStep | undefined} Next incomplete step or undefined
	 */
	const getNextIncompleteStep = (): OnboardingStep | undefined => {
		return state.stepperData.find(
			(step) =>
				step.stepStatus !== ONBOARDING_STEP_STATUS.COMPLETED &&
				step.stepStatus !== ONBOARDING_STEP_STATUS.SKIPPED
		);
	};

	/**
	 * Get step configuration by ID
	 * @param {number} stepId - Unique identifier of the onboarding step to retrieve
	 * @returns {OnboardingStep | undefined} Step configuration object if found, otherwise undefined
	 */
	const getStepById = (stepId: number): OnboardingStep | undefined => {
		return state.stepperData.find((step) => step.id === stepId);
	};

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
			currentStepConfig,
			goToStep,
			getNextIncompleteStep,
			getStepById,

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
			currentStepConfig,
			userName,
			mobile,
			agreementId,
			goToStep,
			getNextIncompleteStep,
			getStepById,
		]
	);

	return (
		<OnboardingContext.Provider value={contextValue}>
			{children}
		</OnboardingContext.Provider>
	);
};

/**
 * useOnboardingContext
 *
 * Hook to access onboarding context. Must be used within OnboardingProvider.
 * @returns {OnboardingContextValue} Onboarding context value
 * @throws {Error} If used outside of OnboardingProvider
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
