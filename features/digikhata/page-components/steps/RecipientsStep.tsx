import {
	Box,
	Button,
	Flex,
	Grid,
	Skeleton,
	SkeletonText,
	Text,
	useToast,
} from "@chakra-ui/react";
import { keyframes } from "@chakra-ui/system";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useEffect } from "react";
import { ANIMATION } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { Recipient } from "../../context/types";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface RecipientsStepProps {
	mobile: string;
}

const newRecipientPulse = keyframes`
	0%, 100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.5); border-color: #ca8a04; }
	50%       { box-shadow: 0 0 0 8px rgba(234, 179, 8, 0); border-color: #d97706; }
`;

interface RecipientCardProps {
	recipient: Recipient;
	onTransfer: (_r: Recipient) => void;
}

const RecipientCard = ({
	recipient,
	onTransfer,
}: RecipientCardProps): JSX.Element => {
	const maskedAccount =
		recipient.accountNumber.length > 4
			? `••••${recipient.accountNumber.slice(-4)}`
			: recipient.accountNumber;

	return (
		<Flex
			direction="column"
			gap={2}
			p={4}
			bg="surface"
			borderRadius="12"
			border="2px solid"
			borderColor={recipient.isNew ? "yellow.500" : "divider"}
			transition="all 0.2s ease-out"
			sx={
				recipient.isNew
					? {
							animation: `${newRecipientPulse} 1.5s ease-in-out ${Math.ceil(ANIMATION.NEW_RECIPIENT_PULSE_MS / 1500)} forwards`,
						}
					: undefined
			}
			_hover={{
				borderColor: "primary.light",
				transform: "translateY(-1px)",
			}}
			cursor="default"
		>
			{recipient.isNew ? (
				<Text
					fontSize="9px"
					fontWeight="bold"
					color="yellow.600"
					textTransform="uppercase"
					letterSpacing="wider"
				>
					New
				</Text>
			) : null}

			<Text
				fontWeight="semibold"
				color="dark"
				fontSize="sm"
				noOfLines={1}
			>
				{recipient.name}
			</Text>
			<Text fontSize="xs" color="light">
				{recipient.bankName}
			</Text>
			<Flex align="center" gap={1} flexWrap="wrap">
				<Box
					bg="shade"
					px={2}
					py={0.5}
					borderRadius="full"
					fontSize="xs"
					color="dark"
					fontFamily="mono"
					letterSpacing="wider"
				>
					{maskedAccount}
				</Box>
				<Box
					bg="shade"
					px={2}
					py={0.5}
					borderRadius="full"
					fontSize="xs"
					color="dark"
					fontFamily="mono"
				>
					{recipient.ifsc}
				</Box>
			</Flex>
			<Button
				size="sm"
				w="full"
				mt={1}
				bg="primary.DEFAULT"
				color="white"
				borderRadius="8"
				_hover={{ bg: "primary.dark" }}
				onClick={() => onTransfer(recipient)}
			>
				Transfer
			</Button>
		</Flex>
	);
};

/**
 * Shows all registered recipients.
 * On mount fetches recipients; if empty auto-navigates to add-recipient.
 * Add recipient dashed card at the end of the grid.
 * @param root0
 * @param root0.mobile
 */
export const RecipientsStep = ({
	mobile,
}: RecipientsStepProps): JSX.Element => {
	const { state, dispatch } = useDigiKhata();
	const { getRecipients, isGettingRecipients } = useDigiKhataApi(mobile);

	const toast = useToast();

	useEffect(() => {
		const load = async () => {
			const res = await getRecipients();
			if (res?.data?.status === 0) {
				const list: Recipient[] = res.data.data?.recipients ?? [];
				dispatch({ type: "SET_RECIPIENTS", payload: list });
				if (list.length === 0) {
					dispatch({ type: "SET_STEP", step: "add-recipient" });
				}
			} else {
				toast({
					title: res?.data?.message ?? "Failed to load recipients",
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			}
		};
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleTransfer = (recipient: Recipient) => {
		dispatch({ type: "SET_SELECTED_RECIPIENT", payload: recipient });
		dispatch({ type: "SET_STEP", step: "fund-transfer" });
	};

	return (
		<Flex
			direction="column"
			gap={4}
			sx={{
				animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
				animationDelay: ANIMATION.STEP_IN_DELAY,
			}}
		>
			<Flex align="center" justify="space-between">
				<Flex align="center" gap={3}>
					<Button
						variant="ghost"
						size="sm"
						onClick={() =>
							dispatch({
								type: "SET_STEP",
								step: "wallet-dashboard",
							})
						}
						px={2}
						color="light"
					>
						← Back
					</Button>
					<Text fontWeight="semibold" fontSize="md" color="dark">
						Recipients
					</Text>
				</Flex>
				<Button
					size="sm"
					variant="outline"
					colorScheme="primary"
					borderRadius="8"
					onClick={() =>
						dispatch({ type: "SET_STEP", step: "add-recipient" })
					}
				>
					+ Add
				</Button>
			</Flex>

			{isGettingRecipients ? (
				<Grid
					templateColumns={{ base: "1fr 1fr", md: "1fr 1fr 1fr" }}
					gap={3}
				>
					{[1, 2, 3].map((i) => (
						<Flex
							key={i}
							direction="column"
							gap={2}
							p={4}
							bg="surface"
							borderRadius="12"
							border="2px solid"
							borderColor="divider"
						>
							<Skeleton h="14px" w="60%" borderRadius="4" />
							<SkeletonText noOfLines={2} spacing={2} />
							<Skeleton h="32px" borderRadius="8" mt={1} />
						</Flex>
					))}
				</Grid>
			) : (
				<Grid
					templateColumns={{ base: "1fr 1fr", md: "1fr 1fr 1fr" }}
					gap={3}
				>
					{state.recipients.map((r) => (
						<RecipientCard
							key={r.beneficiary_id}
							recipient={r}
							onTransfer={handleTransfer}
						/>
					))}

					{/* Add New Recipient dashed card */}
					<Flex
						direction="column"
						align="center"
						justify="center"
						gap={2}
						p={4}
						bg="surface"
						borderRadius="12"
						border="2px dashed"
						borderColor="divider"
						cursor="pointer"
						transition="all 0.2s ease-out"
						minH="140px"
						_hover={{ borderColor: "primary.light", bg: "shade" }}
						onClick={() =>
							dispatch({
								type: "SET_STEP",
								step: "add-recipient",
							})
						}
					>
						<Text fontSize="2xl" userSelect="none">
							➕
						</Text>
						<Text fontSize="sm" color="light" textAlign="center">
							Add Recipient
						</Text>
					</Flex>
				</Grid>
			)}
		</Flex>
	);
};
