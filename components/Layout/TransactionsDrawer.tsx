import {
	Avatar,
	Box,
	Divider,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	Flex,
	SimpleGrid,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { TransactionIds } from "constants/EpsTransactions";
import { OtherMenuItems } from "constants/SidebarMenu";
import { useMenuContext } from "contexts";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { IcoButton, Icon } from "..";

/**
 * Component for displaying a drawer with transaction options.
 * @returns JSX.Element
 */
const TransactionsDrawer = () => {
	const router = useRouter();
	const { interactions } = useMenuContext();
	let { role_tx_list, interaction_list } = interactions;
	const btnRef = useRef();
	const [billPaymentOptions, setBillPaymentOptions] = useState([]);
	const [interactionList, setInteractionList] = useState([
		...interaction_list,
	]);
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		// Remove "other..." entries from the list
		let _filteredInteractionList = interaction_list.filter(
			(tx) => OtherMenuItems.indexOf(tx.id) === -1
		);

		setInteractionList(_filteredInteractionList.slice(0, 3));
	}, [interaction_list]);

	useEffect(() => {
		const billPayment = role_tx_list[TransactionIds.BILL_PAYMENT];
		if (!billPayment) return;

		const group_interaction_ids = billPayment.group_interaction_ids
			.split(",")
			.map(Number);
		const bbps_tx_list = group_interaction_ids
			.filter((id) => id in role_tx_list)
			.map((id) => ({ id, ...role_tx_list[id] }));

		setBillPaymentOptions(
			bbps_tx_list.length > 8
				? [
						...bbps_tx_list.slice(0, 7),
						{ id: null, label: "More", icon: "more-horiz" },
				  ]
				: bbps_tx_list
		);
	}, [role_tx_list]);

	/**
	 * Handles click on bill payment option.
	 * @param {number | null} id - The id of the clicked option.
	 */
	const handleBillPaymentOptionClick = (id: number | null) => {
		router.push(
			`transaction/${TransactionIds.BILL_PAYMENT}/` + (id ? `${id}` : "")
		);
	};

	return (
		<>
			<Flex
				w="100%"
				h="100%"
				align="center"
				justify="center"
				borderRadius="50px"
				onClick={onOpen}
			>
				<Icon ref={btnRef} name="transaction" size="md" color="light">
					Open
				</Icon>
			</Flex>
			<Drawer
				isOpen={isOpen}
				placement="bottom"
				onClose={onClose}
				finalFocusRef={btnRef}
			>
				<DrawerOverlay />
				<DrawerContent
					maxH="90%"
					w="100%"
					py="8px"
					borderTopRadius="10px"
					gap="2"
					pb="56px"
				>
					<Flex
						w="100%"
						align="center"
						justify="space-between"
						pl="20px"
					>
						<Text fontSize="lg" fontWeight="semibold">
							Start a Transaction
						</Text>
						<Flex
							direction="row-reverse"
							onClick={onClose}
							w="20%"
							pr="20px"
						>
							<Icon
								size="xs"
								name="close"
								color="light"
								_active={{ color: "error" }}
							/>
						</Flex>
					</Flex>
					<Divider />
					{/* Common Transactions */}
					<Flex direction="column" gap="2" pb="1" px="20px">
						{interactionList?.map(({ label, icon, id }, index) => {
							return (
								<>
									<Interaction
										{...{ key: index, label, icon, id }}
									/>
									{interactionList.length - 1 !== index ? (
										<Divider variant="dashed" />
									) : null}
								</>
							);
						})}
					</Flex>
					{/* Recharge & Bill Payments */}
					<Flex direction="column" gap="4" px="20px">
						<Text fontWeight="medium">
							Recharge & Bill Payments
						</Text>
						<SimpleGrid
							columns={4}
							rowGap={4}
							columnGap={6}
							alignItems="flex-start"
							justifyContent="center"
						>
							{billPaymentOptions?.map(
								({ label, icon, id }, index) => (
									<Box
										key={index}
										display="flex"
										flexDirection="column"
										alignItems="center"
										justifyContent="center"
									>
										<IcoButton
											title={label}
											iconName={icon}
											size="md"
											theme="dark"
											onClick={() =>
												handleBillPaymentOptionClick(id)
											}
										/>
										<Text
											pt={{ base: "10px" }}
											fontSize={{
												base: "xs",
												"2xl": "md",
											}}
											noOfLines={2}
											textAlign="center"
										>
											{label}
										</Text>
									</Box>
								)
							)}
						</SimpleGrid>
					</Flex>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default TransactionsDrawer;

/**
 * Component for displaying an interaction.
 * @param {Object} props - The props.
 * @param {string} props.label - The label of the interaction.
 * @param {string} props.icon - The icon of the interaction.
 * @param {number} props.id - The id of the interaction.
 * @returns JSX.Element
 */
const Interaction: React.FC<{
	label: string;
	icon: string;
	id: number;
}> = ({ label, icon, id }) => {
	const { h } = useHslColor(label);
	const router = useRouter();
	const onInteractionClick = (id) => {
		router.push(`transaction/${id}`);
	};
	return (
		<Flex
			align="center"
			gap="4"
			py="2"
			onClick={() => onInteractionClick(id)}
		>
			<Flex gap="4" w="100%" align="center">
				<Avatar
					size={{ base: "sm", md: "md" }}
					name={icon ? null : label}
					border={`2px solid hsl(${h},80%,90%)`}
					bg={`hsl(${h},80%,95%)`}
					color={`hsl(${h},80%,30%)`}
					icon={
						<Icon
							size="sm"
							name={icon}
							color={`hsl(${h},80%,30%)`}
						/>
					}
				/>
				<Text fontSize="sm  " fontWeight="medium">
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
