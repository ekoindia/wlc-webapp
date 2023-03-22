import React, { useEffect } from "react";
import { Menus } from "components";
import { getLocationStyle, getNameStyle, getStatusStyle } from "helpers";
import { Box, Flex, IconButton } from "@chakra-ui/react";
/**
 * A <TransactionCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionCard></TransactionCard>`
 */
const TransactionCard = ({ className = "", ...props }) => {
	useEffect(() => {
		// TODO: Add your useEffect code here and update dependencies as required
	}, []);
	const item = {
		transactionId: 3027555195,
		datetime: "29/11/2022, 09:58:48 AM",
		activity: "DMT Commission",
		description:
			"Saurabh Mullick, 9654110669 A/C:20082437069 STATE BANK OF INDIA",
		amount: "20",
		type: "credit",
		balance: "123123",
		name: "Ajay",
	};

	return (
		<>
			<Flex justifyContent="space-between">
				<Box color="accent.DEFAULT" fontSize={{ base: "md " }}>
					{getNameStyle(item.name)}
				</Box>
				<Menus
					iconName="more-vert"
					as={IconButton}
					iconStyles={{ width: "4px", height: "18px" }}
					type="inverted"
					onClick={(e) => {
						e.stopPropagation();
					}}
				/>
			</Flex>
			<Flex direction="column" fontSize={{ base: "sm" }} pl="42px">
				<Flex gap="2">
					<Box as="span" color="light">
						Mobile Number:
					</Box>
					<Box as="span" color="dark">
						{item.transactionId}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Type:
					</Box>
					<Box as="span" color="dark">
						{item.type}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Onboarded on:
					</Box>
					<Box as="span" color="dark">
						{item.createdAt}
					</Box>
				</Flex>
				<Flex justifyContent="space-between" mt="10px" py="10px">
					{getStatusStyle(item.account_status)}
					{getLocationStyle(item.location)}
				</Flex>
			</Flex>
		</>
	);
};

export default TransactionCard;
