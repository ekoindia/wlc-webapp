import {
	Box,
	Button as ChakraButton,
	Divider,
	Flex,
	Heading,
	HStack,
	Icon,
	Stack,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import Button from "components/Button/Button";
import { formatDate } from "libs/dateFormat";
import { useContext, useEffect, useState } from "react";
import {
	FaCheckCircle,
	FaExclamationTriangle,
	FaInfoCircle,
	FaReceipt,
	FaShare,
} from "react-icons/fa";
import { formatCurrency } from "utils/numberFormat";
import { BbpsContext } from "./context/BbpsContext";
import { PaymentStatusType } from "./context/types";
import { useBbpsNavigation } from "./hooks/useBbpsNavigation";

/**
 * Status component for displaying BBPS payment status and transaction details
 * @returns {JSX.Element} Status component
 */
export const Status = (): JSX.Element => {
	const nav = useBbpsNavigation();
	const toast = useToast();
	const { state } = useContext(BbpsContext);
	const { paymentStatus, selectedBills } = state;
	const [isDownloading, setIsDownloading] = useState(false);
	const [isSharing, setIsSharing] = useState(false);

	// Ensure we have payment status
	useEffect(() => {
		if (!paymentStatus) {
			// Redirect to search if no payment status
			nav.goSearch();
		}
	}, [paymentStatus, nav]);

	// Show loading or redirect if no payment status
	if (!paymentStatus) {
		return (
			<Box
				p={6}
				bg="white"
				borderRadius="10px"
				boxShadow="basic"
				textAlign="center"
			>
				<Heading size="md" mb={4}>
					No payment information available
				</Heading>
				<Text color="gray.600" mb={4}>
					Redirecting to search...
				</Text>
				<Button onClick={nav.goSearch}>Back to Search</Button>
			</Box>
		);
	}

	/**
	 * Get status icon and color based on status type
	 * @param {PaymentStatusType} status - The payment status
	 * @returns {object} Status configuration object
	 */
	const getStatusConfig = (status: PaymentStatusType) => {
		switch (status) {
			case "success":
				return {
					icon: FaCheckCircle,
					color: "green.500",
					bgColor: "green.50",
					title: "Payment Successful",
					message:
						"Your bill payment has been processed successfully.",
				};
			case "failure":
				return {
					icon: FaExclamationTriangle,
					color: "red.500",
					bgColor: "red.50",
					title: "Payment Failed",
					message:
						"We couldn't process your payment. Please try again.",
				};
			case "pending":
				return {
					icon: FaInfoCircle,
					color: "blue.500",
					bgColor: "blue.50",
					title: "Payment Pending",
					message:
						"Your payment is being processed. Please check back later.",
				};
			default:
				return {
					icon: FaInfoCircle,
					color: "gray.500",
					bgColor: "gray.50",
					title: "Payment Status",
					message: "Payment status is unknown.",
				};
		}
	};

	const statusConfig = getStatusConfig(paymentStatus.status);

	/**
	 * Handle receipt download
	 */
	const handleDownloadReceipt = (): void => {
		setIsDownloading(true);

		// Simulate download delay
		setTimeout(() => {
			toast({
				title: "Receipt downloaded",
				description: "The receipt has been downloaded to your device.",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			setIsDownloading(false);
		}, 1500);
	};

	/**
	 * Handle share receipt
	 */
	const handleShareReceipt = (): void => {
		setIsSharing(true);

		// Simulate share delay
		setTimeout(() => {
			toast({
				title: "Receipt shared",
				description: "The receipt has been shared successfully.",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			setIsSharing(false);
		}, 1500);
	};

	return (
		<Box>
			{/* Status Header */}
			<Box
				p={8}
				borderRadius="lg"
				bg={statusConfig.bgColor}
				mb={6}
				textAlign="center"
			>
				<Icon
					as={statusConfig.icon}
					boxSize={16}
					color={statusConfig.color}
					mb={4}
				/>
				<Heading size="lg" mb={2} color={statusConfig.color}>
					{statusConfig.title}
				</Heading>
				<Text fontSize="md" color="gray.600">
					{statusConfig.message}
				</Text>
			</Box>

			{/* Transaction Details */}
			<Box
				p={6}
				borderWidth="1px"
				borderRadius="lg"
				bg="white"
				boxShadow="sm"
				mb={6}
			>
				<Heading size="sm" mb={4} color="gray.700">
					Transaction Details
				</Heading>

				<Stack spacing={4} divider={<Divider />}>
					<Flex justify="space-between">
						<Text color="gray.600">Transaction ID</Text>
						<Text fontWeight="medium">
							{paymentStatus.transactionId}
						</Text>
					</Flex>

					<Flex justify="space-between">
						<Text color="gray.600">Date & Time</Text>
						<Text fontWeight="medium">
							{formatDate(
								paymentStatus.timestamp,
								"dd/MM/yyyy hh:mm a"
							)}
						</Text>
					</Flex>

					<Flex justify="space-between">
						<Text color="gray.600">Payment Mode</Text>
						<Text fontWeight="medium">Wallet</Text>
					</Flex>

					<Flex justify="space-between">
						<Text color="gray.600">Amount</Text>
						<Text fontWeight="bold" color="primary.600">
							{formatCurrency(
								paymentStatus.amount,
								"INR",
								true,
								false
							)}
						</Text>
					</Flex>
				</Stack>
			</Box>

			{/* Bill Details */}
			{selectedBills.length > 0 && (
				<Box
					p={6}
					borderWidth="1px"
					borderRadius="lg"
					bg="white"
					boxShadow="sm"
					mb={6}
				>
					<Heading size="sm" mb={4} color="gray.700">
						Bill Details
					</Heading>

					<VStack spacing={4} align="stretch">
						{selectedBills.map((bill) => (
							<Box
								key={bill.billid}
								p={4}
								borderWidth="1px"
								borderRadius="md"
								bg="gray.50"
							>
								<Flex justify="space-between" mb={2}>
									<Text fontWeight="medium">
										{bill.label}
									</Text>
									<Text fontWeight="bold">
										{formatCurrency(
											bill.amount,
											"INR",
											true,
											false
										)}
									</Text>
								</Flex>
								<Text fontSize="sm" color="gray.600">
									Bill ID: {bill.billid}
								</Text>
							</Box>
						))}
					</VStack>
				</Box>
			)}

			{/* Action Buttons */}
			<HStack spacing={4} justify="center" mt={6}>
				{paymentStatus.status === "success" && (
					<>
						<ChakraButton
							leftIcon={<FaReceipt />}
							colorScheme="blue"
							variant="outline"
							onClick={handleDownloadReceipt}
							isLoading={isDownloading}
							loadingText="Downloading..."
						>
							Download Receipt
						</ChakraButton>
						<ChakraButton
							leftIcon={<FaShare />}
							colorScheme="blue"
							variant="outline"
							onClick={handleShareReceipt}
							isLoading={isSharing}
							loadingText="Sharing..."
						>
							Share Receipt
						</ChakraButton>
					</>
				)}
			</HStack>

			{/* Back to Home Button */}
			<Flex justify="center" mt={6}>
				<Button onClick={nav.goSearch} size="lg">
					{paymentStatus.status === "failure"
						? "Try Again"
						: "Make Another Payment"}
				</Button>
			</Flex>
		</Box>
	);
};
