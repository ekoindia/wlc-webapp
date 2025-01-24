import { Flex } from "@chakra-ui/react";
import { Table } from "components";
import { OnboardingDashboardCard } from ".";

const onboarded_merchants_parameter_list = [
	{
		name: "name",
		label: "Agents's Name",
		sorting: true,
		show: "Avatar",
	},
	{
		name: "user_code",
		label: "User Code",
		sorting: true,
	},
	{
		name: "location",
		label: "Location",
		sorting: true,
	},
	{
		name: "business_type",
		label: "Business Type",
		sorting: true,
	},
	{ name: "onboardedOn", label: "Onboarded on", show: "Date" },
	// { name: "businessDetailsCaptured", label: "Business Detail Captured" },
	// { name: "businessName", label: "Business Name" },
	// { name: "daysinFunnel", label: "Onboarding Funnel" },
	// { name: "panCaptured", label: "PAN Captured" },
	// { name: "aadhaarCaptured", label: "Aadhaar Captured" },
	// { name: "agreementSigned", label: "Agreement Signed" },
	// { name: "onboarded", label: "Onboarded" },
	// { name: "transacting", label: "Non Transacting Live" },
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
		<Flex
			direction="column"
			p="20px"
			w="100%"
			bg="white"
			borderRadius="10"
			border="basic"
		>
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
