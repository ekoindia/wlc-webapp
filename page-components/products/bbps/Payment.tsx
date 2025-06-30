import {
	Box,
	Flex,
	Heading,
	Radio,
	RadioGroup,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";
import { Button, PageTitle } from "components";
import { useContext, useState } from "react";
import { formatCurrency } from "utils/numberFormat";
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
	} = state;
	const [isProcessing, setIsProcessing] = useState(false);

	// Get API functions
	const { makePayment } = useBbpsApi(selectedProduct);

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
			payment_amount: totalAmount,
			payment_amount_breakup: selectedBills.map((bill) => ({
				billid: bill.billid,
				bill_payment_amount: bill.amount,
			})),
			// Add other required fields here based on API specification
		};

		console.log("[BBPS] Payment request:", paymentRequest);
		console.log(
			"[BBPS] Using mock mode:",
			useMockData,
			"with response type:",
			mockResponseType
		);

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

	return (
		<Box>
			<PageTitle
				title="Payment Summary"
				subtitle="Confirm your payment"
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

			{/* Payment Summary */}
			<Box
				p={6}
				borderWidth="1px"
				borderRadius="lg"
				bg="white"
				boxShadow="sm"
				mb={6}
			>
				<Heading size="sm" mb={4} color="gray.700">
					Selected Bills
				</Heading>

				<Stack spacing={4}>
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
								{formatCurrency(
									bill.amount,
									"INR",
									true,
									false
								)}
							</Text>
						</Flex>
					))}
				</Stack>

				{/* Total Amount */}
				<Flex
					justify="space-between"
					mt={6}
					pt={4}
					borderTopWidth="1px"
					borderColor="gray.200"
					fontWeight="bold"
				>
					<Text fontSize="lg">Total Amount</Text>
					<Text fontSize="lg" color="primary.600">
						{formatCurrency(totalAmount, "INR", true, false)}
					</Text>
				</Flex>
			</Box>

			{/* Payment Options (simplified) */}
			<Box
				p={6}
				borderWidth="1px"
				borderRadius="lg"
				bg="white"
				boxShadow="sm"
				mb={8}
			>
				<Heading size="sm" mb={4} color="gray.700">
					Payment Method
				</Heading>
				<Text color="gray.600">
					Payment will be processed from your default wallet
				</Text>
			</Box>

			{/* Mock Response Selection (only shown when useMockData is true) */}
			{useMockData && (
				<Box
					p={6}
					borderWidth="1px"
					borderRadius="lg"
					bg="yellow.50"
					boxShadow="sm"
					mb={8}
				>
					<Heading size="sm" mb={4} color="yellow.700">
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
						<Stack direction="row" spacing={6}>
							<Radio value="success" colorScheme="green">
								Success
							</Radio>
							<Radio value="failure" colorScheme="red">
								Failure
							</Radio>
							<Radio value="pending" colorScheme="blue">
								Pending
							</Radio>
						</Stack>
					</RadioGroup>
				</Box>
			)}

			{/* Action Buttons */}
			<Flex justify="center" mt={8}>
				<Button
					onClick={handlePayment}
					size="lg"
					isLoading={isProcessing}
					loadingText="Processing..."
					px={10}
				>
					Confirm Payment
				</Button>
			</Flex>

			<Flex justify="center" mt={4}>
				<Button
					variant="ghost"
					onClick={nav.goPreview}
					color="primary.500"
					size="lg"
				>
					Back to Bill Selection
				</Button>
			</Flex>
		</Box>
	);
};
