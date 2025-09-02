import { Divider, Flex, Select, Text } from "@chakra-ui/react";
import { Table } from "components";
import { Endpoints } from "constants";
import { useApiFetch, useFeatureFlag } from "hooks";
import { useEffect, useState } from "react";
import { LuTrophy } from "react-icons/lu";
import { useDashboard } from "..";
import { TopMerchantsTable } from "./TopMerchantsTable";

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
}) => {
	const [productFilter, setProductFilter] = useState("");
	const [topMerchantsData, setTopMerchantsData] = useState([]);
	const { businessDashboardData, setBusinessDashboardData } = useDashboard();

	const [showNewDashboard] = useFeatureFlag("DASHBOARD_V2");

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
	}, [dateFrom, dateTo, productFilter]);

	return (
		<Flex
			direction="column"
			p="20px"
			w="100%"
			bg="white"
			borderRadius="10"
			border="basic"
			gap="4"
		>
			<Flex
				direction={{ base: "column", md: "row" }}
				justify="space-between"
				gap={{ base: "2", md: "4" }}
				w="100%"
			>
				<Flex
					fontSize="lg"
					fontWeight="semibold"
					align="center"
					gap="0.4em"
				>
					<LuTrophy color="#f97415" />
					GTV Leaderboard
				</Flex>

				<Flex w={{ base: "100%", md: "auto" }}>
					<Select
						variant="filled"
						value={productFilter}
						onChange={(e) => setProductFilter(e.target.value)}
						size="xs"
					>
						{productFilterList.map(({ label, value }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</Select>
				</Flex>
			</Flex>
			<Divider />
			<Flex direction="column">
				{topMerchantsData?.length > 0 ? (
					showNewDashboard ? (
						// New table with graphs & enhanced UI
						<TopMerchantsTable
							data={topMerchantsData}
							totalGtv={+totalBusiness?.gtv?.amount ?? 0}
							totalTransactions={
								+totalBusiness?.transactions?.transactions ?? 0
							}
							isLoading={isLoading}
						/>
					) : (
						// Old generic table
						<Table
							data={topMerchantsData}
							renderer={topMerchantsTableParameterList}
							isLoading={isLoading}
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
