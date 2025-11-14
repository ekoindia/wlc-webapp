import { useToken } from "@chakra-ui/react";
import { OnboardingWidget as ExternalOnboardingWidgetBase } from "@ekoindia/oaas-widget";
import {
	masterOnboardingSteps,
	ONBOARDING_API_STATUS,
	ONBOARDING_STEP_IDS,
	ONBOARDING_STEP_STATUS,
} from "constants/OnboardingSteps";
import { useAppSource, useOrgDetailContext, usePubSub } from "contexts";
import { useBankList, useCountryStates, useShopTypes } from "hooks";
import { useCallback, useEffect, useMemo } from "react";
import { ANDROID_ACTION, ANDROID_PERMISSION, doAndroidAction } from "utils";
import {
	createStepLookupMap,
	extractStepConfiguration,
	useAndroidIntegration,
	useDigilockerApi,
	useEsignIntegration,
	useFileUpload,
	useKycFormSubmission,
	useOnboardingState,
	usePintwinIntegration,
	useStepConfiguration,
} from "./hooks";
import {
	getAgreementIdFromData,
	getMobileFromData,
	getOnboardingStepsFromData,
	getRoleListFromData,
	getUserTypeFromData,
} from "./utils";

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
		constants?: {
			apiStatus: typeof ONBOARDING_API_STATUS;
			stepIds: typeof ONBOARDING_STEP_IDS;
			stepStatus: typeof ONBOARDING_STEP_STATUS;
		};
	}>;

