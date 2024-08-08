// import {
// 	Avatar,
// 	Divider,
// 	Flex,
// 	Grid,
// 	Text,
// 	useBreakpointValue,
// } from "@chakra-ui/react";
// import { useMenuContext } from "contexts";
// import useHslColor from "hooks/useHslColor";
// import { useRouter } from "next/router";
// import {
// 	Accordion,
// 	AccordionButton,
// 	AccordionItem,
// 	AccordionPanel,
// 	Icon,
// } from "..";

// // list should consist of
// // id (key), icon, label, links?, subItem?

// const AccordionMenu = ({ list }): JSX.Element => {
// 	return (
// 		<Accordion px="4" allowToggle>
// 			{list?.map(({ id, label, icon, link, subItems }, index: number) => {
// 				console.log("subItems", subItems);
// 				return (
// 					<>
// 						{subItems?.length > 0 ? (
// 							<MenuPanel
// 								{...{
// 									key: index,
// 									id,
// 									label,
// 									icon,
// 									subItems,
// 								}}
// 							/>
// 						) : (
// 							<MenuItem
// 								{...{
// 									key: index,
// 									id,
// 									label,
// 									icon,
// 									link,
// 								}}
// 							/>
// 						)}
// 						{list.length - 1 !== index && (
// 							<Divider variant="dashed" />
// 						)}
// 					</>
// 				);
// 			})}
// 		</Accordion>
// 	);
// };

// export default AccordionMenu;

// /* ####################### MenuItem ####################### */

// type MenuItemProps = {
// 	id: number;
// 	label: string;
// 	icon: string;
// 	link?: string;
// };

// /**
//  * `MenuItem` is a component that represents a single MenuItem.
//  * It simply passes its props to an `MenuItemItem` component.
//  * @param {MenuItemProps} props - Props for configuring the MenuItem component.
//  * @param {number} props.id - The ID of the MenuItem.
//  * @param {string} props.label - The label for the MenuItem.
//  * @param {string} props.icon - The icon for the MenuItem.
//  * @param {string} props.link - Link of the sidebar menu items.
//  * @returns {JSX.Element}
//  */
// const MenuItem = ({ id, label, icon, link }: MenuItemProps): JSX.Element => {
// 	const router = useRouter();
// 	const { h } = useHslColor(label);

// 	return (
// 		<AccordionItem id={id}>
// 			<AccordionButton
// 				iconName="chevron-right"
// 				iconSize="10px"
// 				py="2"
// 				pr="0.5"
// 				onClick={() => {
// 					router.push(link);
// 				}}
// 			>
// 				<IconWithLabel {...{ icon, hue: h, label }} />
// 			</AccordionButton>
// 		</AccordionItem>
// 	);
// };

// /* ####################### MenuPanel ####################### */

// type MenuPanelSubItemProps = {
// 	id: number;
// 	label: string;
// 	icon: string;
// 	link?: string;
// 	theme?: string;
// };

// type MenuPanelProps = {
// 	id: number;
// 	label: string;
// 	icon: string;
// 	subItems: MenuPanelSubItemProps[];
// };

// /**
//  * `MenuPanel` is a component that displays a group of interactions in a grid.
//  * It uses the `group_interaction_ids` prop to find the relevant interactions from the `role_tx_list` context.
//  * If there is more than one interaction in the group, it will pass `isMenuPanel` as true to the `InteractionItem` component.
//  * @param {MenuPanelProps} props - Props for configuring the MenuPanel component.
//  * @param {number} props.id - The ID of the interaction group.
//  * @param {string} props.label - The label for the interaction group.
//  * @param {string} props.icon - The icon for the interaction group.
//  * @param {() => void} props.onClose - Callback invoked to close the modal.
//  * @returns {JSX.Element} A `Flex` component containing a `Details` component, which in turn contains an `InteractionItem` and a `MenuPanelBox`.
//  */
// const MenuPanel = ({
// 	id,
// 	label,
// 	icon,
// 	subItems,
// }: MenuPanelProps): JSX.Element => {
// 	const { interactions } = useMenuContext();
// 	const { role_tx_list } = interactions;
// 	const { h } = useHslColor(label);

// 	// Set the number of columns based on the screen size
// 	const numColumns = useBreakpointValue({ base: 3, sm: 4 }, { ssr: false });

// 	const groupInteractionCount = numColumns * 2; // Two rows of items

// 	// const groupInteractions = group_interaction_ids
// 	// 	.split(",")
// 	// 	.map(Number)
// 	// 	.filter((id) => id in role_tx_list)
// 	// 	.map((id) => ({ id, ...role_tx_list[id] }));

// 	// const groupInteractionsLength = groupInteractions?.length ?? 0;

// 	// // Ensure the "More" button appears at the end of the grid without extra space
// 	// const _groupInteractions =
// 	// 	groupInteractionsLength > groupInteractionCount
// 	// 		? [
// 	// 				...groupInteractions.slice(0, groupInteractionCount - 1),
// 	// 				{
// 	// 					id: null,
// 	// 					label: "More",
// 	// 					icon: "more-horiz",
// 	// 					theme: "gray",
// 	// 				},
// 	// 			]
// 	// 		: groupInteractions;

