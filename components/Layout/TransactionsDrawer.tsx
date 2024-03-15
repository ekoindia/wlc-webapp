import {
	Avatar,
	Divider,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	SimpleGrid,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { OtherMenuItems } from "constants/SidebarMenu";
import { InteractionBehavior } from "constants/trxnFramework";
import { useMenuContext } from "contexts";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Details, Icon } from "..";

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
	const { interactions } = useMenuContext();
	const { interaction_list } = interactions;
	const btnRef = useRef<HTMLButtonElement>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [interactionList, setInteractionList] = useState<InteractionList[]>([
		...interaction_list,
	]);

	useEffect(() => {
		let _interactionList = interaction_list.filter(
			(tx: InteractionList) => OtherMenuItems.indexOf(tx.id) === -1
		);
		setInteractionList(_interactionList);
	}, [interaction_list]);

	return (
		<DrawerContainer {...{ isOpen, onOpen, onClose, btnRef }}>
			{interactionList?.map(
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
							{interactionList.length - 1 !== index && (
								<Divider variant="dashed" />
							)}
						</>
					);
				}
			)}
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
				Transaction
			</Text>
		</Flex>
		<Drawer
			isOpen={isOpen}
			placement="bottom"
			onClose={onClose}
			finalFocusRef={btnRef}
		>
			<DrawerOverlay />
			<DrawerContent maxH="80%" w="100%" borderTopRadius="10px" pb="22px">
				<DrawerHeader onClose={onClose} />
				<Divider />
				<Flex
					className="customScrollbars"
					direction="column"
					overflowY="scroll"
					gap="2"
				>
					<Flex direction="column" gap="2" py="2" px="20px">
						{children}
					</Flex>
				</Flex>
			</DrawerContent>
		</Drawer>
	</>
);

const DrawerHeader = ({ onClose }) => (
	<Flex w="100%" align="center" justify="space-between" pl="20px" py="10px">
		<Text fontSize="lg" fontWeight="semibold">
			Start a Transaction
		</Text>
		<Flex direction="row-reverse" onClick={onClose} w="20%" pr="28px">
			<Icon
				size="xs"
				name="close"
				color="light"
				_active={{ color: "error" }}
			/>
		</Flex>
	</Flex>
);

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
 * @param {number} id - The ID of the interaction.
 * @param {string} label - The label for the interaction.
 * @param {string} icon - The icon for the interaction.
 * @param {() => void} onClose - Callback invoked to close the modal.
 *
 * @returns {JSX.Element} An `InteractionItem` component with the same props as the `Interaction` component.
 */
const Interaction = ({
	id,
	label,
	icon,
	onClose,
}: InteractionProps): JSX.Element => {
	return <InteractionItem {...{ id, label, icon, onClose }} />;
};

/* ####################### InteractionItem ####################### */

type InteractionItemProps = {
	id: number;
	label: string;
	icon: string;
	onClose: () => void;
	isGridInteraction?: boolean;
};

/**
 * `InteractionItem` is a component that represents a single interaction item.
 * It displays an icon and a label, and navigates to the transaction page for the interaction when clicked.
 * If `isGridInteraction` is true, the click handler is disabled.
 *
 * @param {number} id - The ID of the interaction.
 * @param {string} label - The label for the interaction.
 * @param {string} icon - The icon for the interaction.
 * @param {() => void} onClose - Callback invoked to close the modal.
 * @param {boolean} [isGridInteraction=false] - Whether the interaction is part of a grid. If true, the click handler is disabled.
 *
 * @returns {JSX.Element} A `Flex` component containing an `Icon` and a `Text` component.
 */
