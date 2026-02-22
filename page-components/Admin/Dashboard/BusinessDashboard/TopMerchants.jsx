import { Flex, Select, Text } from "@chakra-ui/react";
import { Table } from "components";
import { DragHandle } from "components/DraggableGrid";
import { Endpoints } from "constants";
import { useApiFetch, useFeatureFlag } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LuTrophy } from "react-icons/lu";
import { TopMerchantsChart, TopMerchantsTable } from ".";
import { useDashboard } from "..";

/**
 * Process top merchants data for the dashboard
 * - Add cumulative GTV, and other relevant metrics like percentages
 * MARK: Process
 * @param {Array} merchants - Array of merchant objects
 * @param {number} totalGtv - Total GTV for all merchants
 * @param {number} totalCount - Total count of merchants
 * @param {0|1|2} [decimalPrecision] - Decimal precision for percentage calculations. 0 by default.
 * @returns {Array} Processed array of merchant data
 */
const processTopMerchantsData = (
	merchants,
	totalGtv,
	totalCount,
	decimalPrecision = 0
) => {
	// Calculate cumulative metrics
	let cumulativeGtv = 0;

	const processedData = merchants.map((m) => {
		cumulativeGtv += +m?.gtv ?? 0;

		return {
			...m,
			gtvPercent:
				totalGtv > 0
					? (((+m?.gtv ?? 0) / totalGtv) * 100).toFixed(
							decimalPrecision
						)
					: 0,
			countPercent:
				totalCount > 0
					? (
							((+m?.totalTransactions ?? 0) / totalCount) *
							100
						).toFixed(decimalPrecision)
					: 0,
			gtvCumulative: cumulativeGtv,
			gtvCumulativePercent:
				totalGtv > 0 && cumulativeGtv > 0
					? ((cumulativeGtv / totalGtv) * 100).toFixed(
							decimalPrecision
						)
					: 0,
		};
	});

	return processedData;
};

// TODO: Redundant. used only for the old generic table
const topMerchantsTableParameterList = [
	{ label: "#", show: "#" },
	{ name: "name", label: "Name", sorting: true, show: "Avatar" },
	{ name: "usercode", label: "Agent's\nCode", sorting: true },
	{
		name: "gtv",
		label: "GTV",
		sorting: true,
		show: "Amount",
	},
	{
		name: "totalTransactions",
		label: "Transaction\nCount",
		sorting: true,
	},
	{
		name: "status",
		label: "Status",
		show: "Tag",
		sorting: true,
	},
	{
		name: "raCases",
		label: "Pending\nTransactions",
		sorting: true,
	},
	{
		name: "onboardingDate",
		label: "Onboarding\nDate",
		sorting: true,
		show: "Date",
	},
	{
		name: "distributorMapped",
		label: "Distributor\nMapped",
		sorting: true,
	},
];

// Helper function to generate cache key
const getCacheKey = (productFilter, dateFrom, dateTo) => {
	return `${productFilter || "all"}-${dateFrom}-${dateTo}`;
};

/**
 * TopMerchants component displays a table of top merchants based on GTV.
 * @param {object} props - Properties passed to the component.
 * @param {Array} props.productFilterList - List of product filters.
 * @param {string} props.dateFrom - Start date for filtering data.
 * @param {string} props.dateTo - End date for filtering data.
 * @param {object} props.totalBusiness - Total business data (total GTV, Transaction count, etc).
 * @param {boolean} [props.isDraggable] - Whether the component is draggable in the grid.
 * @returns {JSX.Element} The rendered top merchants component
 * @example
 * <TopMerchants
 *   dateFrom="2023-01-01"
 *   dateTo="2023-01-31"
 *   productFilterList={[{ label: "Product 1", value: "81" }]}
 * />
 */
