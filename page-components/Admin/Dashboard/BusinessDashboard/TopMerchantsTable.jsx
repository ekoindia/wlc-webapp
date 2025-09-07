import { Box, Flex, HStack, Tag, Text, VStack } from "@chakra-ui/react";
import { Currency, Icon } from "components";
import { getDateDistance } from "libs";
import { LuCake } from "react-icons/lu";

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
 * A small label element for the table elements
 * Used to display the parent name, joining date, and other labels like "GTV", "Transactions, etc"
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Label text
 * @param {object} props.rest - Additional props to pass to the Text component
 * @returns {JSX.Element} - Rendered label element
 */
const Label = ({ children, ...rest }) => (
	<Text
		fontSize="0.7rem"
		color="gray.500"
		fontWeight="medium"
		noOfLines={1}
		{...rest}
	>
		{children}
	</Text>
);

/**
 * Horizontal bar chart component for GTV and Transactions
 * MARK: Bar Chart
 * @param {object} props - Component props
 * @param {number} props.value - Current value
 * @param {number} props.total - Total value
 * @param {string} props.label - Label for the chart
 * @param {boolean} props.isCurrency - Whether to format the value as currency
 * @param props.color
 */
const HorizontalBarChart = ({
	value,
	total,
	label,
	isCurrency = false,
	color = "accent.DEFAULT",
	...rest
}) => {
	const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;

	return (
		<VStack spacing="6px" align="stretch" minW="0" {...rest}>
			{/* GTV Bar */}
			<HStack spacing="8px" align="center">
				<VStack spacing="2px" align="stretch" flex="1" minW="0">
					{/* Top Layer: Label */}
					<Text
						fontSize="0.9rem"
						fontWeight="bold"
						color={color}
						noOfLines={1}
					>
						{isCurrency ? (
							<Currency amount={value} showSymbol={true} />
						) : (
							formatNumber(value)
						)}
					</Text>

					{/* Mid Layer: Bar */}
					{total > 0 ? (
						<Box
							h="8px"
							bg="gray.100"
							borderRadius="full"
							overflow="hidden"
						>
							<Box
								h="100%"
								bg={color}
								// gradient bg
								// bgGradient="linear(to-r, #8827F0, #4469F1)"
								borderRadius="full"
								width={`${Math.min(percentage, 100)}%`}
								transition="width 0.3s ease"
							/>
						</Box>
					) : null}

					{/* Bottom Layer: Label & Percentage */}
					<HStack
						justify="space-between"
						align="center"
						fontSize="0.7rem"
					>
						<Label>{label}</Label>
						{total > 0 ? (
							<Text color="primary.DEFAULT" fontWeight="semibold">
								{percentage}%
							</Text>
						) : null}
					</HStack>
				</VStack>
			</HStack>
		</VStack>
	);
};

/**
 * Individual merchant row component for the leaderboard
 * MARK: row
 * @param {object} props - Component props
 * @param {object} props.merchant - Merchant data
 * @param {number} props.rank - Merchant rank position
 * @param {number} props.totalGtv - Total GTV for percentage calculation
 * @param {number} props.totalTransactions - Total transactions for percentage calculation
 * @param {Date} props.now - Current date/time
 * @param props.onViewProfile
 */
