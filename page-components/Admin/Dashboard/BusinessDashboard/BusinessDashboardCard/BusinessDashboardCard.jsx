import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { getNameStyle, getStatusStyle } from "helpers";
/**
 * A <BusinessDashboardCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BusinessDashboardCard></BusinessDashboardCard>`
 */
const BusinessDashboardCard = ({ className = "", ...props }) => {
	const [count, setCount] = useState(0);

	const item = {
		transactionId: 270000,
		TotalTransaction: 1277000,
		name: "DMT Commission",
		description:
			"Saurabh Mullick, 9654110669 A/C:20082437069 STATE BANK OF INDIA",
		racases: "20",
		date: "5/10/2017",
		DistributorMapped: "Izma Finance",
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
						GTV:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{/* {item.agent_mobile} */}
						&#x20B9;{item.transactionId}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Total Transaction:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{/* {item.agent_mobile} */}
						{item.TotalTransaction}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						RA cases:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{/* {item.agent_mobile} */}
						{item.racases}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Onboarding Date:
					</Box>
					<Box as="span" color="dark" fontWeight={"medium"}>
						{/* {item.agent_mobile} */}
						{item.date}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="dark">
						Distributor Mapped:
						{/* {item.agent_mobile} */}
						<Box as="span" color="dark" fontWeight={"medium"}>
							{item.DistributorMapped}
						</Box>
						{item.amount}
					</Box>
				</Flex>

				<Flex justifyContent="space-between" py="10px">
					{getStatusStyle(item.account_status)}
				</Flex>
			</Flex>
		</>
	);
};

export default BusinessDashboardCard;
