import { Box, Flex } from "@chakra-ui/react";
import { getLocationStyle, getNameStyle, getStatusStyle } from "helpers";

/**
 * A TransactionHistoryCard page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionHistoryCard></TransactionHistoryCard>`
 */
const TransactionHistoryCard = ({ item }) => {
	return (
		<Flex direction="column" bg="white" borderRadius="10px" p="20px">
			<Flex justifyContent="space-between">
				<Box color="primary.DEFAULT" fontSize={{ base: "md " }}>
					{getNameStyle(item.agent_name)}
				</Box>
				{/* <Menus
					iconName="more-vert"
					as={IconButton}
					iconStyles={{ width: "4px", height: "18px" }}
					type="inverted"
					onClick={(e) => {
						e.stopPropagation();
					}}
				/> */}
			</Flex>
			<Flex direction="column" fontSize={{ base: "sm" }} pl="42px">
				<Flex gap="2">
					<Box as="span" color="light">
						Mobile Number:
					</Box>
					<Box as="span" color="dark">
						{item.agent_mobile}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Type:
					</Box>
					<Box as="span" color="dark">
						{item.agent_type}
					</Box>
				</Flex>
				{/* <Flex gap="2">
					<Box as="span" color="light">
						Account Number:
					</Box>
					<Box as="span" color="dark">
						{item.onboarded_on}
					</Box>
				</Flex> */}
				{/* <Flex gap="2">
					<Box as="span" color="light">
						User Code:
					</Box>
					<Box as="span" color="dark">
						{item.eko_code} 
					</Box>
				</Flex> */}
				<Flex justifyContent="space-between" mt="10px" py="10px">
					{getStatusStyle(item.account_status)}
					{getLocationStyle(item.location)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default TransactionHistoryCard;
