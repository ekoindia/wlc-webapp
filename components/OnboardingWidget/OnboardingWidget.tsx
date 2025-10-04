import { Center, Spinner, useToast, useToken } from "@chakra-ui/react";
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
import { useCallback, useEffect, useState } from "react";
import { ANDROID_ACTION, ANDROID_PERMISSION, doAndroidAction } from "utils";
import { createPintwinFormat } from "../../utils/pintwinFormat";

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

interface SignUrlData {
	pipe?: number;
	short_url?: string;
	document_id?: string;
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

	const [selectedRole, setSelectedRole] = useState(null);
	const [lastStepResponse, setLastStepResponse] = useState();
	const [latLong, setLatLong] = useState();
	const [aadhaar, setAadhaar] = useState();
	const [accesskey, setAccessKey] = useState(); // For Aadhaar OTP
	const [userCode, setUserCode] = useState(); // For Aadhaar OTP
	const [signUrlData, setSignUrlData] = useState<SignUrlData | null>(null);
	const [bookletNumber, setBookletNumber] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [apiInProgress, setApiInProgress] = useState(false);
	const [esignStatus, setEsignStatus] = useState(0); // 0: loading, 1: ready, 2: failed
	const [digilockerData, setDigilockerData] = useState(null);
	const [stepperData, setStepperData] = useState<OnboardingStep[]>([]);

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

	let bookletKeys = [];
	console.log("[AgentOnboarding] bookletKeys", bookletKeys);
	const user_id =
		userData?.userDetails?.mobile || userData?.userDetails.signup_mobile;
	let interaction_type_id = TransactionIds.USER_ONBOARDING;

	const androidleegalityResponseHandler = useCallback(
		(res) => {
			let value = JSON.parse(res);
			if (value.agreement_status === "success") {
				handleStepDataSubmit({
					id: 12,
					form_data: {
						agreement_id: userData?.userDetails?.agreement_id,
						document_id: value.document_id,
					},
				});
			} else {
				toast({
					title: "Something went wrong, please try again later!",
					status: "error",
					duration: 2000,
				});
			}
		},
		[userData]
	);

