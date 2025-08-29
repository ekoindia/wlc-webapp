import { Box, Flex, HStack, Tag, Text, VStack } from "@chakra-ui/react";
import { Currency, DateView } from "components";

/**
 * Format large numbers with appropriate suffixes
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
const formatNumber = (num) => {
	if (!num) return "0";
	if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
	if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
	if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
	return num.toString();
};

/**
 * Horizontal bar chart component for GTV and Transactions
 * MARK: Bar Chart
 * @param {object} props - Component props
 * @param {number} props.value - Current value
 * @param {number} props.total - Total value
 * @param {string} props.label - Label for the chart
 * @param {boolean} props.isCurrency - Whether to format the value as currency
 */
const HorizontalBarChart = ({
	value,
	total,
	label,
	isCurrency = false,
	...rest
}) => {
	const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;

	return (
		<VStack spacing="6px" align="stretch" minW="160px" {...rest}>
			{/* GTV Bar */}
			<HStack spacing="8px" align="center">
				<VStack spacing="2px" align="stretch" flex="1">
					{/* Top Layer: Label */}
					<Text
						fontSize="1em"
						fontWeight="bold"
						color="accent.DEFAULT"
					>
						{isCurrency ? (
							<Currency amount={value} showSymbol={true} />
						) : (
							formatNumber(value)
						)}
					</Text>

					{/* Mid Layer: Bar */}
					<Box
						h="6px"
						bg="gray.100"
						borderRadius="full"
						overflow="hidden"
					>
						<Box
							h="100%"
							bg="primary.DEFAULT"
							borderRadius="full"
							width={`${Math.min(percentage, 100)}%`}
							transition="width 0.3s ease"
						/>
					</Box>

					{/* Bottom Layer: Label & Percentage */}
					<HStack justify="space-between" align="center">
						<Text
							fontSize="xs"
							color="gray.500"
							fontWeight="medium"
						>
							{label}
						</Text>
						<Text
							fontSize="xs"
							color="primary.DEFAULT"
							fontWeight="semibold"
						>
							{percentage}%
						</Text>
					</HStack>
				</VStack>
			</HStack>
		</VStack>
	);
};

/**
 * Individual merchant row component for the leaderboard
 * @param {object} props - Component props
 * @param {object} props.merchant - Merchant data
 * @param {number} props.rank - Merchant rank position
 * @param {number} props.totalGtv - Total GTV for percentage calculation
 * @param {number} props.totalTransactions - Total transactions for percentage calculation
 */
