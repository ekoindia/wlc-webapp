import { Flex, Select, Text } from "@chakra-ui/react";
import { Table } from "components";
import { Endpoints } from "constants";
import { useApiFetch } from "hooks";
import { useEffect, useState } from "react";

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
		label: "Total\nTransaction",
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

/**
 * TopMerchants component displays a table of top merchants based on GTV.
 * @param {object} props - Properties passed to the component.
 * @param {string} [props.className] - Optional classes to pass to this component.
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
	const [productFilter, setProductFilter] = useState("81");
	const [topMerchantsData, setTopMerchantsData] = useState([]);

	// MARK: Fetching Top Merchants Data
	const [fetchProductOverviewData] = useApiFetch(Endpoints.TRANSACTION_JSON, {
		onSuccess: (res) => {
			const _data = res?.data?.dashboard_object?.gtv_top_merchants || [];
			setTopMerchantsData(_data);
		},
	});

	useEffect(() => {
		if (!dateFrom || !dateTo) return;

		fetchProductOverviewData({
			body: {
				interaction_type_id: 682,
				requestPayload: {
					gtv_top_merchants: {
						datefrom: dateFrom,
						dateto: dateTo,
						typeid: productFilter,
					},
				},
			},
		});
	}, [dateFrom, dateTo, productFilter]);

	const onFilterChange = (typeid) => {
		setProductFilter(typeid);
	};

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
					GTV-wise Top Merchants
				</Text>
				<Flex w={{ base: "100%", md: "auto" }}>
					<Select
						variant="filled"
						value={productFilter}
						onChange={(e) => onFilterChange(e.target.value)}
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
			<Table
				{...{
					data: topMerchantsData,
					renderer: topMerchantsTableParameterList,
				}}
			/>
		</Flex>
	);
};

export default TopMerchants;
