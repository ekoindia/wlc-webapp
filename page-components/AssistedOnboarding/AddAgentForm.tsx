import { Flex, Text, useToast } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { ParamType } from "constants/trxnFramework";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "tf-components/Form";
import {
	ASSISTED_ONBOARDING_STEPS,
	RESPONSE_TYPE_IDS,
} from "./AssistedOnboarding";

interface AddAgentFormProps {
	setStep: React.Dispatch<React.SetStateAction<string>>;
	setAgentMobile: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * AddAgentForm component for collecting agent's phone number
 * @param {AddAgentFormProps} props - Component props
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setStep - Function to set the current step
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setAgentMobile - Function to set the agent's mobile number
 * @returns {JSX.Element} The rendered AddAgentForm component
 */
const AddAgentForm = ({
	setStep,
	setAgentMobile,
}: AddAgentFormProps): JSX.Element => {
	const toast = useToast();
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

	const add_agent_parameter_list = [
		{
			name: "csp_id",
			label: `Agent's Mobile Number`,
			parameter_type_id: ParamType.TEXT,
			maxLength: 10,
			minLength: 10,
			placeholder: "Enter 10-digit mobile number",
			validations: {
				required: "Mobile number is required",
				pattern: {
					value: /^[6-9]\d{9}$/,
					message: "Enter a valid 10-digit mobile number",
				},
			},
		},
	];

	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Proceed",
			loading: isSubmitting,
			disabled: !isValid || !isDirty,
		},
	];

	// const toast = useToast();
	const { accessToken } = useSession();

	const handleFormSubmit = async (data) => {
		const _cspId = data.csp_id;

		// Store the mobile number for use in other components
		setAgentMobile(_cspId);

		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					body: {
						interaction_type_id:
							TransactionIds.ASSISTED_ONBOARDING_ADD_AGENT,
						csp_id: _cspId,
						merchant_type: "",
					},
					token: accessToken,
				}
			);

			if (response?.data) {
				// Extract response_type_id from the root level of response
				const responseTypeId = response.response_type_id;

				console.log("[AddAgentForm] API Response:", {
					responseTypeId,
					fullResponse: response,
				});

				// Handle different response scenarios
				if (
					responseTypeId ===
					RESPONSE_TYPE_IDS.AGENT_COMPLETED_ONBOARDING
				) {
					// Agent already exists - check status to determine if onboarding is complete
					setStep(ASSISTED_ONBOARDING_STEPS.AGENT_STATUS_CHECK);
					return;
				}

				if (
					responseTypeId ===
					RESPONSE_TYPE_IDS.AGENT_OTP_VERIFIED_PENDING_ONBOARDING
				) {
					// Agent exists, OTP verified but onboarding not complete
					setStep(ASSISTED_ONBOARDING_STEPS.ONBOARDING_WIDGET);
					return;
				}

				if (
					responseTypeId ===
					RESPONSE_TYPE_IDS.AGENT_NOT_EXISTS_NEED_OTP
				) {
					const _otp = response?.data?.otp;
					// in case of dev, show otp toast
					if (process.env.NEXT_PUBLIC_ENV !== "production" && toast) {
						toast({
							title: `Demo OTP: ${_otp}`,
							status: "success",
							duration: 5000,
							position: "top-right",
						});
					}
					// Agent doesn't exist, needs OTP verification
					setStep(ASSISTED_ONBOARDING_STEPS.OTP_VERIFICATION);
					return;
				}
			}
		} catch (error: any) {
			console.error("Error checking agent:", error);
		}
	};

	// handle if agent already exists
	return (
		<Flex
			direction="column"
			bg="white"
			p="8"
			borderRadius="md"
			shadow="md"
			maxW="500px"
			w="100%"
		>
			{/* Form Title */}
			<Text fontSize="xl" fontWeight="semibold" mb="6" textAlign="center">
				Add New Agent
			</Text>

			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<Flex direction="column" gap="8">
					<Form
						{...{
							parameter_list: add_agent_parameter_list,
							formValues: watcher,
							control,
							register,
							errors,
						}}
					/>

					<ActionButtonGroup {...{ buttonConfigList, w: "full" }} />
				</Flex>
			</form>
		</Flex>
	);
};

export default AddAgentForm;
