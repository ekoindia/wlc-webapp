import {
	Avatar,
	Divider,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	Grid,
	Text,
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
					// className="customScrollbars"
					direction="column"
					overflowY="scroll"
					px="5"
					py="2"
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
	const router = useRouter();
	const { h } = useHslColor(label);

	const onInteractionClick = (id: number) => {
		const newPath = generateNewPath(router.asPath, id);
		router.push(newPath);
		onClose();
	};

	return (
		<AccordionItem id={id}>
			<AccordionButton py="1">
				<Flex
					align="center"
					gap="4"
					py="1"
					cursor="pointer"
					onClick={() => {
						onInteractionClick(id);
					}}
				>
					<Flex gap="4" w="100%" align="center">
						<Icon
							name={icon}
							size="md"
							color={`hsl(${h},80%,30%)`}
						/>
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
	const { h } = useHslColor(label);

	const groupInteractions = group_interaction_ids
		.split(",")
		.map(Number)
		.filter((id) => id in role_tx_list)
		.map((id) => ({ id, ...role_tx_list[id] }));

	return (
		<AccordionItem id={id}>
			<AccordionButton py="1">
				<Flex gap="4" w="100%" align="center" cursor="pointer">
					<Icon name={icon} size="md" color={`hsl(${h},80%,30%)`} />
					<Text fontSize="sm" fontWeight="medium">
						{label}
					</Text>
				</Flex>
			</AccordionButton>
			<AccordionPanel>
				<Grid
					templateColumns={{
						base: "repeat(auto-fill, minmax(100px, 1fr))",
					}}
					gap="4"
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
	onClose: () => void;
};

/**
 * `GridInteractionItem` is a component that represents a single interaction in a grid of interactions.
 * When clicked, it navigates to the transaction page for the interaction and calls the `onClose` function.
 *
 * @param {string} key - The unique key for the interaction.
 * @param {number} id - The ID of the interaction group.
 * @param {number} group_interaction_id - The ID of the interaction within the group.
 * @param {string} label - The label for the interaction.
 * @param {string} icon - The icon for the interaction.
 * @param {() => void} onClose - A function to be called when the interaction is clicked.
 *
 * @returns {JSX.Element} A `Flex` component containing an `Avatar` and a `Text` component.
 */
const GridInteractionItem = ({
	key,
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
			key={key}
			direction="column"
			align="center"
			justify="center"
			gap="2"
			cursor="pointer"
			onClick={() => {
				onInteractionClick(id, group_interaction_id);
				onClose();
			}}
		>
			<Avatar
				size="sm"
				name={icon ? null : label}
				bg="inputlabel"
				color="white"
				icon={<Icon size="16px" name={icon} color="white" />}
			/>
			<Text fontSize="xs" noOfLines={2} textAlign="center">
				{label}
			</Text>
		</Flex>
	);
};
