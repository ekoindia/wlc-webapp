import { Flex, Text } from "@chakra-ui/react";
import { Table } from "components";

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
 * @example	`<TopMerchants></TopMerchants>`
 */
const TopMerchants = ({ data }) => {
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
			>
				<Text fontSize="xl" fontWeight="semibold">
					GTV-wise Top Merchants
				</Text>
				{/* TODO: Need Pills */}
			</Flex>
			<Table
				{...{
					data,
					renderer: topMerchantsTableParameterList,
				}}
			/>
		</Flex>
	);
};

export default TopMerchants;
