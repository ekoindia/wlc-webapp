import { Center, Spinner, useToast, useToken } from "@chakra-ui/react";
import { Endpoints, TransactionIds } from "constants";
import {
	useAppSource,
	useOrgDetailContext,
	usePubSub,
	useSession,
} from "contexts";
import { useUser } from "contexts/UserContext";
// import { Home, SelectionScreen } from "eko-oaas-package";
import { OnboardingWidget, SelectionScreen } from "@ekoindia/oaas-widget";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ANDROID_ACTION, ANDROID_PERMISSION, doAndroidAction } from "utils";
import { createPintwinFormat } from "../../utils/pintwinFormat";
// import { distributorStepsData } from "./distributorStepsData";

const selectionStepData = {
	id: 0,
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
				label: "I'm a Retailer",
				description: "I serve customers from my shop",
				icon: "../assets/icons/user_merchant.png",
				isVisible: true,
				user_type: [
					{ key: 3, name: "I Merchant" },
					{ key: 2, name: "Merchant" },
				],
			},
			{
				id: 2,
				merchant_type: 3,
				applicant_type: 2,
				label: "I'm a Distributor",
				description:
					"I have a network of retailer and i want to serve them",
				icon: "../assets/icons/user_distributor.png",
				isVisible: true,
				user_type: [{ key: 1, name: "Distributor" }],
			},
			{
				id: 3,
				merchant_type: 2,
				applicant_type: 1,
				label: "I'm an Enterprise",
				description:
					"I want to use API and other solutions to make my own service",
				icon: "../assets/icons/user_enterprise.png",
				isVisible: false,
				user_type: [{ key: 23, name: "Partner" }],
			},
		],
	},
};

/**
 * Onboarding steps data for both sellers & distributor.
 * Based on user-type (seller or distributor), the oaas-widget will manually remove a few steps for the distributor (hard-coded in the oaas-widget file `src/components/Common/Sidebar/Sidebar.tsx`).
 * Currently, only "Business Details" & "Secret PIN" steps are removed from the Distributor onboarding.
 *
 * Some steps are disabled by marking `isVisible` as `false`.
 */
const distributorStepsData = [
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
	{
		id: 3,
		name: "LocationCapture",
		label: "Location Capturing",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 13000,
		primaryCTAText: "Start Location Capture",
		description: "",
		form_data: {},
		success_message: "Location captured successfully.",
	},
	{
		id: 4,
		name: "AadhaarVerification",
		label: "Aadhaar Verification",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12400,
		primaryCTAText: "Verify Aadhaar",
		description:
			"Upload your Aadhaar Copy front and back to verify yourself. Accepted formats are",
		form_data: {},
		success_message: "Aadhaar uploaded successfully.",
	},
	{
		id: 5,
		name: "Aadhaar Consent",
		label: "Aadhaar Consent",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Verify Consent",
		description: "",
		form_data: {},
		success_message: "Aadhaar consent taken.",
	},
	{
		id: 6,
		name: "Confirm Aadhaar Number",
		label: "Confirm Aadhaar Number",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Proceed",
		description: "",
		form_data: {},
		success_message: "Aadhaar number confirmed.",
	},

	{
		id: 7,
		name: "ConfirmAadhaarOTP",
		label: "Confirm Aadhaar OTP",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Confirm",
		description: "",
		form_data: {},
		success_message: "Aadhaar confirmed successfully.",
	},
	{
		id: 11,
		name: "SelfieKYC",
		label: "Selfie KYC",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12500,
		primaryCTAText: "Next",
		description:
			"Thanks for completing your personal and address verification. Take a clear selfie to complete the eKYC process.",
		form_data: {},
		success_message: "KYC completed.",
	},
	{
		id: 9,
		name: "BusinessDetails",
		label: "Business Details",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 13300,
		primaryCTAText: "Next",
		description: "",
		form_data: {},
	},
	{
		id: 10,
		name: "SecretPin",
		label: "Secret Pin",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12600,
		primaryCTAText: "Next",
		description: "Set Your 4-Digit Secret Pin",
		form_data: {},
	},
	{
		id: 12,
		name: "Sign Agreement",
		label: "Sign Agreement",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12800,
		primaryCTAText: "Sign Agreement",
		description: "",
		form_data: {},
		success_message: "Agreement signed successfully.",
	},
	{
		id: 8,
		name: "PanVerification",
		label: "Pan Verification",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12300,
		primaryCTAText: "Verify PAN",
		description:
			"Upload your PAN copy to verify your business. Accepted formats are",
		form_data: {},
		success_message: "PAN verified successfully.",
	},

	{
		id: 16,
		name: "PanVerification",
		label: "Pan Verification",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 13000,
		primaryCTAText: "Verify PAN",
		description: "Enter your PAN Number to verify your business.",
		form_data: {},
		success_message: "PAN verified successfully.",
	},

	{
		id: 13,
		name: "Activation Plans",
		label: "Activation Plans",
		isSkipable: false,
		isRequired: true,
		isVisible: false,
		stepStatus: 0,
		role: 13400,
		primaryCTAText: "Sign Agreement",
		description: "Select Plans To See Details",
		form_data: {},
		success_message: "Agreement signed successfully.",
	},
	{
		id: 14,
		name: "OnboardingStatus",
		label: "Onboarding Status",
		isSkipable: false,
		isRequired: false,
		isVisible: false,
		stepStatus: 0,
		primaryCTAText: "Submit",
		description: "",
		form_data: {},
	},
	{
		id: 15,
		name: "PANAadhaarMatching",
		label: "PAN - Aadhaar Matching",
		isSkipable: false,
		isRequired: false,
		isVisible: false,
		stepStatus: 0,
		primaryCTAText: "Start Matching",
		description: "",
		form_data: {},
	},
];

