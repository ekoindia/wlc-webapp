import { Box, Center, Spinner, useToken } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";

import { type OnboardingStep } from "constants/OnboardingSteps";
import { useAppSource, usePubSub, useSession } from "contexts";
import { fetcher } from "helpers";
import { useCountryStates, useRefreshToken, useShopTypes } from "hooks";
import dynamic from "next/dynamic";
import router from "next/router";
import { useCallback, useEffect } from "react";
import { ANDROID_ACTION, ANDROID_PERMISSION, doAndroidAction } from "utils";

import {
	useAndroidIntegration,
	useDigilockerApi,
	useEsignIntegration,
	useFileUpload,
	useFormSubmission,
	useOnboardingState,
	usePintwinIntegration,
	useStepConfiguration,
} from "./hooks";
import { getMobileFromData } from "./utils";

const ExternalSelectionScreen = dynamic(
	() => import("@ekoindia/oaas-widget").then((mod) => mod.SelectionScreen),
	{ ssr: false }
);

const ExternalOnboardingWidget = dynamic(
	() => import("@ekoindia/oaas-widget").then((mod) => mod.OnboardingWidget),
	{ ssr: false }
);

interface OnboardingWidgetProps {
	isAssistedOnboarding?: boolean;
	logo: string;
	appName: string;
	orgName: string;
	userData: any;
	updateUserInfo: any;
	roleSelectionStep?: OnboardingStep;
	assistedAgentDetails?: any;
}

/**
 * A OnboardingWidget component for handling agent onboarding flow
 * @param {object} props - Properties passed to the component
 * @param {string} [props.isAssistedOnboarding] - Is the onboarding being done on behalf of a agent (assisted onboarding)
 * @param {string} [props.logo] - Logo URL of the organization
 * @param {string} [props.appName] - Name of the application
 * @param {string} [props.orgName] - Name of the organization
 * @param {any} [props.userData] - User data object
 * @param {any} [props.updateUserInfo] - Function to update user information
 * @param {OnboardingStep} [props.roleSelectionStep] - Custom role selection step configuration
 * @param {any} [props.assistedAgentDetails] - Details of the assisted agent
 * @returns {JSX.Element} - The rendered OnboardingWidget component
 * @example	`<OnboardingWidget></OnboardingWidget>`
 */
const OnboardingWidget = ({
	isAssistedOnboarding = false,
	logo,
	appName,
	orgName,
	userData,
	updateUserInfo,
	roleSelectionStep,
	assistedAgentDetails,
}: OnboardingWidgetProps): JSX.Element => {
	console.log("[AgentOnboarding] assistedAgentDetails", assistedAgentDetails);
	const { accessToken } = useSession();

	const { state, actions } = useOnboardingState();
	const { isAndroid } = useAppSource();
	const { subscribe, TOPICS } = usePubSub();
	const { generateNewToken } = useRefreshToken();
	const { shopTypes: shopTypesData } = useShopTypes();
	const { states: stateTypesData } = useCountryStates();

	// Get theme primary color
	const [primaryColor, accentColor] = useToken("colors", [
		"primary.DEFAULT",
		"accent.DEFAULT",
	]);

	// Agent mobile number for assisted onboarding
	let assistedAgentMobile = assistedAgentDetails?.user_detail?.mobile || null;

	// Determine the user details to use for onboarding
	const onboardingUserDetails = isAssistedOnboarding
		? assistedAgentDetails
		: { details: userData.details };

	console.log(
		"[AgentOnboarding] useEsignIntegration getMobileFromData onboardingUserDetails",
		onboardingUserDetails
	);

	console.log(
		"[AgentOnboarding] useEsignIntegration getMobileFromData agent mobile",
		getMobileFromData(onboardingUserDetails)
	);

	// Initialize specialized hooks
	const esign = useEsignIntegration({
		userData: onboardingUserDetails,
		state,
		actions,
		isAndroid,
		logo,
		onStepSubmit: (data) => handleStepDataSubmit(data),
	});

	const android = useAndroidIntegration({
		userData: onboardingUserDetails,
		onStepSubmit: (data) => handleStepDataSubmit(data),
	});

	const digilocker = useDigilockerApi({
		actions,
	});

	const pintwin = usePintwinIntegration({
		state,
		actions,
		userData: onboardingUserDetails,
	});

	// Initialize step configuration hook
	const stepConfiguration = useStepConfiguration({
		actions,
	});

	// TODO: Check if isAssistedOnboarding is needed here
	const formSubmission = useFormSubmission({
		userData: onboardingUserDetails,
		state,
		actions,
		isAssistedOnboarding,
		assistedAgentMobile,
		roleSelectionStep,
		refreshApiCall: () => refreshApiCall(),
		initialStepSetter: stepConfiguration.initializeSteps,
	});

	// TODO: Check if isAssistedOnboarding is needed here
	const fileUpload = useFileUpload({
		userData: onboardingUserDetails,
		state,
		actions,
		isAssistedOnboarding,
		assistedAgentMobile,
		refreshApiCall: () => refreshApiCall(),
	});

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
	}, [userData, isAssistedOnboarding, accessToken]);

	const initialStepSetter = useCallback(
		(user_data) => {
			stepConfiguration.initializeSteps(user_data);
		},
		[stepConfiguration]
	);

	const handleStepDataSubmit = useCallback(
		(data) => {
			console.log("[AgentOnboarding] handleStepDataSubmit data", data);
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
		[actions, fileUpload, formSubmission]
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
	}, [state.esign.signUrlData, userData?.userDetails?.agreement_id]);

	useEffect(() => {
		if (state.pintwin.bookletNumber) {
			pintwin.getBookletKey();
		}
	}, [state.pintwin.bookletNumber]);

	// Subscribe to the Android responses
	useEffect(() => {
		const unsubscribe = subscribe(TOPICS.ANDROID_RESPONSE, (data) => {
			if (data?.action === ANDROID_ACTION.LEEGALITY_ESIGN_RESPONSE) {
				android.androidleegalityResponseHandler(data?.data);
			}
		});

		return unsubscribe;
	}, [TOPICS.ANDROID_RESPONSE, subscribe]);

	useEffect(() => {
		initialStepSetter({
			details: onboardingUserDetails,
		});
	}, []);

	useEffect(() => {
		// TODO: based on the assisted onboarding prop, decide that to do.
		refreshApiCall();
	}, []);

	// MARK: JSX
	return (
		<Box bg="bg" w="100%" minH="100vh">
			{state.ui.isLoading ? (
				<Center height="100vh">
					<Spinner />
				</Center>
			) : (
				<div
					style={
						state.selectedRole === null
							? {
									display: "flex",
									justifyContent: "center",
								}
							: {}
					}
				>
					{state.selectedRole === null &&
					userData?.userDetails?.mobile === "1" ? (
						<ExternalSelectionScreen
							{...({
								stepData: roleSelectionStep,
								handleSubmit: (data: any) => {
									handleStepDataSubmit(data);
								},
								isDisabledCTA: state.ui.apiInProgress,
								primaryColor: primaryColor,
								accentColor: accentColor,
							} as any)}
						/>
					) : (
						<ExternalOnboardingWidget
							{...({
								defaultStep:
									userData?.userDetails?.role_list || "12400",
								isBranding: false,
								userData: userData,
								handleSubmit: handleStepDataSubmit,
								stepResponse: state.lastStepResponse,
								selectedMerchantType: state.selectedRole,
								shopTypes: shopTypesData,
								stateTypes: stateTypesData,
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
					)}
				</div>
			)}
		</Box>
	);
};

export default OnboardingWidget;
