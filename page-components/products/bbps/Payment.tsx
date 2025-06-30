import {
	Box,
	Button,
	Flex,
	Heading,
	Radio,
	RadioGroup,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";
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
			// Make the actual payment API call
			const { data: response, error } = await makePayment(paymentRequest);

			if (error || !response) {
				// Handle payment failure
				const paymentStatus: PaymentStatusData = {
					...paymentStatusMocks.failure,
					status: "failure",
					message: error || "Payment failed. Please try again.",
					amount: totalAmount,
					billIds: selectedBills.map((bill) => bill.billid),
					transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
					timestamp: new Date().toISOString(),
				};

				dispatch({
					type: "SET_PAYMENT_STATUS",
					payload: paymentStatus,
				});

				toast({
					title: "Payment failed",
					description: paymentStatus.message,
					status: "error",
					duration: 5000,
					isClosable: true,
				});

				// Navigate to status page
				dispatch({ type: "SET_CURRENT_STEP", step: "status" });
				nav.goStatus();
			} else if (response.status === 0) {
				// Handle payment success
				const paymentStatus: PaymentStatusData = {
					status: "success",
					message:
						response.message || "Payment processed successfully",
					transactionId:
						response.data?.transactionId ||
						`TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
					amount: totalAmount,
					timestamp:
						response.data?.timestamp || new Date().toISOString(),
					billIds: selectedBills.map((bill) => bill.billid),
				};

				dispatch({
					type: "SET_PAYMENT_STATUS",
					payload: paymentStatus,
				});

				toast({
					title: "Payment successful",
					description: paymentStatus.message,
					status: "success",
					duration: 5000,
					isClosable: true,
				});

				// Navigate to status page
				dispatch({ type: "SET_CURRENT_STEP", step: "status" });
				nav.goStatus();
			} else {
				// Handle payment pending or other status
				const paymentStatus: PaymentStatusData = {
					status: "pending",
					message: response.message || "Payment is being processed",
					transactionId:
						response.data?.transactionId ||
						`TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
					amount: totalAmount,
					timestamp:
						response.data?.timestamp || new Date().toISOString(),
					billIds: selectedBills.map((bill) => bill.billid),
				};

				dispatch({
					type: "SET_PAYMENT_STATUS",
					payload: paymentStatus,
				});

				toast({
					title: "Payment pending",
					description: paymentStatus.message,
					status: "info",
					duration: 5000,
					isClosable: true,
				});

				// Navigate to status page
				dispatch({ type: "SET_CURRENT_STEP", step: "status" });
				nav.goStatus();
			}
		} catch (error) {
			console.error("[BBPS] Payment error:", error);

			const paymentStatus: PaymentStatusData = {
				...paymentStatusMocks.failure,
				status: "failure",
				message: "An unexpected error occurred during payment",
				amount: totalAmount,
				billIds: selectedBills.map((bill) => bill.billid),
				transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
				timestamp: new Date().toISOString(),
			};

			dispatch({
				type: "SET_PAYMENT_STATUS",
				payload: paymentStatus,
			});

			toast({
				title: "Payment error",
				description: "An unexpected error occurred during payment",
				status: "error",
				duration: 5000,
				isClosable: true,
			});

			// Navigate to status page
			dispatch({ type: "SET_CURRENT_STEP", step: "status" });
			nav.goStatus();
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Box>
			<Flex justify="space-between" align="center" mb={6}>
				<Heading size="md" color="primary.600">
					Payment Summary
				</Heading>
				{useMockData && (
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
				)}
			</Flex>

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
								{formatCurrency(bill.amount)}
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
						{formatCurrency(totalAmount)}
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
					borderRadius="full"
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
