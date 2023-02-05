import { Box, Flex } from "@chakra-ui/react";
import {
	getLocationStyle,
	getNameStyle,
	getStatusStyle,
} from "components/Tables/Tables";
import { Cards, Menus } from "../../";

const NetworkCard = (props) => {
	// const { item, index } = props;
	const index = 123;
	const item = {
		agent_mobile: 123123,
		agent_name: "jhkajsdhfl",
		onboarded_on: "2020/12/12",
		agent_type: "Seller",
		eko_code: 123123,
		account_status: "Active",
		location: "Delhi NCR",
	};
	return (
		<Cards key={index} width="100%" height="auto" p="15px">
			<Flex justifyContent="space-between">
				<Box color="accent.DEFAULT" fontSize={{ base: "md " }}>
					{getNameStyle(item.agent_name)}
				</Box>
				<Menus type="inverted" />
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
				<Flex gap="2">
					<Box as="span" color="light">
						Eko Code:
					</Box>
					<Box as="span" color="dark">
						{item.eko_code}
					</Box>
				</Flex>
				<Flex justifyContent="space-between" mt="10px" py="10px">
					{getStatusStyle(item.account_status)}
					{getLocationStyle(item.location)}
				</Flex>
			</Flex>
		</Cards>
	);
};

export default NetworkCard;
