import { Box, Flex, Skeleton, Text, VStack, useToast } from "@chakra-ui/react";
import { ActionButtonGroup, Button, Icon } from "components";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { usePubSub, useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pintwin } from "tf-components/Pintwin";
import { useOnboardingContext } from "../../context";
import type { CustomComponentProps } from "../ContentRenderer";

/** Response from GET_BOOKLET_NUMBER API (interaction_type_id: 170) */
interface BookletDataResponse {
	user_code: string;
	booklet_serial_number: string;
	is_pintwin_user: 0 | 1;
}

/** PIN state for each Pintwin input */
interface PinState {
	raw: string;
	encoded: string;
}

/**
 * SecretPinStep - Custom component for Secret PIN onboarding step
 *
 * This component:
 * 1. Fetches booklet data (is_pintwin_user, booklet_serial_number) from API on mount
 * 2. Renders two Pintwin components for Secret PIN and Confirm PIN
 * 3. Validates that both PINs match before enabling submit
 * 4. Submits encoded PINs along with booklet data to the pipeline
 * @param {CustomComponentProps} props - Standard custom step props
 * @returns {JSX.Element} The rendered component
 */
const SecretPinStep = ({
	stepConfig,
	onSubmit,
	onAdvance,
	onSkip,
	isLoading: isSubmitting = false,
}: CustomComponentProps): JSX.Element => {
	// Determine if step can be skipped (not required)
	const canSkip = !stepConfig.isRequired && onSkip;
	const toast = useToast();
	const { publish, TOPICS } = usePubSub();
	const { mobile, state, pipelineResults } = useOnboardingContext();
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const lastProcessedResultRef = useRef<any>(null);

	// Booklet data state
	const [bookletData, setBookletData] = useState<BookletDataResponse | null>(
		null
	);
	const [isLoadingBooklet, setIsLoadingBooklet] = useState(true);
	const [bookletError, setBookletError] = useState<string | null>(null);

	// PIN states
	const [firstPin, setFirstPin] = useState<PinState>({
		raw: "",
		encoded: "",
	});
	const [secondPin, setSecondPin] = useState<PinState>({
		raw: "",
		encoded: "",
	});

	// Validation
	const pinsMatch =
		firstPin.raw.length === 4 &&
		secondPin.raw.length === 4 &&
		firstPin.raw === secondPin.raw;
	const pinsMismatch =
		firstPin.raw.length === 4 &&
		secondPin.raw.length === 4 &&
		firstPin.raw !== secondPin.raw;

	/**
	 * Fetch booklet data from API (interaction_type_id: 170)
	 */
	const fetchBookletData = useCallback(async () => {
		setIsLoadingBooklet(true);
		setBookletError(null);

		try {
			const response = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					token: accessToken,
					body: {
						interaction_type_id: TransactionIds.GET_BOOKLET_NUMBER,
						document_id: "",
						latlong: state.latLong || "27.176670,78.008075,7787",
						user_id: mobile,
					},
				},
				generateNewToken
			);

			if (
				response?.response_status_id === 0 &&
				response?.response_type_id === 1646
			) {
				setBookletData(response.data);
				// console.log(
				// 	"[SecretPinStep] Booklet data fetched:",
				// 	response.data
				// );
			} else {
				// API returned but with an error message
				setBookletError(
					response.message || "Failed to fetch booklet data"
				);
			}
		} catch (error) {
			console.error(
				"[SecretPinStep] Error fetching booklet data:",
				error
			);
			setBookletError("Failed to connect. Please try again.");
		} finally {
			setIsLoadingBooklet(false);
		}
	}, [accessToken, generateNewToken, mobile, state.latLong]);

	// Fetch booklet data on mount
	useEffect(() => {
		fetchBookletData();
	}, [fetchBookletData]);

	/**
	 * Check pipeline result for step completion - auto-advance if already successful
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
					"Secret PIN created successfully!",
				status: "success",
				duration: 2000,
			});
			onAdvance(stepConfig.id);
		} else if (result.status === "failed") {
			lastProcessedResultRef.current = result;
			const failedStep = result.list.find((r) => r.status === "failed");
			const errorMessage =
				failedStep?.response?.message ||
				"Failed to create secret PIN. Please try again.";
			toast({
				title: "Verification Failed",
				description: errorMessage,
				status: "error",
				duration: 4000,
				isClosable: true,
			});
			// Signal all Pintwin components to refresh their keys
			publish(TOPICS.REFRESH_PINTWIN);
		}
	}, [
		pipelineResults,
		stepConfig.id,
		stepConfig.success_message,
		onAdvance,
		toast,
		publish,
		TOPICS,
	]);

	/**
	 * Handle form submission
	 */
	const handleSubmit = () => {
		if (!bookletData || !pinsMatch) return;

		console.log("[SecretPinStep] Submitting with data:", {
			first_okekey: "[ENCODED]",
			second_okekey: "[ENCODED]",
			is_pintwin_user: bookletData.is_pintwin_user,
			booklet_serial_number: bookletData.booklet_serial_number,
		});

		onSubmit({
			id: stepConfig.id,
			form_data: {
				first_okekey: firstPin.encoded,
				second_okekey: secondPin.encoded,
				is_pintwin_user: bookletData.is_pintwin_user,
				booklet_serial_number: bookletData.booklet_serial_number,
			},
		});
	};

	// Loading state - show skeletons
	if (isLoadingBooklet) {
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
					<Skeleton height="80px" />
					<Skeleton height="80px" />
				</VStack>
			</VStack>
		);
	}

	// Derived state: booklet failed to load
	const bookletLoadError = !isLoadingBooklet && bookletError;

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

			<VStack gap={6} align="stretch">
				{/* Error banner when booklet data fails to load */}
				{bookletLoadError && (
					<Flex
						align="center"
						justify="space-between"
						p={2}
						pl={4}
						bg="red.50"
						border="1px solid"
						borderColor="error"
						borderRadius="md"
					>
						<Flex align="center" gap={3}>
							<Icon name="error" size="md" color="error" />
							<Text
								color="error"
								fontWeight="medium"
								fontSize="sm"
							>
								{bookletError}
							</Text>
						</Flex>
						<Button
							size="sm"
							variant="link"
							color="error"
							leftIcon={<Icon name="retry" size="sm" />}
							onClick={fetchBookletData}
						>
							Retry
						</Button>
					</Flex>
				)}

				{/* Only show Pintwin inputs if booklet data is loaded */}
				{bookletData && (
					<>
						{/* Secret PIN Input */}
						<Pintwin
							label="Secret PIN"
							length={4}
							onPinChange={(pin) =>
								setFirstPin((prev) => ({ ...prev, raw: pin }))
							}
							onPinComplete={(pin, encodedPin) =>
								setFirstPin({ raw: pin, encoded: encodedPin })
							}
						/>

						{/* Confirm PIN Input */}
						<Pintwin
							label="Confirm Secret PIN"
							length={4}
							onPinChange={(pin) =>
								setSecondPin((prev) => ({ ...prev, raw: pin }))
							}
							onPinComplete={(pin, encodedPin) =>
								setSecondPin({ raw: pin, encoded: encodedPin })
							}
						/>

						{/* PIN mismatch error */}
						{pinsMismatch && (
							<Flex
								align="center"
								gap={3}
								p={3}
								bg="rgba(255, 64, 129, 0.15)"
								border="1px solid"
								borderColor="error"
								borderRadius="md"
							>
								<Icon name="error" size="sm" color="error" />
								<Text
									fontSize="sm"
									color="error"
									fontWeight="medium"
								>
									PINs do not match. Please try again.
								</Text>
							</Flex>
						)}

						<ActionButtonGroup
							isFixedOnMobile={false}
							buttonConfigList={[
								{
									label: isSubmitting
										? "Loading..."
										: stepConfig.primaryCTAText ||
											"Proceed",
									onClick: handleSubmit,
									loading: isSubmitting,
									disabled:
										isSubmitting ||
										!pinsMatch ||
										!firstPin.encoded,
								},
								...(canSkip
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
													h: {
														base: "64px",
														md: "64px",
													},
													w: {
														base: "100%",
														md: "auto",
													},
													_hover: {
														textDecoration: "none",
													},
												},
											},
										]
									: []),
							]}
						/>
					</>
				)}
			</VStack>
		</VStack>
	);
};

export default SecretPinStep;
