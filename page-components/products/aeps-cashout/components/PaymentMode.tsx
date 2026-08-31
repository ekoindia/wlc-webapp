import {
	Badge,
	Box,
	Flex,
	HStack,
	Icon as ChakraIcon,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Icon } from "components";
import { MdChevronRight } from "react-icons/md";
import { AEPS_PAYMENT_MODES } from "../constants";
import { useAepsContext } from "../context/AepsContext";
import type { AepsPaymentModeOption } from "../contracts";

const MODE_ICONS: Record<number, string> = {
	2: "cash",
	3: "account-balance",
	4: "transaction-history",
};

interface PaymentModeCardProps {
	mode: AepsPaymentModeOption;
	onSelect: (_mode: AepsPaymentModeOption) => void;
}

/**
 * A single selectable transaction-type card (mirrors card-252's card design).
 * @param root0
 * @param root0.mode
 * @param root0.onSelect
 */
const PaymentModeCard = ({ mode, onSelect }: PaymentModeCardProps) => {
	const { label, enabled } = mode;

	return (
		<Flex
			align="center"
			gap={4}
			p={4}
			borderRadius="14px"
			border="1px solid"
			borderColor={enabled ? "gray.200" : "gray.100"}
			bg={enabled ? "white" : "gray.50"}
			cursor={enabled ? "pointer" : "not-allowed"}
			opacity={enabled ? 1 : 0.6}
			transition="all 0.15s ease-in-out"
			role="group"
			_hover={
				enabled
					? { borderColor: "primary.DEFAULT", boxShadow: "basic" }
					: undefined
			}
			onClick={enabled ? () => onSelect(mode) : undefined}
		>
			<Flex
				align="center"
				justify="center"
				boxSize="48px"
				borderRadius="full"
				bg="gray.100"
				flexShrink={0}
			>
				<Icon
					name={MODE_ICONS[mode.id]}
					size="md"
					color={enabled ? "primary.DEFAULT" : "gray.400"}
				/>
			</Flex>

			<HStack flex={1}>
				<Text fontWeight="semibold" fontSize="md">
					{label}
				</Text>
				{!enabled && (
					<Badge
						colorScheme="gray"
						borderRadius="full"
						px={2}
						fontSize="10px"
					>
						Coming soon
					</Badge>
				)}
			</HStack>

			{enabled && (
				<ChakraIcon
					as={MdChevronRight}
					boxSize={6}
					color="gray.400"
					_groupHover={{ color: "primary.DEFAULT" }}
				/>
			)}
		</Flex>
	);
};

/**
 * Catalog 9001 "Payment Mode" — a Local/no-API step (client-side only).
 * Only Cash Withdrawal is wired up today; the others are shown to match the
 * legacy widget's menu but are disabled until their chains are built.
 */
export const PaymentMode = () => {
	const { selectPaymentMode } = useAepsContext();

	return (
		<VStack align="stretch" spacing={5}>
			<Box>
				<Text fontSize="lg" fontWeight="bold" mb={1}>
					Select Transaction Type
				</Text>
				<Text fontSize="sm" color="gray.500">
					What would you like to do for this customer?
				</Text>
			</Box>

			<VStack align="stretch" spacing={3}>
				{AEPS_PAYMENT_MODES.map((mode) => (
					<PaymentModeCard
						key={mode.id}
						mode={mode}
						onSelect={(m) => selectPaymentMode(m.id)}
					/>
				))}
			</VStack>
		</VStack>
	);
};

export default PaymentMode;
