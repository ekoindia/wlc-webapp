import { Box, Flex, Icon, Spinner, Text, useToast } from "@chakra-ui/react";
import { Button } from "components/Button";
import { Endpoints } from "constants/EndPoints";
import { fetcher } from "helpers/apiHelper";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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
 *
 * // Using mock data for testing
 * <Pintwin
 *   useMockData={true}
 *   keyLoaded={false}
 *   noLookup={false}
 * />
 * ```
 */
interface PintwinProps {
	/** Whether PinTwin key is loaded */
	keyLoaded?: boolean;
	/** Whether there was an error loading the key */
	keyLoadError?: boolean;
	/** Whether to show the lookup table (if false, shows direct PIN entry) */
	noLookup?: boolean;
	/** Whether the component is disabled */
	disabled?: boolean;
	/** Whether to use mock data instead of making API calls */
	useMockData?: boolean;
	/** Callback when PinTwin key is reloaded */
	onKeyReloaded?: (_keyId: string) => void;
	/** Callback when key loading state changes */
	onKeyLoadStateChange?: (_loaded: boolean, _error: boolean) => void;
	/** Callback when encodePinTwin function is ready */
	onEncodePinTwinReady?: (_encoderFn: (_pin: string) => string) => void;
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
 * Internal function to fetch PinTwin key from API
 * @returns Promise that resolves to PinTwinResponse
 */
const fetchPinTwinKey = async (): Promise<PinTwinResponse> => {
	const accessToken = sessionStorage.getItem("access_token");
	const tempUserId = sessionStorage.getItem("temp_user_id");

	const response = await fetcher(
		process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
		{
			body: {
				interaction_type_id: 10005,
				alternate_user_id: tempUserId,
			},
			token: accessToken,
		}
	);

	return response;
};

/**
 * Pintwin Component
 *
 * A secure PIN entry component that displays a PinTwin key grid for secure PIN input.
 * The component can operate in two modes:
 * 1. Lookup mode: Shows a visual grid of random digits for secure PIN entry
 * 2. Direct mode: Shows security status for direct PIN entry
 *
 * The component internally fetches a PinTwin key from the server and displays it as a 10-digit
 * lookup table. Users can use this table to securely enter their PIN by looking up
 * the corresponding digits.
 * @param props Component properties
 * @param props.keyLoaded Whether the PinTwin key has been successfully loaded
 * @param props.keyLoadError Whether there was an error loading the PinTwin key
 * @param props.noLookup If true, shows secure mode without lookup table
 * @param props.disabled Whether the component is disabled and non-interactive
 * @param props.useMockData Whether to use mock data instead of making API calls
 * @param props.onKeyReloaded Callback fired when a new PinTwin key is loaded
 * @param props.onKeyLoadStateChange Callback fired when key loading state changes
 * @param props.onEncodePinTwinReady Callback to provide the PIN encoding function
 * @param props.keyId Key identifier for PIN encoding (unused)
 * @param props.language Language preference for UI (unused)
 * @returns A React functional component that renders the PinTwin interface
 * @example
 * ```typescript
 * // Basic usage with automatic key fetching
 * <Pintwin
 *   keyLoaded={true}
 *   keyLoadError={false}
 *   noLookup={false}
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
 *
 * // Using mock data for testing/development
 * <Pintwin
 *   useMockData={true}
 *   noLookup={false}
 * />
 * ```
 */
const Pintwin: React.FC<PintwinProps> = ({
	keyLoaded = false,
	keyLoadError = false,
	noLookup = false,
	disabled = false,
	useMockData = false,
	onKeyReloaded,
	onKeyLoadStateChange,
	onEncodePinTwinReady,
	keyId: _keyId,
	language: _language,
}) => {
	const [loading, setLoading] = useState(false);
	const [pintwinKey, setPintwinKey] = useState<string[]>([]);
	console.log("pintwinKey", pintwinKey);
	const [_retryCount, setRetryCount] = useState(0);
	const toast = useToast();

	// Use ref to track retry count to avoid closure issues
	const retryCountRef = useRef(0);
	// Use ref to track timeout for cleanup
	const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	// Use ref to track if component is mounted
	const isMountedRef = useRef(true);

	const MAX_RETRY_COUNT = 8;
	const RETRY_DELAY = 1000;

	/**
	 * Handles key reloading with error handling and retry logic
	 */
	const handleKeyReload = useCallback(async () => {
		console.log(
			"[Pintwin] handleKeyReload - loading:",
			loading,
			"mounted:",
			isMountedRef.current
		);
		if (loading || !isMountedRef.current) return;

		// Mock response for development/testing
		const mockPinTwinResponse: PinTwinResponse = {
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
			onKeyLoadStateChange?.(false, false); // Loading started, key not loaded yet

			let response: PinTwinResponse;
			if (useMockData) {
				console.log("useMockData", useMockData);
				// Use mock response when mock flag is enabled
				response = mockPinTwinResponse;
			} else {
				// Use actual API call when mock flag is disabled
				response = await fetchPinTwinKey();
			}

			console.log("response", response);
			if (response?.data?.pintwin_key) {
				setPintwinKey(response.data.pintwin_key.split(""));
				setRetryCount(0);
				retryCountRef.current = 0;
				onKeyReloaded?.(response.data.key_id?.toString() || "");
				onKeyLoadStateChange?.(true, false); // Key loaded successfully, no error
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

			if (
				retryCountRef.current < MAX_RETRY_COUNT &&
				isMountedRef.current
			) {
				const newRetryCount = retryCountRef.current + 1;
				retryCountRef.current = newRetryCount;
				setRetryCount(newRetryCount);

				toast({
					title: `Failed to load key. Retrying... (${newRetryCount}/${MAX_RETRY_COUNT})`,
					status: "warning",
					duration: 3000,
				});

				// Clear any existing timeout
				if (retryTimeoutRef.current) {
					clearTimeout(retryTimeoutRef.current);
				}

				// Retry after delay
				retryTimeoutRef.current = setTimeout(() => {
					if (isMountedRef.current) {
						handleKeyReload();
					}
				}, RETRY_DELAY);
			} else if (isMountedRef.current) {
				toast({
					title: "Failed to load PinTwin key after multiple attempts",
					status: "error",
					duration: 5000,
				});
			}
		} finally {
			// if (isMountedRef.current) {
			setLoading(false);
			// }
		}
	}, [useMockData, onKeyLoadStateChange, onKeyReloaded]);

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
			handleKeyReload();
		}
	}, [keyLoaded, keyLoadError, handleKeyReload]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			isMountedRef.current = false;
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current);
			}
		};
	}, []);

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
						{pintwinKey?.map((digit, index) => (
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