	const getSignUrl = useCallback(() => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: accessToken,
				body: {
					interaction_type_id:
						TransactionIds?.USER_ONBOARDING_GET_AGREEMENT_URL,
					document_id: "",
					agreement_id: userData?.userDetails?.agreement_id ?? 5,
					latlong: latLong || "27.176670,78.008075,7787",
					user_id,
					locale: "en",
				},
			},
			generateNewToken
		)
			.then((res) => {
				if (res?.data?.short_url) {
					setSignUrlData(res.data);
					setEsignStatus(1);
				} else {
					toast({
						title:
							res?.message ||
							"E-sign initialization failed, please try again.",
						status: "error",
						duration: 5000,
					});
					setEsignStatus(2);
				}
			})
			.catch((err) =>
				console.error("[getSignUrl for Leegality] Error:", err)
			);
	}, [userData, latLong]);

	const getBookletNumber = useCallback(() => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: accessToken,
				body: {
					interaction_type_id: TransactionIds?.GET_BOOKLET_NUMBER,
					document_id: "",
					latlong: latLong || "27.176670,78.008075,7787",
					user_id,
					locale: "en",
				},
			},
			generateNewToken
		)
			.then((res) => {
				if (res.response_status_id === 0) {
					setBookletNumber(res.data);
				}
			})
			.catch((err) => console.error("[getBookletNumber] Error:", err));
	}, [latLong]);

	const getBookletKey = useCallback(() => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: accessToken,
				body: {
					interaction_type_id: TransactionIds?.GET_PINTWIN_KEY,
					document_id: "",
					latlong: latLong || "27.176670,78.008075,7787",
					user_id,
					locale: "en",
				},
			},
			generateNewToken
		)
			.then((res) => {
				if (res.response_status_id === 0) {
					bookletKeys = [...bookletKeys, res.data];
				}
			})
			.catch((err) => console.error("[getBookletKey] Error: ", err));
	}, [latLong]);

	const refreshApiCall = useCallback(async () => {
		setApiInProgress(true);
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
			updateUserInfo(res);
			setIsLoading(false);

			if (
				res?.details?.onboarding !== 1 &&
				res?.details?.onboarding !== undefined &&
				res?.details?.onboarding !== null &&
				!isAssistedOnboarding
			) {
				router.push("/home");
			}

			setApiInProgress(false);
			return res;
		} catch (error) {
			setIsLoading(false);
			setApiInProgress(false);

			console.log("inside initial api error", error);
		}
	}, [userData, accessToken, isAssistedOnboarding]);

	// Fetcher function for Digilocker URL
	const getDigilockerUrl = useCallback(async () => {
		try {
			const data = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					token: accessToken,
					method: "POST",
					body: {},
					headers: {
						"tf-req-method": "POST",
						"tf-req-uri": "/karza/digilocker-redirection-url",
						"tf-req-uri-root-path": "/ekoicici/v1/marketuat",
					},
				},
				generateNewToken
			);

			// console.log("[getDigilockerUrl] Response:", data);

			if (data?.status === 0) {
				// Handle successful response
				if (data?.data?.link) {
					// Store the response data for future use
					setDigilockerData({
						link: data.data.link,
						requestId: data.data.requestId,
						initiatorId: data.data.initiator_id,
						timestamp: data.data.timestamp,
					});
				}
			}
		} catch (error) {
			// console.error("[getDigilockerUrl] Error:", error);
			toast({
				title:
					error?.message ??
					"Something went wrong, please try again later!",
				status: "error",
				duration: 2000,
			});
		}
	}, []);

	const handleLeegalityCallback = useCallback(
		(res) => {
			if (res.error) {
				toast({
					title:
						res?.error ||
						"Something went wrong, please try again later!",
					status: "error",
					duration: 2000,
				});
			} else {
				handleStepDataSubmit({
					id: 12,
					form_data: {
						document_id: res.documentId,
						agreement_id: userData?.userDetails?.agreement_id,
					},
				});
			}
		},
		[userData]
	);

	const initialStepSetter = (user_data) => {
		const currentStepData: OnboardingStep[] = [];
		/**
		 * Sets up the appropriate onboarding steps based on user type
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

			user_data?.details?.onboarding_steps?.forEach((step) => {
				let currentData = step_data?.filter(
					(singleStep) => singleStep.role === step.role
				);
				currentStepData.push(...currentData);
			});
		}
		stepSetter();
		console.log("[AgentOnboarding] currentStepData", currentStepData);
		setStepperData([...currentStepData]); // FIX: by Kr.Abhishek (duplicate data)
	};

	const handleStepDataSubmit = (data) => {
		console.log("[AgentOnboarding] handleStepDataSubmit data", data);
		if (data?.id === 3) {
			setLatLong(data?.form_data?.latlong);
		}

		// If the form does not require file-upload...
		if (
			data?.id !== 1 &&
			data?.id !== 4 &&
			// data?.id !== 5 &&
			// data?.id !== 6 &&
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
				bodyData.form_data.latlong = latLong;
				interaction_type_id = TransactionIds.USER_AADHAR_CONSENT;
			} else if (data?.id === 6 || data?.id === 7) {
				bodyData.form_data.caseId = userCode;
				bodyData.form_data.hold_timeout = "";
				bodyData.form_data.access_key = accesskey;
				if (data?.id === 6) {
					setAadhaar(bodyData.form_data.aadhar);
					interaction_type_id =
						TransactionIds.USER_AADHAR_NUMBER_CONFIRM;
				} else {
					interaction_type_id =
						TransactionIds.USER_AADHAR_OTP_CONFIRM;
					bodyData.form_data.aadhar = aadhaar;
				}
			} else if (data?.id === 9) {
				interaction_type_id = TransactionIds.USER_ONBOARDING_BUSINESS;
				bodyData.form_data.latlong = latLong;
				bodyData.form_data.csp_id = userData.userDetails.mobile;
				bodyData.form_data.communication = 1;
			} else if (data?.id === 10) {
				if (
					data?.form_data?.first_okekey &&
					bookletKeys[bookletKeys?.length - 2]
				) {
					bodyData.form_data.first_okekey = createPintwinFormat(
						data.form_data.first_okekey,
						bookletKeys[bookletKeys.length - 2]
					);
				}
				if (
					data?.form_data?.second_okekey &&
					bookletKeys[bookletKeys?.length - 1]
				) {
					bodyData.form_data.second_okekey = createPintwinFormat(
						data?.form_data?.second_okekey,
						bookletKeys[bookletKeys.length - 1]
					);
				}
				bodyData.form_data.is_pintwin_user =
					bookletNumber?.is_pintwin_user ?? false;
				bodyData.form_data.booklet_serial_number =
					bookletNumber?.booklet_serial_number ?? "";
				bodyData.form_data.latlong = latLong;
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
				bodyData.form_data.token_id = digilockerData?.requestId;
			}
			updateOnboarding(bodyData);
		} else {
			handleFileUploadOnboarding(data);
		}
	};

	// Method only for file upload data
	const handleFileUploadOnboarding = async (data) => {
		// Handle all file upload API's here only
		setApiInProgress(true);
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
				latlong: latLong,
				source: "WLC",
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
			setLastStepResponse(uploadResponse);
			refreshApiCall();
		} else {
			toast({
				title:
					uploadResponse.message ||
					"Something went wrong, please try again later!",
				status: "error",
				duration: 2000,
			});
			setLastStepResponse(uploadResponse);
		}

		setApiInProgress(false);
	};

	const updateOnboarding = (bodyData) => {
		setApiInProgress(true);
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: accessToken,
				body: {
					interaction_type_id: interaction_type_id,
					user_id,
					...bodyData.form_data,
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
						setAccessKey(data?.data?.access_key);
						setUserCode(data?.data?.user_code);
					}
					if (bodyData?.id == 2) {
						setSelectedRole(bodyData?.form_data?.merchant_type);
					}
					setLastStepResponse(data);
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
					setLastStepResponse(data);
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
				setLastStepResponse(err);
			})
			.finally(() => {
				setApiInProgress(false);
			});
	};

	const handleStepCallBack = (callType) => {
		if (callType.type === 12) {
			// Leegality Esign
			if (callType.method === "getSignUrl") {
				getSignUrl();
			}
			if (callType.method === "legalityOpen") {
				if (
					signUrlData &&
					signUrlData.pipe == agreementProvider.SIGNZY
				) {
					window.open(signUrlData.short_url, "SignAgreementWindow");
				} else if (
					signUrlData &&
					signUrlData.pipe == agreementProvider.KARZA
				) {
					if (!signUrlData.short_url) {
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
								signing_url: signUrlData?.short_url,
								document_id: signUrlData?.document_id,
							})
						);
					} else {
						const leegality = new (window as any).Leegality({
							callback: handleLeegalityCallback.bind(this),
							logo: logo,
						});
						leegality.init();
						leegality.esign(signUrlData?.short_url); // signUrlData?.short_url
					}
				}
			}
		} else if (callType.type === 10) {
			if (callType.method === "getBookletNumber") {
				getBookletNumber();
			}
			if (callType.method === "getBookletKey") {
				getBookletKey();
			}
		} else if (callType.type === 7) {
			if (callType.method === "resendOtp") {
				handleStepDataSubmit({
					id: 6,
					form_data: {
						aadhar: aadhaar,
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
				getDigilockerUrl();
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
			setEsignStatus(2); // Set E-sign load status to failed
		};

		refreshApiCall(); // TODO: Handle this efficiently
	}, []);

	useEffect(() => {
		const handleMessage = (event) => {
			if (event.data.type === "STATUS_UPDATE") {
				handleStepDataSubmit({
					id: 12,
					form_data: {
						document_id: signUrlData?.document_id ?? "",
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
	}, [signUrlData]);

	useEffect(() => {
		if (bookletNumber) {
			getBookletKey();
		}
	}, [bookletNumber]);

	// Subscribe to the Android responses
	useEffect(() => {
		const unsubscribe = subscribe(TOPICS.ANDROID_RESPONSE, (data) => {
			if (data?.action === ANDROID_ACTION.LEEGALITY_ESIGN_RESPONSE) {
				androidleegalityResponseHandler(data?.data);
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
		<>
			{isLoading ? (
				<Center height="100vh">
					<Spinner />
				</Center>
			) : (
				<div
					style={
						selectedRole === null
							? {
									display: "flex",
									justifyContent: "center",
								}
							: {}
					}
				>
					{selectedRole === null &&
					userData?.userDetails?.mobile === "1" ? (
						<ExternalSelectionScreen
							{...({
								stepData: roleSelectionStep,
								handleSubmit: (data: any) => {
									handleStepDataSubmit(data);
								},
								isDisabledCTA: apiInProgress,
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
								stepResponse: lastStepResponse,
								selectedMerchantType: selectedRole,
								shopTypes: shopTypesData,
								stateTypes: stateTypesData,
								stepsData: stepperData,
								handleStepCallBack: handleStepCallBack,
								esignStatus: esignStatus,
								primaryColor: primaryColor,
								accentColor: accentColor,
								appName: appName,
								orgName: orgName,
								digilockerData: digilockerData,
							} as any)}
						/>
					)}
				</div>
			)}
		</>
	);
};

export default OnboardingWidget;
