import { Flex } from "@chakra-ui/react";
import { EarningOverview, SuccessRate, TopMerchants, TopPanel } from ".";

/**
 * A <BusinessDashboard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BusinessDashboard></BusinessDashboard>`
 */
const BusinessDashboard = ({ data }) => {
	console.log("[BusinessDashboard] data", data);
	const { topPanel, earningOverview, topMerchants, successRate } = data || {};
	return (
		<Flex direction="column">
			<Flex
				bg={{ base: "white", md: "initial" }}
				p={{ base: "10px 0px 30px 0px", md: "0px" }}
				borderRadius="0px 0px 20px 20px"
			>
				<TopPanel data={topPanel} />
			</Flex>
			<Flex p="20px" gap="4" wrap="wrap">
				<Flex flex="2">
					<EarningOverview data={earningOverview} />
				</Flex>
				<Flex flex="1">
					<SuccessRate data={successRate} />
				</Flex>
			</Flex>
			<Flex p="0px 20px 20px">
				<TopMerchants data={topMerchants} />
			</Flex>
		</Flex>
	);
};

export default BusinessDashboard;
