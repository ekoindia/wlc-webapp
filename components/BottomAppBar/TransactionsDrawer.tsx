import {
	Avatar,
	Divider,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Grid,
	Text,
	useBreakpointValue,
	useDisclosure,
	useToken,
} from "@chakra-ui/react";
import { InteractionBehavior } from "constants/trxnFramework";
import { useMenuContext } from "contexts";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { useRef } from "react";
import { svgBgDotted } from "utils/svgPatterns";
import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Icon,
} from "..";

/**
 * Generates a new path for transaction navigation.
 *
 * @param {string} currentPath - The current path of the router.
 * @param {number} id - The id to be included in the new path.
 * @param {number} [group_interaction_id] - The optional group interaction id to be included in the new path.
 * @returns {string} The new path.
 */
const generateNewPath = (
	currentPath: string,
	id: number,
	group_interaction_id?: number
) => {
	//TODO Refactor this 👇
	// do I really need if else ??
	let newPath;
	if (currentPath.includes("transaction")) {
		newPath = currentPath.replace(
			/transaction\/\d+(\/\d*)?/,
			`transaction/${id}${
				group_interaction_id ? `/${group_interaction_id}` : ""
			}`
		);
	} else {
		newPath = `transaction/${id}${
			group_interaction_id ? `/${group_interaction_id}` : ""
		}`;
	}
	return newPath;
};

interface InteractionList {
	id: number;
	behavior: number;
	group_interaction_ids: string;
	label: string;
	icon: string;
}

/**
 * Component for displaying a drawer with transaction options.
 * @returns JSX.Element
 */
const TransactionsDrawer = (): JSX.Element => {
	const btnRef = useRef<HTMLButtonElement>(null);
	const { trxnList } = useMenuContext();
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<DrawerContainer {...{ isOpen, onOpen, onClose, btnRef }}>
			<Accordion allowToggle>
				{trxnList?.map(
					(
						{
							id,
							behavior,
							group_interaction_ids,
							label,
							icon,
						}: InteractionList,
						index: number
					) => {
						return (
							<>
								{group_interaction_ids !== null &&
								InteractionBehavior.GRID === +behavior ? (
									<GridInteraction
										{...{
											key: index,
											id,
											group_interaction_ids,
											label,
											icon,
											onClose,
										}}
									/>
								) : (
									<Interaction
										{...{
											key: index,
											id,
											label,
											icon,
											onClose,
										}}
									/>
								)}
								{trxnList.length - 1 !== index && (
									<Divider variant="dashed" />
								)}
							</>
						);
					}
				)}
			</Accordion>
		</DrawerContainer>
	);
};

export default TransactionsDrawer;

const DrawerContainer = ({ isOpen, onOpen, onClose, btnRef, children }) => (
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
			<Icon ref={btnRef} name="transaction" size="sm" color="light" />
			<Text fontSize="10px" fontWeight="medium" noOfLines={2}>
				Transactions
			</Text>
		</Flex>
		<Drawer
			isOpen={isOpen}
			placement="bottom"
			onClose={onClose}
			finalFocusRef={btnRef}
		>
			<DrawerOverlay />
			<DrawerContent maxH="70%" w="100%" borderTopRadius="10px" pb="5">
				<DrawerHeader onClose={onClose} />
				<Divider />
				<Flex
					// className="customScrollbars"
					direction="column"
					overflowY="scroll"
					px="5"
					// py="2"
					gap="2"
				>
					{children}
				</Flex>
			</DrawerContent>
		</Drawer>
	</>
);

const DrawerHeader = ({ onClose }) => {
	const [contrast_color] = useToken("colors", ["navbar.dark"]);
	return (
		<Flex
			w="100%"
			minH="56px"
			align="center"
			justify="space-between"
			px="5"
			backgroundImage={svgBgDotted({
				fill: contrast_color,
				opacity: 0.04,
			})}
		>
			<Text fontSize="lg" fontWeight="semibold">
				Start a Transaction
			</Text>
			<Flex direction="row-reverse" onClick={onClose} w="20%">
				<Icon
					size="xs"
					name="close"
					color="light"
					_active={{ color: "error" }}
				/>
			</Flex>
		</Flex>
	);
};

/* ####################### Interaction ####################### */

type InteractionProps = {
	id: number;
	label: string;
	icon: string;
	onClose: () => void;
};

/**
 * `Interaction` is a component that represents a single interaction.
 * It simply passes its props to an `InteractionItem` component.
 *
 * @param {InteractionProps} props - Props for configuring the Interaction component.
 * @param {number} props.id - The ID of the interaction.
 * @param {string} props.label - The label for the interaction.
 * @param {string} props.icon - The icon for the interaction.
 * @param {() => void} props.onClose - Callback invoked to close the modal.
 *
 * @returns {JSX.Element} An `InteractionItem` component with the same props as the `Interaction` component.
 */
const Interaction = ({
	id,
	label,
	icon,
	onClose,
}: InteractionProps): JSX.Element => {
	const router = useRouter();
	const { h } = useHslColor(label);

	const onInteractionClick = (id: number) => {
		const newPath = generateNewPath(router.asPath, id);
		router.push(newPath);
		onClose();
	};

	return (
		<AccordionItem id={id}>
			<AccordionButton
				iconName="chevron-right"
				iconSize="10px"
				py="1"
				pr="1"
			>
				<Flex
					py="1"
					w="100%"
					align="center"
					gap="4"
					cursor="pointer"
					onClick={() => {
						onInteractionClick(id);
					}}
				>
					<Icon name={icon} size="md" color={`hsl(${h},80%,30%)`} />
					<Text fontSize="sm" fontWeight="medium">
						{label}
					</Text>
				</Flex>
			</AccordionButton>
		</AccordionItem>
	);
};

