import { Box, Flex } from "@chakra-ui/react";

/**
 * A <AccountStatementCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<AccountStatementCard></AccountStatementCard>`
 */

const AccountStatementCard = ({ item }) => {
	return (
		<Flex direction="column" fontSize="12px" rowGap="2">
			<Flex gap="2">
				<Box as="span" color="light">
					TID:
				</Box>
				<Box as="span" color="dark" fontWeight="medium">
					{item.transaction_id}
				</Box>
			</Flex>
			<Flex gap="2">
				<Box as="span" color="light">
					Date & Time:
				</Box>
				<Box as="span" color="dark" fontWeight="medium">
					{item.date_time}
				</Box>
			</Flex>
			<Flex gap="2">
				<Box as="span" color="light">
					Activity:
				</Box>
				<Box as="span" color="dark" fontWeight="medium">
					{item.activity}
				</Box>
			</Flex>
			<Flex direction={"column"}>
				<Box as="span" color="light">
					Description:
				</Box>
				<Box as="span" color="dark" fontWeight="medium">
					{item.description}
				</Box>
			</Flex>
			<Flex mt="10px" fontSize="16px" fontWeight="medium">
				<Box as="span" color="dark">
					&#x20B9;{item.amount}
				</Box>
			</Flex>
		</Flex>
	);
};

export default AccountStatementCard;
