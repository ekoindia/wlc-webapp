import { Box, Flex, Icon, Spinner, Text, useToast } from "@chakra-ui/react";
import { Button } from "components/Button";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaRedo, FaShieldAlt } from "react-icons/fa";

/**
 * PinTwin response data interface
 * @example
 * ```typescript
 * const response: PinTwinResponse = {
 *   response_status_id: 0,
 *   data: {
 *     customer_id_type: "mobile_number",
 *     key_id: 39,
 *     pintwin_key: "1974856302",
 *     id_type: "mobile_number",
 *     customer_id: "9002333333"
 *   },
 *   response_type_id: 2,
 *   message: "Success!",
 *   status: 0
 * };
 * ```
 */
interface PinTwinResponse {
	response_status_id: number;
	data: {
		customer_id_type: string;
		key_id: number;
		pintwin_key: string;
		id_type: string;
		customer_id: string;
	};
	response_type_id: number;
	message: string;
	status: number;
}

/**
 * Props for the Pintwin component
 * @example
 * ```typescript
 * // Basic usage with lookup mode
 * <Pintwin
 *   keyLoaded={true}
 *   noLookup={false}
 *   fetchPinTwinKey={async () => await api.getPinTwinKey()}
 *   onKeyReloaded={(keyId) => console.log('Key loaded:', keyId)}
 *   onKeyLoadStateChange={(loaded, error) => setKeyState({loaded, error})}
 * />
 *
 * // Secure mode (no lookup table)
 * <Pintwin
 *   keyLoaded={true}
 *   noLookup={true}
 *   disabled={false}
 * />
 * ```
 */
interface PintwinProps {
	/** ID/position of the PinTwin key */
	_keyId?: string;
	/** Whether PinTwin key is loaded */
	keyLoaded?: boolean;
	/** Whether there was an error loading the key */
	keyLoadError?: boolean;
	/** Whether to show the lookup table (if false, shows direct PIN entry) */
	noLookup?: boolean;
	/** Whether the component is disabled */
	disabled?: boolean;
	/** Language for localization */
	_language?: string;
	/** Callback when PinTwin key is reloaded */
	onKeyReloaded?: (_keyId: string) => void;
	/** Callback when key loading state changes */
	onKeyLoadStateChange?: (_loaded: boolean, _error: boolean) => void;
	/** Callback when encodePinTwin function is ready */
	onEncodePinTwinReady?: (_encoderFn: (_pin: string) => string) => void;
	/** Custom API function for fetching PinTwin key */
	fetchPinTwinKey?: () => Promise<PinTwinResponse>;
	/** ID/position of the PinTwin key */
	keyId?: string;
	/** Language for localization */
	language?: string;
}

/**
 * Color palette for PinTwin key display
 */
const PIN_COLORS = [
	{ bg: "#FFEB3B", border: "#FFEB3B" },
	{ bg: "#81D4FA", border: "#81D4FA" },
	{ bg: "#FFEB3B", border: "#FFEB3B" },
	{ bg: "#81D4FA", border: "#81D4FA" },
	{ bg: "#FFEB3B", border: "#FFEB3B" },
];