// 	return (
// 		<AccordionItem id={id}>
// 			{({ isExpanded, handleOpenIndexes }) => (
// 				<>
// 					<AccordionButton
// 						iconName={isExpanded ? "minus" : "add"}
// 						iconSize="10px"
// 						py="2"
// 						onClick={handleOpenIndexes}
// 					>
// 						<IconWithLabel {...{ icon, hue: h, label }} />
// 					</AccordionButton>
// 					<AccordionPanel isExpanded={isExpanded} pb="2">
// 						<Grid
// 							templateColumns={`repeat(${numColumns}, 1fr)`}
// 							gap="3"
// 							alignItems="flex-start"
// 							justifyContent="center"
// 						>
// 							{/* {subItems?.map(
// 								({ label, icon, theme = "dark" }, index) => (
// 									<MenuPanelItem
// 										{...{
// 											key: `${index}-${label}`,
// 											id,
// 											label,
// 											icon,
// 											theme,
// 											// onClose,
// 										}}
// 									/>
// 								)
// 							)} */}
// 						</Grid>
// 					</AccordionPanel>
// 				</>
// 			)}
// 		</AccordionItem>
// 	);
// };

// /* ####################### MenuPanelItem ####################### */

// type MenuPanelItemProps = {
// 	key: string;
// 	id: number;
// 	label: string;
// 	icon: string;
// 	theme: string;
// 	// onClose: () => void;
// };

// /**
//  * `MenuPanelItem` is a component that represents a single interaction in a grid of interactions.
//  * When clicked, it navigates to the transaction page for the interaction and calls the `onClose` function.
//  * @param {MenuPanelItemProps} props - Props for configuring the MenuPanelItem component.
//  * @param {string} props.key - The unique key for the interaction.
//  * @param {number} props.id - The ID of the interaction group.
//  * @param {number} props.group_interaction_id - The ID of the interaction within the group.
//  * @param {string} props.label - The label for the interaction.
//  * @param {string} props.icon - The icon for the interaction.
//  * @param {string} props.theme - The theme for the Avatar
//  * @param {() => void} props.onClose - A function to be called when the interaction is clicked.
//  * @returns {JSX.Element} A `Flex` component containing an `Avatar` and a `Text` component.
//  */
// const MenuPanelItem = ({
// 	key,
// 	id,
// 	label,
// 	icon,
// 	theme,
// 	// onClose,
// }: MenuPanelItemProps): JSX.Element => {
// 	// const router = useRouter();
// 	// const { isAdmin } = useSession();

// 	// const onInteractionClick = (id: number, group_interaction_id?: number) => {
// 	// 	const newPath = generateNewPath(
// 	// 		router.asPath,
// 	// 		id,
// 	// 		isAdmin,
// 	// 		group_interaction_id
// 	// 	);
// 	// 	router.push(newPath);
// 	// 	onClose();
// 	// };

// 	// TODO create common func for getting theme object
// 	// for avatar bg & color
// 	const avatarTheme: Object =
// 		theme === "dark"
// 			? {
// 					bg: "inputlabel",
// 					color: "white",
// 					boxShadow: "0px 3px 10px #0000001A",
// 				}
// 			: theme === "gray"
// 				? {
// 						bgGradient: "linear(to-b, divider, hint)",
// 						color: "white",
// 						border: "1px solid var(--chakra-colors-divider)",
// 					}
// 				: null;

// 	return (
// 		<Flex
// 			key={key}
// 			direction="column"
// 			align="center"
// 			justify="center"
// 			gap="2"
// 			py="2"
// 			cursor="pointer"
// 			// onClick={() => {
// 			// 	onInteractionClick(id, group_interaction_id);
// 			// 	onClose();
// 			// }}
// 		>
// 			<Avatar
// 				size="sm"
// 				name={icon ? null : label}
// 				icon={<Icon size="16px" name={icon} color="white" />}
// 				{...avatarTheme}
// 			/>
// 			<Text fontSize="xs" noOfLines={1} textAlign="center">
// 				{label}
// 			</Text>
// 		</Flex>
// 	);
// };

// /* ####################### IconWithLabel ####################### */

// type IconWithLabelProps = {
// 	icon: string;
// 	hue: number;
// 	label: string;
// };

// /**
//  * IconWithLabel component renders a Flex container with an Icon and Text.
//  * @param {IconWithLabelProps} props - Properties passed to the component.
//  * @param {string} props.icon - Name of the icon to display.
//  * @param {number} props.hue - Hue value for the icon color.
//  * @param {string} props.label - Text label to display next to the icon.
//  * @example
//  * <IconWithLabel icon="home" hue={120} label="Home" />
//  */
// const IconWithLabel = ({
// 	icon,
// 	hue,
// 	label,
// }: IconWithLabelProps): JSX.Element => (
// 	<Flex py="1" w="100%" align="center" gap="4" cursor="pointer">
// 		<Icon name={icon} size="sm" color={`hsl(${hue},80%,30%)`} />
// 		<Text fontSize="sm" fontWeight="medium">
// 			{label}
// 		</Text>
// 	</Flex>
// );
