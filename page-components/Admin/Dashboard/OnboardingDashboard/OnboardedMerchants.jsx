import { Flex, Text } from "@chakra-ui/react";
import { Table } from "components";
import { OnboardingDashboardCard } from ".";

/**
 * A OnboardedMerchants page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardedMerchants></OnboardedMerchants>`
 */
const OnboardedMerchants = ({
	onboardingMerchantData,
	totalRecords,
	pageNumber,
	setPageNumber,
	isLoading,
}) => {
	// console.log("[OnboardedMerchants] isLoading", isLoading);
	// console.log("[OnboardedMerchants] data", onboardingMerchantData);

	const renderer = [
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
		},
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
		{ name: "onboardedOn", field: "Onboarded on", show: "Date" },
		{ name: "businessDetailsCaptured", field: "Business Detail Captured" },
		{ name: "businessName", field: "Business Name" },
		{ name: "daysinFunnel", field: "Onboarding Funnel" },
		{ name: "panCaptured", field: "PAN Captured" },
		{ name: "aadhaarCaptured", field: "Aadhaar Captured" },
		{ name: "agreementSigned", field: "Agreement Signed" },
		{ name: "onboarded", field: "Onboarded" },
		{ name: "transacting", field: "Non Transacting Live" },
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
				visibleColumns={5}
				data={onboardingMerchantData}
				variant="stripedActionExpand"
				ResponsiveCard={OnboardingDashboardCard}
				totalRecords={totalRecords}
				pageNumber={pageNumber}
				setPageNumber={setPageNumber}
				isLoading={isLoading}
			/>
		</Flex>
	);
};

export default OnboardedMerchants;
