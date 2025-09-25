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
	/** Callback function called when PIN is entered or changed */
	onPinChange?: (_pin: string, _encodedPin?: string) => void;
}

/**
 * Pintwin Component
 *
 * A secure PIN lookup display component that shows a PinTwin key grid for secure PIN entry.
 * This is a pure presentational component that uses the `usePinTwin` hook for all business logic
 * including API calls, consolidated state management, and PIN encoding functionality.
 * @param {PintwinProps} props Component properties
 * @returns {React.ReactElement | null} A React functional component that renders the PinTwin interface
 * @example
 * ```typescript
 * Basic usage with automatic key loading
 * <Pintwin />
 *
 * Disabled state (non-interactive)
 * <Pintwin disabled={true} />
 *
 * With PIN change handler
 * <Pintwin onPinChange={(pin, encodedPin) => console.log('PIN entered:', encodedPin)} />
 *
 * Combined configuration
 * <Pintwin
 *   disabled={false}
 *   onPinChange={handlePinEntry}
 * />
 * ```
 */
const Pintwin: React.FC<PintwinProps> = ({
	label = "Secret PIN",
	disabled = false,
	onPinChange,
}) => {
	const { refreshPinTwinKey, encodePinTwin, pinTwinKeyLoadStatus } =
		usePinTwin();

	// Derive individual status flags from consolidated state for component logic
	// This maintains component readability while using the cleaner hook interface
	const loading = pinTwinKeyLoadStatus === "loading";
	const keyLoadError = pinTwinKeyLoadStatus === "error";

	/**
	 * Handles PIN input changes (for length tracking only, no encoding)
	 */
	const handlePinInputChange = useCallback(
		(value: string) => {
			if (onPinChange) {
				onPinChange(value, undefined); // Only track length, do not encode
			}
		},
		[onPinChange]
	);

	/**
	 * Handles PIN input completion (encode only when complete)
	 */
	const handlePinComplete = useCallback(
		(value: string) => {
			if (onPinChange) {
				const encodedValue = encodePinTwin
					? encodePinTwin(value)
					: value;
				onPinChange(value, encodedValue);
			}
		},
		[onPinChange, encodePinTwin]
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
						length={4}
						onChange={handlePinInputChange}
						onComplete={handlePinComplete}
						inputStyle={{
							w: { base: 12, sm: 14 },
							h: { base: 12 },
							fontSize: "2em",
							textAlign: "center",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							sx: { caretColor: "transparent" },
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