const retailerStepsData = [
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
	{
		id: 3,
		name: "LocationCapture",
		label: "Location Capturing",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12400,
		primaryCTAText: "Start Location Capture",
		description: "",
		form_data: {},
		success_message: "Location captured successfully.",
	},
	{
		id: 4,
		name: "AadhaarVerification",
		label: "Aadhaar Verification",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12400,
		primaryCTAText: "Verify Aadhaar",
		description:
			"Upload your Aadhaar Copy front and back to verify yourself. Accepted formats are",
		form_data: {},
		success_message: "Aadhaar uploaded successfully.",
	},
	{
		id: 5,
		name: "Aadhaar Consent",
		label: "Aadhaar Consent",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Verify Consent",
		description: "",
		form_data: {},
		success_message: "Aadhaar consent taken.",
	},
	{
		id: 6,
		name: "Confirm Aadhaar Number",
		label: "Confirm Aadhaar Number",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Proceed",
		description: "",
		form_data: {},
		success_message: "Aadhaar number confirmed.",
	},

	{
		id: 7,
		name: "ConfirmAadhaarOTP",
		label: "Confirm Aadhaar OTP",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Confirm",
		description: "",
		form_data: {},
		success_message: "Aadhaar confirmed successfully.",
	},
	{
		id: 11,
		name: "SelfieKYC",
		label: "Selfie KYC",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12500,
		primaryCTAText: "Next",
		description:
			"Thanks for completing your personal and address verification. Take a clear selfie to complete the eKYC process.",
		form_data: {},
		success_message: "KYC completed.",
	},
	{
		id: 10,
		name: "SecretPin",
		label: "Secret Pin",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12600,
		primaryCTAText: "Next",
		description: "Set Your 4-Digit Secret Pin",
		form_data: {},
	},
	{
		id: 12,
		name: "Sign Agreement",
		label: "Sign Agreement",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12800,
		primaryCTAText: "Sign Agreement",
		description: "",
		form_data: {},
		success_message: "Agreement signed successfully.",
	},
	{
		id: 8,
		name: "PanVerification",
		label: "Pan Verification",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12300,
		primaryCTAText: "Verify PAN",
		description:
			"Upload your PAN copy to verify your business. Accepted formats are",
		form_data: {},
		success_message: "PAN verified successfully.",
	},
	{
		id: 13,
		name: "Activation Plans",
		label: "Activation Plans",
		isSkipable: false,
		isRequired: true,
		isVisible: false,
		stepStatus: 0,
		role: 13400,
		primaryCTAText: "Sign Agreement",
		description: "Select Plans To See Details",
		form_data: {},
		success_message: "Agreement signed successfully.",
	},
	{
		id: 14,
		name: "OnboardingStatus",
		label: "Onboarding Status",
		isSkipable: false,
		isRequired: false,
		isVisible: false,
		stepStatus: 0,
		primaryCTAText: "Submit",
		description: "",
		form_data: {},
	},
	{
		id: 15,
		name: "PANAadhaarMatching",
		label: "PAN - Aadhaar Matching",
		isSkipable: false,
		isRequired: false,
		isVisible: false,
		stepStatus: 0,
		primaryCTAText: "Start Matching",
		description: "",
		form_data: {},
	},
];

