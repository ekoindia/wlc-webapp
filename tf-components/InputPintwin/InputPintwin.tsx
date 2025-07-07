import {
	Box,
	Collapse,
	Flex,
	Icon,
	useBreakpointValue,
} from "@chakra-ui/react";
import { Button } from "components/Button";
import { Input } from "components/Input";
import { ParamType } from "constants/trxnFramework";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { FaLock } from "react-icons/fa";
import KeyboardNumeric from "../KeyboardNumeric/KeyboardNumeric";
import Pintwin, { PinTwinResponse } from "../Pintwin/Pintwin";

/**
 * Props for the InputPintwin component
 * @example
 * ```typescript
 * // Basic PIN input with PinTwin security
 * <InputPintwin
 *   name="pin"
 *   label="Enter Your PIN"
 *   lengthMin={4}
 *   lengthMax={6}
 *   required={true}
 *   pintwinApp={true}
 *   fetchPinTwinKey={async () => await api.getPinTwinKey()}
 *   onChange={(encoded, masked) => {
 *     console.log('Encoded PIN:', encoded);
 *     console.log('Masked display:', masked);
 *   }}
 *   onValidationChange={(isValid) => setIsFormValid(isValid)}
 * />
 *
 * // Set PIN mode
 * <InputPintwin
 *   label="Set Your New PIN"
 *   metadata="reset_pin_interaction_id"
 *   showSetPin={true}
 *   onSetPin={() => handleSetPin()}
 * />
 * ```
 */
interface InputPintwinProps {
	/** Input field name */
	name?: string;
	/** Input field label */
	label?: string;
	/** Input field value */
	_value?: string;
	/** Decorated value for display (with masking) */
	valueDecorated?: string;
	/** Whether the input is disabled */
	disabled?: boolean;
	/** Whether the input is frozen (read-only but displayed) */
	isFrozen?: boolean;
	/** Whether the input is visible */
	isVisible?: boolean;
	/** Whether the input is required */
	required?: boolean;
	/** Whether the input is invalid */
	invalid?: boolean;
	/** Error message to display */
	errorMessage?: string;
	/** Description/help text */
	description?: string;
	/** Minimum length */
	lengthMin?: number;
	/** Maximum length */
	lengthMax?: number;
	/** Whether PinTwin app is enabled */
	pintwinApp?: boolean;
	/** Whether to show Set PIN mode */
	showSetPin?: boolean;
	/** Metadata for additional configuration */
	metadata?: string;
	/** Custom PinTwin key fetch function */
	fetchPinTwinKey?: () => Promise<PinTwinResponse>;
	/** Callback when value changes */
	onChange?: (_value: string, _decoratedValue: string) => void;
	/** Callback when validation changes */
	onValidationChange?: (_isValid: boolean) => void;
	/** Callback when focus changes */
	onFocusChange?: (_isFocused: boolean) => void;
	/** Callback when jump to next field is requested */
	onJumpToNext?: () => void;
	/** Callback when Set PIN is requested */
	onSetPin?: () => void;
	/** Callback when Reset PIN is requested */
	onResetPin?: () => void;
}

