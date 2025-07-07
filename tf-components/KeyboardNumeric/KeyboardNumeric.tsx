import { Box, Flex, Grid, Icon } from "@chakra-ui/react";
import { Button } from "components/Button";
import React, { useCallback, useMemo, useState } from "react";
import { FaArrowsAltH, FaBackspace, FaCheck } from "react-icons/fa";

/**
 * Configuration for a single keyboard key
 * @example
 * ```typescript
 * const customKey: KeyConfig = {
 *   key: "1",
 *   type: "number"
 * };
 *
 * const deleteKey: KeyConfig = {
 *   key: "⌫",
 *   type: "action"
 * };
 * ```
 */
interface KeyConfig {
	key: string;
	type: "number" | "action";
}

/**
 * Props for the KeyboardNumeric component
 * @example
 * ```typescript
 * // Basic numeric keyboard
 * <KeyboardNumeric
 *   onKeyPress={(key) => console.log('Key pressed:', key)}
 *   onDelete={() => console.log('Delete pressed')}
 *   onOk={() => console.log('OK pressed')}
 * />
 *
 * // Custom styling and left-handed mode
 * <KeyboardNumeric
 *   leftHanded={true}
 *   disabled={false}
 *   containerStyle={{ backgroundColor: '#f5f5f5' }}
 *   keyStyle={{ borderRadius: '8px' }}
 *   onKeyPress={handleKeyPress}
 * />
 * ```
 */
interface KeyboardNumericProps {
	/** Whether the keyboard is disabled */
	disabled?: boolean;
	/** Whether to show the keyboard on the left side (for left-handed users) */
	leftHanded?: boolean;
	/** Custom key configuration */
	keys?: KeyConfig[];
	/** Callback when a number key is pressed */
	onKeyPress?: (_key: string) => void;
	/** Callback when delete key is pressed */
	onDelete?: () => void;
	/** Callback when OK key is pressed */
	onOk?: () => void;
	/** Custom styling for the keyboard container */
	containerStyle?: React.CSSProperties;
	/** Custom styling for individual keys */
	keyStyle?: React.CSSProperties;
}

/**
 * Default keyboard layout
 */
const DEFAULT_KEYS: KeyConfig[] = [
	{ key: "1", type: "number" },
	{ key: "2", type: "number" },
	{ key: "3", type: "number" },
	{ key: "4", type: "number" },
	{ key: "5", type: "number" },
	{ key: "6", type: "number" },
	{ key: "7", type: "number" },
	{ key: "8", type: "number" },
	{ key: "9", type: "number" },
	{ key: "delete", type: "action" },
	{ key: "0", type: "number" },
	{ key: "ok", type: "action" },
];

/**
 * KeyboardNumeric Component
 *
 * A responsive numeric keyboard component designed for mobile PIN entry and numeric input.
 * Features a clean, accessible interface with haptic feedback and customizable layouts.
 *
 * Key Features:
 * - Full numeric keypad (0-9) with action buttons
 * - Left-handed mode for improved accessibility
 * - Haptic feedback (vibration) on key press
 * - Customizable key configuration
 * - Responsive design optimized for mobile devices
 * - Visual feedback with button press animations
 * - Support for custom styling
 * @param {KeyboardNumericProps} props - Component properties
 * @param {boolean} [props.disabled] - Whether the keyboard is disabled and non-interactive
 * @param {boolean} [props.leftHanded] - Whether to use left-handed layout (toggle button on left)
 * @param {KeyConfig[]} [props.keys] - Custom key configuration array (defaults to standard 0-9 layout)
 * @param {(key: string) => void} [props.onKeyPress] - Callback fired when a numeric key is pressed
 * @param {() => void} [props.onDelete] - Callback fired when delete/backspace key is pressed
 * @param {() => void} [props.onOk] - Callback fired when OK/enter key is pressed
 * @param {React.CSSProperties} [props.containerStyle] - Custom CSS styles for the keyboard container
 * @param {React.CSSProperties} [props.keyStyle] - Custom CSS styles for individual keys
 * @returns {React.ReactElement} A React functional component that renders an interactive numeric keyboard
 * @example
 * ```typescript
 * // PIN entry keyboard
 * const [pin, setPin] = useState('');
 *
 * <KeyboardNumeric
 *   disabled={pin.length >= 4}
 *   onKeyPress={(digit) => {
 *     if (pin.length < 4) {
 *       setPin(pin + digit);
 *     }
 *   }}
 *   onDelete={() => {
 *     setPin(pin.slice(0, -1));
 *   }}
 *   onOk={() => {
 *     if (pin.length === 4) {
 *       submitPin(pin);
 *     }
 *   }}
 * />
 *
 * // Calculator-style keyboard with custom styling
 * <KeyboardNumeric
 *   leftHanded={false}
 *   containerStyle={{
 *     backgroundColor: '#f8f9fa',
 *     borderRadius: '12px',
 *     padding: '16px'
 *   }}
 *   keyStyle={{
 *     fontSize: '18px',
 *     fontWeight: 'bold'
 *   }}
 *   onKeyPress={(num) => appendToCalculator(num)}
 * />
 *
 * // Custom key layout
 * const customKeys: KeyConfig[] = [
 *   { key: "1", type: "number" },
 *   { key: "2", type: "number" },
 *   { key: "3", type: "number" },
 *   { key: "⌫", type: "action" }
 * ];
 *
 * <KeyboardNumeric
 *   keys={customKeys}
 *   onKeyPress={handleCustomKey}
 * />
 * ```
 */
