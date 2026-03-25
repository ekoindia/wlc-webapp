import { Flex, useToast } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { ParamType } from "constants/trxnFramework";
import { useAppSource, useOrgDetailContext } from "contexts";
import { sendOtpRequest } from "helpers";
import router from "next/router";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components/Form";
import { ONBOARDING_GATEWAY_STEPS } from "./OnboardingGateway";

const add_agent_parameter_list = [
	{
		name: "csp_id",
		label: `Agent's Mobile Number`,
		parameter_type_id: ParamType.MOBILE,
		maxLength: 10,
		minLength: 10,
		metadata: "91",
		inputmode: "tel",
		placeholder: "Enter 10-digit mobile number",
		validations: {
			required: "Mobile number is required",
			pattern: {
				value: /^[6-9]\d{9}$/,
				message: "Enter a valid 10-digit mobile number",
			},
			minLength: {
				value: 10,
				message: "Mobile number must minimum be 10 digits",
			},
			maxLength: {
				value: 10,
				message: "Mobile number must be max 10 digits",
			},
		},
	},
];

interface OnboardingGatewayLoginProps {
	setStep: React.Dispatch<React.SetStateAction<string>>;
	setAgentMobile: React.Dispatch<React.SetStateAction<string>>;
	setAgentDetails: React.Dispatch<React.SetStateAction<any>>;
}

/**
 * OnboardingGatewayLogin component for collecting agent's phone number
 * @param {OnboardingGatewayLoginProps} props - Component props
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setStep - Function to set the current step
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setAgentMobile - Function to set the agent's mobile number
 * @returns {JSX.Element} The rendered OnboardingGatewayLogin component
 */
const OnboardingGatewayLogin = ({
	setStep,
	setAgentMobile,
	setAgentDetails,
}: OnboardingGatewayLoginProps): JSX.Element => {
	const toast = useToast();
	const { isAndroid } = useAppSource();
	const { orgDetail } = useOrgDetailContext();
	const isMobileMappedUserId =
		orgDetail?.metadata?.login_meta?.mobile_mapped_user_id === 1;

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

	const handleFormSubmit = async (data) => {
		const _cspId = data.csp_id;

		try {
			const { otp_sent }: any = await sendOtpRequest(
				orgDetail?.org_id || 1,
				_cspId,
				toast,
				"send",
				isAndroid,
				isMobileMappedUserId,
				orgDetail?.org_token
			);

			console.log("[OnboardingGatewayLogin] otp_sent", otp_sent);
			setAgentMobile(_cspId);
			setAgentDetails(null); // Explicitly clear any stale details
			setStep(ONBOARDING_GATEWAY_STEPS.OTP_VERIFICATION);
		} catch (error: any) {
			console.error("Error checking agent:", error);
			toast({
				title:
					error?.message || "Something went wrong. Please try again.",
				status: "error",
				duration: 5000,
				position: "top-right",
			});
		}
	};

	const handleFormErrors = (errors) => {
		console.error("Form submission errors:", errors);
	};

	// MARK: Form Buttons
	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Proceed",
			loading: isSubmitting,
			disabled: !isValid || !isDirty,

			// onClick: () => handleSubmit(handleFormSubmit, handleFormErrors)(),
		},
		{
			variant: "link",
			size: "lg",
			label: "Back",
			onClick: () => router.back(),
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

	// MARK: jsx
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
			<form
				// onSubmit={(e) => e.preventDefault()}
				onSubmit={handleSubmit(handleFormSubmit, handleFormErrors)}
				// onKeyDown={(e) => {
				// 	if (e.key === "Enter") {
				// 		console.log("ENTER PRESSED... submitting form");
				// 		e.preventDefault();
				// 		handleSubmit(handleFormSubmit, handleFormErrors)();
				// 	}
				// }}
			>
				<Flex direction="column" gap="6">
					<Form
						{...{
							parameter_list: add_agent_parameter_list,
							formValues: watcher,
							control,
							register,
							errors,
						}}
						size="md"
					/>
					<ActionButtonGroup {...{ buttonConfigList }} mt="1em" />
				</Flex>
			</form>
		</Flex>
	);
};

export default OnboardingGatewayLogin;
