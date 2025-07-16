import { Endpoints } from "constants/EndPoints";
import { TransactionTypes } from "constants/EpsTransactions";
import { fetcher } from "helpers/apiHelper";
import { useCallback, useEffect, useRef, useState } from "react";

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

interface UsePinTwinOptions {
	/** Whether to use mock data instead of API calls */
	useMockData?: boolean;
	/** Whether to auto-load key on mount */
	autoLoad?: boolean;
	/** Maximum retry attempts */
	maxRetries?: number;
	/** Retry delay in milliseconds */
	retryDelay?: number;
}

export interface UsePinTwinReturn {
	/** The current PinTwin key as an array of digits */
	pintwinKey: string[];
	/** Whether the key is currently being loaded */
	loading: boolean;
	/** Whether the key has been successfully loaded */
	keyLoaded: boolean;
	/** Whether there was an error loading the key */
	keyLoadError: boolean;
	/** Current retry count */
	retryCount: number;
	/** Function to manually reload the PinTwin key */
	reloadKey: () => Promise<void>;
	/** Function to encode a PIN using the current key */
	encodePinTwin: (_pin: string) => string;
	/** Current key ID */
	keyId: string;
}

/**
 * Custom hook for managing PinTwin key operations
 * @param {UsePinTwinOptions} options Configuration options for the hook
 * @returns {UsePinTwinReturn} Object containing PinTwin state and operations
 * @example
 * ```typescript
 * // Basic usage with auto-loading
 * const { pintwinKey, loading, keyLoaded, encodePinTwin } = usePinTwin();
 *
 * // Custom configuration
 * const { encodePinTwin, reloadKey } = usePinTwin({
 *   useMockData: true,
 *   autoLoad: false,
 *   maxRetries: 5
 * });
 *
 * // Encode a PIN immediately
 * const encodedPin = encodePinTwin('1234');
 * ```
 */
export const usePinTwin = (
	options: UsePinTwinOptions = {}
): UsePinTwinReturn => {
	const {
		useMockData = false,
		autoLoad = true,
		maxRetries = 8,
		retryDelay = 1000,
	} = options;

	const [pintwinKey, setPintwinKey] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [keyLoaded, setKeyLoaded] = useState(false);
	const [keyLoadError, setKeyLoadError] = useState(false);
	const [retryCount, setRetryCount] = useState(0);
	const [keyId, setKeyId] = useState("");

	const retryCountRef = useRef(0);
	const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const isMountedRef = useRef(true);
	const hasAutoLoaded = useRef(false);

	// Store options in refs to avoid recreating reloadKey function
	const optionsRef = useRef({ useMockData, maxRetries, retryDelay });
	optionsRef.current = { useMockData, maxRetries, retryDelay };

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
	 * Reloads the PinTwin key with retry logic
	 */
	const reloadKey = useCallback(async (): Promise<void> => {
		if (loading || !isMountedRef.current) return;

		const mockResponse: PinTwinResponse = {
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
			setKeyLoadError(false);

			const response = optionsRef.current.useMockData
				? mockResponse
				: await fetchPinTwinKey();

			if (response?.data?.pintwin_key) {
				setPintwinKey(response.data.pintwin_key.split(""));
				setKeyId(response.data.key_id?.toString() ?? "");
				setKeyLoaded(true);
				setKeyLoadError(false);
				setRetryCount(0);
				retryCountRef.current = 0;
			} else {
				throw new Error("Invalid response format");
			}
		} catch (error) {
			console.error("Error loading PinTwin key:", error);
			setKeyLoaded(false);
			setKeyLoadError(true);

			if (
				retryCountRef.current < optionsRef.current.maxRetries &&
				isMountedRef.current
			) {
				const newRetryCount = retryCountRef.current + 1;
				retryCountRef.current = newRetryCount;
				setRetryCount(newRetryCount);

				if (retryTimeoutRef.current) {
					clearTimeout(retryTimeoutRef.current);
				}

				retryTimeoutRef.current = setTimeout(() => {
					if (isMountedRef.current) {
						reloadKey();
					}
				}, optionsRef.current.retryDelay);
			} else if (isMountedRef.current) {
			}
		} finally {
			if (isMountedRef.current) {
				setLoading(false);
			}
		}
	}, [loading, fetchPinTwinKey]);

	/**
	 * Encodes a PIN using the current PinTwin key
	 */
	const encodePinTwin = useCallback(
		(pin: string): string => {
			if (!pintwinKey || pintwinKey.length < 10) {
				return "";
			}

			let encodedValue = pin.split("").reduce((encoded, digit) => {
				const index = parseInt(digit, 10);
				return encoded + (pintwinKey[index] ?? "");
			}, "");

			// Append key ID for server identification when PIN has content
			if (keyId && pin.length > 0) {
				encodedValue += `|${keyId}`;
			}

			return encodedValue;
		},
		[pintwinKey, keyId]
	);

	// Auto-load key on mount - run only once
	useEffect(() => {
		if (autoLoad && !hasAutoLoaded.current) {
			hasAutoLoaded.current = true;
			reloadKey();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Cleanup on unmount
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
		pintwinKey,
		loading,
		keyLoaded,
		keyLoadError,
		retryCount,
		reloadKey,
		encodePinTwin,
		keyId,
	};
};
