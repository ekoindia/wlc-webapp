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
import { AEPS_PROVIDERS } from "../constants";
import { useAepsContext } from "../context/AepsContext";
import type { AepsProviderOption } from "../contracts";

interface ProviderCardProps {
	provider: AepsProviderOption;
	onSelect: (_provider: AepsProviderOption) => void;
}

/**
 * A single selectable bank/device option card (mirrors the legacy widget's card-252 menu).
 * @param root0
 * @param root0.provider
 * @param root0.onSelect
 */
const ProviderCard = ({ provider, onSelect }: ProviderCardProps) => {
	const { label, description, iconName, enabled } = provider;

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
			onClick={enabled ? () => onSelect(provider) : undefined}
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
					name={iconName}
					size="md"
					color={enabled ? "primary.DEFAULT" : "gray.400"}
				/>
			</Flex>

			<VStack align="start" spacing={0.5} flex={1}>
				<HStack>
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
				<Text fontSize="sm" color="gray.500">
					{description}
				</Text>
			</VStack>

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
 * Step 0 — card-252 equivalent: choose a bank/device before entering the
 * Fingpay chain (device -> search -> cashout -> otp -> result). Matches the
 * legacy Connect widget's AePS menu (Fingpay / Fino Payments Bank / Fund
 * Settlement) so agents see the same set of options, even though only the
 * Fingpay chain is implemented natively today.
 */
export const ProviderSelect = () => {
	const { actions } = useAepsContext();

	const handleSelect = (provider: AepsProviderOption): void => {
		actions.setProvider(provider.id);
		actions.setStep("fingpayStatus");
	};

	return (
		<VStack align="stretch" spacing={5}>
			<Box>
				<Text fontSize="lg" fontWeight="bold" mb={1}>
					Select AePS Bank/Device
				</Text>
				<Text fontSize="sm" color="gray.500">
					Choose how you'd like to authenticate the customer for this
					cashout.
				</Text>
			</Box>

			<VStack align="stretch" spacing={3}>
				{AEPS_PROVIDERS.map((provider) => (
					<ProviderCard
						key={provider.id}
						provider={provider}
						onSelect={handleSelect}
					/>
				))}
			</VStack>
		</VStack>
	);
};

export default ProviderSelect;
