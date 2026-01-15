import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ASSISTED_ONBOARDING_STEPS } from "./AssistedOnboarding";

export interface AgentStatusCheckProps {
	agentMobile: string;
	setStep: React.Dispatch<React.SetStateAction<string>>;
	onAgentDetailsFetched: (_agentDetails: any) => void;
	fetchAgentDetails: (_mobile: string) => Promise<any>;
}

/**
 * AgentStatusCheck component that fetches agent details and routes based on onboarding status
 * @param {AgentStatusCheckProps} props - Component props
 * @param {string} props.agentMobile - The agent's mobile number
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setStep - Function to set the current step
 * @param {(agentDetails: any) => void} props.onAgentDetailsFetched - Callback to update parent state with agent details
 * @param {(mobile: string) => Promise<any>} props.fetchAgentDetails - Function to fetch agent details from API
 * @returns {JSX.Element} The rendered AgentStatusCheck component
 * @example
 * ```tsx
 * <AgentStatusCheck
 *   agentMobile="9002229988"
 *   setStep={setStep}
 *   onAgentDetailsFetched={(details) => setAgentDetails(details)}
 *   fetchAgentDetails={fetchAgentDetails}
 * />
 * ```
 */
const AgentStatusCheck = ({
	agentMobile,
	setStep,
	onAgentDetailsFetched,
	fetchAgentDetails,
}: AgentStatusCheckProps): JSX.Element => {
	const [hasError, setHasError] = useState(false);

	/**
	 * Evaluates agent onboarding status and routes accordingly
	 */
	const checkAgentStatusAndRoute = async () => {
		setHasError(false);

		try {
			const agentDetails = await fetchAgentDetails(agentMobile);

			if (!agentDetails) {
				setHasError(true);
				return;
			}

			// Update parent state with fetched agent details
			onAgentDetailsFetched(agentDetails);

			// Check onboarding status

			const { user_detail } = agentDetails;
			const { onboarding, onboarding_steps } = user_detail;

			// If onboarding is incomplete (1) and has onboarding steps, continue onboarding
			if (onboarding === 1 && onboarding_steps?.length > 0) {
				console.log(
					"[AgentStatusCheck] Agent has incomplete onboarding, routing to KYC steps"
				);
				setStep(ASSISTED_ONBOARDING_STEPS.ONBOARDING_WIDGET);
				return;
			}

			// Otherwise, agent already exists and completed onboarding
			console.log(
				"[AgentStatusCheck] Agent already exists with complete onboarding"
			);
			setStep(ASSISTED_ONBOARDING_STEPS.AGENT_ALREADY_EXISTS);
		} catch (error) {
			console.error(
				"[AgentStatusCheck] Error checking agent status:",
				error
			);
			setHasError(true);
		}
	};

	useEffect(() => {
		checkAgentStatusAndRoute();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// MARK: JSX
	if (hasError) {
		return (
			<VStack spacing={4} p={6}>
				<Text color="error" fontWeight="semibold">
					Error fetching agent details
				</Text>
				<Text fontSize="sm" color="light">
					Please try again or contact support
				</Text>
			</VStack>
		);
	}

	return (
		<Center minH="200px">
			<VStack spacing={4}>
				<Spinner size="lg" color="primary.DEFAULT" />
				<Text fontSize="sm" color="light">
					Checking agent status...
				</Text>
			</VStack>
		</Center>
	);
};

export default AgentStatusCheck;
