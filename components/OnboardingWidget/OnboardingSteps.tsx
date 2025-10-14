import { useToken } from "@chakra-ui/react";
import { useAppSource, usePubSub } from "contexts";
import { useBankList, useCountryStates, useShopTypes } from "hooks";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo } from "react";
import { ANDROID_ACTION, ANDROID_PERMISSION, doAndroidAction } from "utils";
import {
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

const ExternalOnboardingWidget = dynamic(
	() => import("@ekoindia/oaas-widget").then((mod) => mod.OnboardingWidget),
	{ ssr: false }
);

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

	/**
	 * Update the status of a specific onboarding step
	 * @param {number} id - The ID of the step to update
	 * @param {number} status - The new status to set (default is 3)
	 */
	const updateStepStatus = (id, status = 3) => {
		const updatedStepperData = state.stepperData.map((step) =>
			step.id === id ? { ...step, stepStatus: status } : step
		);
		actions.setStepperData(updatedStepperData);
	};

	// Initialize step configuration hook
	const stepConfiguration = useStepConfiguration({
		actions,
		userType,
		onboardingSteps,
		roleList,
	});

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
		mobile,
		onSuccess: async (_response, data) => {
			updateStepStatus(data.id, 3);

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
		// onError: (error) => {
		// 	console.error("File upload error:", error);
		// },
	});

	const initialStepSetter = useCallback(
		(user_data) => {
			console.log(
				"[AgentOnboarding] initialStepSetter user_data",
				user_data
			);
			stepConfiguration.initializeSteps(user_data);
		},
		[stepConfiguration]
	);

	const handleStepDataSubmit = useCallback(
		async (data) => {
			console.log("[AgentOnboarding] handleStepDataSubmit data", data);

			// Skip role selection (ID 0) as it's handled in RoleSelection component
			if (data?.id === 0) {
				console.log(
					"[AgentOnboarding] Skipping role selection in OnboardingSteps - handled in RoleSelection"
				);
				return;
			}

			if (data?.id === 3) {
				actions.setLocation(data?.form_data?.latlong);
				updateStepStatus(3);
			}

			// Route to appropriate handler based on form type
			if ([1, 4, 8, 11].includes(data?.id)) {
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

	const handleStepCallBack = (callType) => {
		if (callType.type === 12) {
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
		} else if (callType.type === 10) {
			if (callType.method === "getBookletNumber") {
				pintwin.getBookletNumber();
			}
			if (callType.method === "getBookletKey") {
				pintwin.getBookletKey();
			}
		} else if (callType.type === 7) {
			if (callType.method === "resendOtp") {
				handleStepDataSubmit({
					id: 6,
					form_data: {
						aadhar: state.aadhaar.number,
						is_consent: "Y",
					},
				});
			}
		} else if (callType.type === 3) {
			if (callType.method === "grantPermission") {
				if (isAndroid) {
					doAndroidAction(
						ANDROID_ACTION.GRANT_PERMISSION,
						ANDROID_PERMISSION.LOCATION
					);
				}
			}
		} else if (callType.type === 20) {
			if (callType.method === "getDigilockerUrl") {
				digilocker.getDigilockerUrl();
			}
		}
	};

	useEffect(() => {
		const handleMessage = (event) => {
			if (event.data.type === "STATUS_UPDATE") {
				handleStepDataSubmit({
					id: 12,
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
		initialStepSetter({
			details: onboardingUserDetails,
		});
	}, []);

	console.log("[AgentOnboarding] state data", state.stepperData);

	return (
		<ExternalOnboardingWidget
			{...({
				defaultStep: roleList || "12400",
				isBranding: false,
				userData: userData,
				handleSubmit: handleStepDataSubmit,
				stepResponse: state.lastStepResponse,
				selectedMerchantType: state.selectedRole,
				shopTypes: shopTypesData,
				stateTypes: stateTypesData,
				bankList: bankList,
				stepsData: state.stepperData,
				handleStepCallBack: handleStepCallBack,
				esignStatus:
					state.esign.status === "ready"
						? 1
						: state.esign.status === "failed"
							? 2
							: 0,
				primaryColor: primaryColor,
				accentColor: accentColor,
				appName: appName,
				orgName: orgName,
				digilockerData: state.digilocker.data,
			} as any)}
		/>
	);
};

export default OnboardingSteps;