const OnboardingSteps = ({
	isAssistedOnboarding,
	logo,
	appName,
	orgName,
	userData,
	assistedAgentDetails,
	refreshAgentProfile,
}) => {
	const { state, actions } = useOnboardingState();
	const { isAndroid } = useAppSource();
	const { subscribe, TOPICS } = usePubSub();
	const { banks: bankList } = useBankList();
	const { shopTypes: shopTypesData } = useShopTypes();
	const { states: stateTypesData } = useCountryStates();
	const { orgDetail } = useOrgDetailContext();

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

	const mobile = useMemo(
		() => getMobileFromData(onboardingUserDetails, isAssistedOnboarding),
		[onboardingUserDetails, isAssistedOnboarding]
	);

	const agreementId = useMemo(
		() =>
			getAgreementIdFromData(onboardingUserDetails, isAssistedOnboarding),
		[onboardingUserDetails, isAssistedOnboarding]
	);

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
		(id, status = 3) => {
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

	const digilocker = useDigilockerApi({
		actions,
	});

	const pintwin = usePintwinIntegration({
		state,
		actions,
		mobile,
	});

	const { submitForm } = useKycFormSubmission({
		state,
		actions,
		agreementId,
		mobile,
		onSuccess: async (_response, data) => {
			// Update step status
			updateStepStatus(data.id, 3);

			// Refresh user profile
			await refreshAgentProfile();
		},
		onError: async (_error, data) => {
			// Update step status to failed
			updateStepStatus(data.id, 2);

			// Refresh user profile
			await refreshAgentProfile();
		},
	});

	const { uploadFile } = useFileUpload({
		state,
		actions,
		mobile,
		onSuccess: async (_response, data) => {
			// Update step status
			updateStepStatus(data.id, 3);

			// Refresh user profile
			await refreshAgentProfile();
		},

		onError: async (_error, data) => {
			// Update step status to failed
			updateStepStatus(data.id, 2);

			// Refresh user profile
			await refreshAgentProfile();
		},
	});

	const initialStepSetter = useCallback(
		(user_data) => {
			stepConfiguration.initializeSteps(user_data);
		},
		[stepConfiguration]
	);

	const handleStepDataSubmit = useCallback(
		async (data) => {
			// console.log("[AgentOnboarding] handleStepDataSubmit data", data);

			// Skip role selection as it's handled in RoleSelection component
			if (data?.id === ONBOARDING_STEP_IDS.SELECTION_SCREEN) {
				// console.log(
				// 	"[AgentOnboarding] Skipping role selection in OnboardingSteps - handled in RoleSelection"
				// );
				return;
			}

			if (data?.id === ONBOARDING_STEP_IDS.LOCATION_CAPTURE) {
				actions.setLocation(data?.form_data?.latlong);
				updateStepStatus(ONBOARDING_STEP_IDS.LOCATION_CAPTURE);
			}

			// Route to appropriate handler based on form type (file upload steps)
			if (
				[
					ONBOARDING_STEP_IDS.WELCOME,
					ONBOARDING_STEP_IDS.AADHAAR_VERIFICATION,
					ONBOARDING_STEP_IDS.PAN_VERIFICATION,
					ONBOARDING_STEP_IDS.VIDEO_KYC,
					ONBOARDING_STEP_IDS.ADD_BANK_ACCOUNT,
				].includes(data?.id)
			) {
				await uploadFile(data);
				return;
			} else {
				// Regular form submission
				await submitForm(data);
				return;
			}
		},
		[actions]
	);

	// Method only for file upload data

	/**
	 * Handles skipping of an onboarding step
	 * Called by child component when user skips a step
	 * @param {number} stepId - ID of the step to skip
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

	const handleStepCallBack = (callType) => {
		if (callType.type === ONBOARDING_STEP_IDS.SIGN_AGREEMENT) {
			// Leegality Esign
			if (callType.method === "getSignUrl") {
				// Initialize script if not already loaded before getting sign URL
				if (!document.getElementById("legality")) {
					esign.initializeEsignScript();
				}
				esign.getSignUrl();
			}
			if (callType.method === "legalityOpen") {
				esign.openEsign();
			}
		} else if (callType.type === ONBOARDING_STEP_IDS.SECRET_PIN) {
			if (callType.method === "getBookletNumber") {
				pintwin.getBookletNumber();
			}
			if (callType.method === "getBookletKey") {
				pintwin.getBookletKey();
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
		} else if (
			callType.type === ONBOARDING_STEP_IDS.DIGILOCKER_REDIRECTION
		) {
			if (callType.method === "getDigilockerUrl") {
				digilocker.getDigilockerUrl();
			}
		}
	};

	useEffect(() => {
		const handleMessage = (event) => {
			if (event.data.type === "STATUS_UPDATE") {
				handleStepDataSubmit({
					id: ONBOARDING_STEP_IDS.SIGN_AGREEMENT,
					form_data: {
						document_id: state.esign.signUrlData?.document_id ?? "",
						agreement_id: userData?.userDetails?.agreement_id,
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
	}, [
		state.esign.signUrlData,
		userData?.userDetails?.agreement_id,
		handleStepDataSubmit,
	]);

	useEffect(() => {
		if (state.pintwin.bookletNumber) {
			pintwin.getBookletKey();
		}
	}, [state.pintwin.bookletNumber, pintwin]);

	// Subscribe to the Android responses
	useEffect(() => {
		const unsubscribe = subscribe(TOPICS.ANDROID_RESPONSE, (data) => {
			if (data?.action === ANDROID_ACTION.LEEGALITY_ESIGN_RESPONSE) {
				android.androidleegalityResponseHandler(data?.data);
			}
		});

		return unsubscribe;
	}, [TOPICS.ANDROID_RESPONSE, subscribe, android]);

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
	}, [onboardingUserDetails]);

	// console.log("[AgentOnboarding] state data", state.stepperData);

	return (
		<ExternalOnboardingWidget
			{...({
				appName: appName,
				orgName: orgName,
				primaryColor: primaryColor,
				accentColor: accentColor,
				shopTypes: shopTypesData,
				stateTypes: stateTypesData,
				bankList: bankList,
				userData: userData,
				handleSubmit: handleStepDataSubmit,
				stepResponse: state.lastStepResponse,
				stepsData: state.stepperData,
				handleStepCallBack: handleStepCallBack,
				handleOnboardingSkip: handleOnboardingSkip,
				esignStatus:
					state.esign.status === "ready"
						? 1
						: state.esign.status === "failed"
							? 2
							: 0,
				digilockerData: state.digilocker.data,
				constants: {
					apiStatus: ONBOARDING_API_STATUS,
					stepIds: ONBOARDING_STEP_IDS,
					stepStatus: ONBOARDING_STEP_STATUS,
				},
			} as any)}
		/>
	);
};

export default OnboardingSteps;
