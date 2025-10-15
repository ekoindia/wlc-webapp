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
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			size: "lg",
			label: "Back",
			onClick: () => {
				setStep(ASSISTED_ONBOARDING_STEPS.ADD_AGENT);
			},
			styles: {
				color: "primary.DEFAULT",
				bg: { base: "white", md: "none" },
				h: { base: "64px", md: "64px" },
				w: { base: "100%", md: "auto" },
				_hover: { textDecoration: "none" },
			},
		},
	];

	return (
		<Flex
			direction="column"
			bg="white"
			p={{ base: 8, md: 10 }}
			borderRadius="15px"
			boxShadow="0px 5px 20px rgba(0, 0, 0, 0.08)"
			border="1px solid"
			borderColor="divider"
			maxW="600px"
			w="100%"
			textAlign="center"
		>
			{/* Message */}
			<Text fontSize={{ base: "md", md: "lg" }} color="light" mb="8">
				The agent with mobile number{" "}
				<Text as="span" fontWeight="semibold" color="primary.DEFAULT">
					{agentMobile}
				</Text>{" "}
				has already completed onboarding and exists in the system.
			</Text>

			<ActionButtonGroup {...{ buttonConfigList }} />
		</Flex>
	);
};

export default AgentAlreadyExistsScreen;
