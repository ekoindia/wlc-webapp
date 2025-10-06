import { Box, Center, Spinner, useToast, useToken } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import {
	distributorStepsData,
	retailerStepsData,
	type OnboardingStep,
} from "constants/OnboardingSteps";
import { agreementProvider } from "constants/ProductDetails";
import { useAppSource, usePubSub, useSession } from "contexts";
import { fetcher } from "helpers";
import { useCountryStates, useRefreshToken, useShopTypes } from "hooks";
import dynamic from "next/dynamic";
import router from "next/router";
import { useCallback, useEffect } from "react";
import { ANDROID_ACTION, ANDROID_PERMISSION, doAndroidAction } from "utils";
import { createPintwinFormat } from "../../utils/pintwinFormat";
import {
	useAndroidIntegration,
	useDigilockerApi,
	useEsignIntegration,
	useOnboardingState,
	usePintwinIntegration,
} from "./hooks";

const ExternalSelectionScreen = dynamic(
	() => import("@ekoindia/oaas-widget").then((mod) => mod.SelectionScreen),
	{ ssr: false }
);

const ExternalOnboardingWidget = dynamic(
	() => import("@ekoindia/oaas-widget").then((mod) => mod.OnboardingWidget),
	{ ssr: false }
);

interface OnboardingFormData {
	client_ref_id: string;
	user_id: any;
	interaction_type_id: any;
	intent_id: number;
	locale: string;
	doc_type: number;
	latlong: any;
	source: string;
	file1?: string;
	file2?: string;
	doc_id?: any;
	shop_type?: any;
	shop_name?: any;
}