/**
 * InputPintwin Component
 *
 * A secure PIN input component that combines:
 * - Standard input field with password masking
 * - PinTwin keypad for secure PIN lookup
 * - Numeric keyboard for mobile devices
 * - Input validation and error handling
 * - Support for Set PIN and Reset PIN functionality
 *
 * Features:
 * - Secure PIN entry with visual masking
 * - PinTwin encoding for enhanced security
 * - Mobile-responsive design
 * - Haptic feedback on mobile
 * - Real-time validation
 * - Accessibility support
 * @param {InputPintwinProps} props - Component properties
 * @param {string} [props.name] - Input field name attribute for form handling
 * @param {string} [props.label] - Display label for the input field
 * @param {string} [props._value] - Internal value (prefixed with underscore as unused)
 * @param {string} [props.valueDecorated] - Masked value for display purposes (e.g., "****")
 * @param {boolean} [props.disabled] - Whether the input is disabled and non-interactive
 * @param {boolean} [props.isFrozen] - Whether the input is read-only but still displayed
 * @param {boolean} [props.isVisible] - Whether the component should be rendered
 * @param {boolean} [props.required] - Whether the input is required for form validation
 * @param {boolean} [props.invalid] - Whether the input is in an invalid state
 * @param {string} [props.errorMessage] - Error message to display when validation fails
 * @param {string} [props.description] - Help text or description for the input
 * @param {number} [props.lengthMin] - Minimum required length for PIN validation
 * @param {number} [props.lengthMax] - Maximum allowed length for PIN input
 * @param {boolean} [props.pintwinApp] - Whether to enable PinTwin secure keypad
 * @param {boolean} [props.showSetPin] - Whether to show Set PIN mode for PIN creation
 * @param {string} [props.metadata] - Additional metadata for PIN operations
 * @param {() => Promise<PinTwinResponse>} [props.fetchPinTwinKey] - Custom function to fetch PinTwin encryption key
 * @param {(value: string, decoratedValue: string) => void} [props.onChange] - Callback fired when PIN value changes with encoded and masked values
 * @param {(isValid: boolean) => void} [props.onValidationChange] - Callback fired when validation state changes
 * @param {(isFocused: boolean) => void} [props.onFocusChange] - Callback fired when input focus state changes
 * @param {() => void} [props.onJumpToNext] - Callback fired when user wants to proceed to next field
 * @param {() => void} [props.onSetPin] - Callback fired when Set PIN action is requested
 * @param {() => void} [props.onResetPin] - Callback fired when Reset PIN action is requested
 * @returns {React.ReactElement} A React functional component that renders the secure PIN input interface
 * @example
 * ```typescript
 * // Basic usage with validation
 * const [pin, setPin] = useState('');
 * const [isValid, setIsValid] = useState(false);
 *
 * <InputPintwin
 *   name="userPin"
 *   label="Enter Your 4-Digit PIN"
 *   lengthMin={4}
 *   lengthMax={4}
 *   required={true}
 *   pintwinApp={true}
 *   fetchPinTwinKey={async () => {
 *     const response = await fetch('/api/pintwin-key');
 *     return response.json();
 *   }}
 *   onChange={(encodedPin, maskedPin) => {
 *     setPin(encodedPin);
 *     console.log('User sees:', maskedPin); // "****"
 *   }}
 *   onValidationChange={setIsValid}
 *   onFocusChange={(focused) => {
 *     if (focused) console.log('PIN input focused');
 *   }}
 * />
 *
 * // Set PIN workflow
 * <InputPintwin
 *   label="Create Your New PIN"
 *   lengthMin={4}
 *   lengthMax={6}
 *   metadata="new_pin_setup"
 *   showSetPin={true}
 *   onSetPin={() => {
 *     // Navigate to PIN creation flow
 *     router.push('/set-pin');
 *   }}
 *   onResetPin={() => {
 *     // Handle forgot PIN scenario
 *     router.push('/forgot-pin');
 *   }}
 * />
 * ```
 */
