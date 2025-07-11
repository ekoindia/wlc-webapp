import {
	Box,
	Divider,
	Flex,
	Heading,
	Icon,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import {
	ActionButtonGroup,
	Button,
	Currency,
	PageTitle,
	Share,
} from "components";
import { formatDate } from "libs/dateFormat";
import { useContext, useEffect } from "react";
import {
	FaCheckCircle,
	FaExclamationTriangle,
	FaInfoCircle,
} from "react-icons/fa";
import { BbpsContext } from "./context/BbpsContext";
import { PaymentStatusType } from "./context/types";
import { useBbpsNavigation } from "./hooks/useBbpsNavigation";

/**
 * Status component for displaying BBPS payment status and transaction details
 * @returns {JSX.Element} Status component
 */
export const Status = (): JSX.Element => {
	const nav = useBbpsNavigation();
	const { state } = useContext(BbpsContext);
	const { paymentStatus, selectedBills, useMockData } = state;

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

	const buttonConfigList = [
		{
			type: "submit",
			label:
				paymentStatus.status === "success"
					? "Make Another Payment"
					: "Try Again",
			onClick: nav.goSearch,
			disabled: false,
			styles: { h: "64px", w: { base: "100%", md: "200px" } },
		},
		{
			variant: "link",
			label: "Back to Search",
			onClick: nav.goSearch,
			disabled: false,
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
				title="Payment Status"
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
			<Flex
				direction="column"
				gap="4"
				mx={{ base: "4", md: "0" }}
				mb={{ base: "128px", md: "64px" }}
			>
				{/* Status Header */}
				<Box
					p={8}
					borderRadius="lg"
					bg={statusConfig.bgColor}
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
				>
					<Flex justify="space-between" align="center" mb={4}>
						<Heading size="sm" color="gray.700">
							Transaction Details
						</Heading>
						<Share
							title="Payment Receipt"
							text={`Payment ${paymentStatus.status === "success" ? "Successful" : paymentStatus.status === "failure" ? "Failed" : "Pending"}\n\nTransaction ID: ${paymentStatus.transactionId}\nAmount: ₹${paymentStatus.amount}\nDate: ${formatDate(paymentStatus.timestamp, "dd/MM/yyyy hh:mm a")}`}
							size="sm"
							variant="outline"
							// label="Share Receipt"
							hideIcon={false}
						/>
					</Flex>

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
								<Currency amount={paymentStatus.amount} />
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
											<Currency amount={bill.amount} />
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
				<ActionButtonGroup
					buttonConfigList={buttonConfigList}
					bg={{ base: "white", md: "transparent" }}
				/>
			</Flex>
		</>
	);
};
