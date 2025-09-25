import { Endpoints } from "constants/EndPoints";
import { TransactionTypes } from "constants/EpsTransactions";
import { fetcher } from "helpers/apiHelper";
import { useCallback, useEffect, useRef, useState } from "react";

const maxRetries = 8; // Maximum number of retry attempts
const retryDelay = 1000; // Delay between retry attempts in milliseconds

interface PinTwinData {
	customer_id_type: string;
	key_id: number;
	pintwin_key: string;
	id_type: string;
	customer_id: string;
}

interface PinTwinResponse {
	response_status_id: number;
	data: PinTwinData;
	response_type_id: number;
	message: string;
	status: number;
}

type PinTwinKeyLoadStatus = "loading" | "loaded" | "error";

export interface UsePinTwinReturn {
	/** Current load status of the PinTwin key: 'loading', 'loaded', or 'error' */
	pinTwinKeyLoadStatus: PinTwinKeyLoadStatus;
	/** Function to manually reload the PinTwin key */
	refreshPinTwinKey: () => Promise<void>;
	/** Function to encode a PIN using the current key. It is usually 4-digit long but can be of any length (upto 10-digits) */
	encodePinTwin: (_pin: string) => string;
}

/**
 * Custom hook for managing PinTwin key operations with consolidated state management
 *
 * This hook manages the complete lifecycle of PinTwin keys including:
 * - Automatic key fetching on mount with retry logic
 * - Manual key refresh functionality
 * - PIN encoding using the loaded key
 * - Consolidated loading status tracking (loading/loaded/error)
 * @param {UsePinTwinOptions} options Configuration options for the hook
 * @returns {UsePinTwinReturn} Object containing PinTwin state and operations
 * @example
 * ```typescript
 * // Basic usage with auto-loading
 * const { pinTwinKey, pinTwinKeyLoadStatus, encodePinTwin } = usePinTwin();
 *
 * // Custom configuration with mock data for development
 * const { encodePinTwin, refreshPinTwinKey } = usePinTwin({
 *   useMockData: true,
 *   maxRetries: 5,
 *   retryDelay: 2000
 * });
 *
 * // Status-based conditional logic
 * if (pinTwinKeyLoadStatus === 'loaded') {
 *   const encodedPin = encodePinTwin('1234');
 * } else if (pinTwinKeyLoadStatus === 'error') {
 *   // Handle error state - user can retry with refreshPinTwinKey
 * }
 *
 * // Component integration example
 * const isLoading = pinTwinKeyLoadStatus === 'loading';
 * const hasError = pinTwinKeyLoadStatus === 'error';
 * const isReady = pinTwinKeyLoadStatus === 'loaded';
 * ```
 */
export const usePinTwin = (): UsePinTwinReturn => {
	const [pinTwinKey, setPinTwinKey] = useState<string[]>([]);
	const [pinTwinKeyLoadStatus, setPinTwinKeyLoadStatus] =
		useState<PinTwinKeyLoadStatus>("loading");
	const [pinTwinKeyId, setPinTwinKeyId] = useState("");

	const retryCountRef = useRef(0);
	const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const isMountedRef = useRef(true);
	const hasAutoLoaded = useRef(false);

	// Store options in refs to prevent refreshPinTwinKey function recreation
	// This optimization ensures stable function reference while allowing dynamic option access
	const optionsRef = useRef({ maxRetries, retryDelay });
	optionsRef.current = { maxRetries, retryDelay };

	/**
	 * Fetches PinTwin key from API
	 */
	const fetchPinTwinKey = useCallback(async (): Promise<PinTwinResponse> => {
		const accessToken = sessionStorage.getItem("access_token");
		const tempUserId = sessionStorage.getItem("temp_user_id");

		const response = await fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				body: {
					interaction_type_id: TransactionTypes.FETCH_PINTWIN,
					alternate_user_id: tempUserId,
				},
				token: accessToken,
			}
		);

		return response;
	}, []);

	/**
	 * Reloads the PinTwin key with automatic retry logic
	 *
	 * This function handles the complete key loading process including:
	 * - Setting initial loading status
	 * - Making API calls with fallback to mock data
	 * - Automatic retry logic with configurable attempts and delays
	 * - Final status updates (loaded/error) based on outcome
	 */
	const refreshPinTwinKey = useCallback(async (): Promise<void> => {
		if (!isMountedRef.current) return;

		// Initialize loading status at the start of the refresh process
		setPinTwinKeyLoadStatus("loading");

		const attemptLoad = async (): Promise<void> => {
			try {
				const response = await fetchPinTwinKey();

				if (response?.data?.pintwin_key) {
					setPinTwinKey(response.data.pintwin_key.split(""));
					setPinTwinKeyId(response.data.key_id?.toString() ?? "");
					retryCountRef.current = 0;
					// Success: Update status to loaded and complete the process
					if (isMountedRef.current) {
						setPinTwinKeyLoadStatus("loaded");
					}
				} else {
					throw new Error("Invalid response format");
				}
			} catch (error) {
				console.error("Error loading PinTwin key:", error);

				if (
					retryCountRef.current < optionsRef.current.maxRetries &&
					isMountedRef.current
				) {
					// Retry attempt: increment counter and schedule next attempt
					// Status remains "loading" during retry process
					const newRetryCount = retryCountRef.current + 1;
					retryCountRef.current = newRetryCount;

					if (retryTimeoutRef.current) {
						clearTimeout(retryTimeoutRef.current);
					}

					retryTimeoutRef.current = setTimeout(() => {
						if (isMountedRef.current) {
							attemptLoad();
						}
					}, optionsRef.current.retryDelay);
				} else {
					// Failure: All retries exhausted, update status to error
					if (isMountedRef.current) {
						setPinTwinKeyLoadStatus("error");
					}
				}
			}
		};

		// Start the first attempt
		attemptLoad();
	}, [fetchPinTwinKey]);

	/**
	 * Encodes a PIN using the current PinTwin key with server identification
	 *
	 * This function transforms a user's PIN by mapping each digit through the
	 * PinTwin key lookup table and appends the key ID for server verification.
	 * Returns empty string if the key is not fully loaded (< 10 digits).
	 * @param {string} pin The PIN to encode (typically 4 digits, max 10)
	 * @returns {string} Encoded PIN with key ID suffix (format: "encodedPin|keyId") or empty string if key not ready
	 */
	const encodePinTwin = useCallback(
		(pin: string): string => {
			if (!pinTwinKey || pinTwinKey.length < 10) {
				return "";
			}

			let encodedValue = pin.split("").reduce((encoded, digit) => {
				const index = parseInt(digit, 10);
				return encoded + (pinTwinKey[index] ?? "");
			}, "");

			// Append key ID for server identification when PIN has content
			if (pinTwinKeyId && pin.length > 0) {
				encodedValue += `|${pinTwinKeyId}`;
			}

			return encodedValue;
		},
		[pinTwinKey, pinTwinKeyId]
	);

	// Auto-load PinTwin key on component mount (runs only once)
	// This initiates the loading process with status tracking
	useEffect(() => {
		if (!hasAutoLoaded.current) {
			hasAutoLoaded.current = true;
			refreshPinTwinKey();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Component lifecycle management and cleanup
	// Ensures proper cleanup of timeouts and prevents memory leaks
	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current);
			}
		};
	}, []);

	return {
		pinTwinKeyLoadStatus,
		refreshPinTwinKey,
		encodePinTwin,
	};
};
