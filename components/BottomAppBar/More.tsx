import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { AccordionMenu, Icon, StatusCard } from "components";
import { useUser } from "contexts/UserContext";
import { useNavigationLists } from "hooks";
import { useRef } from "react";
import { BottomAppBarDrawer, useAccordionMenuConverter } from ".";

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
 * const updatedList = attachLinkToMenuItems(list, true);
 * updatedList = [
 *   { id: 1, label: 'Label 1', link: '/custom-link' },
 *   { id: 2, label: 'Label 2', link: '/admin/transaction/2' },
 * ];
 */
const attachLinkToMenuItems = (list: any[], isAdmin: boolean): any[] => {
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

interface ButtonProps {
	isSideBarMode?: boolean;
}

/**
 * The More component renders a button that opens a drawer containing additional menu items.
 * @param {object} props - The props of the component.
 * @param {string} [props.placement] - The placement of the drawer.
 * @param props.isSideBarMode
 */
const More = ({ isSideBarMode = false }: ButtonProps) => {
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
			subItems: attachLinkToMenuItems(otherList, isAdmin),
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
				<Icon ref={btnRef} name="others" size="sm" />
				<Text
					fontSize="10px"
					fontWeight="medium"
					noOfLines={2}
					userSelect="none"
				>
					More
				</Text>
			</Flex>
			<BottomAppBarDrawer
				id="more-drawer"
				title="More"
				isOpen={isOpen}
				onOpen={onOpen}
				onClose={onClose}
				isSideBarMode={isSideBarMode}
				finalFocusRef={btnRef}
			>
				<Box bg="primary.DEFAULT">
					<StatusCard onLoadBalanceClick={() => onClose()} />
				</Box>
				<AccordionMenu {...{ list, onMenuItemClick }} />
			</BottomAppBarDrawer>
		</>
	);
};

export default More;
