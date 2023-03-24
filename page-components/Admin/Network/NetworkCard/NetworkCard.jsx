import { Box, Flex, IconButton } from "@chakra-ui/react";
import { Menus } from "components";
import { getLocationStyle, getNameStyle, getStatusStyle } from "helpers";

/**
 * A <NetworkCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkCard></NetworkCard>`
 */

const NetworkCard = (props) => {
	// const { item } = props;

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
						{item.mobile_number}
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

export default NetworkCard;
