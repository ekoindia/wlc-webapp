import { Box, Flex } from "@chakra-ui/react";

/**
 * A <CommissionsCard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<CommissionsCard></CommissionsCard>` TODO: Fix example
 */
const CommissionsCard = ({ item }) => {
	return (
		<Flex direction="column" fontSize={{ base: "sm" }} pl="42px">
			<Flex gap="2">
				<Box as="span" color="light">
					Transaction value:
				</Box>
				<Box as="span" color="dark">
					{item && item.transaction_value}
				</Box>
			</Flex>
			<Flex gap="2">
				<Box as="span" color="light">
					Commission:
				</Box>
				<Box as="span" color="dark">
					{item && item.commission}
				</Box>
			</Flex>
			<Flex gap="2">
				<Box as="span" color="light">
					Biller Name:
				</Box>
				<Box as="span" color="dark">
					{item && item.biller_name}
				</Box>
			</Flex>
		</Flex>
	);
};

export default CommissionsCard;
