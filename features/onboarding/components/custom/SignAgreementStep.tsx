import {
	Alert,
	AlertDescription,
	AlertIcon,
	Box,
	Button,
	Flex,
	ListItem,
	OrderedList,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { ActionButtonGroup, IcoButton, Icon } from "components";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOnboardingContext } from "../../context";
import { useSignAgreement } from "../../hooks/useSignAgreement";
import type { CustomComponentProps } from "../ContentRenderer";

/** Auto-advance countdown duration in seconds */
const AUTO_ADVANCE_SECONDS = 5;

/**
 * SignAgreementStep Component
 *
 * Handles the e-signature agreement flow in the onboarding process.
 * Uses useSignAgreement hook for provider-agnostic signing (Leegality, Karza, Signzy),
 * Android WebView support, and SDK callback handling.
 *
 * Flow:
 * 1. On mount, initializes esign session (loads provider script + fetches URL)
 * 2. User clicks "Sign Agreement" to open signing popup/SDK
 * 3. User completes e-sign in popup/app
 * 4. User clicks "Proceed" to verify + submit step (or auto-advances on success)
 *
 * State Machine: idle -> loading -> ready -> signing -> verifying -> success/error
 * @param {CustomComponentProps} props - Standard custom step props
 * @returns {JSX.Element} The rendered component
 */
