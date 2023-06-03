import { Flex } from "@chakra-ui/react";
import { Filter, OnboardedMerchants } from ".";

/**
 * A OnboardingDashboard page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardingDashboard></OnboardingDashboard>`
 */
const OnboardingDashboard = ({ data }) => {
	console.log("data", data);

	return (
		<Flex direction="column">
			<Flex px={{ base: "0px", md: "20px" }}>
				<Filter data={data[0] || {}} />
			</Flex>
			<Flex p="20px">
				<OnboardedMerchants data={data[1] || {}} />
			</Flex>
		</Flex>
	);
};

export default OnboardingDashboard;
