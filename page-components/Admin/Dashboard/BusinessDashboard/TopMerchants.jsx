import { Flex, Text } from "@chakra-ui/react";
import { Table } from "components";
import { BusinessDashboardCard } from ".";

/**
 * A TopMerchants page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TopMerchants></TopMerchants>`
 */
const TopMerchants = ({ data }) => {
	const renderer = [
		{ field: "Sr. No.", show: "#" },
		{ name: "name", field: "Name", sorting: true, show: "Avatar" },
		{
			name: "gtv",
			field: "GTV",
			sorting: true,
			show: "Amount",
		},
		{
			name: "totalTransactions",
			field: "Total Transaction",
			sorting: true,
		},
		{
			name: "status",
			field: "Status",
			show: "Tag",
			sorting: true,
		},
		{
			name: "raCases",
			field: "RA Cases",
			sorting: true,
		},
		{ name: "onboardingDate", field: "Onboarding Date", sorting: true },
		{
			name: "distributorMapped",
			field: "Distributor Mapped",
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
				variant="evenStriped"
				isScrollrequired={true}
				border="none"
				ResponsiveCard={BusinessDashboardCard}
			/>
		</Flex>
	);
};

export default TopMerchants;
