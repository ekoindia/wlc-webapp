import { Center, Spinner, useToast, useToken } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import {
	distributorStepsData,
	retailerStepsData,
	selectionStepData,
} from "constants/OnboardingSteps";
import { agreementProvider } from "constants/ProductDetails";
import {
	useAppSource,
	useOrgDetailContext,
	usePubSub,
	useSession,
	useUser,
} from "contexts";
import { fetcher } from "helpers";
import { useCountryStates, useRefreshToken, useShopTypes } from "hooks";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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

// Declare the props interface
interface OnboardingWidgetProps {
	prop1?: string;
	// size: "lg" | "md" | "sm" | "xs" | string;
	[key: string]: any;
}

// Define interfaces for proper typing
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

/**
 * A OnboardingWidget component for handling user onboarding flow
 * @param {object} props - Properties passed to the component
 * @param {string} [props.prop1] - Optional property description
 * @returns {JSX.Element} - The rendered OnboardingWidget component
 * @example	`<OnboardingWidget></OnboardingWidget>`
 */
const OnboardingWidget = ({
	prop1: _prop1,
}: OnboardingWidgetProps): JSX.Element => {
	const { userData, updateUserInfo } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const { accessToken } = useSession();
	const [selectedRole, setSelectedRole] = useState(null);
	const { generateNewToken } = useRefreshToken();
	const [lastStepResponse, setLastStepResponse] = useState();
	const [latLong, setLatLong] = useState();
	const [aadhaar, setAadhaar] = useState();
	const [accesskey, setAccessKey] = useState();
	const [userCode, setUserCode] = useState();

	const [userLoginData, setUserLoginData] = useState<any>(null);
	const [signUrlData, setSignUrlData] = useState<SignUrlData | null>(null);
	const [bookletNumber, setBookletNumber] = useState<any>(null);
	const [isSpinner, setisSpinner] = useState(true);
	const [apiInProgress, setApiInProgress] = useState(false);
	const [esignStatus, setEsignStatus] = useState(0); // 0: loading, 1: ready, 2: failed
	const [digilockerData, setDigilockerData] = useState(null);

	const [stepperData, setStepperData] = useState([
		{
			id: 1,
			name: "Welcome",
			label: "Welcome",
			isSkipable: false,
			isRequired: false,
			isVisible: false,
			stepStatus: 0,
			primaryCTAText: "Start Onboarding",
			description: "",
			form_data: {},
		},
		{
			id: 2,
			name: "RoleCapture",
			label: "Tell us who you are?",
			isSkipable: false,
			isRequired: false,
			isVisible: false,
			stepStatus: 0,
			primaryCTAText: "Continue",
			description: "",
			form_data: {
				roles: [
					{
						id: 1,
						merchant_type: 1,
						applicant_type: 0,
						label: "I'm a retailer",
						description: "I serve customers from my shop",
						icon: "../assets/icons/user_merchant.png",
						isVisible: true,
					},
					{
						id: 2,
						merchant_type: 3,
						applicant_type: 2,
						label: "I'm a distributor",
						description:
							"I have a network of retailer and i want to serve them",
						icon: "../assets/icons/user_distributor.png",
						isVisible: true,
					},
					{
						id: 3,
						merchant_type: 2,
						applicant_type: 1,
						label: "I'm a Enterprise",
						description:
							"I want to use API and other solution to make my own service",
						icon: "../assets/icons/user_enterprise.png",
						isVisible: false,
					},
				],
			},
		},
	]);

	const { isAndroid } = useAppSource();
	const { subscribe, TOPICS } = usePubSub();
	const toast = useToast();

	// Get theme primary color
	const [primaryColor, accentColor] = useToken("colors", [
		"primary.DEFAULT",
		"accent.DEFAULT",
	]);

	// Use custom hooks for data fetching
	const { shopTypes: shopTypesData } = useShopTypes();
	const { states: stateTypesData } = useCountryStates();

	const androidleegalityResponseHandler = (res) => {
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
	};

	const initialStepSetter = (user_data) => {
		const currentStepData = [];
		/**
		 * Sets up the appropriate onboarding steps based on user type
		 */
		function stepSetter() {
			// console.log(
			// 	"[oaas] > Setup Steps #1: ",
			// 	userData,
			// 	userData?.details?.onboarding_steps
			// );

			var step_data = [];
			// User_Type = 1 : Distributor
			// User Type = 3 : Retailer
			if (user_data?.details?.userDetails?.user_type == 1) {
				step_data = distributorStepsData;
			} else if (user_data?.details?.userDetails?.user_type == 3) {
				step_data = retailerStepsData;
			}

			user_data?.details?.onboarding_steps?.forEach((step) => {
				//console.log("[oaas] > Setup Steps #2: ", step, step_data);
				let currentData = step_data?.filter(
					(singleStep) => singleStep.role === step.role
				);
				currentStepData.push(...currentData);
			});
		}
		stepSetter();
		setStepperData([/* ...stepperData, */ ...currentStepData]); // FIX: by Kr.Abhishek (duplicate data)
	};

	let bookletKeys = [];

	const user_id =
		userData?.userDetails?.mobile || userData?.userDetails.signup_mobile;
	let interaction_type_id = TransactionIds.USER_ONBOARDING;

	const handleStepDataSubmit = (data) => {
		// console.log("HandleWlcStepData", data);
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
				const applicantData = selectionStepData.form_data.roles.find(
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
					// bodyData.form_data.accessKey = lastStepResponse?.data?.access_key
				}
			} else if (data?.id === 9) {
				interaction_type_id = TransactionIds.USER_ONBOARDING_BUSINESS;
				bodyData.form_data.latlong = latLong;
				bodyData.form_data.csp_id = userData.userDetails.mobile;
				bodyData.form_data.communication = 1;
			} else if (data?.id === 10) {
				// Object.keys(data.form_data) {}
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
			// console.log("PAN data", data);
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

		// console.log("inside handle file upload ", bodyData, formData);

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
					// console.log("📡 Fetch Result:", {
					// 	res,
					// });
					return res.json();
				} else {
					res.text().then(() => {
						// console.error("📡 Fetch Error:", {
						// 	res,
						// });
					});

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
				// console.error("error in update onboarding: ", err);
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

		// console.log("uploadResponse", uploadResponse);
	};

	const updateOnboarding = (bodyData) => {
		// setisSpinner(true);
		setApiInProgress(true);
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
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

					// setisSpinner(false);
				} else {
					toast({
						title: data.message,
						status: "error",
						duration: 2000,
					});
					setLastStepResponse(data);
					// setisSpinner(false);
				}
				// onClose();
			})
			.catch((err) => {
				// setDisabled(false);
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

	const refreshApiCall = async () => {
		// setisSpinner(true);
		setApiInProgress(true);
		try {
			const res = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL +
					Endpoints.REFRESH_PROFILE,
				{
					token: userData?.access_token,
					body: {
						last_refresh_token: userData?.access_token,
					},
				},
				generateNewToken
			);
			setUserLoginData(res);
			updateUserInfo(res);
			setisSpinner(false);

			if (
				res?.details?.onboarding !== 1 &&
				res?.details?.onboarding !== undefined &&
				res?.details?.onboarding !== null
			) {
				// router.push("/home"); // TODO: Handle this accordingly
			}

			setApiInProgress(false);
			return res;
		} catch (error) {
			setisSpinner(false);
			setApiInProgress(false);

			console.log("inside initial api error", error);
		}
	};

	// Fetcher function for Digilocker URL
	const getDigilockerUrl = async () => {
		try {
			const data = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					token: userData?.access_token,
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
	};

	const handleLeegalityCallback = (res) => {
		// console.log("Leegality callback response", res);
		if (res.error) {
			// console.error("LeegalityCallBack Error", res.error);
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
	};

	const handleStepCallBack = (callType) => {
		// console.log("[stepcallback]", callType, latLong, userLoginData);
		if (callType.type === 12) {
			// Leegality Esign
			if (callType.method === "getSignUrl") {
				getSignUrl();
			}
			if (callType.method === "legalityOpen") {
				// console.log(
				// 	"Opening Leegality Popup: ",
				// 	orgDetail.logo,
				// 	signUrlData,
				// 	isAndroid ? "Android" : "Web"
				// );

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
						// console.error(
						// 	"[oaas Leegality] Didn't receive short-url"
						// );
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
								//	signUrlData?.short_url,
								// logo: orgDetail.logo,
							})
						);
					} else {
						const leegality = new (window as any).Leegality({
							callback: handleLeegalityCallback.bind(this),
							logo: orgDetail.logo,
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

	const getSignUrl = () => {
		// console.log("Getting Signed URL for Leegality...");
		// if (agreementId) {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
				body: {
					interaction_type_id:
						TransactionIds?.USER_ONBOARDING_GET_AGREEMENT_URL,
					document_id: "",
					agreement_id: userLoginData?.details?.agreement_id ?? 5,
					latlong: latLong || "27.176670,78.008075,7787",
					user_id,
					locale: "en",
				},
			},
			generateNewToken
		)
			.then((res) => {
				// console.log("[getSignUrl] resp:", res);
				// console.log("Get Signed URL for Leegality Response: ", res);
				if (res?.data?.short_url) {
					setSignUrlData(res.data);
					// Inform the OaaS Widget that Leegality is ready
					setEsignStatus(1);
					// widgetRef?.current?.postMessage({
					// 	type: "esign:ready",
					// });
				} else {
					toast({
						title:
							res?.message ||
							"E-sign initialization failed, please try again.",
						status: "error",
						duration: 5000,
					});
					// console.error(
					// 	"[getSignUrl] Error: E-sign initialization failed: " +
					// 		res?.message
					// );
					setEsignStatus(2);
					// widgetRef?.current?.postMessage({
					// 	type: "esign:failed",
					// });
				}
			})
			.catch((err) =>
				console.error("[getSignUrl for Leegality] Error:", err)
			);
		// }
	};

	const getBookletNumber = () => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
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
				// console.log("[getBookletNumber] resp:", res);
				if (res.response_status_id === 0) {
					setBookletNumber(res.data);
					// setSignUrlData(res.data);
				}
			})
			.catch((err) => console.error("[getBookletNumber] Error:", err));
		// }
	};

	const getBookletKey = () => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
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
				// console.log("[getBookletKey] resp: ", res, bookletKeys);
				if (res.response_status_id === 0) {
					bookletKeys = [...bookletKeys, res.data];
					// setSignUrlData(res.data);
				}
			})
			.catch((err) => console.error("[getBookletKey] Error: ", err));
		// }
	};

	// Note: Load leegality script only when E-sign step is reached...track script status independently
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "/scripts/leegalityv5.min.js";
		// script.src = '../scripts/leegalityv5.min.js';
		script.id = "legality";
		document.body.appendChild(script);
		script.onload = () => {
			// console.log("Leegality script loaded", script);
		};
		script.onerror = () => {
			// console.error("Failed to load Leegality script");
			toast({
				title: "Failed to initialize eSign",
				description:
					"Please check your network connection & try again.",
				status: "error",
				duration: 2000,
			});
			setEsignStatus(2); // Set E-sign load status to failed
		};
		if (!userLoginData) {
			refreshApiCall();
			// Data fetching now handled by useShopTypes and useCountryStates hooks
		}
		// setLeegalityLoaded(true);
	}, [userLoginData]);

	useEffect(() => {
		const handleMessage = (event) => {
			if (event.data.type === "STATUS_UPDATE") {
				//const { body } = event.data;

				handleStepDataSubmit({
					id: 12,
					form_data: {
						//agreement_status: body.status == 0 ? "success" : "fail",
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
			// console.log("[signup] [PubSub] >>> android-response:: ", data);

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
			{isSpinner ? (
				<Center height={"100vh"}>
					<Spinner />
				</Center>
			) : (
				<div
					style={
						selectedRole === null
							? {
									background: "#FFF",
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
								stepData: selectionStepData,
								handleSubmit: (data: any) => {
									// setSelectedRole(data.form_data.value);
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
								// ref={widgetRef}
								// defaultStep="24000"
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
								orgDetail: orgDetail,
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