const MerchantRow = ({
	merchant,
	rank,
	totalGtv,
	totalTransactions,
	now,
	onViewProfile,
}) => {
	// Extract `merchant` data...
	const {
		name = "",
		status = "inactive",
		gtv = 0,
		totalTransactions: merchantTransactions = 0,
		onboardingDate = "",
		distributorMapped = "",
		raCases = 0,
		// gtvPercent = 0,
		gtvCumulativePercent = 0,
		usercode = "",
		cellNumber,
	} = merchant;

	// Calculate average ticket
	const avgTicket = merchantTransactions > 0 ? gtv / merchantTransactions : 0;

	// Calculate cumulative percentage
	// const cumulativePercentage = totalGtv > 0 ? (gtv / totalGtv) * 100 : 0;

	// Status color mapping
	const statusColors = {
		active: "green",
		inactive: "red",
		pending: "orange",
		suspended: "red",
	};

	// MARK: row jsx
	return (
		<Flex
			w="100%"
			p="16px"
			bg="white"
			borderRadius="10px"
			border="1px solid"
			borderColor="divider"
			mb="12px"
			align="center"
			gap={{ base: "8px", md: "16px" }}
			rowGap="16px"
			wrap={{ base: "wrap", lg: "nowrap" }}
			_hover={{ bg: "focusbg" }}
			transition="background-color 0.2s"
			// minW="0"
		>
			{/* Merchant Details */}
			<HStack gap="12px" flex="4" minW={{ base: "full", md: "auto" }}>
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
				<VStack align="start" spacing="4px" flex="1" minW="0">
					<Text
						fontSize="md"
						fontWeight="semibold"
						color="dark"
						noOfLines={1}
						cursor="pointer"
						onClick={() => onViewProfile(cellNumber)}
					>
						{name}
					</Text>
					<Flex
						direction="row"
						gap="8px"
						wrap="wrap"
						alignItems="center"
						color="gray.500"
					>
						<Label># {usercode}</Label>
						<Tag
							size="sm"
							colorScheme={
								statusColors[status?.toLowerCase()] || "gray"
							}
							variant="outline"
							borderRadius="full"
							fontSize="0.6em"
							cursor="default"
							userSelect="none"
						>
							{status}
						</Tag>
					</Flex>
					<Flex
						direction="row"
						gap="8px"
						wrap="wrap"
						alignItems="center"
						color="gray.500"
					>
						{distributorMapped && (
							<>
								<Icon name="refer" size="12px" />
								<Label color="gray.600">
									{distributorMapped}
								</Label>
							</>
						)}
						{onboardingDate && (
							<>
								<LuCake />
								<Label>
									{getDateDistance(onboardingDate, now)}
									{/* <DateView date={onboardingDate} /> */}
								</Label>
							</>
						)}
					</Flex>
				</VStack>
			</HStack>

			{/* GTV Chart */}
			<HorizontalBarChart
				value={gtv}
				total={totalGtv}
				label="GTV"
				isCurrency
				color="#e27c7c"
				flex="2"
				minW={{ base: "45%", md: "auto" }}
			/>

			{/* Transaction Count Chart */}
			<HorizontalBarChart
				value={merchantTransactions}
				total={totalTransactions}
				label="Transactions"
				color="#858299"
				flex="2"
				minW={{ base: "45%", md: "auto" }}
			/>

			{/* Pending (Response Awaited) Transactions */}
			<VStack spacing="2px" align="center" flex="1">
				<Text fontSize="0.85rem" fontWeight="bold" color="orange.400">
					{(+raCases)?.toFixed(0) || 0}
				</Text>
				<Label>Pending </Label>
			</VStack>

			{/* Average Ticket */}
			<VStack spacing="2px" align="center" flex="1">
				<Text fontSize="0.85rem" fontWeight="bold" color="gray.500">
					<Currency amount={avgTicket.toFixed(0)} showSymbol={true} />
				</Text>
				<Label>Avg Ticket</Label>
			</VStack>

			{/* Cumulative Percentage */}
			{totalTransactions ? (
				<VStack spacing="2px" align="center" flex="1">
					<Text fontSize="0.85rem" fontWeight="bold" color="success">
						{gtvCumulativePercent}%
					</Text>
					<Label>Cumulative</Label>
				</VStack>
			) : null}
			{/* </HStack> */}
		</Flex>
	);
};

/**
 * Custom table component for Top Merchants leaderboard
 * MARK: table
 * @param {object} props - Component props
 * @param {Array} props.data - Array of merchant data
 * @param {boolean} props.isLoading - Loading state
 * @param props.totalGtv
 * @param props.totalTransactions
 * @param props.onViewProfile
 */
const TopMerchantsTable = ({
	data = [],
	totalGtv,
	totalTransactions,
	isLoading = false,
	onViewProfile,
}) => {
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
					No data available for this period.
				</Text>
			</Box>
		);
	}

	const now = new Date();

	return (
		<VStack spacing="0" w="100%" align="stretch">
			{data.map((merchant, index) => (
				<MerchantRow
					key={merchant.usercode || index}
					merchant={merchant}
					rank={index + 1}
					totalGtv={totalGtv}
					totalTransactions={totalTransactions}
					now={now}
					onViewProfile={onViewProfile}
				/>
			))}
		</VStack>
	);
};

export default TopMerchantsTable;
