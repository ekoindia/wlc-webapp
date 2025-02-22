import { Divider, Flex, Select, Text } from "@chakra-ui/react";
import { Table } from "components";
import { Endpoints } from "constants";
import { useApiFetch } from "hooks";
import { useEffect, useState } from "react";
import { useDashboard } from "..";

const topMerchantsTableParameterList = [
	{ label: "#", show: "#" },
	{ name: "name", label: "Name", sorting: true, show: "Avatar" },
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
	// Extract only the date portion (first 10 characters: "YYYY-MM-DD")
	const fromKey = dateFrom.slice(0, 10);
	const toKey = dateTo.slice(0, 10);

	return `${productFilter || "all"}-${fromKey}-${toKey}`;
};

/**
 * TopMerchants component displays a table of top merchants based on GTV.
 * @param {object} props - Properties passed to the component.
 * @param {Array} props.productFilterList - List of product filters.
 * @param {string} props.dateFrom - Start date for filtering data.
 * @param {string} props.dateTo - End date for filtering data.
 * @example
 * <TopMerchants
 *   dateFrom="2023-01-01"
 *   dateTo="2023-01-31"
 *   productFilterList={[{ label: "Product 1", value: "81" }]}
 * />
 */
const TopMerchants = ({ dateFrom, dateTo, productFilterList }) => {
	const [productFilter, setProductFilter] = useState("");
	const [topMerchantsData, setTopMerchantsData] = useState([]);
	const { businessDashboardData, setBusinessDashboardData } = useDashboard();

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
				<Text fontSize="xl" fontWeight="semibold">
					GTV-wise Top Retailers
				</Text>

				<Flex w={{ base: "100%", md: "auto" }}>
					<Select
						variant="filled"
						value={productFilter}
						onChange={(e) => setProductFilter(e.target.value)}
						size="sm"
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
					<Table
						data={topMerchantsData}
						renderer={topMerchantsTableParameterList}
						isLoading={isLoading}
					/>
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
