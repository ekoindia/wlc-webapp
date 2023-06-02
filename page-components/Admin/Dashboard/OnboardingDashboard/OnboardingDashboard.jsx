import { Flex } from "@chakra-ui/react";
import { Filter, OnboardedMerchants } from ".";

/**
 * A OnboardingDashboard page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardingDashboard></OnboardingDashboard>`
 */
const OnboardingDashboard = ({
	data,
	filterStatus,
	setFilterStatus,
	totalRecords,
	pageNumber,
	setPageNumber,
}) => {
	console.log("[OnboardingDashboard] data", data);
	const filterData = data?.[0] ?? {};
	const onboardingMerchantData = data?.[1] ?? {};

	return (
		<Flex direction="column">
			<Flex px={{ base: "0px", md: "20px" }}>
				<Filter {...{ filterData, filterStatus, setFilterStatus }} />
			</Flex>
			<Flex p="20px">
				<OnboardedMerchants
					{...{
						onboardingMerchantData,
						totalRecords,
						pageNumber,
						setPageNumber,
					}}
				/>
			</Flex>
		</Flex>
	);
};

export default OnboardingDashboard;
