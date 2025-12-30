/**
 * MultiServiceToggle component for enabling/disabling multi-service selection mode.
 * Uses pricing-config style tooltip (primary bg, info-outline icon).
 */

import { Flex, Switch, Text, Tooltip } from "@chakra-ui/react";
import { Icon } from "components";

interface MultiServiceToggleProps {
	/** Whether multi-service mode is enabled */
	isEnabled: boolean;
	/** Callback when toggle is changed */
	onToggle: () => void;
	/** Label text */
	label?: string;
	/** Tooltip text */
	tooltip?: string;
}

/**
 * Toggle switch for enabling multi-service selection mode.
 * Styled similar to pricing-config with info tooltip.
 * @param {MultiServiceToggleProps} props - Component props
 * @param {boolean} props.isEnabled - Whether multi-service mode is currently enabled
 * @param {Function} props.onToggle - Callback invoked when toggle state changes
 * @param {string} [props.label] - Label text displayed next to the toggle
 * @param {string} [props.tooltip] - Tooltip text explaining the feature
 * @returns {JSX.Element} Rendered toggle switch with label and info tooltip
 */
export const MultiServiceToggle = ({
	isEnabled,
	onToggle,
	label = "Multi-Service Verification",
	tooltip = "Select multiple services to verify at once. All unique parameters will be collected in a single form.",
}: MultiServiceToggleProps): JSX.Element => {
	return (
		<Flex align="center" gap="2">
			<Switch
				size={{ base: "sm", md: "md" }}
				colorScheme="green"
				isChecked={isEnabled}
				onChange={onToggle}
			/>
			<Text
				fontSize="sm"
				fontWeight="medium"
				userSelect="none"
				color="gray.700"
			>
				{label}
			</Text>
			<Tooltip
				hasArrow
				placement="right"
				label={tooltip}
				aria-label={tooltip}
				fontSize="xs"
				bg="primary.DEFAULT"
				color="white"
				borderRadius="8"
				px="3"
				py="2"
				maxW="250px"
			>
				<span>
					<Icon
						name="info-outline"
						size="xs"
						cursor="pointer"
						color="light"
					/>
				</span>
			</Tooltip>
		</Flex>
	);
};

export default MultiServiceToggle;
