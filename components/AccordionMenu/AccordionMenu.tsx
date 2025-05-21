import {
	Avatar,
	Divider,
	Flex,
	Grid,
	Text,
	useBreakpointValue,
} from "@chakra-ui/react";
import { useUser } from "contexts/UserContext";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import React from "react";
import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Icon,
	Tags,
} from "..";

/**
 * AccordionMenu component renders a list of interactions within an Accordion.
 * @component
 * @param {object} props - The component props
 * @param {Array} props.list - The list of interaction items to be displayed.
 * @param {Function} props.onMenuItemClick - Function to be called when a menu item is clicked.
 * @returns {JSX.Element} The rendered AccordionMenu component.
 * @example
 * const list = [
 *   { id: 1, label: 'Label 1', icon: 'icon1', link: 'link1' },
 *   { id: 2, label: 'Label 2', icon: 'icon2', subItems: [{ id: 3, label: 'Subitem', icon: 'icon3' }] },
 * ];
 * return (
 *   <AccordionMenu list={list} onMenuItemClick={handleClose} />
 * )
 */
const AccordionMenu = ({ list, onMenuItemClick }): JSX.Element => {
	return (
		<Accordion px="4" allowToggle>
			{list?.map(
				(
					{
						id,
						label,
						icon,
						link,
						subItems,
						showAll = false,
						isPanelExpanded = null,
						beta = false,
					},
					index: number
				) => {
					return (
						<React.Fragment key={index}>
							{subItems?.length > 0 ? (
								<MenuPanel
									{...{
										id,
										label,
										icon,
										subItems,
										showAll,
										isPanelExpanded,
										onMenuItemClick,
									}}
								/>
							) : (
								<MenuItem
									{...{
										id,
										label,
										icon,
										link,
										onMenuItemClick,
										isBeta: beta,
									}}
								/>
							)}
							{list.length - 1 !== index && (
								<Divider variant="dashed" />
							)}
						</React.Fragment>
					);
				}
			)}
		</Accordion>
	);
};

export default AccordionMenu;

/* ####################### MenuItem ####################### */

type MenuItemProps = {
	id: number;
	label: string;
	icon: string;
	link?: string;
	onMenuItemClick?: () => void;
	isBeta?: boolean;
};

/**
 * `MenuItem` is a component that represents a single menu item.
 * It renders an accordion item that handles navigation and menu interactions.
 * @param {MenuItemProps} props - Props for configuring the MenuItem component.
 * @param {number} props.id - The ID of the MenuItem.
 * @param {string} props.label - The label for the MenuItem.
 * @param {string} props.icon - The icon for the MenuItem.
 * @param {string} [props.link] - The link associated with the MenuItem.
 * @param {Function} [props.onMenuItemClick] - Function to be called when the menu item is clicked.
 * @returns {JSX.Element} The rendered MenuItem component.
 */
const MenuItem = ({
	id,
	label,
	icon,
	link,
	onMenuItemClick,
	isBeta,
}: MenuItemProps): JSX.Element => {
	const router = useRouter();
	const { h } = useHslColor(label);

	return (
		<AccordionItem id={id}>
			<AccordionButton
				iconName="chevron-right"
				iconSize="16px"
				iconColor="#666"
				iconStyle={{
					borderRadius: "50%",
					padding: "2px",
				}}
				py="2"
				pr="0.5"
				onClick={() => {
					if (link) router.push(link);
					if (onMenuItemClick) onMenuItemClick();
				}}
			>
				<IconWithLabel {...{ icon, hue: h, label, isBeta }} />
			</AccordionButton>
		</AccordionItem>
	);
};

/* ####################### MenuPanel ####################### */

type MenuPanelSubItemProps = {
	id: number | null;
	label: string;
	icon: string;
	link?: string;
	theme?: string;
};

type MenuPanelProps = {
	id: number;
	label: string;
	icon: string;
	subItems: MenuPanelSubItemProps[];
	showAll: boolean;
	isPanelExpanded?: boolean;
	onMenuItemClick?: () => void;
};

/**
 * `MenuPanel` is a component that displays a group of sub-items within an accordion panel.
 * It conditionally displays a "More" button if there are too many sub-items.
 * @param {MenuPanelProps} props - Props for configuring the MenuPanel component.
 * @param {number} props.id - The ID of the interaction group.
 * @param {string} props.label - The label for the interaction group.
 * @param {string} props.icon - The icon for the interaction group.
 * @param {Array<MenuPanelSubItemProps>} props.subItems - The list of sub-items for the panel.
 * @param {boolean} props.showAll - Whether to show all sub-items or limit the number shown.
 * @param {boolean} [props.isPanelExpanded] - Whether the panel is expanded by default.
 * @param {Function} [props.onMenuItemClick] - Function to be called when a sub-item is clicked.
 * @returns {JSX.Element} The rendered MenuPanel component.
 */
