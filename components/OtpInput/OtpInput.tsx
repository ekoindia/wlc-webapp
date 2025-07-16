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
 * // With value and change handlers
 * <OtpInput
 *   value="1234"
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
	/** Initial OTP value */
	value?: string;
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
 *   value="123"
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
	value,
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
	const [Otp, setOtp] = useState("");
	const inputfocusbg =
		(inputStyle?.focus as Record<string, any>)?.background ||
		"var(--chakra-colors-focusbg)";
	const inputbg = (inputStyle?.background as string) || " ";

	return (
		<Flex minW={"10rem"} columnGap={"10px"} wrap="wrap" {...containerStyle}>
			<PinInput
				autoFocus
				type="number"
				otp
				value={value}
				placeholder={placeholder}
				manageFocus={true}
				isDisabled={isDisabled}
				onChange={(e) => {
					setOtp(e);
					onChange(e);
				}}
				onComplete={(val) => {
					onComplete && onComplete(val);
				}}
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
							bg={Otp[idx] ? inputfocusbg : inputbg}
							borderRadius="10"
							boxShadow={Otp[idx] ? "sh-otpfocus" : ""}
							_focus={{
								// bg: "focusbg",
								boxShadow: "sh-otpfocus",
								borderColor: "hint",
								transition: "box-shadow 0.3s ease-out",
							}}
							onFocus={(e) => {
								if (!Otp.length || idx - Otp.length - 1 >= 0) {
									inputRef.current[Otp.length]?.focus();
								} else {
									const target = e.target as HTMLInputElement;
									target.style.background = inputfocusbg;
								}
							}}
							onKeyDown={(e) => {
								const target = e.target as HTMLInputElement;
								if (e.code === "Enter") {
									onEnter && onEnter(Otp);
								} else if (e.code === "Backspace") {
									target.style.background = "#fff";
								} else {
									target.style.background = inputfocusbg;
								}
								onKeyDown && onKeyDown(e);
							}}
							{...inputStyle}
						/>
					))}
			</PinInput>
		</Flex>
	);
};

export default OtpInput;
export type { OtpInputProps };