/* ####################### GridInteraction ####################### */

type GridInteractionProps = {
	id: number;
	group_interaction_ids: string;
	label: string;
	icon: string;
	onClose: () => void;
};

/**
 * `GridInteraction` is a component that displays a group of interactions in a grid.
 * It uses the `group_interaction_ids` prop to find the relevant interactions from the `role_tx_list` context.
 * If there is more than one interaction in the group, it will pass `isGridInteraction` as true to the `InteractionItem` component.
 *
 * @param {GridInteractionProps} props - Props for configuring the GridInteraction component.
 * @param {number} props.id - The ID of the interaction group.
 * @param {string} props.group_interaction_ids - A comma-separated string of interaction IDs.
 * @param {string} props.label - The label for the interaction group.
 * @param {string} props.icon - The icon for the interaction group.
 * @param {() => void} props.onClose - Callback invoked to close the modal.
 *
 * @returns {JSX.Element} A `Flex` component containing a `Details` component, which in turn contains an `InteractionItem` and a `GridInteractionBox`.
 */
const GridInteraction = ({
	id,
	group_interaction_ids,
	label,
	icon,
	onClose,
}: GridInteractionProps): JSX.Element => {
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions;
	const { h } = useHslColor(label);

	// Set the number of columns based on the screen size
	const numColumns = useBreakpointValue({ base: 3, sm: 4 }, { ssr: false });

	const groupInteractionCount = numColumns * 2; // Two rows of items

	const groupInteractions = group_interaction_ids
		.split(",")
		.map(Number)
		.filter((id) => id in role_tx_list)
		.map((id) => ({ id, ...role_tx_list[id] }));

	const groupInteractionsLength = groupInteractions?.length ?? 0;

	// Ensure the "More" button appears at the end of the grid without extra space
	const _groupInteractions =
		groupInteractionsLength > groupInteractionCount
			? [
					...groupInteractions.slice(0, groupInteractionCount - 1),
					{
						id: null,
						label: "More",
						icon: "more-horiz",
						theme: "gray",
					},
			  ]
			: groupInteractions;

	return (
		<AccordionItem id={id}>
			<AccordionButton py="1">
				<Flex py="1" gap="4" w="100%" align="center" cursor="pointer">
					<Icon name={icon} size="md" color={`hsl(${h},80%,30%)`} />
					<Text fontSize="sm" fontWeight="medium">
						{label}
					</Text>
				</Flex>
			</AccordionButton>
			<AccordionPanel>
				<Grid
					templateColumns={`repeat(${numColumns}, 1fr)`}
					gap="3"
					alignItems="flex-start"
					justifyContent="center"
				>
					{_groupInteractions?.map(
						(
							{
								id: group_interaction_id,
								label,
								icon,
								theme = "dark",
							},
							index
						) => (
							<GridInteractionItem
								key={`${index}-${label}`}
								{...{
									id,
									group_interaction_id,
									label,
									icon,
									theme,
									onClose,
								}}
							/>
						)
					)}
				</Grid>
			</AccordionPanel>
		</AccordionItem>
	);
};

/* ####################### GridInteractionItem ####################### */

type GridInteractionItemProps = {
	key: string;
	id: number;
	group_interaction_id: number;
	label: string;
	icon: string;
	theme: string;
	onClose: () => void;
};

/**
 * `GridInteractionItem` is a component that represents a single interaction in a grid of interactions.
 * When clicked, it navigates to the transaction page for the interaction and calls the `onClose` function.
 *
 * @param {GridInteractionItemProps} props - Props for configuring the GridInteractionItem component.
 * @param {string} props.key - The unique key for the interaction.
 * @param {number} props.id - The ID of the interaction group.
 * @param {number} props.group_interaction_id - The ID of the interaction within the group.
 * @param {string} props.label - The label for the interaction.
 * @param {string} props.icon - The icon for the interaction.
 * @param {string} props.theme - The theme for the Avatar
 * @param {() => void} props.onClose - A function to be called when the interaction is clicked.
 *
 * @returns {JSX.Element} A `Flex` component containing an `Avatar` and a `Text` component.
 */
const GridInteractionItem = ({
	key,
	id,
	group_interaction_id,
	label,
	icon,
	theme,
	onClose,
}: GridInteractionItemProps): JSX.Element => {
	const router = useRouter();

	const onInteractionClick = (id: number, group_interaction_id?: number) => {
		const newPath = generateNewPath(
			router.asPath,
			id,
			group_interaction_id
		);
		router.push(newPath);
		onClose();
	};

	// TODO create common func for getting theme object
	// for avatar bg & color
	const avatarTheme: Object =
		theme === "dark"
			? {
					bg: "inputlabel",
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
			key={key}
			direction="column"
			align="center"
			justify="center"
			gap="2"
			py="2"
			cursor="pointer"
			onClick={() => {
				onInteractionClick(id, group_interaction_id);
				onClose();
			}}
		>
			<Avatar
				size="sm"
				name={icon ? null : label}
				icon={<Icon size="16px" name={icon} color="white" />}
				{...avatarTheme}
			/>
			<Text fontSize="xs" noOfLines={1} textAlign="center">
				{label}
			</Text>
		</Flex>
	);
};
