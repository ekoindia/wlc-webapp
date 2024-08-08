import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
// import { useMenuContext } from "contexts/MenuContext";
import { useNavigationLists } from "hooks";
import { useRef } from "react";
import { BottomAppBarDrawerList } from ".";
import { Drawer, Icon, StatusCard } from "..";
// import { convertToAccordionMenuList } from "./BottomAppBarUtils";

// Ignore both home & dashboard in more option as it is already visible
const IGNORE_LIST = [1, 8];

/**
 * The More component renders a button that opens a drawer containing additional menu items.
 */
const More = () => {
	const btnRef = useRef<HTMLButtonElement>(null);
	// const { isAdmin } = useUser();

	// const { interactions } = useMenuContext();
	// const { role_tx_list } = interactions;

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { menuList, otherList } = useNavigationLists(IGNORE_LIST);
	console.log("otherList", otherList);
	// const { gridInteractions: other } = generateGridInteraction(otherList);
	const list = [...menuList, ...otherList];

	// const AccordionMenuList = convertToAccordionMenuList(list, role_tx_list);
	// console.log("AccordionMenuList", AccordionMenuList);
	return (
		<>
			<Flex
				direction="column"
				gap="1"
				w="100%"
				h="100%"
				align="center"
				justify="center"
				onClick={onOpen}
			>
				<Icon ref={btnRef} name="others" size="sm" color="light" />
				<Text fontSize="10px" fontWeight="medium" noOfLines={2}>
					More
				</Text>
			</Flex>
			<Drawer
				id="more-drawer"
				title="More"
				isOpen={isOpen}
				onOpen={onOpen}
				onClose={onClose}
				isFullHeight={false}
				finalFocusRef={btnRef}
			>
				<Box bg="primary.DEFAULT">
					<StatusCard onLoadBalanceClick={() => onClose()} />
				</Box>
				<BottomAppBarDrawerList {...{ list, onClose }} />
			</Drawer>
		</>
	);
};

export default More;
