/**
 * @file ScannerButton — Circular biometric capture button with dynamic colors and scanning animation.
 */
import { Box, IconButton, keyframes } from "@chakra-ui/react";
import { Icon } from "components";
import { memo } from "react";
import { getBiometricIcon } from "./utils/biometricIcons";
import type { BiometricType, RDStatusValue } from "./utils/rdServiceHelpers";
import { RD_STATUS } from "./utils/rdServiceHelpers";

interface ScannerButtonProps {
	status: RDStatusValue;
	serviceType: BiometricType;
	disabled?: boolean;
	onClick: () => void;
}

const scanAnimation = keyframes`
	50% { transform: translateY(50px); }
`;

/**
 * Get background color for the scanner button based on current status.
 * @param {RDStatusValue} status - The current RD status value.
 * @returns {string} - The background color string.
 */
const getButtonBg = (status: RDStatusValue): string => {
	if (status < 0) return "error";
	if (status === RD_STATUS.READY) return "primary.DEFAULT";
	if (status === RD_STATUS.SCAN_OK) return "success";
	return "var(--chakra-colors-gray-100, #FFF)";
};

/**
 * Get text/icon color for the scanner button based on current status.
 * @param {RDStatusValue} status - The current RD status value.
 * @returns {string} - The color string.
 */
const getButtonColor = (status: RDStatusValue): string => {
	if (
		status < 0 ||
		status === RD_STATUS.READY ||
		status === RD_STATUS.SCAN_OK
	) {
		return "#FFF";
	}
	return "var(--chakra-colors-gray-800, #212121)";
};

const ScannerButton = ({
	status,
	serviceType,
	disabled = false,
	onClick,
}: ScannerButtonProps): JSX.Element => {
	const iconName = getBiometricIcon(serviceType);
	const isScanning = status === RD_STATUS.SCANNING;
	const isDisabled =
		disabled ||
		status === RD_STATUS.SEARCHING ||
		status === RD_STATUS.SCANNING;

	return (
		<Box position="relative" display="inline-flex">
			<IconButton
				id="uidai-scanner-btn"
				aria-label="Capture biometric"
				isRound
				size="lg"
				w="60px"
				h="60px"
				minW="60px"
				bg={getButtonBg(status)}
				color={getButtonColor(status)}
				isDisabled={isDisabled}
				onClick={onClick}
				transition="background 0.1s ease-in, color 0.1s ease-in"
				_hover={{
					opacity: isDisabled ? 0.8 : 0.9,
				}}
				_disabled={{
					opacity: 0.8,
					cursor: "not-allowed",
				}}
				icon={<Icon name={iconName} size="xl" />}
			/>
			{isScanning ? (
				<Box
					position="absolute"
					left="2px"
					top="2px"
					width="56px"
					height="4px"
					borderRadius="2px"
					bgImage="linear-gradient(to right, rgba(0,184,0,0), rgba(0,184,0,0.7) 40%, rgba(0,184,0,0.7) 60%, rgba(0,184,0,0))"
					animation={`${scanAnimation} 1.5s ease-in-out infinite`}
					pointerEvents="none"
				/>
			) : null}
		</Box>
	);
};

export default memo(ScannerButton);
