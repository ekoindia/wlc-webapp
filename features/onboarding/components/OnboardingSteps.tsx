import { useToast, useToken } from "@chakra-ui/react";
import { OnboardingWidget as ExternalOnboardingWidgetBase } from "@ekoindia/oaas-widget";
import {
	useAppSource,
	useOrgDetailContext,
	usePubSub,
	useSession,
} from "contexts";
import {
	useBankList,
	useCountryStates,
	useRefreshToken,
	useShopTypes,
} from "hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ANDROID_ACTION, ANDROID_PERMISSION, doAndroidAction } from "utils";
import {
	masterOnboardingSteps,
	ONBOARDING_API_STATUS,
	ONBOARDING_STEP_IDS,
	ONBOARDING_STEP_STATUS,
} from "../constants";
import { OnboardingProvider } from "../context";
import {
	createStepLookupMap,
	extractStepConfiguration,
	useAndroidIntegration,
	useEsignIntegration,
	useOnboardingState,
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

// Type assertion to fix external component type mismatch
const ExternalOnboardingWidget =
	ExternalOnboardingWidgetBase as unknown as React.FC<{
		appName: string;
		orgName: string;
		primaryColor: string;
		accentColor: string;
		shopTypes: any;
		stateTypes: any;
		bankList: any;
		userData: any;
		handleSubmit: (_data: any) => void;
		stepResponse: any;
		stepsData: any[];
		handleStepCallBack: (_callType: any) => void;
		handleOnboardingSkip: (_stepId: number) => void;
		esignStatus: number;
		digilockerData: any;
		initialStepId?: number;
		constants?: {
			apiStatus: typeof ONBOARDING_API_STATUS;
			stepIds: typeof ONBOARDING_STEP_IDS;
			stepStatus: typeof ONBOARDING_STEP_STATUS;
		};
	}>;

/**
 * OnboardingSteps
 *
 * Manages onboarding state and integrations, and renders either the external onboarding widget
 * or a local form based on the step configuration.
 *
 * Responsibilities:
 * - Initialize and persist step state via useStepConfiguration / useOnboardingState
 * - Route step submissions to upload/form handlers and third-party integrations (esign)
 * - Render locally defined steps using LocalStepForm overlay
 * - Handle step skip logic, widget callbacks, Android messages and pub/sub responses
 * @param {object} props - Component props
 * @param {boolean} props.isAssistedOnboarding - whether assisted onboarding flow is active
 * @param {string} props.logo - organization logo URL
 * @param {string} props.appName - application display name
 * @param {string} props.orgName - organization name
 * @param {any} props.userData - user data object (server/context)
 * @param {any} props.assistedAgentDetails - assisted onboarding user details (when assisted)
 * @param {() => Promise<void>} props.refreshAgentProfile - refresh callback to sync profile after step changes
 * @param {string} [props.initialLatLong] - pre-fetched geolocation string (lat,long,accuracy) to populate state early
 * @returns {JSX.Element} ExternalOnboardingWidget wrapped with local orchestration
 */
const OnboardingSteps = ({
	isAssistedOnboarding,
	logo,
	appName,
	orgName,
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
	const { state, actions } = useOnboardingState();
	const { isAndroid } = useAppSource();
	const { subscribe, TOPICS } = usePubSub();
	const { banks: bankList } = useBankList();
	const { shopTypes: shopTypesData } = useShopTypes();
	const { states: stateTypesData } = useCountryStates();
	const { orgDetail } = useOrgDetailContext();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	// Set initial location in state if provided (fetched early by parent)
	useEffect(() => {
		if (initialLatLong && !state.latLong) {
			actions.setLocation(initialLatLong);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialLatLong]);

	// Get theme primary color
	const [primaryColor, accentColor] = useToken("colors", [
		"primary.DEFAULT",
		"accent.DEFAULT",
	]);

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

	/**
	 * Calculate the initial step ID to render.
	 * Finds the first step that has a role and is not COMPLETED or SKIPPED.
	 * Falls back to the first step if none found.
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

		return initialStep?.id ?? stepsData[0]?.id;
	}, [state?.stepperData]);

	// Track the current active step for local form rendering
	// Initialize with initialStepId to avoid first-render timing issues
	const [currentStepId, setCurrentStepId] = useState<number | undefined>(
		() => initialStepId
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

	// Initialize specialized hooks
	const esign = useEsignIntegration({
		state,
		actions,
		isAndroid,
		logo,
		agreementId,
		mobile,
		onStepSubmit: (data) => handleStepDataSubmit(data),
	});

	const android = useAndroidIntegration({
		agreementId,
		onStepSubmit: (data) => handleStepDataSubmit(data),
	});

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
			if (data?.id === ONBOARDING_STEP_IDS.SELECTION_SCREEN) {
				// Skip role selection as it's handled in RoleSelection component
				return;
			}

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
					onSuccess: async (response) => {
						console.log(
							"[OnboardingSteps] Pipeline success:",
							response
						);
						toast({
							title: data.success_message || "Success",
							status: "success",
							duration: 2000,
						});
						// Update step status
						updateStepStatus(
							data.id,
							ONBOARDING_STEP_STATUS.COMPLETED
						);
						// Advance to next incomplete step for local step tracking
						const nextStep = state?.stepperData?.find(
							(step) =>
								step.id !== data.id &&
								step.applicableRoles?.length &&
								step.stepStatus !==
									ONBOARDING_STEP_STATUS.COMPLETED &&
								step.stepStatus !==
									ONBOARDING_STEP_STATUS.SKIPPED
						);
						if (nextStep) {
							setCurrentStepId(nextStep.id);
						}
						// Refresh user profile if configured
						if (stepConfig?.postSubmit?.refreshProfile) {
							await refreshAgentProfile();
						}
					},
					onError: async (error) => {
						console.error(
							"[OnboardingSteps] Pipeline error:",
							error
						);
						// Store error response for component error handling
						actions.setLastStepResponse(error);
						toast({
							title: error?.message || "Something went wrong",
							status: "error",
							duration: 3000,
						});
						// Update step status to failed
						updateStepStatus(
							data.id,
							ONBOARDING_STEP_STATUS.FAILED
						);
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
			refreshAgentProfile,
			state.aadhaar?.accessKey,
			state.aadhaar?.number,
			state.aadhaar?.userCode,
			state.digilocker,
			state.latLong,
			state?.stepperData,
			toast,
			updateStepStatus,
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
	 * Handle callbacks dispatched by the external widget.
	 * Supports actions for esign (legality and Android permission requests.
	 * MARK: Widget Callbacks
	 * @param {object} callType - callback descriptor from widget
	 * @param {number} callType.type - step id constant indicating source step
	 * @param {string} callType.method - specific method/action requested by the widget
	 * @returns {void}
	 */
	const handleStepCallBack = (callType) => {
		if (callType.type === ONBOARDING_STEP_IDS.SIGN_AGREEMENT) {
			// Leegality Esign
			if (callType.method === "getSignUrl") {
				// Initialize script if not already loaded before getting sign URL
				if (!document.getElementById("legality")) {
					esign.initializeEsignScript();
				}
				esign.getSignUrl();
			} else if (callType.method === "legalityOpen") {
				esign.openEsign();
			} else if (callType.method === "checkEsignStatus") {
				esign.checkEsignStatus();
			}
		} else if (
			callType.type === ONBOARDING_STEP_IDS.AADHAAR_NUMBER_OTP_VERIFY
		) {
			if (callType.method === "resendOtp") {
				handleStepDataSubmit({
					id: ONBOARDING_STEP_IDS.CONFIRM_AADHAAR_NUMBER,
					form_data: {
						aadhar: state.aadhaar.number,
						is_consent: "Y",
					},
				});
			}
		} else if (callType.type === ONBOARDING_STEP_IDS.LOCATION_CAPTURE) {
			if (callType.method === "grantPermission") {
				if (isAndroid) {
					doAndroidAction(
						ANDROID_ACTION.GRANT_PERMISSION,
						ANDROID_PERMISSION.LOCATION
					);
				}
			}
		}
	};

	/**
	 * Setup Window Message Listener for eSign status updates to trigger step submission.
	 * The eSign web library sends postMessage events with type "STATUS_UPDATE" on completion from its own tab.
	 * MARK: eSign Resp
	 */
	useEffect(() => {
		const handleMessage = (event) => {
			if (event.data.type === "STATUS_UPDATE") {
				handleStepDataSubmit({
					id: ONBOARDING_STEP_IDS.SIGN_AGREEMENT,
					form_data: {
						document_id: state.esign.signUrlData?.document_id ?? "",
						agreement_id: agreementId,
					},
				});
			}
		};

		// Use AbortController to remove the event listeners when the component is unmounted
		const controller = new AbortController();
		const { signal } = controller;

		window.addEventListener("message", handleMessage, { signal });

		// Cleanup listener on component unmount
		return () => {
			controller.abort();
		};
	}, [state.esign.signUrlData, agreementId, handleStepDataSubmit]);

	/**
	 * Subscribe to Android responses for eSign status updates.
	 * MARK: Android Esign Resp
	 */
	useEffect(() => {
		const unsubscribe = subscribe(TOPICS.ANDROID_RESPONSE, (data) => {
			if (data?.action === ANDROID_ACTION.LEEGALITY_ESIGN_RESPONSE) {
				android.androidleegalityResponseHandler(data?.data);
			}
		});

		return unsubscribe;
	}, [TOPICS.ANDROID_RESPONSE, subscribe, android]);

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
		<OnboardingProvider
			userName={String(userName || "")}
			mobile={String(mobile || "")}
			agreementId={String(agreementId || "")}
			externalState={{ state, dispatch: () => {}, actions }}
		>
			<OnboardingLayout
				steps={state?.stepperData || []}
				currentStepId={currentStepId}
			>
				<ContentRenderer
					stepConfig={currentStepConfig}
					onSubmit={handleStepDataSubmit}
					onSkip={handleOnboardingSkip}
					isLoading={state?.ui?.apiInProgress}
					widgetContent={
						<ExternalOnboardingWidget
							{...({
								appName: appName,
								orgName: orgName,
								primaryColor: primaryColor,
								accentColor: accentColor,
								shopTypes: shopTypesData,
								stateTypes: stateTypesData,
								bankList: bankList,
								userData: onboardingUserDetails,
								handleSubmit: handleStepDataSubmit,
								stepResponse: state?.lastStepResponse,
								stepsData: state?.stepperData,
								handleStepCallBack: handleStepCallBack,
								handleOnboardingSkip: handleOnboardingSkip,
								apiInProgress: state?.ui?.apiInProgress,
								esignStatus:
									state?.esign?.status === "ready"
										? 1
										: state?.esign?.status === "failed"
											? 2
											: 0,
								digilockerData: state?.digilocker?.data,
								initialStepId: initialStepId,
								constants: {
									apiStatus: ONBOARDING_API_STATUS,
									stepIds: ONBOARDING_STEP_IDS,
									stepStatus: ONBOARDING_STEP_STATUS,
								},
							} as any)}
						/>
					}
				/>
			</OnboardingLayout>
		</OnboardingProvider>
	);
};

export default OnboardingSteps;