const MenuPanel = ({
	id,
	label,
	icon,
	subItems,
	showAll,
	isPanelExpanded,
	onMenuItemClick,
}: MenuPanelProps): JSX.Element => {
	const { h } = useHslColor(label);

	const { isAdmin } = useUser();

	const prefix = isAdmin ? "/admin" : "";

	// Set the number of columns based on the screen size
	const numColumns = useBreakpointValue({ base: 3, sm: 4 }, { ssr: false });

	const subItemsCount = numColumns * 2; // Two rows of items

	const subItemsLength = subItems?.length ?? 0;

	// Ensure the "More" button appears at the end of the grid without extra space
	const _subItems =
		!showAll && subItemsLength > subItemsCount
			? [
					...subItems.slice(0, subItemsCount - 1),
					{
						id: id,
						label: "More",
						icon: "more-horiz",
						theme: "gray",
						link: `${prefix}/transaction/${id}`,
					},
				]
			: subItems;

	return (
		<AccordionItem id={id}>
			{({ isExpanded, handleOpenIndexes }) => (
				<>
					<AccordionButton
						iconName={isExpanded ? "minus" : "add"}
						iconSize="16px"
						iconColor="white"
						iconStyle={{
							borderRadius: "50%",
							backgroundColor: "#666",
							padding: "4px",
						}}
						py={{ base: "2", md: "3", lg: "4" }}
						onClick={isPanelExpanded ? null : handleOpenIndexes}
					>
						<IconWithLabel {...{ icon, hue: h, label }} />
					</AccordionButton>
					<AccordionPanel
						isExpanded={
							isPanelExpanded ? isPanelExpanded : isExpanded
						}
						pb="2"
					>
						<Grid
							templateColumns={`repeat(${numColumns}, 1fr)`}
							gap="1"
							alignItems="flex-start"
							justifyContent="center"
						>
							{_subItems?.map(
								(
									{ label, icon, link, theme = "dark" },
									index
								) => (
									<MenuPanelItem
										key={`${index}-${label}`}
										{...{
											id,
											label,
											icon,
											link,
											theme,
											onMenuItemClick,
										}}
									/>
								)
							)}
						</Grid>
					</AccordionPanel>
				</>
			)}
		</AccordionItem>
	);
};

/* ####################### MenuPanelItem ####################### */

type MenuPanelItemProps = {
	label: string;
	icon: string;
	link: string;
	theme: string;
	onMenuItemClick?: () => void;
};

/**
 * `MenuPanelItem` is a component that represents a single sub-item in a list of sub-items.
 * It displays an icon and label, and optionally navigates to a link when clicked.
 * @param {MenuPanelItemProps} props - Props for configuring the MenuPanelItem component.
 * @param {string} props.label - The label for the sub-item.
 * @param {string} props.icon - The icon for the sub-item.
 * @param {string} props.link - The link associated with the sub-item.
 * @param {string} props.theme - The theme for the sub-item's appearance.
 * @param {Function} [props.onMenuItemClick] - Function to be called when the sub-item is clicked.
 * @returns {JSX.Element} A `Flex` component containing an `Avatar` and a `Text` component.
 */
const MenuPanelItem = ({
	label,
	icon,
	link,
	theme,
	onMenuItemClick,
}: MenuPanelItemProps): JSX.Element => {
	const router = useRouter();
	// TODO create common func for getting theme object
	// for avatar bg & color
	const avatarTheme: Object =
		theme === "dark"
			? {
					bg: "inputLabel",
					color: "white",
					boxShadow: "0px 3px 10px #0000001A",
				}
			: theme === "gray"
				? {
						bgGradient: "linear(to-b, divider, hint)",
						color: "white",
						border: "1px solid var(--chakra-colors-divider)",
					}
				: null;

	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			gap="2"
			py="1"
			cursor="pointer"
			onClick={() => {
				if (link) router.push(link);
				if (onMenuItemClick) onMenuItemClick();
			}}
		>
			<Avatar
				size="sm"
				name={icon ? null : label}
				icon={<Icon size="16px" name={icon} color="white" />}
				{...avatarTheme}
			/>
			<Text
				fontSize="xxs"
				noOfLines={2}
				textAlign="center"
				userSelect="none"
			>
				{label}
			</Text>
		</Flex>
	);
};

/* ####################### IconWithLabel ####################### */

type IconWithLabelProps = {
	icon: string;
	hue: number;
	label: string;
	isBeta?: boolean;
};

/**
 * IconWithLabel component renders a Flex container with an Icon and Text.
 * @param {IconWithLabelProps} props - Properties passed to the component.
 * @param {string} props.icon - Name of the icon to display.
 * @param {number} props.hue - Hue value for the icon color.
 * @param {string} props.label - Text label to display next to the icon.
 * @param {boolean} props.isBeta - If true, the "Beta" tag is displayed next to the label.
 * @returns {JSX.Element} The rendered IconWithLabel component.
 * @example
 * <IconWithLabel icon="home" hue={120} label="Home" />
 */
const IconWithLabel = ({
	icon,
	hue,
	label,
	isBeta,
}: IconWithLabelProps): JSX.Element => (
	<Flex py="1" w="100%" align="center" gap="4" cursor="pointer">
		<Icon name={icon} size="sm" color={`hsl(${hue},80%,30%)`} />
		<Flex align="center" gap="2">
			<Text fontSize="sm" fontWeight="medium" userSelect="none">
				{label}
			</Text>
			{isBeta ? (
				<Tags
					status="BETA"
					bg="accent.DEFAULT"
					color="white"
					borderRadius="full"
					h="14px"
					fontSize="8px"
					fontWeight="500"
					px="6px"
					border="none"
				/>
			) : null}
		</Flex>
	</Flex>
);
