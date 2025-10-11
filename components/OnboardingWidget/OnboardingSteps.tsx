import { useToken } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useAppSource, usePubSub, useSession } from "contexts";
import { fetcher } from "helpers";
import {
	useBankList,
	useCountryStates,
	useRefreshToken,
	useShopTypes,
} from "hooks";
import dynamic from "next/dynamic";
import router from "next/router";
import { useCallback, useEffect } from "react";
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
	getUserCodeFromData,
	getUserTypeFromData,
} from "./utils";

const ExternalOnboardingWidget = dynamic(
	() => import("@ekoindia/oaas-widget").then((mod) => mod.OnboardingWidget),
	{ ssr: false }
);

const OnboardingSteps = ({
	// setStep,
	isAssistedOnboarding,
	logo,
	appName,
	orgName,
	userData,
	updateUserInfo,
	assistedAgentDetails,
}) => {
	const { state, actions } = useOnboardingState();
	const { isAndroid } = useAppSource();
	const { subscribe, TOPICS } = usePubSub();
	const { generateNewToken } = useRefreshToken();
	const { banks: bankList } = useBankList();
	const { shopTypes: shopTypesData } = useShopTypes();
	const { states: stateTypesData } = useCountryStates();
	const { accessToken } = useSession();
	// Get theme primary color
	const [primaryColor, accentColor] = useToken("colors", [
		"primary.DEFAULT",
		"accent.DEFAULT",
	]);

	// Determine the user details to use for onboarding
	const onboardingUserDetails = isAssistedOnboarding
		? assistedAgentDetails
		: userData;

	console.log(
		"[AgentOnboarding] onboardingUserDetails",
		onboardingUserDetails
	);

	const userType = getUserTypeFromData(
		onboardingUserDetails,
		isAssistedOnboarding
	);

	console.log("[AgentOnboarding] userType", userType);

	const onboardingSteps = getOnboardingStepsFromData(
		onboardingUserDetails,
		isAssistedOnboarding
	);

	console.log("[AgentOnboarding] onboardingSteps", onboardingSteps);

	const mobile = getMobileFromData(
		onboardingUserDetails,
		isAssistedOnboarding
	);

	console.log("[AgentOnboarding] mobile", mobile);

	const agreementId = getAgreementIdFromData(
		onboardingUserDetails,
		isAssistedOnboarding
	);

	console.log("[AgentOnboarding] agreementId", agreementId);

	const userCode = getUserCodeFromData(
		onboardingUserDetails,
		isAssistedOnboarding
	);

	console.log("[AgentOnboarding] userCode", userCode);

	// Initialize step configuration hook
	const stepConfiguration = useStepConfiguration({
		actions,
		userType,
		onboardingSteps,
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

	const formSubmission = useKycFormSubmission({
		state,
		actions,
		mobile,
		onSuccess: !isAssistedOnboarding
			? async (_data, bodyData) => {
					// Refresh API and handle step initialization for role selection
					const refreshResult = await refreshApiCall();
					if (bodyData.id === 0) {
						initialStepSetter(refreshResult);
					}
				}
			: undefined,
	});

	const fileUpload = useFileUpload({
		state,
		actions,
		mobile,
		refreshApiCall: !isAssistedOnboarding
			? () => refreshApiCall()
			: undefined,
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
		(data) => {
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
			}

			// Route to appropriate handler based on form type
			if (
				data?.id === 1 ||
				data?.id === 4 ||
				data?.id === 8 ||
				data?.id === 11
			) {
				// File upload forms
				fileUpload.uploadFile(data);
			} else {
				// Regular form submission
				formSubmission.submitForm(data);
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

	// Method to refresh user profile and update states
	const refreshApiCall = useCallback(async () => {
		actions.setApiInProgress(true);
		try {
			const res = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL +
					Endpoints.REFRESH_PROFILE,
				{
					token: accessToken,
					body: {
						last_refresh_token: userData?.refresh_token,
					},
				},
				generateNewToken
			);

			// Check if states list needs to be captured on refresh
			updateUserInfo(res);
			actions.setIsLoading(false);

			if (
				res?.details?.onboarding !== 1 &&
				res?.details?.onboarding !== undefined &&
				res?.details?.onboarding !== null &&
				!isAssistedOnboarding
			) {
				router.push("/home");
			}

			actions.setApiInProgress(false);
			return res;
		} catch (error) {
			actions.setIsLoading(false);
			actions.setApiInProgress(false);

			console.log("inside initial api error", error);
		}
	}, []);

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
	}, [onboardingUserDetails]);

	useEffect(() => {
		// Based on the assisted onboarding prop, decide what to do.
		refreshApiCall();
	}, []);
	return (
		<ExternalOnboardingWidget
			{...({
				defaultStep: userData?.userDetails?.role_list || "12400",
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
