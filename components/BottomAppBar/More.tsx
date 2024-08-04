import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { InteractionBehavior } from "constants/trxnFramework";
import { useUser } from "contexts/UserContext";
import { useNavigationLists } from "hooks";
import { useRef } from "react";
import { BottomAppBarDrawerList } from ".";
import { Drawer, Icon, StatusCard } from "..";

// Ignore both home & dashboard in more option as it is already visible
const IGNORE_LIST = [1, 8];

// Generates a grid interaction object by consolidating IDs from a list of interactions.
const generateGridInteraction = (list) => {
	const gridInteractions = {
		behavior: InteractionBehavior.GRID,
		group_interaction_ids: "",
		label: "Others",
		icon: "others",
	};

	list.forEach((listElement) => {
		if (listElement?.id) {
			if (gridInteractions.group_interaction_ids) {
				gridInteractions.group_interaction_ids += ",";
			}
			gridInteractions.group_interaction_ids += listElement.id;
		}
	});

	return { gridInteractions };
};

/**
 * The More component renders a button that opens a drawer containing additional menu items.
 */
const More = () => {
	const btnRef = useRef<HTMLButtonElement>(null);
	const { isAdmin } = useUser();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { menuList, otherList } = useNavigationLists(IGNORE_LIST);
	const { gridInteractions: other } = generateGridInteraction(otherList);
	const list = [
		...menuList,
		// Adding Transaction History, as it will not be found in role_tx_list when handling group_interaction_ids, due to which Transaction History appears as a separate item outside of the "Others" option.
		{
			icon: "transaction-history",
			label: "Transaction History",
			description: "Statement of your previous transactions",
			link: `${isAdmin ? "/admin" : ""}${Endpoints.HISTORY}`,
		},
		other,
	];

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
