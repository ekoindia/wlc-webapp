import { Flex, Text, useToast } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { Endpoints } from "constants/EndPoints";
import { ParamType } from "constants/trxnFramework";
import { useAppSource, useOrgDetailContext } from "contexts";
import { fetcher } from "helpers";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components/Form";
import { useOnboardingContext } from "../../context";
import { ASSISTED_ONBOARDING_STEPS } from "../AssistedOnboarding";
import { ONBOARDING_GATEWAY_STEPS } from "./OnboardingGateway";

export interface OnboardingGatewayVerifyOtpProps {
	setStep: React.Dispatch<
		React.SetStateAction<keyof typeof ONBOARDING_GATEWAY_STEPS>
	>;
	setGatewayAccessToken: React.Dispatch<React.SetStateAction<string>>;
	setAgentDetails: React.Dispatch<React.SetStateAction<any>>;
}

/**
 * OnboardingGatewayVerifyOtp component for verifying OTP for agent onboarding.
 * Reads `mobile` from OnboardingContext instead of receiving it as a prop.
 * @param {OnboardingGatewayVerifyOtpProps} props - Component props
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setStep - Function to set the current step
 * @returns {JSX.Element} The rendered OnboardingGatewayVerifyOtp component
 */
const OnboardingGatewayVerifyOtp = ({
	setStep,
	setGatewayAccessToken,
	setAgentDetails,
}: OnboardingGatewayVerifyOtpProps): JSX.Element => {
	const { mobile } = useOnboardingContext();
	const { isAndroid } = useAppSource();
	const { orgDetail } = useOrgDetailContext();

	console.log("[OnboardingGatewayVerifyOtp] orgDetail", orgDetail);

	const {
		handleSubmit,
		register,
		control,
		formState: { errors, isValid, isDirty, isSubmitting },
	} = useForm({
		mode: "onChange",
	});

	const watcher = useWatch({
		control,
	});

	const otp_verification_parameter_list = [
		{
			name: "otp",
			label: `Enter OTP`,
			parameter_type_id: ParamType.OTP,
			maxLength: 3,
			minLength: 4,
			placeholder: "Enter OTP",
			validations: {
				required: "OTP is required",
				pattern: {
					value: /^[0-9]{3,4}$/,
					message: "Required",
				},
			},
			helperText: "OTP is valid for 15 minutes",
			meta: { length: 3 },
		},
	];

	const buttonConfigList = [
		{
			type: "submit" as const,
			size: "lg",
			label: "Verify",
			loading: isSubmitting,
			disabled: !isValid || !isDirty,
		},
		{
			variant: "link",
			size: "lg",
			label: "Back",
			onClick: () => setStep(ONBOARDING_GATEWAY_STEPS.ADD_AGENT),
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

	const toast = useToast();

	const handleFormSubmit = async (data) => {
		const _otp = data.otp;

		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.LOGIN,
				{
					body: {
						id_type: "Mobile",
						mobile: mobile,
						id_token: _otp,
						org_id: orgDetail?.org_id,
						org_token: orgDetail?.org_token,
						platform: isAndroid ? "android" : "web",
					},
					timeout: 60000,
					token: "", // no token needed for login
				}
			);

			if (response?.access_token && response?.details) {
				console.log(
					"[OnboardingGatewayVerifyOtp] Login Success:",
					response
				);
				setGatewayAccessToken(response.access_token);
				// Store agent data so downstream components have correct user details
				setAgentDetails({
					...response,
					userDetails: response.details,
					onboarding_steps: response.details.onboarding_steps,
					role_list: response.details.role_list,
				});
				setStep(ASSISTED_ONBOARDING_STEPS.ONBOARDING_WIDGET);
				return;
			}

			// Handle OTP verification error or other login issues
			console.log("[AgentOnboarding] Login/OTP INVALID: ", { response });

			if (response?.otpFailed) {
				toast({
					title: "Invalid OTP",
					description:
						"Please enter the correct OTP sent to the agent's mobile number.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				return;
			}

			if (response?.accountInactive) {
				toast({
					title: "Your account has been temporarily blocked.",
					description: "Please contact support.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				return;
			}

			toast({
				title: response?.message || "Login failed.",
				description: "Please make sure your details are correct.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} catch (error: any) {
			console.error("Error verifying OTP:", error);
			toast({
				title: "Error",
				description:
					error?.message || "Something went wrong. Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	// handle if agent already exists
	return (
		<Flex
			direction="column"
			bg="white"
			p={{ base: 6, md: 10 }}
			borderRadius="15px"
			boxShadow="0px 5px 20px rgba(0, 0, 0, 0.08)"
			border="1px solid"
			borderColor="divider"
			maxW="600px"
			w="100%"
		>
			{/* Agent Mobile Display */}
			<Text
				fontSize={{ base: "md", md: "lg" }}
				color="light"
				mb="8"
				textAlign="center"
			>
				Enter the OTP sent to{" "}
				<Text as="span" fontWeight="semibold" color="primary.DEFAULT">
					{mobile}
				</Text>
			</Text>

			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<Flex direction="column" gap="6">
					<Form
						{...{
							parameter_list: otp_verification_parameter_list,
							formValues: watcher,
							control,
							register,
							errors,
						}}
						size="lg"
						onEnter={handleSubmit(handleFormSubmit)}
					/>

					<ActionButtonGroup {...{ buttonConfigList }} mt="1em" />
				</Flex>
			</form>
		</Flex>
	);
};

export default OnboardingGatewayVerifyOtp;
