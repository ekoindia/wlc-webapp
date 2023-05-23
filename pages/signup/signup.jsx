import { useToast } from "@chakra-ui/react";
import { Endpoints, TransactionIds } from "constants";
import { useUser } from "contexts/UserContext";
import { Home, SelectionScreen } from "eko-oaas-package";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { useState } from "react";

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
};

const SignupPage = () => {
	const { userData } = useUser();
	// const [onboardingData, setOnboardingData] = useState();
	const [selectedRole, setSelectedRole] = useState(null);
	const { generateNewToken } = useRefreshToken();
	const [lastStepResponse, setLastStepResponse] = useState();
	const toast = useToast();

	const handleStepDataSubmit = (data) => {
		console.log("HandleWlcStepData", data);
		if (
			data?.id !== 1 &&
			data?.id !== 4 &&
			data?.id !== 5 &&
			data?.id !== 7
		) {
			updateOnboarding(data);
		} else {
			handleFileUploadOnboarding(data);
		}
	};

	const handleFileUploadOnboarding = (data) => {
		// Handle all file upload API's here only
		const bodyData = {
			file1:
				// data?.form_data?.aadharImages?.front?.url instanceof Blob?
				new File(
					[data?.form_data?.aadharImages?.front?.url],
					"aadharFront"
				),
			// : data?.form_data?.aadharImages?.front?.url,
			file2:
				// data?.form_data?.aadharImages?.back?.url instanceof Blob ?
				new File(
					[data?.form_data?.aadharImages?.back?.url],
					"aadharBack"
				),
			// : data?.form_data?.aadharImages?.back?.url,
			"form-data": {
				client_ref_id:
					Date.now() + "" + Math.floor(Math.random() * 1000),
				user_id: userData?.userId,
				interaction_type_id: TransactionIds.USER_ONBOARDING_AADHAR,
				intent_id: 3,
				latlong: "28.669156%2C77.453758%2C11358",
			},
		};

		console.log("inside handle file upload ", bodyData);
		// const formBody = new FormData(bodyData);

		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.UPLOAD,
			{
				token: userData?.access_token,
				body: bodyData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
				timeout: 30000,
			},
			generateNewToken
		)
			.then((data) => {
				toast({
					title: data.message,
					status: "success",
					duration: 2000,
				});
				setLastStepResponse(data);

				console.log("data update", data);
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

				console.error("error in update onboarding: ", err);
			});
	};

	const updateOnboarding = (data) => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
				body: {
					interaction_type_id:
						data?.id === 0
							? TransactionIds.USER_ONBOARDING_ROLE
							: TransactionIds.USER_ONBOARDING,
					user_id: userData?.userId,
					...data?.form_data,
				},
				timeout: 30000,
			},
			generateNewToken
		)
			.then((data) => {
				console.log("data update", data);
				// setDisabled(false);
				// updateShopDetails(formState);
				toast({
					title: data.message,
					status: "success",
					duration: 2000,
				});
				// onClose();
				setLastStepResponse(data);
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
			{selectedRole === null ? (
				<SelectionScreen
					stepData={selectionStepData}
					handleSubmit={(data) => {
						setSelectedRole(data.form_data.value);
						handleStepDataSubmit({
							...data,
							form_data: { merchant_type: data.form_data.value },
						});
					}}
				/>
			) : (
				<Home
					defaultStep={1}
					isBranding={false}
					handleSubmit={handleStepDataSubmit}
					stepResponse={lastStepResponse}
					selectedMerchantType={selectedRole}
				/>
			)}
		</div>
	);
};

export default SignupPage;
