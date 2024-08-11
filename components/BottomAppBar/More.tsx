import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { useUser } from "contexts/UserContext";
import { useNavigationLists } from "hooks";
import { useRef } from "react";
import { useAccordionMenuConverter } from ".";
import { AccordionMenu, Drawer, Icon, StatusCard } from "..";

// Ignore both home & dashboard in more option as it is already visible
const IGNORE_LIST = [1, 8];

/**
 * Adds or modifies the `link` property of items in a list based on their `id` and a specified admin prefix.
 * If a `link` already exists for an item, it is retained; otherwise, a link is generated using the item's `id`.
 * @param {Array} list - The list of items, where each item is expected to have an `id` property.
 * @param {boolean} isAdmin - A flag to determine if the admin prefix should be applied to the generated links.
 * @returns {Array} The updated list with added or modified `link` properties for each item.
 * @example
 * const list = [
 *   { id: 1, label: 'Label 1', link: '/custom-link' },
 *   { id: 2, label: 'Label 2' },
 * ];
 * const updatedList = addLinksToMenu(list, true);
 * updatedList = [
 *   { id: 1, label: 'Label 1', link: '/custom-link' },
 *   { id: 2, label: 'Label 2', link: '/admin/transaction/2' },
 * ];
 */
const addLinksToMenu = (list: any[], isAdmin: boolean): any[] => {
	const prefix = isAdmin ? "/admin" : "";

	const getLink = (id: number, link?: string) => {
		return link ? link : `${prefix}/transaction/${id}`;
	};

	return list.map((item) => {
		if (item.id !== undefined) {
			item.link = getLink(item.id, item.link);
		}

		return item;
	});
};

/**
 * The More component renders a button that opens a drawer containing additional menu items.
 */
const More = () => {
	const btnRef = useRef<HTMLButtonElement>(null);
	const { isAdmin } = useUser();

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { menuList, otherList } = useNavigationLists(IGNORE_LIST);
	const combinedList = [
		...menuList,
		{
			label: "Others",
			icon: "others",
			showAll: true,
			subItems: addLinksToMenu(otherList, isAdmin),
			isPanelExpanded: menuList?.length < 1,
		},
	];

	const list = useAccordionMenuConverter(combinedList);

	const onMenuItemClick = () => onClose();
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
				<AccordionMenu {...{ list, onMenuItemClick }} />
			</Drawer>
		</>
	);
};

export default More;
