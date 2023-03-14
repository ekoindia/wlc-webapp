import React, { useEffect, useState } from "react";
import { getNameStyle, getStatusStyle } from "helpers";
import { Box, Flex } from "@chakra-ui/react";

/**
 * A <OnboardingDashboardCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardingDashboardCard></OnboardingDashboardCard>`
 */
const OnboardingDashboardCard = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0);

	const item = {
		ekocode: 10167076,
		refiD: 1277000,
		name: "Rajesh Gupta",
		Location: "Gurugram, Sector 45, Haryana",
		businesstype: "Money Transfer",
		Onboardedon: "3 Days ago",
	}; // TODO: Edit state as required

	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);

	return (
		<>
			<Flex justifyContent="space-between">
				<Box color="accent.DEFAULT" fontSize={{ base: "md " }}>
					{getNameStyle(item.name)}
				</Box>
			</Flex>

			<Flex direction="column" fontSize="12px" rowGap="2" pl="42px">
				<Flex gap="2">
					<Box as="span" color="light">
						Eko Code:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{/* {item.agent_mobile} */}
						&#x20B9;{item.ekocode}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Ref.ID:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{/* {item.agent_mobile} */}
						{item.refiD}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Location:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{/* {item.agent_mobile} */}
						{item.Location}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Business Type:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{/* {item.agent_mobile} */}
						{item.businesstype}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="dark">
						Onoarded on:
						{/* {item.agent_mobile} */}
						<Box as="span" color="dark" fontWeight={"medium"}>
							{item.Onboardedon}
						</Box>
					</Box>
				</Flex>
			</Flex>
		</>
	);
};

export default OnboardingDashboardCard;
