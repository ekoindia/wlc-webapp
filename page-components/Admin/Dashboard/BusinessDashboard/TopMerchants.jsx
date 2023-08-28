import { Flex, Text } from "@chakra-ui/react";
import { Table } from "components";

/**
 * A TopMerchants page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TopMerchants></TopMerchants>`
 */
const TopMerchants = ({ data }) => {
	const renderer = [
		{ label: "Sr. No.", show: "#" },
		{ name: "name", label: "Name", sorting: true, show: "Avatar" },
		{
			name: "gtv",
			label: "GTV",
			sorting: true,
			show: "Amount",
		},
		{
			name: "totalTransactions",
			label: "Total Transaction",
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
			label: "Pending Transactions",
			sorting: true,
		},
		{
			name: "onboardingDate",
			label: "Onboarding Date",
			sorting: true,
			show: "Date",
		},
		{
			name: "distributorMapped",
			label: "Distributor Mapped",
			sorting: true,
		},
	];
	return (
		<Flex
			direction="column"
			p="20px"
			w="100%"
			bg="white"
			borderRadius="10"
			border="basic"
		>
			<Flex
				direction={{ base: "column", md: "row" }}
				justify="space-between"
			>
				<Text fontSize="xl" fontWeight="semibold">
					GTV wise Top Merchants
				</Text>
				{/* TODO: Need Pills */}
			</Flex>
			<Table
				renderer={renderer}
				data={data}
				// ResponsiveCard={BusinessDashboardCard}
			/>
		</Flex>
	);
};

export default TopMerchants;
