import {
	Alert,
	AlertDescription,
	AlertIcon,
	Badge,
	Box,
	Button as ChakraButton,
	Circle,
	Flex,
	HStack,
	ListItem,
	OrderedList,
	Spinner,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { ActionButtonGroup, Button, Icon } from "components";
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
	onSkip,
	isLoading: isSubmitting = false,
}: CustomComponentProps): JSX.Element => {
	// Determine if step can be skipped (not required)
	const canSkip = !stepConfig.isRequired && onSkip;
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

	// Derived states from hook status
	const isAgreementIdle = status === "idle";
	const isAgreementLoadingStatus = status === "loading";
	// const isAgreementReadyToSign = status === "ready";
	const isAgreementVerifyingStatus = status === "verifying";
	const isAlreadySigned = status === "already_signed";
	const isSignAgreementSuccessfullySigned =
		status === "success" || isAlreadySigned;
	const isAgreementError = status === "error";

	// Combined states for logic
	const isAgreementLoading = isAgreementIdle || isAgreementLoadingStatus;
	const isVerifying = isAgreementVerifyingStatus || isSubmittingStep;
	const agreementLoadError = isAgreementError;

	// Initialize esign session on mount
	useEffect(() => {
		if (isAgreementIdle) {
			initialize();
		}
	}, [isAgreementIdle, initialize]);

	/**
	 * Listen to this step's pipeline result for success/errors
	 */
	useEffect(() => {
		const result = pipelineResults[stepConfig.id];
		console.log("[SignAgreementStep] result", result);
		if (!result || result === lastProcessedResultRef.current) return;

		if (result.status === "success") {
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
		setNotSignedError(false);
		setTimeoutError(false);
		setSubmitError(null);
	}, [hasOpenedSigning, notSignedError, openSigning]);

	/**
	 * Start auto-advance countdown when status becomes success
	 */
	useEffect(() => {
		if (isSignAgreementSuccessfullySigned && !hasAutoSubmittedRef.current) {
			setCountdown(AUTO_ADVANCE_SECONDS);

			countdownIntervalRef.current = setInterval(() => {
				setCountdown((prev) => {
					if (prev === null || prev <= 1) {
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
	}, [isSignAgreementSuccessfullySigned]);

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

	const isProceedDisabled =
		(!hasOpenedSigning && !timeoutError) ||
		isAgreementLoading ||
		isVerifying ||
		isSubmitting ||
		notSignedError;

	const isSignDisabled =
		(hasOpenedSigning && !notSignedError) ||
		isAgreementLoading ||
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
			</Box>

			<VStack gap={4} align="stretch">
				{/* Step Progress Indicators */}
				<VStack align="stretch" gap={3}>
					{/* Step 1: Document Preparation (UPDATED) */}
					<HStack gap={3} align="flex-start" justify="space-between">
						<HStack gap={3} align="flex-start" flex={1}>
							<Box mt={0.5}>
								{isAgreementLoading ? (
									<Spinner
										size="sm"
										color="blue.500"
										thickness="2px"
									/>
								) : agreementLoadError ? (
									<Icon
										name="error"
										size="sm"
										color="error"
									/>
								) : (
									<Icon
										name="check-circle"
										size="sm"
										color="green.500"
									/>
								)}
							</Box>

							<Text
								fontSize="sm"
								fontWeight="medium"
								color={
									isAgreementLoading
										? "gray.600"
										: agreementLoadError
											? "error"
											: "success"
								}
							>
								{isAgreementLoading ? (
									"Preparing your document"
								) : agreementLoadError ? (
									"Failed to prepare document"
								) : isAlreadySigned ? (
									"Document is already signed"
								) : (
									<>
										Document is generated for{" "}
										{userName && (
											<Text
												as="span"
												fontWeight="semibold"
											>
												{userName}
											</Text>
										)}
										{documentId && (
											<Text
												color="gray.500"
												fontWeight="normal"
												fontSize="xs"
												fontStyle="italic"
											>
												(Document ID: {documentId})
											</Text>
										)}
									</>
								)}
							</Text>
						</HStack>

						{agreementLoadError && (
							<Button
								size="sm"
								variant="link"
								color="error"
								leftIcon={<Icon name="retry" size="sm" />}
								onClick={() => initialize()}
							>
								Retry
							</Button>
						)}
					</HStack>

					{/* Step 2: Document Esign (UPDATED) */}
					<HStack
						gap={3}
						align="center"
						opacity={agreementLoadError ? 0.4 : 1}
					>
						{isSignAgreementSuccessfullySigned ? (
							<Icon
								name="check-circle"
								size="sm"
								color="green.500"
							/>
						) : (
							<Circle
								size="18px"
								border="2px solid"
								borderColor="gray.300"
							/>
						)}

						<HStack gap={2} align="center">
							<Text
								fontSize="sm"
								color="gray.700"
								fontWeight="medium"
							>
								Document Esign
							</Text>
							<Badge
								colorScheme={
									isSignAgreementSuccessfullySigned
										? "green"
										: "yellow"
								}
								fontSize="xs"
								variant="subtle"
							>
								{isSignAgreementSuccessfullySigned
									? "Completed"
									: "Pending"}
							</Badge>
						</HStack>
					</HStack>
				</VStack>

				{/* Sign Agreement Button (HIDDEN ON ERROR) */}
				{!isAgreementLoading &&
					!agreementLoadError &&
					!isAlreadySigned && (
						<ChakraButton
							w="full"
							colorScheme="blue"
							onClick={handleSignClick}
							isDisabled={isSignDisabled}
							leftIcon={<Icon name="mode-edit" size="sm" />}
						>
							{hasOpenedSigning
								? "Agreement signing opened"
								: stepConfig.primaryCTAText || "Sign Agreement"}
						</ChakraButton>
					)}

				{/* Success Banner */}
				{isSignAgreementSuccessfullySigned && (
					<Alert status="success" borderRadius="md">
						<AlertIcon />
						<AlertDescription>
							{isAlreadySigned
								? "Agreement has been signed previously."
								: "Agreement signed successfully!"}
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
									: isSignAgreementSuccessfullySigned &&
										  countdown !== null
										? `Proceed now`
										: isVerifying
											? "Verifying..."
											: "Proceed",
								loading: isVerifying,
								disabled: isProceedDisabled,
								onClick: handleProceedClick,
							},
							...(canSkip
								? [
										{
											type: "button",
											variant: "link",
											label: "Skip",
											disabled:
												isSubmitting || isVerifying,
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

export default SignAgreementStep;