const InteractionItem = ({
	id,
	label,
	icon,
	onClose,
	isGridInteraction = false,
}: InteractionItemProps): JSX.Element => {
	const { h } = useHslColor(label);

	const router = useRouter();

	const onInteractionClick = (id: number) => {
		const newPath = generateNewPath(router.asPath, id);
		router.push(newPath);
		onClose();
	};

	return (
		<Flex
			align="center"
			gap="4"
			py="1"
			onClick={
				isGridInteraction
					? null
					: () => {
							onInteractionClick(id);
							onClose();
					  }
			}
		>
			<Flex gap="4" w="100%" align="center">
				<Icon name={icon} size="md" color={`hsl(${h},80%,30%)`} />
				<Text fontSize="sm" fontWeight="medium">
					{label}
				</Text>
			</Flex>
			<Icon
				name="chevron-right"
				size="xs"
				color="light"
				_active={{ color: `hsl(${h},80%,30%)` }}
			/>
		</Flex>
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
 * @param {number} id - The ID of the interaction group.
 * @param {string} group_interaction_ids - A comma-separated string of interaction IDs.
 * @param {string} label - The label for the interaction group.
 * @param {string} icon - The icon for the interaction group.
 * @param {() => void} onClose - Callback invoked to close the modal.
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

	const groupInteractions = group_interaction_ids
		.split(",")
		.map(Number)
		.filter((id) => id in role_tx_list)
		.map((id) => ({ id, ...role_tx_list[id] }));

	const isGridInteraction = groupInteractions?.length > 1;

	return (
		<Flex direction="column" gap="4">
			<Details
				summary={
					<InteractionItem
						{...{ id, label, icon, onClose, isGridInteraction }}
					/>
				}
			>
				<Flex id="test" direction="column" py="4">
					<GridInteractionBox
						{...{ id, groupInteractions, onClose }}
					/>
				</Flex>
			</Details>
		</Flex>
	);
};

/* ####################### GridInteractionBox ####################### */

type GridInteractionBoxProps = {
	id: number;
	groupInteractions: {
		id: number;
		label: string;
		icon: string;
	}[];
	onClose: () => void;
};

/**
 * `GridInteractionBox` is a component that displays a group of interactions in a grid.
 * Each interaction is represented by a `GridInteractionItem` component.
 *
 * @param {number} id - The ID of the interaction group.
 * @param {Object[]} groupInteractions - An array of objects representing the interactions in the group.
 * Each object should have an `id`, a `label`, and an `icon`.
 * @param {() => void} onClose - Callback invoked to close the modal.
 *
 * @returns {JSX.Element} A `SimpleGrid` component containing a `GridInteractionItem` for each interaction in the group.
 */
const GridInteractionBox = ({
	id,
	groupInteractions,
	onClose,
}: GridInteractionBoxProps): JSX.Element => {
	return (
		<SimpleGrid
			columns={4}
			rowGap="4"
			alignItems="flex-start"
			justifyContent="center"
		>
			{groupInteractions?.map(
				({ id: group_interaction_id, label, icon }, index) => (
					<GridInteractionItem
						key={`${index}-${label}`}
						{...{
							id,
							group_interaction_id,
							label,
							icon,
							onClose,
						}}
					/>
				)
			)}
		</SimpleGrid>
	);
};

/* ####################### GridInteractionItem ####################### */

type GridInteractionItemProps = {
	id: number;
	group_interaction_id: number;
	label: string;
	icon: string;
	onClose: () => void;
};

/**
 * `GridInteractionItem` is a component that represents a single interaction in a grid of interactions.
 * When clicked, it navigates to the transaction page for the interaction and calls the `onClose` function.
 *
 * @param {number} id - The ID of the interaction group.
 * @param {number} group_interaction_id - The ID of the interaction within the group.
 * @param {string} label - The label for the interaction.
 * @param {string} icon - The icon for the interaction.
 * @param {() => void} onClose - A function to be called when the interaction is clicked.
 *
 * @returns {JSX.Element} A `Flex` component containing an `Avatar` and a `Text` component.
 */
const GridInteractionItem = ({
	id,
	group_interaction_id,
	label,
	icon,
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

	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			onClick={() => {
				onInteractionClick(id, group_interaction_id);
				onClose();
			}}
		>
			<Avatar
				size={{ base: "sm", md: "md" }}
				name={icon ? null : label}
				bg="inputlabel"
				color="white"
				icon={<Icon size="sm" name={icon} color="white" />}
			/>
			<Text
				pt={{ base: "10px" }}
				fontSize={{ base: "xs", "2xl": "md" }}
				noOfLines={2}
				textAlign="center"
			>
				{label}
			</Text>
		</Flex>
	);
};
