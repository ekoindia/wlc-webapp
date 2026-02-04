import {
	Box,
	Button,
	Flex,
	ListItem,
	OrderedList,
	Text,
	VStack,
} from "@chakra-ui/react";
import { ActionButtonGroup } from "components";
import { useOnboardingContext } from "features/onboarding/context";
import { useEffect } from "react";
import type { CustomComponentProps } from "../ContentRenderer";

/**
 * DigilockerRedirectionStep Component
 *
 * This component handles the Digilocker redirection flow in the onboarding process.
 * It integrates with the onboarding state management to fetch and display the Digilocker URL.
 *
 * Flow:
 * 1. On mount, triggers API call to get Digilocker redirection URL via callback
 * 2. Displays instructions and "Open Digilocker" button
 * 3. User completes verification in Digilocker (opens in new tab)
 * 4. User returns and clicks "Proceed" to continue onboarding
 *
 * The parent OnboardingSteps component handles the callback via handleStepCallBack:
 * - When method is "getDigilockerUrl", it calls the digilocker API hook
 * - The response is stored in state.digilocker.data
 * - This component accesses the data via useOnboardingContext
 * @param {CustomComponentProps} props - Standard custom step props
 * @returns {JSX.Element} The rendered component
 */
const DigilockerRedirectionStep = ({
	stepConfig,
	onSubmit,
	isLoading: isSubmitting = false,
}: CustomComponentProps): JSX.Element => {
	const { state } = useOnboardingContext();

	// Extract digilocker data from state
	const digilockerData = state?.digilocker?.data;
	const digilockerLink = digilockerData?.link;

	// Note: We can't call handleStepCallBack directly from context
	// Instead, we rely on the parent OnboardingSteps to handle callbacks
	// This is a limitation of the current architecture
	useEffect(() => {
		// The callback will be triggered by the widget/parent component
		// when this step becomes active
		console.log("[DigilockerRedirectionStep] Component mounted");
	}, []);

	/**
	 * Opens Digilocker in a new tab
	 */
	const handleOpenDigilocker = () => {
		if (digilockerLink) {
			// Open Digilocker in new tab
			window.open(digilockerLink, "_blank", "noopener,noreferrer");
		}
	};

	/**
	 * Submits the step as completed
	 */
	const handleProceed = () => {
		onSubmit({
			id: stepConfig.id,
			form_data: {
				digilocker_completed: true,
				completion_timestamp: new Date().toISOString(),
			},
		});
	};

	return (
		<VStack gap={6} align="stretch" w="full">
			<Box>
				<Box fontSize="2xl" fontWeight="medium">
					{stepConfig.label}
				</Box>
				<Box fontSize="sm" color="gray.600" mt={3}>
					{stepConfig.description}
				</Box>
			</Box>

			<VStack gap={4} align="stretch">
				{/* Open Digilocker Button */}
				<Button
					w="full"
					colorScheme="blue"
					onClick={handleOpenDigilocker}
					isDisabled={isSubmitting || !digilockerLink}
					isLoading={!digilockerLink}
					loadingText="Loading Digilocker..."
					leftIcon={
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							width="20"
							height="20"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					}
				>
					Open Digilocker
				</Button>

				{/* Instructions Box */}
				<Box
					p={4}
					bg="blue.50"
					borderWidth="1px"
					borderColor="blue.200"
					borderRadius="md"
				>
					<Text fontSize="sm" fontWeight="semibold" color="blue.800">
						Steps:
					</Text>
					<OrderedList mt={2} fontSize="sm" color="blue.700" gap={1}>
						<ListItem>
							Click "Open Digilocker" to access your digital
							documents
						</ListItem>
						<ListItem>
							Complete the required verification process
						</ListItem>
						<ListItem>
							Return to this page and click "Proceed" to continue
						</ListItem>
					</OrderedList>
				</Box>

				{/* Action Buttons */}
				<Flex direction={{ base: "column", sm: "row" }} gap={4} mt={4}>
					<ActionButtonGroup
						isFixedOnMobile={false}
						buttonConfigList={[
							{
								type: "submit",
								label: isSubmitting
									? "Loading..."
									: stepConfig.primaryCTAText || "Proceed",
								loading: isSubmitting,
								disabled: isSubmitting,
								onClick: handleProceed,
							},
						]}
					/>
				</Flex>
			</VStack>
		</VStack>
	);
};

export default DigilockerRedirectionStep;
