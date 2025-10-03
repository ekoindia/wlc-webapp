import { Box } from "@chakra-ui/react";
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

const AgentAlreadyExistsScreen = dynamic(
	() => import("./AgentAlreadyExistsScreen"),
	{ ssr: false }
) as React.ComponentType<AgentAlreadyExistsScreenProps>;

const AgentOnboarding = dynamic(() => import("./AgentOnboarding"), {
	ssr: false,
}) as React.ComponentType<AgentOnboardingProps>;

const OtpVerificationForm = dynamic(() => import("./OtpVerificationForm"), {
	ssr: false,
}) as React.ComponentType<OtpVerificationFormProps>;

/**
 * AssistedOnboarding component that manages the multi-step agent onboarding flow
 * @returns {JSX.Element} The rendered AssistedOnboarding component
 * @example
 * ```tsx
 * <AssistedOnboarding />
 * ```
 */
const AssistedOnboarding = (): JSX.Element => {
	const [step, setStep] = useState<keyof typeof ASSISTED_ONBOARDING_STEPS>(
		ASSISTED_ONBOARDING_STEPS.ADD_AGENT
	);
	const [agentMobile, setAgentMobile] = useState<string>("");
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
				return <AgentOnboarding agentMobile={agentMobile} />;

			default:
				return <div>Oops! Something went wrong.</div>;
		}
	};

	// MARK: JSX
	return (
		<Box w="full" maxW="md" mx="auto" p="6">
			{renderCurrentStep()}
		</Box>
	);
};

export default AssistedOnboarding;
