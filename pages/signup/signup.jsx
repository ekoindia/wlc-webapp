import { useToast } from "@chakra-ui/react";
import { Endpoints, TransactionIds } from "constants";
import { useSession } from "contexts";
import { useUser } from "contexts/UserContext";
import { Home, SelectionScreen } from "eko-oaas-package";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

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
				label: "I'm a seller",
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
					"I have a network of seller and i want to serve them",
				icon: "../assets/icons/user_distributor.png",
				isVisible: false,
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
};

const SignupPage = () => {
	const { userData, updateUserInfo } = useUser();
	const { accessToken } = useSession();
	const router = useRouter();
	// const [onboardingData, setOnboardingData] = useState();
	const [selectedRole, setSelectedRole] = useState(null);
	const { generateNewToken } = useRefreshToken();
	const [lastStepResponse, setLastStepResponse] = useState();
	const [latLong, setLatLong] = useState();
	const [aadhar, setAadhar] = useState();
	const [userLoginData, setUserLoginData] = useState();
	const [shopTypesData, setShopTypesData] = useState();
	const [stateTypesData, setStateTypesData] = useState();
	const [signUrlData, setSignUrlData] = useState();
	const toast = useToast();
	let interaction_type_id = TransactionIds.USER_ONBOARDING;
	const handleStepDataSubmit = (data) => {
		console.log("HandleWlcStepData", data);
		if (data?.id === 3) {
			setLatLong(data?.form_data?.latlong);
		}
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
				console.log("applicantType", applicantData, userData);
				bodyData.form_data.applicant_type = applicantData;
				bodyData.form_data.csp_id = userData.userDetails.signup_mobile;
				interaction_type_id = TransactionIds.USER_ONBOARDING_ROLE;
			} else if (data?.id === 5) {
				bodyData.form_data.company_name =
					userData.userDetails.signup_mobile;
				bodyData.form_data.latlong = latLong;
				interaction_type_id = TransactionIds.USER_AADHAR_CONSENT;
			} else if (data?.id === 6 || data?.id === 7) {
				bodyData.form_data.caseId = lastStepResponse?.data?.user_code;
				bodyData.form_data.hold_timeout = "";
				bodyData.form_data.access_key =
					lastStepResponse?.data?.access_key;
				if (data?.id === 6) {
					setAadhar(bodyData.form_data.aadhar);
					interaction_type_id =
						TransactionIds.USER_AADHAR_NUMBER_CONFIRM;
				} else {
					interaction_type_id =
						TransactionIds.USER_AADHAR_OTP_CONFIRM;
					bodyData.form_data.aadhar = aadhar;
				}
			} else if (data?.id === 9) {
				interaction_type_id = TransactionIds.USER_ONBOARDING_BUSINESS;
			} else if (data?.id === 12) {
				interaction_type_id =
					TransactionIds.USER_ONBOARDING_SUBMIT_SIGN_AGREEMENT;
			}
			updateOnboarding(bodyData);
		} else {
			handleFileUploadOnboarding(data);
		}
	};

	// Method only for file upload data
	const handleFileUploadOnboarding = async (data) => {
		// Handle all file upload API's here only
		const formData = new FormData();

		const bodyData = {
			formdata: {
				client_ref_id:
					Date.now() + "" + Math.floor(Math.random() * 1000),
				user_id: userData?.userDetails.signup_mobile,
				interaction_type_id: TransactionIds.USER_ONBOARDING_AADHAR,
				intent_id: 3,
				locale: "en",
				doc_type: 1,
				latlong: latLong,
				source: "WLC",
			},
		};
		if (data.id === 4) {
			bodyData.file1 = data?.form_data?.aadharImages?.front?.fileData;
			bodyData.file2 = data?.form_data?.aadharImages?.back?.fileData;
			bodyData.formdata.file1 = "";
			bodyData.formdata.file2 = "";
			formData.append("file1", bodyData.file1);
			formData.append("file2", bodyData.file2);
			formData.append(
				"formdata",
				new URLSearchParams(bodyData["formdata"])
			);
		} else if (data.id === 8) {
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

		console.log("inside handle file upload ", bodyData);
		console.log("inside handle file upload formData", formData);

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
						// TODO: Handle unauthorized error by refreshing token
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
		if (uploadResponse.status !== 0) {
			toast({
				title:
					uploadResponse.message ||
					"Something went wrong, please try again later!",
				status: "error",
				duration: 2000,
			});
		} else {
			toast({
				title: uploadResponse.message,
				status: "success",
				duration: 2000,
			});
		}
		setLastStepResponse(uploadResponse);

		console.log("uploadResponse", uploadResponse);
	};

	const updateOnboarding = (bodyData) => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			token: userData?.access_token,
			body: {
				interaction_type_id: interaction_type_id,
				user_id: userData?.userId,
				...bodyData?.form_data,
			},
			timeout: 30000,
		})
			.then((data) => {
				console.log("data update", data);
				if (data?.status === 0) {
					toast({
						title: bodyData.success_message || "Success",
						status: "success",
						duration: 2000,
					});
					if (bodyData?.id === 0) {
						setSelectedRole(data);
					} else {
						setLastStepResponse(data);
					}
					refreshApiCall();
				} else {
					toast({
						title: data.message,
						status: "error",
						duration: 2000,
					});
					setLastStepResponse(data);
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

				console.error("error in update onboarding: ", err);
			});
	};

	const refreshApiCall = () => {
		console.log("inside mainfunction");
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.REFRESH_PROFILE,
			{
				token: userData?.access_token,
				body: {
					last_refresh_token: userData?.access_token,
				},
			},
			generateNewToken
		)
			.then((res) => {
				setUserLoginData(res);
				updateUserInfo(res);
				if (res?.details?.onboarding !== 1) {
					router.push("/home");
				}
				console.log("inside initial api response", res);
			})
			.catch((err) => console.log("inside initial api error", err));
	};

	const getSHopTypes = () => {
		console.log("inside mainfunction");
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
				console.log("inside initial api response shopTypes", res);
			})
			.catch((err) => console.log("inside initial api error", err));
	};

	const getStateType = () => {
		console.log("inside mainfunction");
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
				console.log("inside initial api response stateTypes", res);
			})
			.catch((err) => console.log("inside initial api error", err));
	};
	const getPincodeType = () => {
		console.log("inside mainfunction");
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
				body: {
					interaction_type_id: TransactionIds?.PINCODE_TYPE,
				},
			},
			generateNewToken
		)
			.then((res) => {
				// if (res.status === 0) {
				// 	setStateTypesData(res?.param_attributes.list_elements);
				// }
				console.log("inside initial api response pincode", res);
			})
			.catch((err) => console.log("inside initial api error", err));
	};

	const handleLeegalityCallback = (res) => {
		console.log("callback response", res);
		if (res.error) {
			console.log("res.error leegalityCallBack", res.error);
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
					agreement_id: userData?.details?.agreement_id,
				},
			});
		}
	};

	const handleStepCallBack = useCallback(
		(callType) => {
			console.log("stepcallback", callType, latLong, userLoginData);
			if (callType.type === 12) {
				if (callType.method === "getSignUrl") {
					getSignUrl(userLoginData?.details?.agreement_id);
				}
				if (callType.method === "legalityOpen") {
					console.log("inside legal");
					// eslint-disable-next-line no-undef
					const leegality = new Leegality({
						callback: handleLeegalityCallback.bind(this),
						logo: "/images/logoimage.png",
					});
					leegality.init();
					leegality.esign(signUrlData?.short_url);
				}
			}
		},
		[userLoginData?.details.agreement_id]
	);
	const getSignUrl = () => {
		console.log("inside mainfunction");
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
					user_id: userData?.userDetails.signup_mobile,
					locale: "en",
				},
			},
			generateNewToken
		)
			.then((res) => {
				console.log("inside initial api response stepcallback", res);
				if (res.response_status_id === 0) {
					setSignUrlData(res.data);
				}
			})
			.catch((err) => console.log("inside initial api error", err));
		// }
	};

	useEffect(() => {
		console.log("In ueffect ins", userLoginData);
		if (!userLoginData) {
			refreshApiCall();
			getSHopTypes();
			getStateType();
			getPincodeType();
		}
	}, []);

	useEffect(() => {
		console.log("inside script");
		const script = document.createElement("script");
		script.src = "/scripts/leegalityv5.min.js";
		// script.src = '../scripts/leegalityv5.min.js';
		script.id = "legality";
		document.body.appendChild(script);
		script.onload = () => {
			console.log("script loaded", script);
		};
		// setLeegalityLoaded(true);
	});

	useEffect(() => {
		if (userLoginData?.details?.agreement_id) {
			getSignUrl();
		}
	}, [userLoginData?.details?.agreement_id]);

	console.log("userData", userData);
	return (
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
			{selectedRole === null && userData?.details?.mobile === "1" ? (
				<SelectionScreen
					stepData={selectionStepData}
					handleSubmit={(data) => {
						// setSelectedRole(data.form_data.value);
						handleStepDataSubmit(data);
					}}
				/>
			) : (
				<Home
					// defaultStep={"12800"}
					defaultStep={userLoginData?.details?.role_list || "12400"}
					isBranding={false}
					handleSubmit={handleStepDataSubmit}
					stepResponse={lastStepResponse}
					selectedMerchantType={selectedRole}
					shopTypes={shopTypesData}
					stateTypes={stateTypesData}
					handleStepCallBack={handleStepCallBack}
				/>
			)}
		</div>
	);
};
SignupPage.pageMeta = {
	title: "Signup",
	hideMenu: true,
};
export default SignupPage;
