import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Button } from "components";
import { useUser } from "contexts/UserContext";
import { useRouter } from "next/router";
import { FaCheckCircle } from "react-icons/fa";
import { ASSISTED_ONBOARDING_STEPS } from "./AssistedOnboarding";

export interface OnboardingCompletedProps {
	/**
	 * Function to update the current step in the onboarding flow
	 */
	setStep: (_step: keyof typeof ASSISTED_ONBOARDING_STEPS) => void;
	/**
	 * Optional mobile number of the onboarded agent
	 */
	agentMobile?: string;
}

/**
 * OnboardingCompleted component displays a success message when agent onboarding is complete
 * Provides CTAs to onboard another agent or navigate to home
 * @param {OnboardingCompletedProps} props - Component props
 * @returns {JSX.Element} The rendered OnboardingCompleted component
 * @example
 * ```tsx
 * <OnboardingCompleted setStep={setStep} agentMobile="9876543210" />
 * ```
 */
const OnboardingCompleted = ({
	setStep,
	agentMobile,
}: OnboardingCompletedProps): JSX.Element => {
	const router = useRouter();
	const { userData } = useUser();
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
		setStep(ASSISTED_ONBOARDING_STEPS.ADD_AGENT);
	};

	return (
		<Flex
			w="100%"
			maxW="600px"
			align="center"
			justify="center"
			p={{ base: 4, md: 6 }}
		>
			<Box
				w="100%"
				bg="white"
				borderRadius="15px"
				boxShadow="0px 5px 20px rgba(0, 0, 0, 0.08)"
				border="1px solid"
				borderColor="divider"
				p={{ base: 8, md: 10 }}
			>
				<VStack spacing={6} align="center" textAlign="center">
					{/* Success Icon */}
					<Box color="success">
						<FaCheckCircle size={80} />
					</Box>

					{/* Success Message */}
					<VStack spacing={3} w="100%">
						<Heading
							as="h2"
							fontSize={{ base: "2xl", md: "3xl" }}
							fontWeight="bold"
							color="dark"
						>
							Onboarding Completed!
						</Heading>
						<Text
							fontSize={{ base: "md", md: "lg" }}
							color="light"
							maxW="450px"
						>
							The agent has been successfully onboarded and
							verified. All steps have been completed.
						</Text>
						{agentMobile ? (
							<Text
								fontSize="sm"
								color="primary.DEFAULT"
								fontWeight="semibold"
								mt={2}
							>
								Agent Mobile: {agentMobile}
							</Text>
						) : null}
					</VStack>

					{/* Action Buttons */}
					<VStack spacing={3} w="100%" pt={4}>
						<Button
							variant="primary"
							size="lg"
							w="100%"
							icon="user-plus"
							iconPosition="left"
							onClick={handleOnboardAnother}
						>
							Onboard Another Agent
						</Button>
						<Button
							variant="outline"
							size="lg"
							w="100%"
							icon="home"
							iconPosition="left"
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
