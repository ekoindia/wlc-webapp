import { Box, Flex } from "@chakra-ui/react";
import {
	getLocationStyle,
	getNameStyle,
	getStatusStyle,
} from "components/Tables/Tables";
import { Menus } from "../../";

const NetworkCard = (props) => {
	const { item } = props;

	return (
		<>
			<Flex justifyContent="space-between">
				<Box color="accent.DEFAULT" fontSize={{ base: "md " }}>
					{getNameStyle(item.name)}
				</Box>
				<Menus
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
