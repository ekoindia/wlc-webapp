import {
	Box,
	Button as ChakraButton,
	Flex,
	ListItem,
	OrderedList,
	Text,
	VStack,
	useToast,
} from "@chakra-ui/react";
import { ActionButtonGroup, Icon } from "components";
import { Endpoints } from "constants/EndPoints";
import { useOnboardingContext } from "features/onboarding/context";
import { useApiFetch } from "hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CustomComponentProps } from "../ContentRenderer";

/**
 * DigilockerRedirectionStep Component
 *
 * This component handles the Digilocker redirection flow in the onboarding process.
 * It fetches the Digilocker URL and manages the redirection flow locally.
 *
 * Flow:
 * 1. On mount, triggers API call to get Digilocker redirection URL
 * 2. Displays instructions and "Open Digilocker" button
 * 3. User clicks button once to open Digilocker in new tab
 * 4. User completes verification in Digilocker
 * 5. User returns and clicks "Proceed" to continue onboarding (enabled only after opening Digilocker)
 * @param {CustomComponentProps} props - Standard custom step props
 * @returns {JSX.Element} The rendered component
 */
const DigilockerRedirectionStep = ({
	stepConfig,
	onSubmit,
	onAdvance,
	onSkip,
	isLoading: isSubmitting = false,
}: CustomComponentProps): JSX.Element => {
	// Determine if step can be skipped (not required)
	const canSkip = !stepConfig.isRequired && onSkip;
	const { pipelineResults, setPipelineResult } = useOnboardingContext();
	const toast = useToast();

	// Local state for Digilocker data
	const [digilockerLink, setDigilockerLink] = useState<string | null>(null);
	const [requestId, setRequestId] = useState<string | null>(null);
	const [hasOpenedDigilocker, setHasOpenedDigilocker] = useState(false);
	const [numberMismatchError, setNumberMismatchError] = useState<
		string | null
	>(null);
	const hasFetchedRef = useRef(false);
	const lastProcessedResultRef = useRef<any>(null);

	// Setup API fetch hook
	const [fetchApiData, isDigilockerLoading] = useApiFetch(
		Endpoints.TRANSACTION,
		{
			method: "POST",
		}
	);

	const fetchDigilockerUrl = useCallback(async (): Promise<void> => {
		if (digilockerLink || isDigilockerLoading) return;

		const result = await fetchApiData({
			headers: {
				"tf-req-method": "POST",
				"tf-req-uri": "/karza/digilocker-redirection-url",
				"tf-req-uri-root-path": "/ekoicici/v1/marketuat",
			},
		});

		if (result?.error) {
			console.error(
				"[DigilockerRedirectionStep] getDigilockerUrl error:",
				result
			);
			toast({
				title:
					result?.data?.message ??
					"Something went wrong, please try again later!",
				status: "error",
				duration: 2000,
			});
			return;
		}

		const data = result?.data;

		if (data?.status === 0 && data?.data?.link) {
			// console.log("[DigilockerRedirectionStep] link", data.data.link);
			// console.log(
			// 	"[DigilockerRedirectionStep] requestId",
			// 	data.data.requestId
			// );
			setDigilockerLink(data.data.link);
			setRequestId(data.data.requestId);
			return;
		}

		toast({
			title: data?.message || "Failed to get Digilocker URL",
			status: "error",
			duration: 2000,
		});
	}, [digilockerLink, fetchApiData, isDigilockerLoading, toast]);

	useEffect(() => {
		if (!hasFetchedRef.current) {
			hasFetchedRef.current = true;
			void fetchDigilockerUrl();
		}
	}, [fetchDigilockerUrl]);

	/**
	 * Check pipeline result for step completion - auto-advance if successful
	 * Uses lastProcessedResultRef to track the last processed result and prevent duplicate toasts
	 */
	useEffect(() => {
		const result = pipelineResults[stepConfig.id];
		// Skip if no result or if we've already processed this exact result object
		if (!result || result === lastProcessedResultRef.current) return;

		if (result.status === "success") {
			lastProcessedResultRef.current = result;
			toast({
				title:
					stepConfig.success_message ||
					"Digilocker verification completed successfully!",
				status: "success",
				duration: 2000,
			});
			onAdvance(stepConfig.id);
		}
		// Note: Error handling for 1709 is done in a separate useEffect below
	}, [
		pipelineResults,
		stepConfig.id,
		stepConfig.success_message,
		onAdvance,
		toast,
	]);

	/**
	 * Watch for incomplete verification error (status 1709)
	 * If detected, reset state and fetch new Digilocker URL
	 * Updated to work with new PipelineResult structure
	 */
	useEffect(() => {
		const result = pipelineResults[stepConfig.id];

		// Check if we have a failed verification
		if (result?.status === "failed") {
			const apiResponse = result.list?.[0]?.response;

			if (apiResponse?.response_type_id === 2443) {
				// Number mismatch: onboarding number differs from Aadhaar-linked number
				setNumberMismatchError(
					apiResponse?.message ||
						"The mobile number used for Aadhaar verification on Digilocker does not match your onboarding mobile number. Please retry using the correct number."
				);

				// Clear the pipeline result to prevent re-triggering
				setPipelineResult(stepConfig.id, null as any);
			} else if (apiResponse?.response_type_id === 1709) {
				toast({
					title:
						apiResponse?.message ||
						"Verification incomplete. Please try again.",
					status: "error",
					duration: 3000,
				});

				// Clear the error response to prevent re-triggering
				setPipelineResult(stepConfig.id, null as any);

				// Reset local state
				setHasOpenedDigilocker(false);
				setDigilockerLink(null);
				setRequestId(null);
				hasFetchedRef.current = false;

				// Fetch new Digilocker URL (will bypass guard since digilockerLink is null)
				void fetchDigilockerUrl();
			} else {
				// Handle generic errors (e.g. 500, network error)
				lastProcessedResultRef.current = result;
				const errorMessage =
					apiResponse?.message ||
					"Verification failed. Please try again.";
				toast({
					title: "Verification Failed",
					description: errorMessage,
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			}
		}
	}, [
		pipelineResults,
		stepConfig.id,
		setPipelineResult,
		fetchDigilockerUrl,
		toast,
	]);

	/**
	 * Opens Digilocker in a new tab
	 */
	const handleOpenDigilocker = (): void => {
		if (!digilockerLink || hasOpenedDigilocker) return;

		// Open Digilocker in a new tab
		window.open(digilockerLink, "_blank", "noopener,noreferrer");

		// Mark as opened after successful window.open
		setHasOpenedDigilocker(true);
	};

	/**
	 * Retries Digilocker verification after a number mismatch error.
	 * Resets all local state and fetches a fresh Digilocker URL.
	 */
	const handleRetryVerification = (): void => {
		setNumberMismatchError(null);
		setHasOpenedDigilocker(false);
		setDigilockerLink(null);
		setRequestId(null);
		hasFetchedRef.current = false;
		void fetchDigilockerUrl();
	};

	/**
	 * Submits the step as completed
	 */
	const handleProceed = (): void => {
		onSubmit({
			id: stepConfig.id,
			form_data: {
				digilocker_completed: true,
				completion_timestamp: new Date().toISOString(),
				token_id: requestId,
				is_consent: "Y",
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
				<ChakraButton
					w="full"
					colorScheme="blue"
					onClick={handleOpenDigilocker}
					isDisabled={
						isSubmitting ||
						isDigilockerLoading ||
						hasOpenedDigilocker ||
						!digilockerLink
					}
					isLoading={Boolean(isDigilockerLoading)}
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
					{hasOpenedDigilocker
						? "Digilocker opened"
						: "Open Digilocker"}
				</ChakraButton>

				{/* Number Mismatch Error */}
				{numberMismatchError && (
					<Box
						p={4}
						bg="rgba(255, 64, 129, 0.15)"
						borderWidth="1px"
						borderColor="rgba(255, 64, 129, 0.4)"
						borderRadius="md"
					>
						<Flex align="center" gap={2} mb={2}>
							<Icon name="error" size="sm" color="error" />
							<Text
								fontWeight="semibold"
								fontSize="sm"
								color="error"
							>
								Mobile Number Mismatch
							</Text>
						</Flex>
						<Text fontSize="sm" color="error">
							{numberMismatchError}
						</Text>
					</Box>
				)}

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
								// If error is present, become a Retry button
								type: numberMismatchError ? "button" : "submit",
								label: numberMismatchError
									? "Retry Verification"
									: isSubmitting
										? "Loading..."
										: stepConfig.primaryCTAText ||
											"Proceed",
								loading: isSubmitting || isDigilockerLoading,
								disabled:
									isSubmitting ||
									(!hasOpenedDigilocker &&
										!numberMismatchError),
								onClick: numberMismatchError
									? handleRetryVerification
									: handleProceed,
							},
							...(canSkip && !numberMismatchError
								? [
										{
											type: "button",
											variant: "link",
											label: "Skip",
											disabled: isSubmitting,
											onClick: () =>
												onSkip?.(stepConfig.id),
											styles: {
												color: "primary.DEFAULT",
												bg: {
													base: "white",
													md: "none",
												},
												h: { base: "64px", md: "64px" },
												w: { base: "100%", md: "auto" },
												_hover: {
													textDecoration: "none",
												},
											},
										},
									]
								: []),
						]}
					/>
				</Flex>
			</VStack>
		</VStack>
	);
};

export default DigilockerRedirectionStep;
