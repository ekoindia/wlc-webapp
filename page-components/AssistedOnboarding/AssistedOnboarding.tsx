import { Flex } from "@chakra-ui/react";
import { PageTitle } from "components/PageTitle";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts";
import { useUser } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
	AddAgentForm,
	type AgentAlreadyExistsScreenProps,
	type AgentOnboardingProps,
	type OnboardingCompletedProps,
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
	ONBOARDING_COMPLETED: "ONBOARDING_COMPLETED",
} as const;

const stepBasedTitleMap: Record<
	keyof typeof ASSISTED_ONBOARDING_STEPS,
	string
> = {
	ADD_AGENT: "Add Agent",
	AGENT_STATUS_CHECK: "Checking Agent Status",
	AGENT_ALREADY_EXISTS: "Agent Already Exists",
	OTP_VERIFICATION: "Verify OTP",
	ONBOARDING_WIDGET: "Agent Onboarding",
	ONBOARDING_COMPLETED: "Onboarding Completed",
};

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

const OnboardingCompleted = dynamic(() => import("./OnboardingCompleted"), {
	ssr: false,
}) as React.ComponentType<OnboardingCompletedProps>;

/**
 * AssistedOnboarding component that manages the multi-step agent onboarding flow
 * @returns {JSX.Element} The rendered AssistedOnboarding component
 * @example
 * ```tsx
 * <AssistedOnboarding />
 * ```
 */
const AssistedOnboarding = (): JSX.Element => {
	const router = useRouter();
	const { userData } = useUser();
	const { accessToken } = useSession();

	const [step, setStep] = useState<keyof typeof ASSISTED_ONBOARDING_STEPS>(
		ASSISTED_ONBOARDING_STEPS.ADD_AGENT
	);
	const [agentMobile, setAgentMobile] = useState<string>("");
	const [agentDetails, setAgentDetails] = useState<any>(null);

	const isAdmin = userData?.userType === "Admin";

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
				// check if response.data.user_details.onboarding = 0, then setStep to ONBOARDING_COMPLETED
				if (response?.data?.user_detail?.onboarding === 1) {
					setStep(ASSISTED_ONBOARDING_STEPS.ONBOARDING_COMPLETED);
				}
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

			case ASSISTED_ONBOARDING_STEPS.ONBOARDING_COMPLETED:
				return (
					<OnboardingCompleted
						setStep={setStep}
						agentMobile={agentMobile}
					/>
				);

			default:
				return <div>Oops! Something went wrong.</div>;
		}
	};

	/**
	 * Handle back navigation based on current step
	 * ADD_AGENT → Navigate to home/admin (exit flow)
	 * OTP_VERIFICATION → ADD_AGENT (re-enter mobile)
	 * All other steps → ADD_AGENT (start fresh)
	 */
	const handleBackNavigation = (): void => {
		switch (step) {
			case ASSISTED_ONBOARDING_STEPS.ADD_AGENT:
				// From Add Agent step, navigate to home or admin based on user type
				router.push(isAdmin ? "/admin" : "/home");
				break;

			case ASSISTED_ONBOARDING_STEPS.OTP_VERIFICATION:
				// From OTP, go back to add agent to re-enter mobile
				setStep(ASSISTED_ONBOARDING_STEPS.ADD_AGENT);
				break;

			case ASSISTED_ONBOARDING_STEPS.AGENT_ALREADY_EXISTS:
			case ASSISTED_ONBOARDING_STEPS.ONBOARDING_WIDGET:
			case ASSISTED_ONBOARDING_STEPS.ONBOARDING_COMPLETED:
				// From any other step, go back to start (doesn't make sense to go to intermediate steps)
				setStep(ASSISTED_ONBOARDING_STEPS.ADD_AGENT);
				break;

			default:
				// Fallback to ADD_AGENT
				setStep(ASSISTED_ONBOARDING_STEPS.ADD_AGENT);
		}
	};

	// MARK: JSX
	return (
		<Flex
			direction="column"
			w="100%"
			maxW="100%"
			// p={{ base: "0", md: "4" }}
		>
			{/* Back button navigates based on current step - exits flow from Add Agent, goes to previous step otherwise */}
			<PageTitle
				title={stepBasedTitleMap[step]}
				onBack={handleBackNavigation}
			/>
			<Flex direction="column" align="center" px="4">
				{renderCurrentStep()}
			</Flex>
		</Flex>
	);
};

export default AssistedOnboarding;
