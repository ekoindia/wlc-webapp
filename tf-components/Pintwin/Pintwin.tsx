import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { IcoButton } from "components/IcoButton";
import { InputLabel } from "components/InputLabel";
import { OtpInput } from "components/OtpInput";
import { usePinTwin } from "hooks/usePinTwin";
import { rotateAntiClockwise } from "libs/chakraKeyframes";
import React, { useCallback } from "react";

/**
 * Props for the Pintwin component
 */
interface PintwinProps {
	/** Label for the PIN input field */
	label?: string;
	/** Whether the component is disabled and non-interactive */
	disabled?: boolean;
	/** Number of digits for PIN (default: 4) */
	length?: number;
	/** Callback function called on every keystroke with raw PIN value */
	onPinChange?: (_pin: string) => void;
	/** Callback function called when PIN reaches required length with encoded value */
	onPinComplete?: (_pin: string, _encodedPin: string) => void;
}

/**
 * A secure PIN input component that uses a PinTwin key grid for entry.
 *
 * It relies on the `usePinTwin` hook for its logic, including API calls,
 * state management, PIN encoding and validation, functioning as a presentational component.
 * @param {PintwinProps} props - The props for the component.
 * @returns {React.ReactElement | null} A React functional component that renders the PinTwin interface.
 * @example
 * ```tsx
 * // Basic usage with automatic key loading
 * <Pintwin />
 *
 * // With separate change and complete handlers
 * <Pintwin
 *   length={4}
 *   onPinChange={(pin) => console.log('Typing:', pin)}
 *   onPinComplete={(pin, encodedPin) => console.log('Complete:', encodedPin)}
 * />
 * ```
 */
const Pintwin: React.FC<PintwinProps> = ({
	label = "Secret PIN",
	disabled = false,
	length = 4,
	onPinChange,
	onPinComplete,
}) => {
	const {
		pin,
		setPin,
		refreshPinTwinKey,
		encodePinTwin,
		validatePin,
		pinTwinKeyLoadStatus,
	} = usePinTwin();

	// Derive individual status flags from consolidated state for component logic
	// This maintains component readability while using the cleaner hook interface
	const loading = pinTwinKeyLoadStatus === "loading";
	const keyLoadError = pinTwinKeyLoadStatus === "error";

	/**
	 * Handles PIN input changes (for progress tracking only, no encoding)
	 */
	const handlePinInputChange = useCallback(
		(value: string) => {
			setPin(value);
			if (onPinChange) {
				onPinChange(value);
			}
		},
		[setPin, onPinChange]
	);

	/**
	 * Handles PIN input completion (validate, encode, and notify)
	 */
	const handlePinComplete = useCallback(
		(value: string) => {
			if (onPinComplete) {
				const validation = validatePin(value, length);
				if (validation.isValid) {
					const encodedValue = encodePinTwin(value);
					onPinComplete(value, encodedValue);
				}
			}
		},
		[onPinComplete, encodePinTwin, validatePin, length]
	);

	return (
		<Flex gap={4} align="center">
			<Flex
				direction="column"
				fontSize="lg"
				userSelect="none"
				fontFamily="inherit"
			>
				<InputLabel required>
					<Text>{label}</Text>
				</InputLabel>
				{/* PIN Input Section */}
				<Flex align="center" gap="4">
					<OtpInput
						mask={true}
						length={length}
						value={pin}
						onChange={handlePinInputChange}
						onComplete={handlePinComplete}
						inputStyle={{
							w: { base: 12, sm: 14 },
							h: { base: 12 },
							fontSize: "24px",
						}}
						isDisabled={disabled || loading || keyLoadError}
					/>

					<Tooltip
						hasArrow
						label={
							keyLoadError
								? "Failed! Click to reload security"
								: loading
									? "Wait! Loading security…"
									: "SECURE"
						}
						aria-label={
							keyLoadError
								? "Failed! Click to reload security"
								: loading
									? "Wait! Loading security…"
									: "SECURE"
						}
						placement="right"
						bg={
							keyLoadError
								? "error"
								: loading
									? "highlight"
									: "success"
						}
						color="white"
						borderRadius="8"
					>
						<span>
							<IcoButton
								iconName={
									keyLoadError
										? "replay"
										: loading
											? "retry"
											: "insurance"
								}
								onClick={
									keyLoadError ? refreshPinTwinKey : undefined
								}
								iconSize="sm"
								size="xs"
								theme="ghost"
								iconStyle={{
									color: keyLoadError
										? "error"
										: loading
											? "highlight"
											: "success",
									animation: loading
										? `${rotateAntiClockwise} 1s linear infinite`
										: "none",
								}}
								tabIndex={-1}
							/>
						</span>
					</Tooltip>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Pintwin;
export type { PintwinProps };