const KeyboardNumeric: React.FC<KeyboardNumericProps> = ({
	disabled = false,
	leftHanded = false,
	keys = DEFAULT_KEYS,
	onKeyPress,
	onDelete,
	onOk,
	containerStyle,
	keyStyle,
}) => {
	const [isLeftHanded, setIsLeftHanded] = useState(leftHanded);

	/**
	 * Triggers haptic feedback if available
	 */
	const triggerHapticFeedback = useCallback(() => {
		if ("vibrate" in navigator) {
			navigator.vibrate(10);
		}
	}, []);

	/**
	 * Handles key press events
	 */
	const handleKeyPress = useCallback(
		(keyConfig: KeyConfig) => {
			if (disabled) return;

			triggerHapticFeedback();

			if (keyConfig.type === "action") {
				if (keyConfig.key === "delete") {
					onDelete?.();
				} else if (keyConfig.key === "ok") {
					onOk?.();
				}
			} else {
				onKeyPress?.(keyConfig.key);
			}
		},
		[disabled, onKeyPress, onDelete, onOk, triggerHapticFeedback]
	);

	/**
	 * Toggles left-handed layout
	 */
	const toggleLeftHanded = useCallback(() => {
		setIsLeftHanded((prev) => !prev);
	}, []);

	/**
	 * Gets the button variant based on key type
	 */
	const getButtonVariant = useCallback((keyConfig: KeyConfig) => {
		if (keyConfig.type === "action") {
			if (keyConfig.key === "delete") {
				return "outline";
			} else if (keyConfig.key === "ok") {
				return "accent";
			}
		}
		return "outline";
	}, []);

	/**
	 * Renders individual keyboard key
	 */
	const renderKey = useCallback(
		(keyConfig: KeyConfig, index: number) => {
			return (
				<Button
					key={`${keyConfig.key}-${index}`}
					size="lg"
					variant={getButtonVariant(keyConfig)}
					disabled={disabled}
					onClick={() => handleKeyPress(keyConfig)}
					w="48px"
					h="48px"
					minW="48px"
					borderRadius="50%"
					fontSize="1.2em"
					fontWeight="300"
					style={keyStyle}
				>
					{keyConfig.key === "delete" ? (
						<Icon as={FaBackspace} />
					) : keyConfig.key === "ok" ? (
						<Icon as={FaCheck} />
					) : (
						keyConfig.key
					)}
				</Button>
			);
		},
		[disabled, getButtonVariant, handleKeyPress, keyStyle]
	);

	/**
	 * Renders the keyboard layout
	 */
	const renderKeyboard = useMemo(
		() => (
			<Box
				maxW="174px"
				p={2}
				bg="white"
				borderRadius="md"
				boxShadow="md"
				style={containerStyle}
			>
				<Grid templateColumns="repeat(3, 1fr)" gap={2}>
					{keys.map(renderKey)}
				</Grid>
			</Box>
		),
		[keys, renderKey, containerStyle]
	);

	/**
	 * Renders the side toggle button
	 */
	const renderSideToggle = useMemo(
		() => (
			<Box
				w="34px"
				h="34px"
				bg="gray.300"
				color="white"
				borderRadius="50%"
				display="flex"
				alignItems="center"
				justifyContent="center"
				cursor="pointer"
				onClick={toggleLeftHanded}
				mx={4}
				my={12}
			>
				<Icon as={FaArrowsAltH} />
			</Box>
		),
		[toggleLeftHanded]
	);

	return (
		<Box
			display="inline-block"
			userSelect="none"
			boxSizing="border-box"
			p={2}
		>
			<Flex
				align="center"
				justify="center"
				direction={isLeftHanded ? "row-reverse" : "row"}
				w="100%"
			>
				{/* Side toggle for left/right handed use */}
				<Flex
					direction={isLeftHanded ? "row-reverse" : "row"}
					align="center"
					flex={1}
				>
					{renderSideToggle}
				</Flex>

				{/* Spacer */}
				<Box w="1em" />

				{/* Keyboard */}
				{renderKeyboard}
			</Flex>
		</Box>
	);
};

export default KeyboardNumeric;
export type { KeyboardNumericProps, KeyConfig };
