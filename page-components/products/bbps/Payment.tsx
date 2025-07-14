import {
	Box,
	Divider,
	Flex,
	Heading,
	Radio,
	RadioGroup,
	Text,
	useToast,
} from "@chakra-ui/react";
import { ActionButtonGroup, Currency, PageTitle } from "components";
import { useContext, useEffect, useState } from "react";
import { InputPintwin } from "tf-components";
import { BbpsContext } from "./context/BbpsContext";
import { PaymentStatusData, PaymentStatusType } from "./context/types";
import { useBbpsApi } from "./hooks/useBbpsApi";
import { useBbpsNavigation } from "./hooks/useBbpsNavigation";
import { paymentStatusMocks } from "./utils/mockData";

export const Payment = () => {
	const nav = useBbpsNavigation();
	const toast = useToast();
	const { state, dispatch } = useContext(BbpsContext);
	const {
		selectedBills,
		totalAmount,
		useMockData,
		mockResponseType,
		selectedProduct,
		searchFormData,
	} = state;
	const [isProcessing, setIsProcessing] = useState(false);
	// Store encoded PinTwin value (e.g. "4040|87") returned from InputPintwin
	const [pintwinEncoded, setPintwinEncoded] = useState<string>("");
	// Track if PIN has 4 digits entered
	const [pinLength, setPinLength] = useState(0);

	// Get API functions
	const { makePayment } = useBbpsApi(selectedProduct);

	// 🛡️ Navigation Guard - Redirect if invalid state
	useEffect(() => {
		if (selectedBills.length === 0) {
			console.warn(
				"[BBPS Payment] No selected bills, redirecting to preview"
			);
			nav.goPreview();
		}
	}, [selectedBills.length]);

	// Early return if invalid state to prevent InputPintwin from loading
	if (selectedBills.length === 0) {
		return (
			<Box
				p={6}
				bg="white"
				borderRadius="10px"
				boxShadow="basic"
				textAlign="center"
			>
				<Heading size="md" mb={4}>
					No bills selected
				</Heading>
				<Text color="gray.600" mb={4}>
					Redirecting to bill selection...
				</Text>
			</Box>
		);
	}

	// Handle mock response type change
	const handleMockResponseTypeChange = (value: PaymentStatusType) => {
		dispatch({
			type: "SET_MOCK_RESPONSE_TYPE",
			responseType: value,
		});
	};

	// Helper function to handle payment status updates
	const handlePaymentStatus = (
		status: PaymentStatusType,
		message: string,
		transactionId?: string,
		timestamp?: string
	): void => {
		const paymentStatus: PaymentStatusData = {
			status,
			message,
			transactionId:
				transactionId ||
				`TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
			amount: totalAmount,
			timestamp: timestamp || new Date().toISOString(),
			billIds: selectedBills.map((bill) => bill.billid),
			...(status === "failure" ? paymentStatusMocks.failure : {}),
		};

		dispatch({
			type: "SET_PAYMENT_STATUS",
			payload: paymentStatus,
		});

		// Navigate to status page
		dispatch({ type: "SET_CURRENT_STEP", step: "status" });
		nav.goStatus();
	};

	// Handle payment submission
	const handlePayment = async () => {
		setIsProcessing(true);

		// Construct payment request payload
		const paymentRequest = {
			...searchFormData,
			payment_amount: totalAmount,
			payment_amount_breakup: selectedBills.map((bill) => ({
				billid: bill.billid,
				bill_payment_amount: bill.amount,
			})),
			pintwin: pintwinEncoded, // Encoded PIN with key id (e.g. "4040|87")
			// Add other required fields here based on API specification
		};

		// Log the payload only when using mock data (for debugging)
		if (useMockData) {
			console.log("[BBPS MOCK] Final payment payload:", paymentRequest);
			console.log("[BBPS MOCK] Response type:", mockResponseType);
		}

		// Validate that the sum of bill amounts equals total amount
		const sumOfBillAmounts = paymentRequest.payment_amount_breakup.reduce(
			(sum, item) => sum + item.bill_payment_amount,
			0
		);

		if (Math.abs(sumOfBillAmounts - totalAmount) > 0.01) {
			console.error(
				"[BBPS] Payment validation failed: Sum of bill amounts does not match total amount",
				{ sumOfBillAmounts, totalAmount }
			);
			toast({
				title: "Payment validation failed",
				description: "Sum of bill amounts does not match total amount",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			setIsProcessing(false);
			return;
		}

		try {
			// Make the actual payment API call - pass mockResponseType when in mock mode
			const { data: response, error } = await makePayment(
				paymentRequest,
				useMockData ? mockResponseType : undefined
			);

			console.log("[BBPS] API response:", response, "error:", error);

			if (error || !response) {
				// Handle payment failure
				handlePaymentStatus(
					"failure",
					error || "Payment failed. Please try again."
				);
			} else if (response.status === 0) {
				// Handle payment success
				handlePaymentStatus(
					"success",
					response.message || "Payment processed successfully",
					response.data?.transactionId,
					response.data?.timestamp
				);
			} else if (response.status === 1) {
				// Handle payment failure (status 1)
				handlePaymentStatus(
					"failure",
					response.message || "Payment failed. Please try again.",
					response.data?.transactionId,
					response.data?.timestamp
				);
			} else {
				// Handle payment pending or other status
				handlePaymentStatus(
					"pending",
					response.message || "Payment is being processed",
					response.data?.transactionId,
					response.data?.timestamp
				);
			}
		} catch (error) {
			console.error("[BBPS] Payment error:", error);
			handlePaymentStatus(
				"failure",
				"An unexpected error occurred during payment"
			);
		} finally {
			setIsProcessing(false);
		}
	};

	const buttonConfigList = [
		{
			type: "submit",
			size: "lg",
			label: "Pay",
			loading: isProcessing,
			disabled: pinLength < 4 || isProcessing,
			onClick: handlePayment,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			label: "Back to Preview",
			onClick: nav.goPreview,
			disabled: isProcessing,
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
		<>
			<PageTitle
				title="Payment Summary"
				subtitle="Confirm your payment"
				onBack={nav.goPreviousStep}
				toolComponent={
					useMockData && (
						<Box
							px={2}
							py={1}
							bg="yellow.100"
							color="yellow.800"
							borderRadius="md"
							fontSize="sm"
							fontWeight="medium"
						>
							Mock Mode
						</Box>
					)
				}
			/>

			<Flex direction="column" gap="4" mx={{ base: "4", md: "0" }}>
				{/* Payment Summary */}
				<Flex
					direction="column"
					gap="4"
					p={6}
					borderRadius="lg"
					bg="white"
					boxShadow="sm"
				>
					<Text fontSize="lg" fontWeight="bold" color="gray.700">
						Selected Bills
					</Text>
					{/* Bills List */}
					{selectedBills.map((bill) => (
						<Flex
							key={bill.billid}
							justify="space-between"
							p={3}
							bg="gray.50"
							borderRadius="md"
						>
							<Text>{bill.label}</Text>
							<Text fontWeight="bold">
								<Currency amount={bill.amount} />
							</Text>
						</Flex>
					))}
					{/* Divider */}
					<Divider />

					{/* Total Amount */}
					<Flex justify="space-between" fontWeight="bold">
						<Text fontSize="lg">Total Amount</Text>
						<Text fontSize="lg" color="primary.600">
							<Currency amount={totalAmount} />
						</Text>
					</Flex>
				</Flex>

				{/* Payment Options (simplified) */}
				<Flex
					direction="column"
					gap="4"
					p={6}
					borderWidth="1px"
					borderRadius="lg"
					bg="white"
				>
					<Heading size="sm" color="gray.700">
						Payment Method
					</Heading>
					<Text fontSize="sm" color="gray.600">
						Payment will be processed from your default wallet
					</Text>
					<InputPintwin
						label="PIN"
						lengthMin={4}
						lengthMax={4}
						required={true}
						pintwinApp={true}
						// useMockData={true}
						onChange={(value, masked) => {
							if (value.includes("|")) {
								setPintwinEncoded(value);
							}
							// Track PIN length based on masked value (which shows actual digit count)
							setPinLength(masked.length);
							if (useMockData) {
								console.log(
									"[BBPS MOCK] Pintwin encoded:",
									value,
									"masked:",
									masked,
									"length:",
									masked.length
								);
							}
						}}
					/>
				</Flex>

				{/* Mock Response Selection (only shown when useMockData is true) */}
				{useMockData && (
					<Flex
						direction="column"
						gap="4"
						p={6}
						borderRadius="lg"
						bg="yellow.50"
					>
						<Heading size="sm" color="yellow.700">
							Mock Response Type
						</Heading>

						<RadioGroup
							onChange={(value) =>
								handleMockResponseTypeChange(
									value as PaymentStatusType
								)
							}
							value={mockResponseType || "success"}
						>
							<Flex gap="4">
								{Object.values(paymentStatusMocks).map(
									(mock) => (
										<Radio
											key={mock.status}
											value={mock.status}
											colorScheme={
												mock.status === "success"
													? "green"
													: mock.status === "failure"
														? "red"
														: "blue"
											}
										>
											<Text textTransform="capitalize">
												{mock.status}
											</Text>
										</Radio>
									)
								)}
							</Flex>
						</RadioGroup>
					</Flex>
				)}

				<ActionButtonGroup
					buttonConfigList={buttonConfigList}
					bg={{ base: "white", md: "transparent" }}
				/>
			</Flex>
		</>
	);
};
