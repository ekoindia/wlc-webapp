import { Box, Flex, Grid, Icon } from "@chakra-ui/react";
import { Button } from "components/Button";
import React, { useCallback, useMemo } from "react";
import { FaBackspace, FaCheck } from "react-icons/fa";

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
 * // Custom styling
 * <KeyboardNumeric
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
 * - Haptic feedback (vibration) on key press
 * - Customizable key configuration
 * - Responsive design optimized for mobile devices
 * - Visual feedback with button press animations
 * - Support for custom styling
 * @param {KeyboardNumericProps} props - Component properties
 * @param {boolean} [props.disabled] - Whether the keyboard is disabled and non-interactive
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
	keys = DEFAULT_KEYS,
	onKeyPress,
	onDelete,
	onOk,
	containerStyle,
	keyStyle,
}) => {
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
	 * Gets the button variant based on key type
	 */
	const getButtonVariant = useCallback((keyConfig: KeyConfig) => {
		if (keyConfig.type === "action") {
			if (keyConfig.key === "delete") {
				return "ghost";
			} else if (keyConfig.key === "ok") {
				return "accent";
			}
		}
		return "primary";
	}, []);

	/**
	 * Renders individual keyboard key
	 */
	const renderKey = useCallback(
		(keyConfig: KeyConfig, index: number) => {
			const variant = getButtonVariant(keyConfig);

			let styleProps = {};

			if (variant === "primary") {
				styleProps = {
					bg: "white",
					color: "gray.800",
					_hover: { bg: "gray.100" },
					boxShadow: "sm",
				};
			} else if (keyConfig.key === "delete") {
				styleProps = {
					color: "gray.500",
				};
			}

			return (
				<Button
					key={`${keyConfig.key}-${index}`}
					size="lg"
					variant={variant}
					disabled={disabled}
					onMouseDown={(e) => e.preventDefault()}
					onClick={() => handleKeyPress(keyConfig)}
					w="64px"
					h="64px"
					borderRadius="full"
					fontSize="xl"
					fontWeight="bold"
					style={keyStyle}
					{...styleProps}
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
			<Box p={2} bg="transparent" style={containerStyle}>
				<Grid templateColumns="repeat(3, 1fr)" gap={3}>
					{keys.map(renderKey)}
				</Grid>
			</Box>
		),
		[keys, renderKey, containerStyle]
	);

	return (
		<Flex
			justify="center"
			align="center"
			w="100%"
			userSelect="none"
			boxSizing="border-box"
		>
			{renderKeyboard}
		</Flex>
	);
};

export default KeyboardNumeric;
export type { KeyboardNumericProps, KeyConfig };