/**
 * Pintwin Component
 *
 * A secure PIN entry component that displays a PinTwin key grid for secure PIN input.
 * The component can operate in two modes:
 * 1. Lookup mode: Shows a visual grid of random digits for secure PIN entry
 * 2. Direct mode: Shows security status for direct PIN entry
 *
 * The component fetches a PinTwin key from the server and displays it as a 10-digit
 * lookup table. Users can use this table to securely enter their PIN by looking up
 * the corresponding digits.
 * @param {PintwinProps} props - Component properties
 * @param {string} [props._keyId] - Internal key identifier (prefixed with underscore as unused)
 * @param {boolean} [props.keyLoaded] - Whether the PinTwin key has been successfully loaded
 * @param {boolean} [props.keyLoadError] - Whether there was an error loading the PinTwin key
 * @param {boolean} [props.noLookup] - If true, shows secure mode without lookup table
 * @param {boolean} [props.disabled] - Whether the component is disabled and non-interactive
 * @param {string} [props._language] - Language code for localization (prefixed with underscore as unused)
 * @param {(keyId: string) => void} [props.onKeyReloaded] - Callback fired when a new PinTwin key is loaded
 * @param {(loaded: boolean, error: boolean) => void} [props.onKeyLoadStateChange] - Callback fired when key loading state changes
 * @param {(encoderFn: (pin: string) => string) => void} [props.onEncodePinTwinReady] - Callback to provide the PIN encoding function
 * @param {() => Promise<PinTwinResponse>} [props.fetchPinTwinKey] - Custom function to fetch PinTwin key from API
 * @param {string} [props.keyId] - Key identifier for PIN encoding
 * @param {string} [props.language] - Language preference for UI
 * @returns {React.ReactElement} A React functional component that renders the PinTwin interface
 * @example
 * ```typescript
 * // Basic usage with automatic key fetching
 * <Pintwin
 *   keyLoaded={true}
 *   keyLoadError={false}
 *   noLookup={false}
 *   fetchPinTwinKey={async () => {
 *     const response = await fetch('/api/pintwin-key');
 *     return response.json();
 *   }}
 *   onKeyReloaded={(keyId) => {
 *     console.log('New PinTwin key loaded:', keyId);
 *   }}
 *   onKeyLoadStateChange={(loaded, error) => {
 *     if (loaded) {
 *       console.log('Key loaded successfully');
 *     } else if (error) {
 *       console.error('Failed to load key');
 *     }
 *   }}
 *   onEncodePinTwinReady={(encoderFn) => {
 *     // Store the encoder function for PIN encoding
 *     setEncodePinTwin(() => encoderFn);
 *   }}
 * />
 *
 * // Secure mode without lookup table
 * <Pintwin
 *   keyLoaded={true}
 *   noLookup={true}
 *   disabled={false}
 * />
 * ```
 */
