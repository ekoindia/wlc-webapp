import { Flex, Text, useToast } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { ParamType } from "constants/trxnFramework";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components/Form";
import {
	ASSISTED_ONBOARDING_STEPS,
	RESPONSE_TYPE_IDS,
} from "./AssistedOnboarding";

export interface OtpVerificationFormProps {
	setStep: React.Dispatch<
		React.SetStateAction<keyof typeof ASSISTED_ONBOARDING_STEPS>
	>;
	agentMobile: string;
}

/**
 * OtpVerificationForm component for verifying OTP for agent onboarding
 * @param {OtpVerificationFormProps} props - Component props
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setStep - Function to set the current step
 * @param {string} props.agentMobile - The agent's mobile number
 * @returns {JSX.Element} The rendered OtpVerificationForm component
 */
const OtpVerificationForm = ({
	setStep,
	agentMobile,
}: OtpVerificationFormProps): JSX.Element => {
	const {
		handleSubmit,
		register,
		control,
		formState: {
			errors,
			isValid,
			isDirty,
			isSubmitting,
			// isSubmitSuccessful,
		},
		// reset,
		// trigger,
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
			parameter_type_id: ParamType.TEXT,
			maxLength: 3,
			minLength: 3,
			placeholder: "Enter OTP",
			validations: {
				required: "OTP is required",
				pattern: {
					value: /^[0-9]{3}$/,
					message: "Required",
				},
			},
		},
	];

	const buttonConfigList = [
		{
			type: "submit" as const,
			size: "lg",
			label: "Verify",
			loading: isSubmitting,
			disabled: !isValid || !isDirty,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			size: "lg",
			label: "Back",
			onClick: () => setStep(ASSISTED_ONBOARDING_STEPS.ADD_AGENT),
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

	const { accessToken } = useSession();
	const toast = useToast();

	const handleFormSubmit = async (data) => {
		const _otp = data.otp;

		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					body: {
						interaction_type_id:
							TransactionIds.ASSISTED_ONBOARDING_VERIFY_AGENT_OTP,
						csp_id: agentMobile,
						otp: _otp,
						merchant_type: "",
					},
					token: accessToken,
				}
			);

			if (response?.data) {
				// Extract response_type_id from the root level of response
				const responseTypeId = response.response_type_id;

				console.log("[OtpVerificationForm] API Response:", {
					responseTypeId,
					fullResponse: response,
				});

				// Handle successful OTP verification
				if (
					responseTypeId ===
					RESPONSE_TYPE_IDS.OTP_VERIFICATION_SUCCESS
				) {
					setStep(ASSISTED_ONBOARDING_STEPS.ONBOARDING_WIDGET);
					return;
				}

				// Handle OTP verification error
				if (
					responseTypeId === RESPONSE_TYPE_IDS.OTP_VERIFICATION_ERROR
				) {
					console.log("[AgentOnboarding] OTP INVALID");
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
			}
		} catch (error: any) {
			console.error("Error verifying OTP:", error);
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
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
					{agentMobile}
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
					/>

					<ActionButtonGroup {...{ buttonConfigList }} />
				</Flex>
			</form>
		</Flex>
	);
};

export default OtpVerificationForm;
