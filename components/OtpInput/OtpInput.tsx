import { Flex, PinInput, PinInputField } from "@chakra-ui/react";
import { useRef, useState } from "react";

/**
 * Props for the OtpInput component
 * @example
 * ```typescript
 * // Basic usage with default 6-digit OTP
 * <OtpInput />
 *
 * // Custom length OTP input
 * <OtpInput length={4} />
 *
 * // With change handlers
 * <OtpInput
 *   onChange={(value) => console.log('OTP changed:', value)}
 *   onComplete={(value) => console.log('OTP completed:', value)}
 * />
 *
 * // With custom styling
 * <OtpInput
 *   inputStyle={{ w: 12, h: 12, fontSize: "lg" }}
 *   containerStyle={{ gap: 2 }}
 * />
 *
 * // Disabled state
 * <OtpInput isDisabled={true} />
 * ```
 */
interface OtpInputProps {
	/** Number of input fields to display (default: 6) */
	length?: number;
	/** Placeholder text for input fields */
	placeholder?: string;
	/** Styles for the container Flex component */
	containerStyle?: Record<string, any>;
	/** Styles for individual input fields */
	inputStyle?: Record<string, any>;
	/** Callback function called when OTP value changes */
	onChange?: (_value: string) => void;
	/** Callback function called on key down events */
	onKeyDown?: (_event: React.KeyboardEvent) => void;
	/** Callback function called when Enter key is pressed */
	onEnter?: (_value: string) => void;
	/** Callback function called when OTP is completely filled */
	onComplete?: (_value: string) => void;
	/** Whether the input is disabled */
	isDisabled?: boolean;
	/** Whether to mask the input */
	mask?: boolean;
}

/**
 * OtpInput Component
 *
 * A customizable OTP (One-Time Password) input component that provides a user-friendly
 * interface for entering numeric codes. Features include automatic focus management,
 * keyboard navigation, and visual feedback for filled/empty states.
 *
 * Key Features:
 * - Configurable number of input fields
 * - Automatic focus progression
 * - Visual feedback for filled states
 * - Keyboard navigation support (Enter, Backspace)
 * - Customizable styling
 * - Accessibility support
 * @param {OtpInputProps} props Component properties
 * @returns {React.ReactElement} A React functional component that renders the OTP input interface
 * @example
 * ```typescript
 * // Basic 4-digit OTP input
 * <OtpInput length={4} onComplete={handleOtpComplete} />
 *
 * // Styled OTP input with custom handlers
 * <OtpInput
 *   length={6}
 *   onChange={handleOtpChange}
 *   onComplete={handleOtpComplete}
 *   inputStyle={{
 *     w: 14,
 *     h: 14,
 *     fontSize: "lg",
 *     borderColor: "blue.500"
 *   }}
 *   containerStyle={{
 *     gap: 3,
 *     justifyContent: "center"
 *   }}
 * />
 *
 * // Disabled state for form submission
 * <OtpInput
 *   length={4}
 *   isDisabled={isSubmitting}
 *   onComplete={handleSubmit}
 * />
 * ```
 */
const OtpInput: React.FC<OtpInputProps> = ({
	length = 6,
	placeholder = "",
	mask = false,
	containerStyle = {},
	inputStyle = {},
	onChange = () => {},
	onKeyDown = () => {},
	onEnter = () => {},
	onComplete = () => {},
	isDisabled,
	...rest
}) => {
	const inputRef = useRef<(HTMLInputElement | null)[]>([]);
	const [currentOtp, setCurrentOtp] = useState("");
	const [activeInputIndex, setActiveInputIndex] = useState<number | null>(
		null
	);
	const [isBackspacePressed, setIsBackspacePressed] = useState(false);

	const inputFocusBg =
		(inputStyle?.focus as Record<string, any>)?.background ||
		"var(--chakra-colors-focusbg)";
	const inputBg = (inputStyle?.background as string) || "";

	/**
	 * Determines the background color for a specific input field
	 * @param {number} index - The index of the input field
	 * @returns {string} The background color to apply
	 */
	const getInputBackground = (index: number): string => {
		// If input has a value, use focus background
		if (currentOtp[index]) {
			return inputFocusBg;
		}

		// If this is the active input and backspace was pressed, use default background
		if (activeInputIndex === index && isBackspacePressed) {
			return inputBg;
		}

		// If this is the active input, use focus background
		if (activeInputIndex === index) {
			return inputFocusBg;
		}

		// Default background
		return inputBg;
	};

	/**
	 * Handles focus events on input fields
	 * @param {React.FocusEvent} _e - The focus event
	 * @param {number} index - The index of the focused input
	 */
	const handleFocus = (_e: React.FocusEvent, index: number): void => {
		setActiveInputIndex(index);
		setIsBackspacePressed(false);

		// Auto-focus to first empty field if clicking on a field beyond current OTP length
		if (!currentOtp.length || index > currentOtp.length - 1) {
			const firstEmptyIndex = currentOtp.length;
			if (firstEmptyIndex < length) {
				inputRef.current[firstEmptyIndex]?.focus();
				setActiveInputIndex(firstEmptyIndex);
			}
		}
	};

	/**
	 * Handles key down events on input fields
	 * @param {React.KeyboardEvent} e - The keyboard event
	 * @param {number} index - The index of the input field
	 */
	const handleKeyDown = (e: React.KeyboardEvent, index: number): void => {
		setActiveInputIndex(index);

		if (e.code === "Enter") {
			onEnter(currentOtp);
		} else if (e.code === "Backspace") {
			setIsBackspacePressed(true);
		} else {
			setIsBackspacePressed(false);
		}

		onKeyDown(e);
	};

	/**
	 * Handles OTP value changes
	 * @param {string} value - The new OTP value
	 */
	const handleChange = (value: string): void => {
		setCurrentOtp(value);
		onChange(value);
	};

	return (
		<Flex minW={"10rem"} columnGap={"10px"} wrap="wrap" {...containerStyle}>
			<PinInput
				autoFocus
				type="number"
				otp
				value={currentOtp}
				placeholder={placeholder}
				manageFocus={true}
				isDisabled={isDisabled}
				onChange={handleChange}
				onComplete={onComplete}
				mask={mask}
				{...rest}
			>
				{Array(length)
					.fill(null)
					.map((_, idx) => (
						<PinInputField
							key={idx}
							ref={(ref: HTMLInputElement | null) => {
								inputRef.current[idx] = ref;
							}}
							borderColor="hint"
							bg={getInputBackground(idx)}
							borderRadius="10"
							boxShadow={currentOtp[idx] ? "sh-otpfocus" : ""}
							_focus={{
								boxShadow: "sh-otpfocus",
								borderColor: "hint",
								transition: "box-shadow 0.3s ease-out",
							}}
							onFocus={(e) => handleFocus(e, idx)}
							onKeyDown={(e) => handleKeyDown(e, idx)}
							{...inputStyle}
						/>
					))}
			</PinInput>
		</Flex>
	);
};

export default OtpInput;
export type { OtpInputProps };
