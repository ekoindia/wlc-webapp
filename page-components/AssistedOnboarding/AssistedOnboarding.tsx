import { Flex } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import {
	AddAgentForm,
	type AgentAlreadyExistsScreenProps,
	type AgentOnboardingProps,
	type OtpVerificationFormProps,
} from ".";

/**
 * Constants representing the different steps in the assisted onboarding flow
 */
export const ASSISTED_ONBOARDING_STEPS = {
	ADD_AGENT: "ADD_AGENT",
	AGENT_STATUS_CHECK: "AGENT_STATUS_CHECK",
	AGENT_ALREADY_EXISTS: "AGENT_ALREADY_EXISTS",
	OTP_VERIFICATION: "OTP_VERIFICATION",
	ONBOARDING_WIDGET: "ONBOARDING_WIDGET",
} as const;

/**
 * API Response type IDs for different scenarios
 */
export const RESPONSE_TYPE_IDS = {
	AGENT_COMPLETED_ONBOARDING: 874,
	AGENT_OTP_VERIFIED_PENDING_ONBOARDING: 862,
	AGENT_NOT_EXISTS_NEED_OTP: 873,
	OTP_VERIFICATION_SUCCESS: 876,
	OTP_VERIFICATION_ERROR: 302,
} as const;

const AgentStatusCheck = dynamic(() => import("./AgentStatusCheck"), {
	ssr: false,
});

const AgentAlreadyExistsScreen = dynamic(
	() => import("./AgentAlreadyExistsScreen"),
	{ ssr: false }
) as React.ComponentType<AgentAlreadyExistsScreenProps>;

const OtpVerificationForm = dynamic(() => import("./OtpVerificationForm"), {
	ssr: false,
}) as React.ComponentType<OtpVerificationFormProps>;

const AgentOnboarding = dynamic(() => import("./AgentOnboarding"), {
	ssr: false,
}) as React.ComponentType<AgentOnboardingProps>;

/**
 * AssistedOnboarding component that manages the multi-step agent onboarding flow
 * @returns {JSX.Element} The rendered AssistedOnboarding component
 * @example
 * ```tsx
 * <AssistedOnboarding />
 * ```
 */
const AssistedOnboarding = (): JSX.Element => {
	const { userData } = useUser();
	const { accessToken } = useSession();

	const [step, setStep] = useState<keyof typeof ASSISTED_ONBOARDING_STEPS>(
		ASSISTED_ONBOARDING_STEPS.ADD_AGENT
	);
	const [agentMobile, setAgentMobile] = useState<string>("");
	const [agentDetails, setAgentDetails] = useState<any>(null);

	/**
	 * Fetches agent details using interaction_type_id: 151
	 * Centralized API call shared across multiple child components
	 * @param {string} mobile - The agent's mobile number to fetch details for
	 * @returns {Promise<any>} The agent details response
	 */
	const fetchAgentDetails = async (mobile: string): Promise<any> => {
		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					method: "POST",
					body: {
						interaction_type_id: 151,
						csp_id: mobile,
						user_identity_type: "mobile_number",
						user_identity: userData?.userId,
						mobile: userData?.userId,
						id_type: "Mobile",
					},
					token: accessToken,
				}
			);

			if (response?.data) {
				console.log(
					"[AssistedOnboarding] Agent details fetched:",
					response.data
				);
				return response.data;
			}
			return null;
		} catch (error) {
			console.error(
				"[AssistedOnboarding] Error fetching agent details:",
				error
			);
			throw error;
		}
	};

	// MARK: Render Functions
	const renderCurrentStep = (): JSX.Element => {
		switch (step) {
			case ASSISTED_ONBOARDING_STEPS.ADD_AGENT:
				return (
					<AddAgentForm
						setStep={setStep}
						setAgentMobile={setAgentMobile}
					/>
				);

			case ASSISTED_ONBOARDING_STEPS.AGENT_STATUS_CHECK:
				return (
					<AgentStatusCheck
						agentMobile={agentMobile}
						setStep={setStep}
						onAgentDetailsFetched={setAgentDetails}
						fetchAgentDetails={fetchAgentDetails}
					/>
				);

			case ASSISTED_ONBOARDING_STEPS.AGENT_ALREADY_EXISTS:
				return (
					<AgentAlreadyExistsScreen
						setStep={setStep}
						agentMobile={agentMobile}
					/>
				);

			case ASSISTED_ONBOARDING_STEPS.OTP_VERIFICATION:
				return (
					<OtpVerificationForm
						setStep={setStep}
						agentMobile={agentMobile}
					/>
				);

			case ASSISTED_ONBOARDING_STEPS.ONBOARDING_WIDGET:
				return (
					<AgentOnboarding
						agentMobile={agentMobile}
						agentDetails={agentDetails}
						fetchAgentDetails={fetchAgentDetails}
					/>
				);

			default:
				return <div>Oops! Something went wrong.</div>;
		}
	};

	// MARK: JSX
	return (
		<Flex w="100%" maxW="100%" align="center" justify="center" p="6">
			{renderCurrentStep()}
		</Flex>
	);
};

export default AssistedOnboarding;
