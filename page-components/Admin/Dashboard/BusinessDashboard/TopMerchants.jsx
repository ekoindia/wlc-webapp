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
 * A TopMerchants page-component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @param prop.data
 * @param prop.filterList
 * @param prop.filters
 * @param prop.onFilterChange
 * @param prop.currTab
 * @param prop.productFilterList
 * @param prop.dateFrom
 * @param prop.dateTo
 * @example	`<TopMerchants></TopMerchants>`
 */
const TopMerchants = ({ dateFrom, dateTo, productFilterList }) => {
	const [requestPayload, setRequestPayload] = useState({});
	const [productFilter, setProductFilter] = useState("81");
	const [topMerchantsData, setTopMerchantsData] = useState([]);

	// MARK: Fetching Product Overview Data
	const [fetchProductOverviewData] = useApiFetch(Endpoints.TRANSACTION_JSON, {
		body: {
			interaction_type_id: 682,
			requestPayload: requestPayload,
		},
		onSuccess: (res) => {
			const _data = res?.data?.dashboard_object?.gtv_top_merchants || [];
			setTopMerchantsData(_data);
		},
	});

	useEffect(() => {
		if (dateFrom && dateTo) {
			setRequestPayload(() => ({
				gtv_top_merchants: {
					datefrom: dateFrom,
					dateto: dateTo,
					typeid: productFilter,
				},
			}));
		}
	}, [dateFrom, dateTo, productFilter]);

	useEffect(() => {
		if (dateFrom && dateTo) {
			fetchProductOverviewData();
		}
	}, [requestPayload]);

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