const Pintwin: React.FC<PintwinProps> = ({
	_keyId,
	keyLoaded = false,
	keyLoadError = false,
	noLookup = false,
	disabled = false,
	_language = "en",
	onKeyReloaded,
	onKeyLoadStateChange,
	onEncodePinTwinReady,
	fetchPinTwinKey,
	keyId: _keyId2,
	language: _language2,
}) => {
	const [loading, setLoading] = useState(false);
	const [pintwinKey, setPintwinKey] = useState<string[]>([]);
	const [retryCount, setRetryCount] = useState(0);
	const toast = useToast();

	const MAX_RETRY_COUNT = 8;
	const RETRY_DELAY = 1000; // Assuming a default RETRY_DELAY

	/**
	 * Handles key reloading with error handling and retry logic
	 */
	const handleKeyReload = useCallback(async () => {
		if (loading) return;

		// Mock response for development/testing
		const mockPinTwinResponse = {
			response_status_id: 0,
			data: {
				customer_id_type: "mobile_number",
				key_id: 39,
				pintwin_key: "1974856302",
				id_type: "mobile_number",
				customer_id: "9002333333",
			},
			response_type_id: 2,
			message: "Success!",
			status: 0,
		};

		try {
			setLoading(true);
			onKeyLoadStateChange?.(true, false);

			let response;
			if (fetchPinTwinKey) {
				response = await fetchPinTwinKey();
			} else {
				// Use mock response when no fetch function provided
				response = mockPinTwinResponse;
			}

			if (response?.data?.pintwin_key) {
				setPintwinKey(response.data.pintwin_key);
				setRetryCount(0);
				onKeyReloaded?.(response.data.key_id?.toString() || "");
				onKeyLoadStateChange?.(false, false);
				toast({
					title: "PinTwin key loaded successfully",
					status: "success",
					duration: 2000,
				});
			} else {
				throw new Error("Invalid response format");
			}
		} catch (error) {
			console.error("Error loading PinTwin key:", error);
			onKeyLoadStateChange?.(false, true);

			if (retryCount < MAX_RETRY_COUNT) {
				const newRetryCount = retryCount + 1;
				setRetryCount(newRetryCount);
				toast({
					title: `Failed to load key. Retrying... (${newRetryCount}/${MAX_RETRY_COUNT})`,
					status: "warning",
					duration: 3000,
				});
				// Retry after delay
				setTimeout(() => handleKeyReload(), RETRY_DELAY);
			} else {
				toast({
					title: "Failed to load PinTwin key after multiple attempts",
					status: "error",
					duration: 5000,
				});
			}
		} finally {
			setLoading(false);
		}
	}, [
		loading,
		retryCount,
		fetchPinTwinKey,
		onKeyLoadStateChange,
		onKeyReloaded,
		toast,
	]);

	/**
	 * Encodes a PIN using the current PinTwin key
	 */
	const encodePinTwin = useCallback(
		(pin: string): string => {
			if (!pintwinKey || pintwinKey.length < 10) {
				return "";
			}

			return pin.split("").reduce((encoded, digit) => {
				const index = parseInt(digit, 10);
				return encoded + (pintwinKey[index] || "");
			}, "");
		},
		[pintwinKey]
	);

	/**
	 * Gets the color style for a key at given index
	 */
	const getColorStyle = useCallback((index: number) => {
		const colorIndex = index % PIN_COLORS.length;
		return PIN_COLORS[colorIndex];
	}, []);

	/**
	 * Determines if a divider should be shown after the key at given index
	 */
	const shouldShowDivider = useCallback(
		(index: number) => {
			return index + 1 === Math.floor(pintwinKey.length / 2);
		},
		[pintwinKey.length]
	);

	// Initialize PinTwin key on mount
	useEffect(() => {
		if (!keyLoaded && !keyLoadError) {
			const timer = setTimeout(() => {
				handleKeyReload();
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [keyLoaded, keyLoadError, handleKeyReload]);

	// Expose encodePinTwin function to parent and global window
	useEffect(() => {
		if (typeof window !== "undefined") {
			(window as any).encodePinTwin = encodePinTwin;
		}
		// Provide the encoder function to parent component
		onEncodePinTwinReady?.(encodePinTwin);
	}, [encodePinTwin, onEncodePinTwinReady]);

	/**
	 * Renders the secure mode indicator for direct PIN entry
	 */
	const renderSecureMode = useMemo(
		() => (
			<Box fontSize="sm" userSelect="none">
				{loading && (
					<Flex align="center" gap={2}>
						<Text>Wait! Loading security…</Text>
						<Spinner size="sm" />
					</Flex>
				)}

				{!loading && keyLoaded && (
					<Flex
						align="center"
						gap={2}
						color="green.500"
						textTransform="uppercase"
					>
						<Text fontWeight="bold">SECURE</Text>
						<Icon as={FaShieldAlt} />
					</Flex>
				)}

				{!loading && keyLoadError && (
					<Flex
						align="center"
						gap={2}
						color="red.500"
						cursor="pointer"
						onClick={handleKeyReload}
						opacity={disabled ? 0.5 : 1}
						pointerEvents={disabled ? "none" : "auto"}
					>
						<Text fontSize="xs">
							Failed! Click to
							<br />
							reload security
						</Text>
						<Icon as={FaRedo} />
					</Flex>
				)}
			</Box>
		),
		[loading, keyLoaded, keyLoadError, disabled, handleKeyReload]
	);

	/**
	 * Renders the PinTwin lookup grid
	 */
	const renderLookupGrid = useMemo(
		() => (
			<Flex align="center" gap={2}>
				<Button
					size="sm"
					variant="ghost"
					loading={loading}
					disabled={disabled}
					onClick={handleKeyReload}
					leftIcon={<FaRedo />}
				></Button>

				<Box bg="white" p={2} borderRadius="md">
					<Flex align="center" gap={1} opacity={loading ? 0.4 : 1}>
						{pintwinKey.map((digit, index) => (
							<React.Fragment key={index}>
								<Flex direction="column" align="center">
									<Text fontSize="sm">{index}</Text>
									<Box
										w="1.5em"
										h="1.5em"
										border="1px solid"
										borderRadius="50%"
										borderColor={
											getColorStyle(index).border
										}
										bg={getColorStyle(index).bg}
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
								{shouldShowDivider(index) && <Box w="10px" />}
							</React.Fragment>
						))}
					</Flex>
				</Box>
			</Flex>
		),
		[
			loading,
			disabled,
			handleKeyReload,
			pintwinKey,
			getColorStyle,
			shouldShowDivider,
		]
	);

	return (
		<Box fontSize="lg" userSelect="none" fontFamily="inherit">
			{noLookup ? renderSecureMode : renderLookupGrid}
		</Box>
	);
};

export default Pintwin;
export type { PintwinProps, PinTwinResponse };