const InputPintwin: React.FC<InputPintwinProps> = ({
	name,
	label = "Secret PIN",
	_value = "",
	valueDecorated = "",
	disabled = false,
	isFrozen = false,
	isVisible = true,
	required = true,
	invalid = false,
	errorMessage = "",
	description = "",
	lengthMin = 4,
	lengthMax = 4,
	pintwinApp = false,
	showSetPin = false,
	metadata = "",
	fetchPinTwinKey,
	onChange,
	onValidationChange,
	onFocusChange,
	onJumpToNext,
	onSetPin,
	onResetPin,
}) => {
	// State management
	const [secretValue, setSecretValue] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [showKeyboard, setShowKeyboard] = useState(false);
	const [showPintwin, setShowPintwin] = useState(false);
	const [stretched, setStretched] = useState(false);
	const [keyLoaded, setKeyLoaded] = useState(false);
	const [keyLoadError, setKeyLoadError] = useState(false);
	const [keyId, setKeyId] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [activelyDisabled, setActivelyDisabled] = useState(false);
	const [setPinMode, setSetPinMode] = useState(false);
	const [encodePinTwin, setEncodePinTwin] = useState<
		((_pin: string) => string) | null
	>(null);

	// Refs
	const inputRef = useRef<HTMLInputElement>(null);

	// Responsive breakpoint
	const isMobile = useBreakpointValue({ base: true, md: false });

	/**
	 * Validates the current input
	 */
	const validateInput = useCallback(
		(silently = false) => {
			if (!isVisible || !keyLoaded) {
				setIsValid(false);
				onValidationChange?.(false);
				return;
			}

			const val = secretValue || "";
			let hasError = false;

			// Set PIN mode validation
			if (setPinMode && activelyDisabled) {
				hasError = true;
			}
			// Required field validation
			else if (required && val.length === 0) {
				hasError = true;
			}
			// Minimum length validation
			else if (val.length > 0 && val.length < lengthMin) {
				hasError = true;
			}
			// Maximum length validation
			else if (val.length > 0 && val.length > lengthMax) {
				hasError = true;
			}

			if (hasError) {
				setIsValid(false);
				onValidationChange?.(false);
				if (!silently && !isFrozen) {
					// Set error message
				}
			} else {
				setIsValid(true);
				onValidationChange?.(true);
			}
		},
		[
			isVisible,
			keyLoaded,
			secretValue,
			setPinMode,
			activelyDisabled,
			required,
			lengthMin,
			lengthMax,
			isFrozen,
			onValidationChange,
		]
	);

	/**
	 * Handles input changes
	 */
	const handleInputChange = useCallback(
		(inputValue: string) => {
			// Filter to only numeric input
			const numericValue = inputValue.replace(/[^0-9]/g, "");

			// Enforce max length
			const trimmedValue = numericValue.slice(0, lengthMax);

			setSecretValue(trimmedValue);

			// Create masked display value
			const maskedValue = trimmedValue.replace(/./g, "*");

			// Encode with PinTwin if available
			let encodedValue = trimmedValue;
			if (encodePinTwin && trimmedValue.length > 0) {
				encodedValue = encodePinTwin(trimmedValue);

				// Append key ID for server identification
				if (keyId && trimmedValue.length === lengthMax) {
					encodedValue += `|${keyId}`;
				}
			}

			onChange?.(encodedValue, maskedValue);

			// Show stretch animation if max length reached
			if (trimmedValue.length >= lengthMax) {
				setStretched(true);
				setTimeout(() => setStretched(false), 100);
			}

			// Re-validate if already invalid
			if (!isValid || invalid) {
				validateInput();
			}
		},
		[
			lengthMax,
			keyId,
			onChange,
			isValid,
			invalid,
			validateInput,
			encodePinTwin,
		]
	);

	/**
	 * Handles focus events
	 */
	const handleFocus = useCallback(() => {
		setIsFocused(true);
		setShowPintwin(true);
		setShowKeyboard(isMobile && keyLoaded);
		onFocusChange?.(true);
	}, [isMobile, keyLoaded, onFocusChange]);

	/**
	 * Handles blur events
	 */
	const handleBlur = useCallback(() => {
		setIsFocused(false);
		setTimeout(() => {
			setShowPintwin(false);
			setShowKeyboard(false);
		}, 100);
		onFocusChange?.(false);
		validateInput();
	}, [onFocusChange, validateInput]);

	/**
	 * Handles numeric keyboard key press
	 */
	const handleKeyboardKeyPress = useCallback(
		(key: string) => {
			const newValue = secretValue + key;
			handleInputChange(newValue);
		},
		[secretValue, handleInputChange]
	);

	/**
	 * Handles numeric keyboard delete
	 */
	const handleKeyboardDelete = useCallback(() => {
		setSecretValue("");
		onChange?.("", "");
	}, [onChange]);

	/**
	 * Handles numeric keyboard OK
	 */
	const handleKeyboardOk = useCallback(() => {
		onJumpToNext?.();
	}, [onJumpToNext]);

	/**
	 * Handles PinTwin key loading state changes
	 */
	const handleKeyLoadStateChange = useCallback(
		(loaded: boolean, error: boolean) => {
			setKeyLoaded(loaded);
			setKeyLoadError(error);

			if (loaded && isFocused && isMobile) {
				setShowKeyboard(true);
			}
		},
		[isFocused, isMobile]
	);

	/**
	 * Handles PinTwin key reload
	 */
	const handleKeyReloaded = useCallback(
		(newKeyId: string) => {
			setKeyId(newKeyId);
			// Re-encode current value with new key
			if (secretValue && encodePinTwin) {
				const encodedValue = encodePinTwin(secretValue);
				const maskedValue = secretValue.replace(/./g, "*");
				onChange?.(
					encodedValue + (newKeyId ? `|${newKeyId}` : ""),
					maskedValue
				);
			}
		},
		[secretValue, onChange, encodePinTwin]
	);

	/**
	 * Handles setting the encodePinTwin function from Pintwin
	 */
	const handleEncodePinTwinReady = useCallback(
		(encoderFn: (_pin: string) => string) => {
			setEncodePinTwin(() => encoderFn);
		},
		[]
	);

	/**
	 * Processes Set PIN mode
	 */
	useEffect(() => {
		const shouldShowSetPin = Boolean(metadata && showSetPin);
		setSetPinMode(shouldShowSetPin);

		if (shouldShowSetPin) {
			setActivelyDisabled(true);
		} else {
			setActivelyDisabled(false);
		}
	}, [metadata, showSetPin]);

	/**
	 * Determines if PinTwin should be visible
	 */
	const isPintwinVisible = useMemo(() => {
		return isVisible && !isFrozen && !setPinMode && pintwinApp;
	}, [isVisible, isFrozen, setPinMode, pintwinApp]);

	/**
	 * Determines if numeric keyboard should be visible
	 */
	const isKeyboardVisible = useMemo(() => {
		return isVisible && !isFrozen && isMobile && keyLoaded;
	}, [isVisible, isFrozen, isMobile, keyLoaded]);

	/**
	 * Determines if reset PIN is allowed
	 */
	const isResetPinAllowed = useMemo(() => {
		return Boolean(metadata && !showSetPin);
	}, [metadata, showSetPin]);

	/**
	 * Handles input click (for Set PIN mode)
	 */
	const handleInputClick = useCallback(() => {
		if (setPinMode) {
			onSetPin?.();
		} else if (keyLoadError && !keyLoaded) {
			// Retry loading PinTwin key
			fetchPinTwinKey?.();
		}
		inputRef.current?.focus();
	}, [setPinMode, keyLoadError, keyLoaded, onSetPin, fetchPinTwinKey]);

	/**
	 * Renders the input field
	 */
	const renderInput = useMemo(
		() => (
			<Box position="relative" width="100%">
				<Input
					ref={inputRef}
					name={name}
					label={label}
					value={valueDecorated}
					type="password"
					inputMode="tel"
					minLength={lengthMin}
					maxLength={lengthMax}
					required={required}
					disabled={disabled || isFrozen || !keyLoaded || setPinMode}
					invalid={invalid}
					errorMsg={errorMessage}
					description={
						isFocused && !invalid ? description : undefined
					}
					placeholder=""
					autoComplete="new-password"
					onClick={handleInputClick}
					onChange={(e) => handleInputChange(e.target.value)}
					onFocus={handleFocus}
					onBlur={handleBlur}
					inputLeftElement={<Icon as={FaLock} color="gray.400" />}
					inputRightElement={
						stretched ? (
							<Box
								w="2px"
								h="20px"
								bg="red.500"
								borderRadius="1px"
								transition="width 0.1s ease-out"
							/>
						) : null
					}
				/>
			</Box>
		),
		[
			name,
			label,
			valueDecorated,
			lengthMin,
			lengthMax,
			required,
			disabled,
			isFrozen,
			keyLoaded,
			setPinMode,
			invalid,
			errorMessage,
			isFocused,
			description,
			stretched,
			handleInputClick,
			handleInputChange,
			handleFocus,
			handleBlur,
		]
	);

	/**
	 * Renders the bottom action buttons
	 */
	const renderBottomActions = useMemo(
		() => (
			<Flex justify="flex-end" mt={2} gap={2}>
				{setPinMode && (
					<Button size="sm" variant="accent" onClick={onSetPin}>
						Set Your PIN
					</Button>
				)}

				{isResetPinAllowed && (
					<Button size="sm" variant="ghost" onClick={onResetPin}>
						Forgot PIN?
					</Button>
				)}
			</Flex>
		),
		[setPinMode, isResetPinAllowed, onSetPin, onResetPin]
	);

	if (!isVisible) {
		return null;
	}

	return (
		<Box width="100%">
			{/* Main Input */}
			{renderInput}

			{/* PinTwin Keypad */}
			{isPintwinVisible && (
				<Collapse in={showPintwin} animateOpacity>
					<Box mt={4}>
						<Pintwin
							keyId={keyId}
							keyLoaded={keyLoaded}
							keyLoadError={keyLoadError}
							noLookup={false}
							disabled={disabled}
							onKeyReloaded={handleKeyReloaded}
							onKeyLoadStateChange={handleKeyLoadStateChange}
							onEncodePinTwinReady={handleEncodePinTwinReady}
							fetchPinTwinKey={fetchPinTwinKey}
						/>
					</Box>
				</Collapse>
			)}

			{/* Numeric Keyboard for Mobile */}
			{isKeyboardVisible && (
				<Collapse in={showKeyboard} animateOpacity>
					<Box mt={4}>
						<KeyboardNumeric
							disabled={disabled}
							onKeyPress={handleKeyboardKeyPress}
							onDelete={handleKeyboardDelete}
							onOk={handleKeyboardOk}
						/>
					</Box>
				</Collapse>
			)}

			{/* Bottom Actions */}
			{!disabled && !isFrozen && renderBottomActions}
		</Box>
	);
};

export default InputPintwin;
export type { InputPintwinProps, ParamType };
