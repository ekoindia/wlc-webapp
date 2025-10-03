import { Flex, Text } from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { ASSISTED_ONBOARDING_STEPS } from "./AssistedOnboarding";

export interface AgentAlreadyExistsScreenProps {
	setStep: React.Dispatch<
		React.SetStateAction<keyof typeof ASSISTED_ONBOARDING_STEPS>
	>;
	agentMobile: string;
}

/**
 * AgentAlreadyExistsScreen component to inform that the agent already exists
 * @param {AgentAlreadyExistsScreenProps} props - Component props
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setStep - Function to set the current step
 * @param {string} props.agentMobile - The agent's mobile number
 * @returns {JSX.Element} The rendered AgentAlreadyExistsScreen component
 */
const AgentAlreadyExistsScreen = ({
	setStep,
	agentMobile,
}: AgentAlreadyExistsScreenProps): JSX.Element => {
	const buttonConfigList = [
		{
			type: "button" as const,
			size: "lg",
			label: "Add Another Agent",
			onClick: () => setStep(ASSISTED_ONBOARDING_STEPS.ADD_AGENT),
		},
	];

	return (
		<Flex
			direction="column"
			bg="white"
			p="8"
			borderRadius="md"
			shadow="md"
			maxW="500px"
			textAlign="center"
		>
			{/* Title */}
			<Text fontSize="xl" fontWeight="semibold" mb="4">
				Agent Already Exists
			</Text>

			{/* Message */}
			<Text fontSize="md" color="gray.600" mb="6">
				The agent with mobile number{" "}
				<Text as="span" fontWeight="semibold">
					{agentMobile}
				</Text>{" "}
				has already completed onboarding and exists in the system.
			</Text>

			<ActionButtonGroup {...{ buttonConfigList, w: "full" }} />
		</Flex>
	);
};

export default AgentAlreadyExistsScreen;
