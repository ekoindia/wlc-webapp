import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { Button } from "components";
import { useUser } from "contexts/UserContext";
import { useRouter } from "next/router";
import { FaCheckCircle } from "react-icons/fa";
import { useOnboardingContext } from "../../context";
import { ASSISTED_ONBOARDING_STEPS } from "./AssistedOnboarding";

export interface OnboardingCompletedProps {
	/**
	 * Function to update the current step in the onboarding flow
	 */
	setStep: (_step: keyof typeof ASSISTED_ONBOARDING_STEPS) => void;
	/**
	 * Resets agent-specific state (agentDetails, agentMobile) to prevent
	 * stale data from the previous agent leaking into the next onboarding.
	 */
	resetAgentState: () => void;
}

/**
 * OnboardingCompleted component displays a success message when agent onboarding is complete.
 * Reads `mobile` from OnboardingContext instead of receiving it as a prop.
 * Provides CTAs to onboard another agent or navigate to home.
 * @param {OnboardingCompletedProps} props - Component props
 * @returns {JSX.Element} The rendered OnboardingCompleted component
 */
const OnboardingCompleted = ({
	setStep,
	resetAgentState,
}: OnboardingCompletedProps): JSX.Element => {
	const router = useRouter();
	const { userData } = useUser();
	const { mobile, userName } = useOnboardingContext();
	const isAdmin = userData?.isAdmin ?? false;

	/**
	 * Handles navigation to home page based on user role
	 * Admins go to /home, non-admins go to /
	 */
	const handleGoHome = (): void => {
		const homeRoute = isAdmin ? "/admin" : "/home";
		router.push(homeRoute);
	};

	/**
	 * Handles starting a new onboarding flow
	 * Resets to ADD_AGENT step
	 */
	const handleOnboardAnother = (): void => {
		resetAgentState();
		setStep(ASSISTED_ONBOARDING_STEPS.ADD_AGENT);
	};

	return (
		<Flex w="100%" justify="center" align="center" p={{ base: 4, md: 6 }}>
			<Box
				w="100%"
				maxW="600px"
				bg="white"
				borderRadius="15px"
				boxShadow="0px 5px 20px rgba(0, 0, 0, 0.08)"
				border="1px solid"
				borderColor="divider"
				p={{ base: 6, md: 10 }}
			>
				<VStack spacing={6} align="center" textAlign="center">
					{/* Success Icon */}
					<Box color="success">
						<FaCheckCircle size={80} />
					</Box>

					{/* Success Message */}
					<VStack spacing={3} w="100%">
						<Text
							fontSize={{ base: "md", md: "lg" }}
							color="light"
							maxW="450px"
						>
							Successfully verified and onboarded.
						</Text>
						{userName ? (
							<Text
								fontSize="sm"
								color="primary.DEFAULT"
								fontWeight="semibold"
								mt={2}
							>
								Registered Name: {userName}
							</Text>
						) : null}
						{mobile ? (
							<Text
								fontSize="sm"
								color="primary.DEFAULT"
								fontWeight="semibold"
								mt={2}
							>
								Registered Mobile: {mobile}
							</Text>
						) : null}
					</VStack>

					{/* Action Buttons */}
					<VStack spacing={3} w="100%" pt={4}>
						<Button
							variant="accent"
							size="lg"
							w="100%"
							onClick={handleOnboardAnother}
						>
							Onboard Another Agent
						</Button>
						<Button
							variant="primary_outline"
							size="lg"
							w="100%"
							onClick={handleGoHome}
						>
							Go to Home
						</Button>
					</VStack>
				</VStack>
			</Box>
		</Flex>
	);
};

export default OnboardingCompleted;