const SignAgreementStep = ({
	stepConfig,
	onSubmit,
	onAdvance,
	isLoading: isSubmitting = false,
}: CustomComponentProps): JSX.Element => {
	const toast = useToast();
	const {
		userName,
		agreementId,
		state: _contextState,
		pipelineResults,
	} = useOnboardingContext();
	const { status, initialize, openSigning, documentId } = useSignAgreement();

	// Track if esign was cancelled (1657 error - user didn't sign)
	const [notSignedError, setNotSignedError] = useState(false);

	// Track if API timed out (network error - signing may have succeeded)
	const [timeoutError, setTimeoutError] = useState(false);

	// Track if user has clicked "Sign Agreement" (enables Proceed button)
	const [hasOpenedSigning, setHasOpenedSigning] = useState(false);

	// Track if we're in the process of submitting the step
	const [isSubmittingStep, setIsSubmittingStep] = useState(false);

	// Track if step submit failed (show "Retry proceed")
	const [_submitError, setSubmitError] = useState<string | null>(null);

	// Auto-advance countdown state
	const [countdown, setCountdown] = useState<number | null>(null);
	const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

	// Ref to track if we've already triggered auto-submit
	const hasAutoSubmittedRef = useRef(false);

	// Ref to track if we've already advanced (prevents double-advance)
	const lastProcessedResultRef = useRef<any>(null);

	// Initialize esign session on mount
	useEffect(() => {
		if (status === "idle") {
			initialize();
		}
	}, [status, initialize]);

	/**
	 * Listen to this step's pipeline result for success/errors
	 * Updated to work with new PipelineResult structure
	 * Uses lastProcessedResultRef to track the last processed result and prevent duplicate toasts
	 */
	useEffect(() => {
		const result = pipelineResults[stepConfig.id];
		console.log("[SignAgreementStep] result", result);
		// Skip if no result or if we've already processed this exact result object
		if (!result || result === lastProcessedResultRef.current) return;

		// For pipeline result, check the first (and typically only) API response
		// const apiResponse = result.list?.[0]?.response;
		// const responseTypeId = apiResponse?.response_type_id;

		if (result.status === "success") {
			// Success! Advance to next step
			lastProcessedResultRef.current = result;
			toast({
				title:
					stepConfig.success_message ||
					"Agreement signed successfully!",
				status: "success",
				duration: 2000,
			});
			onAdvance(stepConfig.id);
		} else if (result.status === "failed") {
			lastProcessedResultRef.current = result;
			// Extract error message from failed step
			const failedStep = result.list.find((r) => r.status === "failed");
			const errorMessage =
				failedStep?.response?.message ||
				"Sign Agreement failed. Please try again.";

			toast({
				title: "Sign Agreement Failed",
				description: errorMessage,
				status: "error",
				duration: 4000,
				isClosable: true,
			});

			setNotSignedError(true);
			setTimeoutError(false);
			setHasOpenedSigning(false);
			setIsSubmittingStep(false);
		}
		// else if (
		// 	responseTypeId === 1616 ||
		// 	responseTypeId === 1657 ||
		// 	responseTypeId === 1070
		// ) {
		// 	lastProcessedResultRef.current = result;
		// 	setNotSignedError(true);
		// 	setTimeoutError(false);
		// 	setHasOpenedSigning(false);
		// 	setIsSubmittingStep(false);

		// 	toast({
		// 		title: "Agreement not signed",
		// 		description: "Please sign the agreement to proceed.",
		// 		status: "error",
		// 		duration: 2000,
		// 	});
		// } else if (
		// 	apiResponse?.message?.includes("timeout") ||
		// 	apiResponse?.message?.includes("network") ||
		// 	(apiResponse?.error && !responseTypeId)
		// ) {
		// 	// Timeout/network error - keep sign disabled, show retry on proceed
		// 	lastProcessedResultRef.current = result;
		// 	setTimeoutError(true);
		// 	setNotSignedError(false);
		// 	setIsSubmittingStep(false);
		// }
	}, [
		pipelineResults,
		stepConfig.id,
		stepConfig.success_message,
		onAdvance,
		toast,
	]);

	/**
	 * Submits the step to advance onboarding
	 */
	const handleProceedClick = useCallback((): void => {
		setSubmitError(null);
		setIsSubmittingStep(true);

		try {
			onSubmit({
				id: stepConfig.id,
				form_data: {
					esign_completed: true,
					completion_timestamp: new Date().toISOString(),
					document_id: documentId,
					agreement_id: agreementId,
				},
			});
			// Note: onSubmit may be async and handled by parent
			// If it fails, the parent should show an error
		} catch (err: any) {
			console.error("[SignAgreementStep] Submit error:", err);
			setSubmitError(
				err?.message || "Failed to proceed. Please try again."
			);
			setIsSubmittingStep(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stepConfig.id, documentId, agreementId]);

	/**
	 * Handle "Sign Agreement" button click
	 */
	const handleSignClick = useCallback((): void => {
		if (hasOpenedSigning && !notSignedError) return;
		openSigning();
		setHasOpenedSigning(true);
		setNotSignedError(false); // Clear the error state
		setTimeoutError(false);
		setSubmitError(null);
	}, [hasOpenedSigning, notSignedError, openSigning]);

	/**
	 * Start auto-advance countdown when status becomes success
	 */
	useEffect(() => {
		if (status === "success" && !hasAutoSubmittedRef.current) {
			setCountdown(AUTO_ADVANCE_SECONDS);

			countdownIntervalRef.current = setInterval(() => {
				setCountdown((prev) => {
					if (prev === null || prev <= 1) {
						// Clear interval and trigger submit
						if (countdownIntervalRef.current) {
							clearInterval(countdownIntervalRef.current);
							countdownIntervalRef.current = null;
						}
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			return () => {
				if (countdownIntervalRef.current) {
					clearInterval(countdownIntervalRef.current);
					countdownIntervalRef.current = null;
				}
			};
		}

		return undefined;
	}, [status]);

	/**
	 * Auto-submit when countdown reaches 0
	 */
	useEffect(() => {
		if (
			countdown === 0 &&
			!hasAutoSubmittedRef.current &&
			!isSubmittingStep
		) {
			hasAutoSubmittedRef.current = true;
			handleProceedClick();
		}
	}, [countdown, isSubmittingStep, handleProceedClick]);

	// Derived states for button logic
	const isInitializing = status === "idle" || status === "loading";
	const isVerifying = status === "verifying" || isSubmittingStep;
	const isSuccess = status === "success";
	const agreementLoadError = status === "error"; // Failed to load agreement

	// Proceed button should be disabled until user opens signing
	// Also disabled if we got a "not signed" error (1657)
	// But ENABLED if timeout error (to allow retry)
	const isProceedDisabled =
		(!hasOpenedSigning && !timeoutError) ||
		isInitializing ||
		isVerifying ||
		isSubmitting ||
		notSignedError;

	// Sign button disabled after clicked or during loading states
	// Re-enabled if we got a "not signed" error (1657) - user needs to retry signing
	// Stays disabled on timeout (signing may have succeeded)
	const isSignDisabled =
		(hasOpenedSigning && !notSignedError) ||
		isInitializing ||
		isVerifying ||
		isSubmitting ||
		timeoutError;

	return (
		<VStack gap={6} align="stretch" w="full">
			{/* Header */}
			<Box>
				<Box fontSize="2xl" fontWeight="medium">
					{stepConfig.label}
				</Box>
				<Box fontSize="sm" color="gray.600" mt={3}>
					{stepConfig.description ||
						"Sign the agreement using your Aadhaar number to complete your registration."}
				</Box>
				{status === "ready" && (
					<Box
						mt={3}
						p={3}
						bg="blue.50"
						borderRadius="md"
						borderLeft="4px solid"
						borderColor="blue.500"
					>
						<Text fontSize="sm" color="blue.800">
							{userName ? (
								<>
									Hey,{" "}
									<Text as="span" fontWeight="semibold">
										{userName}
									</Text>
									, the agreement has been prepared for you.
									Please review it carefully before
									proceeding.
								</>
							) : (
								"Hi there, your agreement has been prepared. Please review it carefully before proceeding."
							)}
						</Text>
					</Box>
				)}
			</Box>

			<VStack gap={4} align="stretch">
				{/* Status Banner */}
				{/* {isInitializing && (
					<Alert status="info" borderRadius="md">
						<Spinner size="sm" mr={3} />
						<AlertDescription>
							{userName
								? `Preparing agreement document for ${userName}...`
								: "Preparing agreement document..."}
						</AlertDescription>
					</Alert>
				)} */}

				{/* {isError && !submitError && (
					<Alert status="error" borderRadius="md">
						<AlertIcon />
						<AlertDescription>
							{error || "Failed to initialize. Please try again."}
						</AlertDescription>
					</Alert>
				)}

				{submitError && (
					<Alert status="error" borderRadius="md">
						<AlertIcon />
						<AlertDescription>{submitError}</AlertDescription>
					</Alert>
				)} */}

				{/* {isVerifying && (
					<Alert status="info" borderRadius="md">
						<Spinner size="sm" mr={3} />
						<AlertDescription>
							Verifying your signature...
						</AlertDescription>
					</Alert>
				)} */}

				{/* Sign Agreement Button */}
				<Flex direction="row" align="center" gap={2}>
					<Button
						w="full"
						colorScheme="blue"
						onClick={handleSignClick}
						isDisabled={agreementLoadError || isSignDisabled}
						isLoading={isInitializing}
						loadingText="Preparing..."
						leftIcon={<Icon name="mode-edit" size="sm" />}
					>
						{hasOpenedSigning
							? "Agreement signing opened"
							: stepConfig.primaryCTAText || "Sign Agreement"}
					</Button>
					{agreementLoadError ? (
						<IcoButton
							title="Retry"
							iconName="retry"
							theme="ghost"
							iconStyle={{ color: "error" }}
							iconSize="md"
							onClick={() => initialize()}
						/>
					) : null}
				</Flex>

				{/* Success Banner */}
				{isSuccess && (
					<Alert status="success" borderRadius="md">
						<AlertIcon />
						<AlertDescription>
							Agreement signed successfully!
							{countdown !== null && countdown > 0 && (
								<Text as="span" fontWeight="semibold">
									{" "}
									Proceeding in {countdown} second
									{countdown !== 1 ? "s" : ""}...
								</Text>
							)}
						</AlertDescription>
					</Alert>
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
							Click &quot;Sign Agreement&quot; to start the e-sign
							process
						</ListItem>
						<ListItem>
							Complete your e-signature in the new window using
							Aadhaar or IRIS
						</ListItem>

						<ListItem>
							Return here and click &quot;Proceed&quot; once
							finished
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
								label: timeoutError
									? "Retry"
									: isSuccess && countdown !== null
										? `Proceed now`
										: isVerifying
											? "Verifying..."
											: "Proceed",
								loading: isVerifying,
								disabled: isProceedDisabled,
								onClick: handleProceedClick,
							},
						]}
					/>
				</Flex>
			</VStack>
		</VStack>
	);
};

export default SignAgreementStep;
