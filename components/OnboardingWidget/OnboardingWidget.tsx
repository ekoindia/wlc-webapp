import { Box, Center, Spinner, useToast, useToken } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";

import { type OnboardingStep } from "constants/OnboardingSteps";
import { agreementProvider } from "constants/ProductDetails";
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

	// Use our new reducer-based state management
	const { state, actions } = useOnboardingState();

	const toast = useToast();
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

	let assistedAgentMobile = assistedAgentDetails?.user_detail?.mobile || null;

	// Initialize specialized hooks
	const esign = useEsignIntegration({
		userData,
		state,
		actions,
		isAndroid,
		logo,
		onStepSubmit: (data) => handleStepDataSubmit(data),
	});

	const android = useAndroidIntegration({
		userData,
		onStepSubmit: (data) => handleStepDataSubmit(data),
	});

	const digilocker = useDigilockerApi({
		actions,
	});

	const pintwin = usePintwinIntegration({
		state,
		actions,
		userData,
	});

	// Initialize the new specialized hooks
	const stepConfiguration = useStepConfiguration({
		actions,
		isAssistedOnboarding,
		assistedAgentDetails,
	});

	const formSubmission = useFormSubmission({
		userData,
		state,
		actions,
		isAssistedOnboarding,
		assistedAgentMobile,
		roleSelectionStep,
		refreshApiCall: () => refreshApiCall(),
		initialStepSetter: stepConfiguration.initializeSteps,
	});

	const fileUpload = useFileUpload({
		userData,
		state,
		actions,
		isAssistedOnboarding,
		assistedAgentMobile,
		refreshApiCall: () => refreshApiCall(),
	});

	// Note: androidleegalityResponseHandler now comes from useAndroidIntegration hook

	// Note: getSignUrl now comes from useEsignIntegration hook

	// Note: getBookletNumber and getBookletKey now come from usePintwinIntegration hook

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
	}, [userData, isAssistedOnboarding]);

	// Note: getDigilockerUrl now comes from useDigilockerApi hook

	// Note: handleLeegalityCallback now comes from useEsignIntegration hook

	const initialStepSetter = useCallback(
		(user_data) => {
			stepConfiguration.initializeSteps(user_data);
		},
		[stepConfiguration]
	);

	const handleStepDataSubmit = (data) => {
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
	};

	// Method only for file upload data

	const handleStepCallBack = (callType) => {
		if (callType.type === 12) {
			// Leegality Esign
			if (callType.method === "getSignUrl") {
				esign.getSignUrl();
			}
			if (callType.method === "legalityOpen") {
				if (
					state.esign.signUrlData &&
					state.esign.signUrlData.pipe == agreementProvider.SIGNZY
				) {
					window.open(
						state.esign.signUrlData.short_url,
						"SignAgreementWindow"
					);
				} else if (
					state.esign.signUrlData &&
					state.esign.signUrlData.pipe == agreementProvider.KARZA
				) {
					if (!state.esign.signUrlData.short_url) {
						toast({
							title: "Error starting eSign session. Please reload and try again later.",
							status: "error",
							duration: 2000,
						});
					}

					if (isAndroid) {
						doAndroidAction(
							ANDROID_ACTION.LEEGALITY_ESIGN_OPEN,
							JSON.stringify({
								signing_url: state.esign.signUrlData?.short_url,
								document_id:
									state.esign.signUrlData?.document_id,
							})
						);
					} else {
						const leegality = new (window as any).Leegality({
							callback: esign.handleLeegalityCallback.bind(this),
							logo: logo,
						});
						leegality.init();
						leegality.esign(state.esign.signUrlData?.short_url);
					}
				}
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

	// Note: Load leegality script only when E-sign step is reached...track script status independently
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "/scripts/leegalityv5.min.js";
		script.id = "legality";
		document.body.appendChild(script);
		script.onload = () => {};
		script.onerror = () => {
			toast({
				title: "Failed to initialize eSign",
				description:
					"Please check your network connection & try again.",
				status: "error",
				duration: 2000,
			});
			actions.updateEsignStatus("failed");
		};

		refreshApiCall(); // Consider optimizing this call frequency
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

	// FIX: HACK: ADDED BY KR.ABHISHEK FOR TESTING...INITIAL STEP LIST NOT GETTING POPULATED...
	useEffect(() => {
		initialStepSetter({ details: userData });
	}, [userData]);

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