const SignupPage = () => {
	const { userData, updateUserInfo } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const { accessToken } = useSession();
	const router = useRouter();
	// const [onboardingData, setOnboardingData] = useState();
	const [selectedRole, setSelectedRole] = useState(null);
	const { generateNewToken } = useRefreshToken();
	const [lastStepResponse, setLastStepResponse] = useState();
	const [latLong, setLatLong] = useState();
	const [aadhaar, setAadhaar] = useState();
	const [accesskey, setAccessKey] = useState();
	const [userCode, setUserCode] = useState();

	const [userLoginData, setUserLoginData] = useState();
	const [shopTypesData, setShopTypesData] = useState();
	const [stateTypesData, setStateTypesData] = useState();
	const [signUrlData, setSignUrlData] = useState();
	const [bookletNumber, setBookletNumber] = useState();
	const [isSpinner, setisSpinner] = useState(true);
	const [apiInProgress, setApiInProgress] = useState(false);
	const [esignStatus, setEsignStatus] = useState(0); // 0: loading, 1: ready, 2: failed

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

	// const widgetRef = useRef(null);
	const { isAndroid } = useAppSource();
	const { subscribe, TOPICS } = usePubSub();

	// Subscribe to the Android responses
	useEffect(() => {
		const unsubscribe = subscribe(TOPICS.ANDROID_RESPONSE, (data) => {
			console.log("[signup] [PubSub] >>> android-response:: ", data);

			if (data?.action === ANDROID_ACTION.LEEGALITY_ESIGN_RESPONSE) {
				androidleegalityResponseHandler(data?.data);
			}
		});

		return unsubscribe;
	}, []);

	// useEffect(() => {
	// 	const handleMessage = (event) => {
	// 		if (event.data.type === "STATUS_UPDATE") {
	// 			const { status } = event.data;
	// 			// Handle the status update
	// 			console.log(`Received Status Signup: ${status}`);
	// 		}
	// 	};

	// 	window.addEventListener("message", handleMessage);

	// 	// Cleanup listener on component unmount
	// 	return () => {
	// 		window.removeEventListener("message", handleMessage);
	// 	};
	// }, []);

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

	// FIX: HACK: ADDED BY KR.ABHISHEK FOR TESTING...INITIAL STEP LIST NOT GETTING POPULATED...
	useEffect(() => {
		initialStepSetter({ details: userData });
	}, [userData]);

	let bookletKeys = [];

	const toast = useToast();
	const user_id =
		userData?.userDetails?.mobile || userData?.userDetails.signup_mobile;
	let interaction_type_id = TransactionIds.USER_ONBOARDING;

	const handleStepDataSubmit = (data) => {
		console.log("HandleWlcStepData", data);
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
					bookletNumber?.is_pintwin_user;
				bodyData.form_data.booklet_serial_number =
					bookletNumber?.booklet_serial_number;
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
		const bodyData = {
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
			formData.append(
				"formdata",
				new URLSearchParams(bodyData["formdata"])
			);
		} else if (data.id === 8) {
			console.log("PAN data", data);
			bodyData.file1 = data?.form_data?.panImage?.fileData;
			bodyData.formdata.file1 = "";
			bodyData.formdata.doc_type = 2;
			bodyData.formdata.doc_id = data?.form_data?.panNumber;
			bodyData.formdata.shop_type = data?.form_data?.shopType;
			bodyData.formdata.shop_name = data?.form_data?.shopName;
			formData.append("file1", bodyData.file1);
			formData.append(
				"formdata",
				new URLSearchParams(bodyData["formdata"])
			);
		} else {
			bodyData.file1 = data?.form_data?.videoKyc?.fileData;
			bodyData.formdata.file1 = "";
			bodyData.formdata.doc_type = 3;
			formData.append("file1", bodyData.file1);
			formData.append(
				"formdata",
				new URLSearchParams(bodyData["formdata"])
			);
		}

		console.log("inside handle file upload ", bodyData, formData);

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
					console.log("📡 Fetch Result:", {
						res,
					});
					return res.json();
				} else {
					res.text().then(() => {
						console.error("📡 Fetch Error:", {
							res,
						});
					});

					const err = new Error("API Error");
					err.response = res;
					err.status = res.status;
					if (res.status === 401) {
						err.name = "Unauthorized";
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
				console.error("error in update onboarding: ", err);
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

		console.log("uploadResponse", uploadResponse);
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
				router.push("/home");
			}

			setApiInProgress(false);
			return res;
		} catch (error) {
			setisSpinner(false);
			setApiInProgress(false);

			console.log("inside initial api error", error);
		}
	};

	const getSHopTypes = () => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
				body: {
					interaction_type_id: TransactionIds?.SHOP_TYPE,
				},
			},
			generateNewToken
		)
			.then((res) => {
				if (res.status === 0) {
					setShopTypesData(res?.param_attributes.list_elements);
				}
			})
			.catch((err) => console.error("[GetShopTypes] Error", err));
	};

	const getStateType = () => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
				body: {
					interaction_type_id: TransactionIds?.STATE_TYPE,
				},
			},
			generateNewToken
		)
			.then((res) => {
				if (res.status === 0) {
					setStateTypesData(res?.param_attributes.list_elements);
				}
				console.log("[getStateType] resp:", res);
			})
			.catch((err) => console.error("[getStateType] Error:", err));
	};
	// const getPincodeType = () => {
	// 	console.log("inside mainfunction");
	// 	fetcher(
	// 		process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
	// 		{
	// 			token: userData?.access_token,
	// 			body: {
	// 				interaction_type_id: TransactionIds?.PINCODE_TYPE,
	// 			},
	// 		},
	// 		generateNewToken
	// 	)
	// 		.then((res) => {
	// 			// if (res.status === 0) {
	// 			// 	setStateTypesData(res?.param_attributes.list_elements);
	// 			// }
	// 			console.log("inside initial api response pincode", res);
	// 		})
	// 		.catch((err) => console.log("inside initial api error", err));
	// };

	const handleLeegalityCallback = (res) => {
		console.log("Leegality callback response", res);
		if (res.error) {
			console.error("LeegalityCallBack Error", res.error);
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
		console.log("[stepcallback]", callType, latLong, userLoginData);
		if (callType.type === 12) {
			// Leegality Esign
			if (callType.method === "getSignUrl") {
				getSignUrl(userLoginData?.details?.agreement_id);
			}
			if (callType.method === "legalityOpen") {
				// console.log(
				// 	"Opening Leegality Popup: ",
				// 	orgDetail.logo,
				// 	signUrlData,
				// 	isAndroid ? "Android" : "Web"
				// );

				if (!signUrlData?.short_url) {
					console.error("[oaas Leegality] Didn't receive short-url");
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
					// eslint-disable-next-line no-undef
					const leegality = new Leegality({
						callback: handleLeegalityCallback.bind(this),
						logo: orgDetail.logo,
					});
					leegality.init();
					leegality.esign(signUrlData?.short_url); // signUrlData?.short_url
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
		}
	};

	const getSignUrl = () => {
		console.log("Getting Signed URL for Leegality...");
		// if (agreementId) {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
				body: {
					interaction_type_id:
						TransactionIds?.USER_ONBOARDING_GET_AGREEMENT_URL,
					document_id: "",
					agreement_id: userLoginData?.details?.agreement_id || 5,
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
					console.error(
						"[getSignUrl] Error: E-sign initialization failed: " +
							res?.message
					);
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

	// TODO: Load leegality script only when E-sign step is reached...track script status indipendently
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "/scripts/leegalityv5.min.js";
		// script.src = '../scripts/leegalityv5.min.js';
		script.id = "legality";
		document.body.appendChild(script);
		script.onload = () => {
			console.log("Leegality script loaded", script);
		};
		script.onerror = () => {
			console.error("Failed to load Leegality script");
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
			getSHopTypes();
			getStateType();
			// getPincodeType();
		}
		// setLeegalityLoaded(true);
	}, [userLoginData]);

	// useEffect(() => {
	// 	if (userLoginData?.details?.agreement_id) {
	// 		getSignUrl();
	// 	}
	// }, [userLoginData?.details?.agreement_id]);

	useEffect(() => {
		if (bookletNumber) {
			getBookletKey();
			getBookletKey();
		}
	}, [bookletNumber, getBookletKey]);

	// Get theme primary color
	const [primaryColor] = useToken("colors", ["primary.DEFAULT"]);

	// console.log("[wlc>oaas] Loading Widget: ", {
	// 	selectedRole,
	// 	selectionStepData,
	// 	userData,
	// });

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
						<SelectionScreen
							stepData={selectionStepData}
							handleSubmit={(data) => {
								// setSelectedRole(data.form_data.value);
								handleStepDataSubmit(data);
							}}
							isDisabledCTA={apiInProgress}
							primaryColor={primaryColor}
						/>
					) : (
						<OnboardingWidget
							// ref={widgetRef}
							// defaultStep="24000"
							defaultStep={
								userData?.userDetails?.role_list || "12400"
							}
							isBranding={false}
							userData={userData}
							handleSubmit={handleStepDataSubmit}
							stepResponse={lastStepResponse}
							selectedMerchantType={selectedRole}
							shopTypes={shopTypesData}
							stateTypes={stateTypesData}
							stepsData={stepperData}
							handleStepCallBack={handleStepCallBack}
							esignStatus={esignStatus}
							primaryColor={primaryColor}
							orgDetail={orgDetail}
						/>
					)}
				</div>
			)}
		</>
	);
};

SignupPage.pageMeta = {
	title: "Signup",
	hideMenu: true,
};

export default SignupPage;
