import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { IcoButton } from "components/IcoButton";
import { InputLabel } from "components/InputLabel";
import { OtpInput } from "components/OtpInput";
import { usePinTwin } from "hooks/usePinTwin";
import { rotateAntiClockwise } from "libs/chakraKeyframes";
import React, { useCallback } from "react";

/**
 * Props for the Pintwin component
 * @example
 * ```typescript
 * // Basic usage with automatic key loading
 * <Pintwin />
 *
 * // Disabled state (non-interactive)
 * <Pintwin disabled={true} />
 *
 * // Using mock data for testing/development
 * <Pintwin useMockData={true} />
 *
 * // Hidden mode (no lookup table shown)
 * <Pintwin noLookup={true} />
 *
 * // With PIN change handler
 * <Pintwin onPinChange={(pin, encodedPin) => console.log('PIN entered:', encodedPin)} />
 *
 * // Combined configuration
 * <Pintwin
 *   useMockData={true}
 *   disabled={false}
 *   noLookup={false}
 *   onPinChange={handlePinEntry}
 * />
 * ```
 */
interface PintwinProps {
	/** Whether the component is disabled and non-interactive */
	disabled?: boolean;
	/** Whether to use mock data instead of making API calls */
	useMockData?: boolean;
	/** Whether to show the lookup table (if true, component returns null) */
	noLookup?: boolean;
	/** Callback function called when PIN is entered or changed */
	onPinChange?: (_pin: string, _encodedPin?: string) => void;
	/** Placeholder text for PIN input */
	placeholder?: string;
	/** Label for the PIN input field */
	label?: string;
}

/**
 * Color palette for PinTwin key display
 */
const PIN_COLORS = ["#FFEB3B", "#81D4FA"];

/**
 * Pintwin Component
 *
 * A secure PIN lookup display component that shows a PinTwin key grid for secure PIN entry.
 * This is a pure presentational component that uses the `usePinTwin` hook for all business logic
 * including API calls, state management, and PIN encoding functionality.
 *
 * Key Features:
 * - Displays a 10-digit lookup table with colored indicators
 * - Automatic key fetching with retry logic
 * - Manual reload capability with visual feedback
 * - Loading states and error handling
 * - Mock data support for testing
 * - Responsive design with proper accessibility
 *
 * The component shows a grid where each digit (0-9) maps to a randomly generated digit from the server.
 * Users can use this visual lookup table to securely enter their PIN by referencing the corresponding digits.
 * @param {PintwinProps} props Component properties
 * @returns {React.ReactElement | null} A React functional component that renders the PinTwin interface, or null if noLookup is true
 * @example
 * ```typescript
 * // Basic usage - automatically fetches and displays PinTwin key
 * <Pintwin />
 *
 * // Development/testing mode with mock data
 * <Pintwin useMockData={true} />
 *
 * // Disabled state (user cannot reload key)
 * <Pintwin disabled={true} />
 *
 * // Hidden mode (useful for secure transactions where visual lookup should be disabled)
 * <Pintwin noLookup={true} />
 *
 * // Complete form integration example
 * import { useState } from 'react';
 * import { Pintwin } from 'tf-components/Pintwin/Pintwin';
 *
 * const PinEntryForm = () => {
 *   const [encodedPin, setEncodedPin] = useState('');
 *
 *   const handlePinChange = (pin, encoded) => {
 *     console.log('PIN entered:', pin);
 *     console.log('Encoded PIN:', encoded);
 *     setEncodedPin(encoded);
 *   };
 *
 *   return (
 *     <form>
 *       <Pintwin
 *         onPinChange={handlePinChange}
 *         placeholder="Enter your secure PIN"
 *       />
 *       <input type="hidden" value={encodedPin} name="encoded_pin" />
 *     </form>
 *   );
 * };
 *
 * // Advanced usage with custom configuration
 * <Pintwin
 *   useMockData={process.env.NODE_ENV === 'development'}
 *   disabled={isSubmitting}
 * />
 * ```
 */
const Pintwin: React.FC<PintwinProps> = ({
	disabled = false,
	useMockData = false,
	noLookup = true,
	onPinChange,
	label = "Secret PIN",
}) => {
	const {
		pintwinKey,
		refreshPinTwinKey,
		encodePinTwin,
		loading,
		keyLoadError,
	} = usePinTwin({
		useMockData,
	});

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

					{noLookup ? null : (
						<Flex
							align="center"
							gap={1}
							opacity={loading ? 0.4 : 1}
						>
							{pintwinKey?.map((digit, index) => (
								<React.Fragment key={index}>
									<Flex direction="column" align="center">
										<Text fontSize="sm">{index}</Text>
										<Box
											w="1.5em"
											h="1.5em"
											border="1px solid"
											borderRadius="50%"
											borderColor={PIN_COLORS[index % 2]}
											bg={PIN_COLORS[index % 2]}
											display="flex"
											alignItems="center"
											justifyContent="center"
											fontWeight="bold"
											fontSize="sm"
											color="gray.800"
										>
											{digit}
										</Box>
									</Flex>
								</React.Fragment>
							))}
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Pintwin;
export type { PintwinProps };
