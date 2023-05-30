import { Flex, Text } from "@chakra-ui/react";
import { Table } from "components";
import { OnboardingDashboardCard } from "./OnboardingDashboardCard";

/**
 * A OnboardedMerchants page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardedMerchants></OnboardedMerchants>`
 */
const OnboardedMerchants = ({ data }) => {
	console.log("[OnboardedMerchants] data", data.onboardedMerchants);
	const _data = data?.onboardedMerchants || [];
	const renderer = [
		{ field: "", show: "Accordian" },
		{
			name: "merchantName",
			field: "Merchant's Name",
			sorting: true,
			show: "Avatar",
		},
		{
			name: "ekoCode",
			field: "User Code",
			sorting: true,
			show: "Amount",
		},
		// {
		// 	name: "refId",
		// 	field: "Ref. ID", //TODO check
		// 	sorting: true,
		// },
		{
			name: "location",
			field: "Location",
			sorting: true,
		},
		{
			name: "businessType",
			field: "Business Type",
			sorting: true,
		},
		{ name: "onboardedOn", field: "Onboarded on", sorting: true },
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
			<Text fontSize="xl" fontWeight="semibold">
				Onboarded Merchants
			</Text>
			<Table
				renderer={renderer}
				data={_data}
				variant="evenStriped"
				isScrollrequired={true}
				border="none"
				ResponsiveCard={OnboardingDashboardCard}
			/>
		</Flex>
	);
};

export default OnboardedMerchants;
