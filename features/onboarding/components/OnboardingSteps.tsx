import { useToast } from "@chakra-ui/react";
import { useAppSource, useOrgDetailContext, useSession } from "contexts";
import { useRefreshToken } from "hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
	masterOnboardingSteps,
	ONBOARDING_STEP_STATUS,
	type PipelineResult,
} from "../constants";
import { OnboardingProvider, useOnboardingContext } from "../context";
import {
	createStepLookupMap,
	extractStepConfiguration,
	useStepConfiguration,
} from "../hooks";
import {
	executePipeline,
	getAgreementIdFromData,
	getMobileFromData,
	getOnboardingStepsFromData,
	getRoleListFromData,
	getUserNameFromData,
	getUserTypeFromData,
} from "../utils";
import ContentRenderer from "./ContentRenderer";
import OnboardingLayout from "./OnboardingLayout";

/**
 * OnboardingStepsContent
 *
 * Internal component that uses OnboardingContext to manage onboarding state and integrations.
 * This component must be wrapped by OnboardingProvider.
 *
 * Responsibilities:
 * - Initialize and persist step state via useStepConfiguration / useOnboardingState
 * - Route step submissions to upload/form handlers and third-party integrations (esign)
 * - Render locally defined steps using LocalStepForm overlay
 * - Handle step skip logic, widget callbacks, Android messages and pub/sub responses
 * @param {object} root0 - Component props
 * @param {boolean} root0.isAssistedOnboarding - whether assisted onboarding flow is active
 * @param {any} root0.userData - user data object (server/context)
 * @param {any} [root0.assistedAgentDetails] - assisted onboarding user details (when assisted)
 * @param {() => Promise<void>} root0.refreshAgentProfile - refresh callback to sync profile after step changes
 * @param {string} [root0.initialLatLong] - pre-fetched geolocation string (lat,long,accuracy) to populate state early
 * @returns {JSX.Element} OnboardingLayout with ContentRenderer
 */
