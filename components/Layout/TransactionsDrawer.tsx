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
const TransactionsDrawer: React.FC = () => {
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

const Interaction: React.FC<{
	id: number;
	label: string;
	icon: string;
	onClose: Function;
}> = ({ id, label, icon, onClose }) => {
	return <InteractionItem {...{ id, label, icon, onClose }} />;
};

const InteractionItem: React.FC<{
	id: number;
	label: string;
	icon: string;
	onClose: Function;
	isGridInteraction?: boolean;
}> = ({ id, label, icon, onClose, isGridInteraction }) => {
	const { h } = useHslColor(label);

	const router = useRouter();

	const onInteractionClick = (id) => {
		router.push(`transaction/${id}`);
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

const GridInteraction: React.FC<{
	id: number;
	group_interaction_ids: string;
	label: string;
	icon: string;
	onClose: Function;
}> = ({ id, group_interaction_ids, label, icon, onClose }) => {
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

const GridInteractionBox: React.FC<{
	id: number;
	groupInteractions: any[];
	onClose: Function;
}> = ({ id, groupInteractions, onClose }) => {
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

const GridInteractionItem: React.FC<{
	id: number;
	group_interaction_id: number;
	label: string;
	icon: string;
	onClose: Function;
}> = ({ id, group_interaction_id, label, icon, onClose }) => {
	const router = useRouter();

	const onInteractionClick = (id, group_interaction_id) => {
		router.push(`transaction/${id}/${group_interaction_id || ""}`);
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