const MerchantRow = ({ merchant, rank, totalGtv, totalTransactions }) => {
	// Extract `merchant` data...
	const {
		name = "",
		status = "inactive",
		// usercode = "", // TODO: use this to link to agent profile page (or, use mobile number)
		gtv = 0,
		totalTransactions: merchantTransactions = 0,
		onboardingDate = "",
		distributorMapped = "",
	} = merchant;

	console.log(
		"Merchant Row:",
		merchant,
		gtv,
		merchantTransactions,
		totalGtv,
		totalTransactions
	);

	// Calculate average ticket
	const avgTicket = merchantTransactions > 0 ? gtv / merchantTransactions : 0;

	// Calculate cumulative percentage
	const cumulativePercentage = totalGtv > 0 ? (gtv / totalGtv) * 100 : 0;

	// Status color mapping
	const statusColors = {
		active: "green",
		inactive: "red",
		pending: "orange",
		suspended: "red",
	};

	// TODO
	// const onViewProfile = () => {
	// 	router.push(`/admin/my-network/profile?mobile=${mobile}`);
	// };

	return (
		<Flex
			p="16px"
			bg="white"
			borderRadius="10px"
			border="1px solid"
			borderColor="divider"
			mb="12px"
			align="center"
			gap="24px"
			wrap="wrap"
			_hover={{ bg: "focusbg" }}
			transition="background-color 0.2s"
		>
			{/* Merchant Details */}
			<HStack gap="12px" flex="2">
				{/* Rank */}
				<Box
					w="28px"
					h="28px"
					borderRadius="full"
					bg={rank <= 3 ? "accent.DEFAULT" : "gray.100"}
					display="flex"
					alignItems="center"
					justifyContent="center"
					flexShrink={0}
				>
					<Text
						fontSize="xs"
						fontWeight="bold"
						color={rank <= 3 ? "white" : "gray.600"}
					>
						{rank}
					</Text>
				</Box>

				{/* <Avatar
					name={name}
					size="md"
					bg="primary.DEFAULT"
					color="white"
					fontSize="sm"
					fontWeight="semibold"
					flexShrink={0}
				/> */}

				{/* Agent Details */}
				<VStack align="start" spacing="2px" flex="1" minW="0">
					<HStack spacing="8px" wrap="wrap">
						<Text
							fontSize="md"
							fontWeight="semibold"
							color="dark"
							noOfLines={1}
						>
							{name}
						</Text>
						<Tag
							size="sm"
							colorScheme={
								statusColors[status?.toLowerCase()] || "gray"
							}
							variant="solid"
							borderRadius="full"
						>
							{status}
						</Tag>
					</HStack>
					<HStack spacing="8px" wrap="wrap">
						{distributorMapped && (
							<Text fontSize="xs" color="gray.600" noOfLines={1}>
								{distributorMapped}
							</Text>
						)}
						{onboardingDate && (
							<Text fontSize="xs" color="gray.500">
								<DateView date={onboardingDate} />
							</Text>
						)}
					</HStack>
				</VStack>
			</HStack>

			<HorizontalBarChart
				value={gtv}
				total={totalGtv}
				label="GTV"
				isCurrency
				flex="1"
			/>

			<HorizontalBarChart
				value={merchantTransactions}
				total={totalTransactions}
				label="Transactions"
				flex="1"
			/>

			{/* Average Ticket */}
			<VStack spacing="2px" align="center" minW="80px" flex="1">
				<Text fontSize="lg" fontWeight="bold" color="accent.DEFAULT">
					<Currency amount={avgTicket.toFixed(0)} showSymbol={true} />
				</Text>
				<Text fontSize="xs" color="gray.500">
					Avg Ticket
				</Text>
			</VStack>

			{/* Cumulative Percentage */}
			<VStack spacing="2px" align="center" minW="60px" flex="1">
				<Text fontSize="lg" fontWeight="bold" color="success">
					{cumulativePercentage.toFixed(0)}%
				</Text>
				<Text fontSize="xs" color="gray.500">
					Cumulative
				</Text>
			</VStack>
			{/* </HStack> */}
		</Flex>
	);
};

/**
 * Custom table component for Top Merchants leaderboard
 * @param {object} props - Component props
 * @param {Array} props.data - Array of merchant data
 * @param {boolean} props.isLoading - Loading state
 * @param props.totalGtv
 * @param props.totalTransactions
 */
const TopMerchantsTable = ({
	data = [],
	totalGtv,
	totalTransactions,
	isLoading = false,
}) => {
	console.log("Total Business: 222: ", totalGtv, totalTransactions);

	if (isLoading) {
		return (
			<VStack spacing="12px" w="100%">
				{[...Array(5)].map((_, index) => (
					<Box
						key={index}
						h="80px"
						w="100%"
						bg="gray.100"
						borderRadius="10px"
						animate="pulse"
					/>
				))}
			</VStack>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Box
				p="40px"
				textAlign="center"
				bg="gray.50"
				borderRadius="10px"
				border="1px solid"
				borderColor="divider"
			>
				<Text color="gray.500" fontSize="md">
					No merchants found
				</Text>
			</Box>
		);
	}

	return (
		<VStack spacing="0" w="100%" align="stretch">
			{data.map((merchant, index) => (
				<MerchantRow
					key={merchant.usercode || index}
					merchant={merchant}
					rank={index + 1}
					totalGtv={totalGtv}
					totalTransactions={totalTransactions}
				/>
			))}
		</VStack>
	);
};

export default TopMerchantsTable;
