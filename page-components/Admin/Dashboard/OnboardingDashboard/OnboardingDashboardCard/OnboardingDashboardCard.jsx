import { Box, Flex } from "@chakra-ui/react";
import { getNameStyle } from "helpers";

/**
 * A <OnboardingDashboardCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardingDashboardCard></OnboardingDashboardCard>`
 */
const OnboardingDashboardCard = ({ item }) => {
	return (
		<Flex direction="column" bg="white" p="10px">
			<Flex justifyContent="space-between">
				{getNameStyle(item.merchantName)}
			</Flex>

			<Flex direction="column" fontSize="xs" gap="2">
				<Flex gap="2">
					<Box as="span" color="light">
						User Code:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{item.ekoCode}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Location:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{item.location}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Business Type:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{item.businessType}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="dark">
						Onoarded on:
						<Box as="span" color="dark" fontWeight={"medium"}>
							{item.onboardedOn}
						</Box>
					</Box>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default OnboardingDashboardCard;
