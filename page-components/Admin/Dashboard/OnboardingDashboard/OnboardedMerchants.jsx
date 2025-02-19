import { Flex } from "@chakra-ui/react";
import { Table } from "components";
import { OnboardingDashboardCard } from ".";

const onboarded_merchants_parameter_list = [
	{
		name: "mobile",
		label: "Mobile No.",
		sorting: true,
	},
	{
		name: "user_code",
		label: "User Code",
		sorting: true,
	},
	{
		name: "agent_type",
		label: "Agent Type",
		sorting: true,
	},
	{
		name: "account_status_desc",
		label: "Account Status",
		sorting: true,
		show: "Tag",
	},
	{
		name: "last_updated",
		label: "Last Updated",
		sorting: true,
		show: "DateTime",
	},
	{
		name: "business_type",
		label: "Business Type",
		sorting: true,
	},
	{
		name: "location",
		label: "Location",
		sorting: true,
	},
];

/**
 * A OnboardedMerchants page-component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @param prop.onboardingMerchantData
 * @param prop.pageNumber
 * @param prop.setPageNumber
 * @param prop.isLoading
 * @example	`<OnboardedMerchants></OnboardedMerchants>`
 */
const OnboardedMerchants = ({
	onboardingMerchantData,
	pageNumber,
	setPageNumber,
	isLoading,
}) => {
	return (
		<Flex direction="column" p="20px" w="100%">
			<Table
				renderer={onboarded_merchants_parameter_list}
				visibleColumns={5}
				data={onboardingMerchantData?.tableData}
				variant="stripedActionNone"
				ResponsiveCard={OnboardingDashboardCard}
				totalRecords={onboardingMerchantData?.totalRecords}
				pageNumber={pageNumber}
				setPageNumber={setPageNumber}
				isLoading={isLoading}
			/>
		</Flex>
	);
};

export default OnboardedMerchants;
