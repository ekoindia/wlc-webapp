import { Flex, Text, useToast } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { ParamType } from "constants/trxnFramework";
import { fetcher } from "helpers";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components/Form";
import { useOnboardingContext } from "../../context";
import {
	ASSISTED_ONBOARDING_STEPS,
	RESPONSE_TYPE_IDS,
} from "./AssistedOnboarding";

export interface OtpVerificationFormProps {
	setStep: React.Dispatch<
		React.SetStateAction<keyof typeof ASSISTED_ONBOARDING_STEPS>
	>;
}

/**
 * OtpVerificationForm component for verifying OTP for agent onboarding.
 * Reads `mobile` from OnboardingContext instead of receiving it as a prop.
 * @param {OtpVerificationFormProps} props - Component props
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setStep - Function to set the current step
 * @returns {JSX.Element} The rendered OtpVerificationForm component
 */
const OtpVerificationForm = ({
	setStep,
}: OtpVerificationFormProps): JSX.Element => {
	const { mobile } = useOnboardingContext();

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

	const { services } = useOnboardingContext();
	const { accessToken } = services;
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
						csp_id: mobile,
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
				console.log("[AgentOnboarding] OTP INVALID: ", {
					response,
				});
				toast({
					title: "Invalid OTP",
					description:
						responseTypeId ===
							RESPONSE_TYPE_IDS.OTP_VERIFICATION_ERROR ||
						// EPS BUG: response_type_id is coming as status (which should be 0 for success)
						response?.status ===
							RESPONSE_TYPE_IDS.OTP_VERIFICATION_ERROR
							? "Please enter the correct OTP sent to the agent's mobile number."
							: response.message || "Invalid OTP.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
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

export default OtpVerificationForm;