const OnboardingStepsContent = ({
	isAssistedOnboarding,
	userData,
	assistedAgentDetails,
	refreshAgentProfile,
	initialLatLong,
}: {
	isAssistedOnboarding: boolean;
	userData: any;
	assistedAgentDetails?: any;
	refreshAgentProfile: () => Promise<void>;
	initialLatLong?: string;
}) => {
	const { state, actions, pipelineResults, setPipelineResult } =
		useOnboardingContext();
	const { isAndroid: _isAndroid } = useAppSource();
	const { orgDetail } = useOrgDetailContext();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	/**
	 * Calculate the initial step ID to render.
	 * Finds the first step that is not COMPLETED or SKIPPED.
	 * Returns undefined if all steps are completed (success state).
	 */
	const initialStepId = useMemo(() => {
		const stepsData = state?.stepperData;
		if (!stepsData || stepsData.length === 0) return undefined;

		const initialStep = stepsData.find(
			(step) =>
				step.applicableRoles?.length &&
				step.stepStatus !== ONBOARDING_STEP_STATUS.COMPLETED &&
				step.stepStatus !== ONBOARDING_STEP_STATUS.SKIPPED
		);

		return initialStep?.id;
	}, [state?.stepperData]);

	// Track the current active step for local form rendering
	// Initialize with initialStepId to avoid first-render timing issues
	const [currentStepId, setCurrentStepId] = useState<number | undefined>(
		() => initialStepId
	);

	// Set initial location in state if provided (fetched early by parent)
	useEffect(() => {
		if (initialLatLong && !state.latLong) {
			actions.setLocation(initialLatLong);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialLatLong]);

	// Determine the user details to use for onboarding
	const onboardingUserDetails = useMemo(
		() => (isAssistedOnboarding ? assistedAgentDetails : userData),
		[isAssistedOnboarding, assistedAgentDetails, userData]
	);

	const roleList = getRoleListFromData(
		onboardingUserDetails,
		isAssistedOnboarding
	);

	const userType = useMemo(
		() => getUserTypeFromData(onboardingUserDetails, isAssistedOnboarding),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	// Create step lookup map once for O(1) performance
	const stepLookupMap = useMemo(
		() => createStepLookupMap(masterOnboardingSteps),
		[]
	);

	// Extract disabled_steps and skippable_steps from org metadata based on userType
	const { disabledSteps, skippableSteps } = useMemo(() => {
		return extractStepConfiguration(
			orgDetail?.metadata?.onboarding,
			userType,
			stepLookupMap
		);
	}, [orgDetail?.metadata?.onboarding, userType, stepLookupMap]);

	const onboardingSteps = useMemo(
		() =>
			getOnboardingStepsFromData(
				onboardingUserDetails,
				isAssistedOnboarding
			),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	const mobile = useMemo(
		() => getMobileFromData(onboardingUserDetails, isAssistedOnboarding),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	// Sync currentStepId when initialStepId changes (e.g., after data loads or profile refresh)
	// This ensures form content stays in sync with stepper's active step
	useEffect(() => {
		if (initialStepId !== undefined && currentStepId !== initialStepId) {
			setCurrentStepId(initialStepId);
		}
	}, [initialStepId, currentStepId]);

	/**
	 * Get the current step config from masterOnboardingSteps
	 * Always returns the step config for the active step (ContentRenderer decides how to render)
	 * Uses initialStepId as fallback when currentStepId hasn't been set yet
	 */
	const currentStepConfig = useMemo(() => {
		// Use currentStepId if available, otherwise fall back to initialStepId
		const activeStepId = currentStepId ?? initialStepId;
		if (activeStepId === undefined) return undefined;
		return stepLookupMap.get(String(activeStepId));
	}, [currentStepId, initialStepId, stepLookupMap]);

	// Moved stepConfiguration BEFORE updateStepStatus so it can be referenced
	// Initialize step configuration hook
	const stepConfiguration = useStepConfiguration({
		actions,
		userType,
		onboardingSteps,
		roleList,
		disabledSteps,
		skippableSteps,
		userIdentifier: mobile, // Use mobile number for session storage validation
	});

	/**
	 * Update the status of a specific onboarding step
	 * @param {number} id - The ID of the step to update
	 * @param {number} status - The new status to set (default is 3)
	 */
	const updateStepStatus = useCallback(
		(id: number, status: number = ONBOARDING_STEP_STATUS.COMPLETED) => {
			const updatedStepperData = state.stepperData.map((step) =>
				step.id === id ? { ...step, stepStatus: status } : step
			);
			// Use stepConfiguration to update and persist to session storage
			stepConfiguration.updateStepStates(updatedStepperData);
		},
		[state.stepperData, stepConfiguration]
	);

	/**
	 * Advance to the next incomplete step in the onboarding flow.
	 * This is called by step components when they confirm step success.
	 * @param {number} completedStepId - The ID of the step that was just completed
	 */
	const advanceToNextStep = useCallback(
		async (completedStepId: number) => {
			console.log(
				"[OnboardingSteps] advanceToNextStep called for:",
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
			if (stepConfig?.postSubmit?.refreshProfile) {
				await refreshAgentProfile();
			}

			// Only advance to next step if one exists
			if (nextStep) {
				setCurrentStepId(nextStep.id);
				console.log(
					`[OnboardingSteps] Advancing to next step: ${nextStep.name} (ID: ${nextStep.id})`
				);
			} else {
				console.log(
					"[OnboardingSteps] No next step found. This is the last step. Onboarding flow complete."
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
	 * Initialize step configuration from provided user data.
	 * @param {object} user_data - object containing onboarding details ({ details: { ... } })
	 * @returns {void}
	 */
	const initialStepSetter = useCallback(
		(user_data) => {
			stepConfiguration.initializeSteps(user_data);
		},
		[stepConfiguration]
	);

	/**
	 * Handle submission of step data from the external widget or local form.
	 * Uses the pipeline executor to process steps according to their API configuration.
	 * Supports smart retry: if a step has a previous failed result, resumes from failed API.
	 *
	 * Special cases:
	 * - SELECTION_SCREEN: ignored (handled by RoleSelection elsewhere)
	 *
	 * MARK: Step Submit
	 * @param {object} data - widget payload
	 * @param {number} data.id - step id
	 * @param {object} [data.form_data] - form payload for the step
	 * @returns {Promise<void>}
	 */
	const handleStepDataSubmit = useCallback(
		async (data) => {
			// Find step config from masterOnboardingSteps
			const stepConfig = masterOnboardingSteps.find(
				(step) => step.id === data?.id
			);

			if (!stepConfig) {
				console.warn(
					`[OnboardingSteps] No step config found for step ID: ${data?.id}`
				);
				return;
			}

			console.log(
				`[OnboardingSteps] Executing pipeline for step: ${stepConfig.name}`
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
					`[OnboardingSteps] Smart retry for step ${stepConfig.name}`,
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
							"[OnboardingSteps] Pipeline success:",
							result
						);
						// Store result for this step (enables smart retry + component watching)
						setPipelineResult(data.id, result);
					},
					onError: async (result: PipelineResult) => {
						console.error(
							"[OnboardingSteps] Pipeline error:",
							result
						);
						// Store result for smart retry
						setPipelineResult(data.id, result);
					},
				});

				console.log(
					"[OnboardingSteps] Pipeline result:",
					pipelineResult
				);
			} catch (error) {
				console.error(
					"[OnboardingSteps] Pipeline execution error:",
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

	/**
	 * Handle skipping of an onboarding step.
	 * Marks the step SKIPPED, advances the next incomplete step to IN_PROGRESS and persists.
	 * Note: refreshAgentProfile is intentionally NOT called here to preserve resume state.
	 * MARK: Step Skip
	 * @param {number} stepId - id of the step to skip
	 * @returns {void}
	 */
	const handleOnboardingSkip = useCallback(
		(stepId: number) => {
			console.log(`[OnboardingSteps] Skipping step with ID: ${stepId}`);

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
					`[OnboardingSteps] Step with ID ${stepId} not found in stepperData`
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
				stepConfiguration.updateStepStates(finalStepperData);

				// Update currentStepId to trigger re-render with new step config
				setCurrentStepId(nextStep.id);

				console.log(
					`[OnboardingSteps] Skipped step ${stepId}, moving to next step: ${nextStep.name} (ID: ${nextStep.id})`
				);
			} else {
				// No next step, just update current as skipped and persist
				stepConfiguration.updateStepStates(updatedStepperData);
				console.log(
					"[OnboardingSteps] No more steps available after skip"
				);
			}

			// Note: Deliberately NOT calling refreshAgentProfile() here
			// The backend will sync when user completes/submits the next step
			// This prevents resume logic from resetting the skipped state
		},
		[state.stepperData, stepConfiguration]
	);

	/**
	 * Initialize step configuration when onboarding user details become available.
	 */
	useEffect(() => {
		// Only initialize if we have valid user details
		// This allows re-initialization when data becomes available after async fetch
		if (
			onboardingUserDetails &&
			Object.keys(onboardingUserDetails).length > 0
		) {
			initialStepSetter({
				details: onboardingUserDetails,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onboardingUserDetails]);

	return (
		<OnboardingLayout
			steps={state?.stepperData || []}
			currentStepId={currentStepId}
		>
			<ContentRenderer
				stepConfig={currentStepConfig}
				onSubmit={handleStepDataSubmit}
				onAdvance={advanceToNextStep}
				onSkip={handleOnboardingSkip}
				isLoading={state?.ui?.apiInProgress}
			/>
		</OnboardingLayout>
	);
};

/**
 * OnboardingSteps
 *
 * Wrapper component that provides OnboardingContext to OnboardingStepsContent.
 * Extracts user details and provides them to the context provider.
 * @param {object} props - Component props
 * @param {boolean} props.isAssistedOnboarding - whether assisted onboarding flow is active
 * @param {string} [props.logo] - organization logo URL (reserved for future use)
 * @param {string} [props.appName] - application display name (reserved for future use)
 * @param {string} [props.orgName] - organization name (reserved for future use)
 * @param {any} props.userData - user data object (server/context)
 * @param {any} props.assistedAgentDetails - assisted onboarding user details (when assisted)
 * @param {() => Promise<void>} props.refreshAgentProfile - refresh callback to sync profile after step changes
 * @param {string} [props.initialLatLong] - pre-fetched geolocation string (lat,long,accuracy) to populate state early
 * @returns {JSX.Element} OnboardingStepsContent wrapped with OnboardingProvider
 */
const OnboardingSteps = ({
	isAssistedOnboarding,
	logo: _logo,
	appName: _appName,
	orgName: _orgName,
	userData,
	assistedAgentDetails,
	refreshAgentProfile,
	initialLatLong,
}: {
	isAssistedOnboarding: boolean;
	logo?: string;
	appName?: string;
	orgName?: string;
	userData: any;
	assistedAgentDetails?: any;
	refreshAgentProfile: () => Promise<void>;
	initialLatLong?: string;
}) => {
	// Determine the user details to use for onboarding
	const onboardingUserDetails = useMemo(
		() => (isAssistedOnboarding ? assistedAgentDetails : userData),
		[isAssistedOnboarding, assistedAgentDetails, userData]
	);

	const userName = useMemo(
		() => getUserNameFromData(onboardingUserDetails, isAssistedOnboarding),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	const mobile = useMemo(
		() => getMobileFromData(onboardingUserDetails, isAssistedOnboarding),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	const agreementId = useMemo(
		() =>
			getAgreementIdFromData(onboardingUserDetails, isAssistedOnboarding),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	return (
		<OnboardingProvider
			userName={String(userName || "")}
			mobile={String(mobile || "")}
			agreementId={String(agreementId || "")}
		>
			<OnboardingStepsContent
				isAssistedOnboarding={isAssistedOnboarding}
				userData={userData}
				assistedAgentDetails={assistedAgentDetails}
				refreshAgentProfile={refreshAgentProfile}
				initialLatLong={initialLatLong}
			/>
		</OnboardingProvider>
	);
};

export default OnboardingSteps;