interface BodyData {
	formdata: OnboardingFormData;
	file1?: any;
	file2?: any;
	form_data?: any;
}

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

	const user_id =
		userData?.userDetails?.mobile || userData?.userDetails.signup_mobile;
	let interaction_type_id =
		TransactionIds.USER_ONBOARDING_GEO_LOCATION_CAPTURE;
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
			const currentStepData: OnboardingStep[] = [];
			/**
			 * Sets up the appropriate onboarding steps based on user type
			 */

			// Handle assisted onboarding flow enhancement
			/**
			 * Sets up the appropriate onboarding steps based on user type and role
			 */
			function stepSetter() {
				var step_data: OnboardingStep[] = [];
				// User_Type = 1 : Distributor
				// User Type = 3 : Retailer
				if (user_data?.details?.userDetails?.user_type == 1) {
					step_data = distributorStepsData;
				} else if (user_data?.details?.userDetails?.user_type == 3) {
					step_data = retailerStepsData;
				}

				const _onboardingSteps = isAssistedOnboarding
					? assistedAgentDetails?.user_detail?.onboarding_steps
					: user_data?.details?.onboarding_steps;

				_onboardingSteps?.forEach((step) => {
					let currentData = step_data?.filter(
						(singleStep) => singleStep.role === step.role
					);
					currentStepData.push(...currentData);
				});
			}
			stepSetter();
			console.log("[AgentOnboarding] currentStepData", currentStepData);
			actions.setStepperData([...currentStepData]); // FIX: by Kr.Abhishek (duplicate data)
		},
		[isAssistedOnboarding, assistedAgentDetails]
	);

	const handleStepDataSubmit = (data) => {
		console.log("[AgentOnboarding] handleStepDataSubmit data", data);
		if (data?.id === 3) {
			actions.setLocation(data?.form_data?.latlong);
		}

		// If the form does not require file-upload...
		if (
			data?.id !== 1 &&
			data?.id !== 4 &&
			data?.id !== 8 &&
			data?.id !== 11
		) {
			const bodyData = data;
			if (data?.id === 0) {
				const applicantData = roleSelectionStep.form_data.roles.find(
					(role) =>
						role.merchant_type ===
						parseInt(data.form_data.merchant_type)
				)?.applicant_type;
				bodyData.form_data.applicant_type = applicantData;
				bodyData.form_data.csp_id =
					userData.userDetails.signup_mobile ||
					userData.userDetails.mobile;
				interaction_type_id = TransactionIds.USER_ONBOARDING_ROLE;
			} else if (data?.id === 5) {
				bodyData.form_data.company_name = userData.userDetails.mobile;
				bodyData.form_data.latlong = state.latLong;
				interaction_type_id = TransactionIds.USER_AADHAR_CONSENT;
			} else if (data?.id === 6 || data?.id === 7) {
				bodyData.form_data.caseId = state.aadhaar.userCode;
				bodyData.form_data.hold_timeout = "";
				bodyData.form_data.access_key = state.aadhaar.accessKey;
				if (data?.id === 6) {
					actions.setAadhaarNumber(bodyData.form_data.aadhar);
					interaction_type_id =
						TransactionIds.USER_AADHAR_NUMBER_CONFIRM;
				} else {
					interaction_type_id =
						TransactionIds.USER_AADHAR_OTP_CONFIRM;
					bodyData.form_data.aadhar = state.aadhaar.number;
				}
			} else if (data?.id === 9) {
				interaction_type_id = TransactionIds.USER_ONBOARDING_BUSINESS;
				bodyData.form_data.latlong = state.latLong;
				bodyData.form_data.csp_id = userData.userDetails.mobile;
				bodyData.form_data.communication = 1;
			} else if (data?.id === 10) {
				if (
					data?.form_data?.first_okekey &&
					state.pintwin.bookletKeys[
						state.pintwin.bookletKeys?.length - 2
					]
				) {
					bodyData.form_data.first_okekey = createPintwinFormat(
						data.form_data.first_okekey,
						state.pintwin.bookletKeys[
							state.pintwin.bookletKeys.length - 2
						]
					);
				}
				if (
					data?.form_data?.second_okekey &&
					state.pintwin.bookletKeys[
						state.pintwin.bookletKeys?.length - 1
					]
				) {
					bodyData.form_data.second_okekey = createPintwinFormat(
						data?.form_data?.second_okekey,
						state.pintwin.bookletKeys[
							state.pintwin.bookletKeys.length - 1
						]
					);
				}
				bodyData.form_data.is_pintwin_user =
					state.pintwin.bookletNumber?.is_pintwin_user ?? false;
				bodyData.form_data.booklet_serial_number =
					state.pintwin.bookletNumber?.booklet_serial_number ?? "";
				bodyData.form_data.latlong = state.latLong;
				interaction_type_id = TransactionIds.USER_ONBOARDING_SECRET_PIN;
			} else if (data?.id === 12) {
				interaction_type_id =
					TransactionIds.USER_ONBOARDING_SUBMIT_SIGN_AGREEMENT;
			} else if (data?.id === 16) {
				interaction_type_id =
					TransactionIds.USER_ONBOARDING_PAN_VERIFICATION;
				bodyData.form_data.csp_id =
					userData.userDetails.signup_mobile ||
					userData.userDetails.mobile;
			} else if (data?.id === 20) {
				interaction_type_id = TransactionIds.USER_AADHAR_OTP_CONFIRM;
				bodyData.form_data.is_consent = "Y";
				bodyData.form_data.token_id = state.digilocker.data?.requestId;
			}
			updateOnboarding(bodyData);
		} else {
			handleFileUploadOnboarding(data);
		}
	};

	// Method only for file upload data
	const handleFileUploadOnboarding = async (data) => {
		const _cspId = isAssistedOnboarding
			? { csp_id: assistedAgentMobile }
			: {};
		// Handle all file upload API's here only
		actions.setApiInProgress(true);
		const formData = new FormData();
		const bodyData: BodyData = {
			formdata: {
				client_ref_id:
					Date.now() + "" + Math.floor(Math.random() * 1000),
				user_id,
				interaction_type_id: TransactionIds.USER_ONBOARDING_AADHAR,
				intent_id: 3,
				locale: "en",
				doc_type: 1,
				latlong: state.latLong,
				source: "WLC",
				..._cspId,
			},
		};
		if (data.id === 4) {
			bodyData.file1 = data?.form_data?.aadhaarImages?.front?.fileData;
			bodyData.file2 = data?.form_data?.aadhaarImages?.back?.fileData;
			bodyData.formdata.file1 = "";
			bodyData.formdata.file2 = "";
			formData.append("file1", bodyData.file1);
			formData.append("file2", bodyData.file2);

			// Convert formdata to URLSearchParams compatible format
			const formdataParams = Object.entries(bodyData.formdata).reduce(
				(acc, [key, value]) => {
					acc[key] = String(value ?? "");
					return acc;
				},
				{} as Record<string, string>
			);

			formData.append(
				"formdata",
				new URLSearchParams(formdataParams).toString()
			);
		} else if (data.id === 8) {
			bodyData.file1 = data?.form_data?.panImage?.fileData;
			bodyData.formdata.file1 = "";
			bodyData.formdata.doc_type = 2;
			bodyData.formdata.doc_id = data?.form_data?.panNumber;
			bodyData.formdata.shop_type = data?.form_data?.shopType;
			bodyData.formdata.shop_name = data?.form_data?.shopName;
			formData.append("file1", bodyData.file1);

			// Convert formdata to URLSearchParams compatible format
			const formdataParams2 = Object.entries(bodyData.formdata).reduce(
				(acc, [key, value]) => {
					acc[key] = String(value ?? "");
					return acc;
				},
				{} as Record<string, string>
			);

			formData.append(
				"formdata",
				new URLSearchParams(formdataParams2).toString()
			);
		} else {
			bodyData.file1 = data?.form_data?.videoKyc?.fileData;
			bodyData.formdata.file1 = "";
			bodyData.formdata.doc_type = 3;
			formData.append("file1", bodyData.file1);

			// Convert formdata to URLSearchParams compatible format
			const formdataParams3 = Object.entries(bodyData.formdata).reduce(
				(acc, [key, value]) => {
					acc[key] = String(value ?? "");
					return acc;
				},
				{} as Record<string, string>
			);

			formData.append(
				"formdata",
				new URLSearchParams(formdataParams3).toString()
			);
		}

		const uploadResponse = await fetch(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.UPLOAD,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				body: formData,
			}
		)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					res.text().then(() => {});

					const err = new Error("API Error") as any;
					err.response = res;
					err.status = res.status;
					if (res.status === 401) {
						err.name = "UnauthorizedError";
						generateNewToken(true);
						return;
					}
					throw err;
				}
			})
			.catch((err) => {
				toast({
					title:
						err.message ||
						"Something went wrong, please try again later!",
					status: "error",
					duration: 2000,
				});
				return err;
			});

		const success =
			uploadResponse?.status == 0 && // Status is successful
			!(Object.keys(uploadResponse?.invalid_params || {}).length > 0); // No "invalid-params" present

		if (success) {
			toast({
				title: uploadResponse.message,
				status: "success",
				duration: 2000,
			});
			actions.setLastStepResponse(uploadResponse);
			refreshApiCall();
		} else {
			toast({
				title:
					uploadResponse.message ||
					"Something went wrong, please try again later!",
				status: "error",
				duration: 2000,
			});
			actions.setLastStepResponse(uploadResponse);
		}

		actions.setApiInProgress(false);
	};

	const updateOnboarding = (bodyData) => {
		const _cspId = isAssistedOnboarding
			? { csp_id: assistedAgentMobile }
			: {};
		actions.setApiInProgress(true);
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: accessToken,
				body: {
					interaction_type_id: interaction_type_id,
					user_id,
					...bodyData.form_data,
					..._cspId,
				},
				timeout: 30000,
			},
			generateNewToken
		)
			.then((data) => {
				const success =
					data?.status == 0 && // Status is successful
					!(Object.keys(data?.invalid_params || {}).length > 0); // No "invalid-params" present

				if (success) {
					toast({
						title: bodyData.success_message || "Success",
						status: "success",
						duration: 2000,
					});
					if (bodyData?.id === 5) {
						actions.setAadhaarAccessKey(data?.data?.access_key);
						actions.setAadhaarUserCode(data?.data?.user_code);
					}
					if (bodyData?.id == 2) {
						actions.setRole(bodyData?.form_data?.merchant_type);
					}
					actions.setLastStepResponse(data);
					refreshApiCall().then((res) => {
						if (bodyData?.id === 0) {
							initialStepSetter(res);
						}
					});
				} else {
					toast({
						title: data.message,
						status: "error",
						duration: 2000,
					});
					actions.setLastStepResponse(data);
				}
			})
			.catch((err) => {
				toast({
					title:
						err.message ||
						"Something went wrong, please try again later!",
					status: "error",
					duration: 2000,
				});
				actions.setLastStepResponse(err);
			})
			.finally(() => {
				actions.setApiInProgress(false);
			});
	};

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