const TopMerchants = ({
	dateFrom,
	dateTo,
	productFilterList,
	totalBusiness,
	isDraggable,
}) => {
	const [productFilter, setProductFilter] = useState("");
	const [topMerchantsData, setTopMerchantsData] = useState([]); // Actual/cached list of top merchants
	const [processedMerchantData, setProcessedMerchantData] = useState([]); // Processed list of top-merchants with pre-calculated cumulative sum. percentage, etc
	const { businessDashboardData, setBusinessDashboardData } = useDashboard();

	const [showNewDashboard] = useFeatureFlag("DASHBOARD_V2");

	/**
	 * Prepare the topMerchantData for dashboard...
	 */
	useEffect(() => {
		if (!topMerchantsData || topMerchantsData.length === 0) {
			setProcessedMerchantData([]);
			return;
		}

		setProcessedMerchantData(
			processTopMerchantsData(
				topMerchantsData,
				totalBusiness?.gtv?.amount ?? 0,
				totalBusiness?.transactions?.transactions ?? 0
			)
		);
	}, [topMerchantsData, totalBusiness]);

	// TODO: Improve/refactor this logic. This part seems duplicate which is being repeated in multiple components where we are showing product filter. Seems too much code to produce a cached list of products to filter from.

	// Fetching Top Merchants Data
	const [fetchTopMerchantsOverviewData, isLoading] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			onSuccess: (res) => {
				const _data =
					res?.data?.dashboard_object?.gtv_top_merchants || [];

				const cacheKey = getCacheKey(productFilter, dateFrom, dateTo);

				// Prevent unnecessary re-renders by checking existing data
				setBusinessDashboardData((prev) => {
					if (prev.topMerchantsCache?.[cacheKey]) {
						return prev; // Skip update if already cached
					}
					return {
						...prev,
						topMerchantsCache: {
							...(prev.topMerchantsCache || {}),
							[cacheKey]: _data,
						},
					};
				});

				setTopMerchantsData(_data);
			},
		}
	);

	// Init the component by fetching data from cache or API
	useEffect(() => {
		if (!dateFrom || !dateTo) return;

		const cacheKey = getCacheKey(productFilter, dateFrom, dateTo);

		// Use cached data if available
		if (businessDashboardData?.topMerchantsCache?.[cacheKey]) {
			setTopMerchantsData(
				businessDashboardData.topMerchantsCache[cacheKey]
			);
			return;
		}

		const _typeid = productFilter ? { typeid: productFilter } : {};

		fetchTopMerchantsOverviewData({
			body: {
				interaction_type_id: 682,
				requestPayload: {
					gtv_top_merchants: {
						datefrom: dateFrom,
						dateto: dateTo,
						..._typeid,
					},
				},
			},
		});
	}, [
		dateFrom,
		dateTo,
		productFilter,
		totalBusiness,
		businessDashboardData.topMerchantsCache,
	]);

	const router = useRouter();

	/**
	 * Open a user's profile by using their registered mobile number
	 * @param {string} mobile - The mobile number of the user
	 * @returns {void}
	 */
	const onViewProfile = (mobile) => {
		router.push(`/admin/my-network/profile?mobile=${mobile}`);
	};

	// MARK: jsx
	return (
		<Flex
			direction="column"
			p="20px"
			w="100%"
			h="100%"
			bg="white"
			borderRadius="10"
			border="basic"
			gap="4"
		>
			<Flex direction="column" gap={{ base: "2", md: "0" }} w="100%">
				{/* Desktop: All in one row */}
				<Flex
					display={{ base: "none", md: "flex" }}
					justify="space-between"
					align="center"
					gap="4"
				>
					<DragHandle isDraggable={isDraggable}>
						<Flex
							fontSize="lg"
							fontWeight="semibold"
							align="center"
							gap="0.4em"
							flex="1"
						>
							<LuTrophy color="#e27c7c" />
							GTV Leaderboard
						</Flex>
						<Select
							variant="filled"
							value={productFilter}
							onChange={(e) => setProductFilter(e.target.value)}
							size="xs"
							w="auto"
						>
							{productFilterList.map(({ label, value }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</Select>
					</DragHandle>
				</Flex>

				{/* Mobile: Title + grip on first row, Select on second row */}
				<Flex
					display={{ base: "flex", md: "none" }}
					direction="column"
					gap="2"
				>
					<DragHandle isDraggable={isDraggable}>
						<Flex
							fontSize="lg"
							fontWeight="semibold"
							align="center"
							gap="0.4em"
						>
							<LuTrophy color="#e27c7c" />
							GTV Leaderboard
						</Flex>
					</DragHandle>
					<Select
						variant="filled"
						value={productFilter}
						onChange={(e) => setProductFilter(e.target.value)}
						size="xs"
						w="100%"
					>
						{productFilterList.map(({ label, value }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</Select>
				</Flex>
			</Flex>
			{/* <Divider /> */}

			{/* Top-merchants horizontal dual bar chart (GTV % & Transactions %) */}

			<Flex direction="column" align="center" gap="4">
				{processedMerchantData?.length > 0 ? (
					showNewDashboard ? (
						// New table with graphs & enhanced UI
						<>
							<TopMerchantsChart
								agentList={processedMerchantData}
								onViewProfile={onViewProfile}
							/>
							<TopMerchantsTable
								data={processedMerchantData}
								totalGtv={+totalBusiness?.gtv?.amount ?? 0}
								totalTransactions={
									+totalBusiness?.transactions
										?.transactions ?? 0
								}
								isLoading={isLoading}
								onViewProfile={onViewProfile}
							/>
						</>
					) : (
						// Old generic table
						<Table
							data={topMerchantsData}
							renderer={topMerchantsTableParameterList}
							isLoading={isLoading}
							width="100%"
							maxWidth="100%"
						/>
					)
				) : (
					<Text
						color="gray.500"
						fontSize="md"
						w="100%"
						align="center"
					>
						Nothing Found
					</Text>
				)}
			</Flex>
		</Flex>
	);
};

export default TopMerchants;
