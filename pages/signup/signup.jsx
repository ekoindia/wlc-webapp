import { Center, Spinner, useToast } from "@chakra-ui/react";
import { Endpoints, TransactionIds } from "constants";
import { useOrgDetailContext, useSession } from "contexts";
import { useUser } from "contexts/UserContext";
import { Home, SelectionScreen } from "eko-oaas-package";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createPintwinFormat } from "../../utils/pintwinFormat";

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
				user_type: [
					{ key: 3, name: "I Merchant" },
					{ key: 2, name: "Merchant" },
				],
			},
			{
				id: 2,
				merchant_type: 3,
				applicant_type: 2,
				label: "I'm a distributor",
				description:
					"I have a network of seller and i want to serve them",
				icon: "../assets/icons/user_distributor.png",
				isVisible: true,
				user_type: [{ key: 1, name: "Distributor" }],
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
				user_type: [{ key: 23, name: "Partner" }],
			},
		],
	},
};

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
	let bookletKeys = [];
	const [isSpinner, setisSpinner] = useState(true);
	const toast = useToast();
	const user_id =
		userData?.userDetails?.mobile || userData?.userDetails.signup_mobile;
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
				console.log("Data", data, lastStepResponse);
				bodyData.form_data.caseId = userCode;
				bodyData.form_data.hold_timeout = "";
				bodyData.form_data.access_key = accesskey;
				if (data?.id === 6) {
					setAadhaar(bodyData.form_data.aadhar);
					interaction_type_id =
						TransactionIds.USER_AADHAR_NUMBER_CONFIRM;
				} else {
					console.log("AAdhar wlc", aadhaar);
					interaction_type_id =
						TransactionIds.USER_AADHAR_OTP_CONFIRM;
					bodyData.form_data.aadhar = aadhaar;
					// bodyData.form_data.accessKey = lastStepResponse?.data?.access_key
				}
			} else if (data?.id === 9) {
				console.log("bodyData inside 1", bodyData);
				interaction_type_id = TransactionIds.USER_ONBOARDING_BUSINESS;
				bodyData.form_data.latlong = latLong;
				bodyData.form_data.csp_id = userData.userDetails.mobile;
				bodyData.form_data.communication = 1;
			} else if (data?.id === 10) {
				// Object.keys(data.form_data) {}
				console.log("pintwin 1", data?.form_data, bookletKeys);
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
			console.log("pan data", data);
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
		if (uploadResponse.response_status_id !== 0) {
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
			setLastStepResponse(uploadResponse);
			refreshApiCall();
		}

		console.log("uploadResponse", uploadResponse);
	};

	const updateOnboarding = (bodyData) => {
		console.log("bodyData inside 2", bodyData);
		// setisSpinner(true);
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			token: userData?.access_token,
			body: {
				interaction_type_id: interaction_type_id,
				user_id,
				...bodyData.form_data,
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
					if (bodyData?.id === 5) {
						setAccessKey(data?.data?.access_key);
						setUserCode(data?.data?.user_code);
					}
					if (bodyData?.id == 2) {
						setSelectedRole(bodyData?.form_data?.merchant_type);
					}
					setLastStepResponse(data);
					refreshApiCall();
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

				console.error("error in update onboarding: ", err);
			});
	};

	const refreshApiCall = () => {
		console.log("inside mainfunction");
		// setisSpinner(true);
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
				setisSpinner(false);

				if (
					res?.details?.onboarding !== 1 &&
					res?.details?.onboarding !== undefined &&
					res?.details?.onboarding !== null
				) {
					router.push("/home");
				}
				console.log("inside initial api response", res);
			})
			.catch((err) => {
				setisSpinner(false);

				console.log("inside initial api error", err);
			});
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
					agreement_id: userData?.userDetails?.agreement_id,
				},
			});
		}
	};

	const handleStepCallBack = (callType) => {
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
					logo: orgDetail.logo,
				});
				leegality.init();
				leegality.esign(signUrlData?.short_url);
			}
		} else if (callType.type === 10) {
			if (callType.method === "getBookletNumber") {
				console.log("inside getBookletNumber");
				getBookletNumber();
			}
			if (callType.method === "getBookletKey") {
				console.log("inside getBookletKey");
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
		}
	};

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
					user_id,
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
				console.log(
					"inside initial api response getBookletNumber",
					res
				);
				if (res.response_status_id === 0) {
					setBookletNumber(res.data);
					// setSignUrlData(res.data);
				}
			})
			.catch((err) =>
				console.log("inside initial api error getBookletNumber", err)
			);
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
				console.log(
					"inside initial api response getBookletNumber",
					res,
					bookletKeys
				);
				if (res.response_status_id === 0) {
					bookletKeys = [...bookletKeys, res.data];
					// setSignUrlData(res.data);
				}
			})
			.catch((err) =>
				console.log("inside initial api error getBookletNumber", err)
			);
		// }
	};

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
		if (!userLoginData) {
			refreshApiCall();
			getSHopTypes();
			getStateType();
			// getPincodeType();
		}
		// setLeegalityLoaded(true);
	});

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
	}, [bookletNumber]);
	console.log("userData", userData);
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
						/>
					) : (
						<Home
							// defaultStep="12600"
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
							handleStepCallBack={handleStepCallBack}
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
