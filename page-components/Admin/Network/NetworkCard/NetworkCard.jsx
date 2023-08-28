import { Box, Flex } from "@chakra-ui/react";
import { getLocationStyle, getNameStyle, getStatusStyle } from "helpers";
import { NetworkMenuWrapper } from "..";

/**
 * A <NetworkCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkCard></NetworkCard>`
 */

const NetworkCard = ({ item }) => {
	const { agent_mobile, eko_code, account_status } = item;
	return (
		<Flex direction="column" bg="white" borderRadius="10px" p="20px">
			<Flex justifyContent="space-between">
				<Box color="primary.DEFAULT" fontSize={{ base: "md " }}>
					{getNameStyle(item.agent_name)}
				</Box>
				{/* <Menus
					iconName="more-vert"
					as={IconButton}
					// iconStyles={{ width: "24px", height: "24px" }}
					type="inverted"
					onClick={(e) => {
						e.stopPropagation();
					}}
				/> */}
				<NetworkMenuWrapper
					{...{
						mobile_number: agent_mobile,
						eko_code,
						account_status,
					}}
				/>
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
				<Flex gap="2">
					<Box as="span" color="light">
						Onboarded on:
					</Box>
					<Box as="span" color="dark">
						{item.onboarded_on}
					</Box>
				</Flex>
				<Flex justifyContent="space-between" mt="10px" py="10px">
					{getStatusStyle(item.account_status)}
					{getLocationStyle(item.location)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default NetworkCard;
