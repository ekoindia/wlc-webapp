import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRefreshToken } from ".";

// Types
interface State {
	label: string;
	value: string | number;
	[key: string]: any;
}

interface UseCountryStatesOptions {
	countryCode?: string;
	autoFetch?: boolean;
}

interface UseCountryStatesReturn {
	states: State[];
	isLoading: boolean;
	error: string | null;
	refetch: (_fetchCountryCode?: string) => Promise<void>;
	countryCode: string;
}

/**
 * Custom hook for fetching country states from the API
 * @param {UseCountryStatesOptions} [options] - Configuration options
 * @param {string} [options.countryCode] - The country code to fetch states for (default: "IN" for India)
 * @param {boolean} [options.autoFetch] - Whether to automatically fetch on mount
 * @returns {UseCountryStatesReturn} An object containing states data, loading state, error state, and refetch function
 * @example
 * // Fetch Indian states (default)
 * const { states, isLoading, error, refetch } = useCountryStates();
 *
 * // Fetch states for a specific country (future use)
 * const { states, isLoading, error, refetch } = useCountryStates({ countryCode: "US" });
 *
 * // Manual fetch only
 * const { states, isLoading, error, refetch } = useCountryStates({ autoFetch: false });
 */
const useCountryStates = (
	options: UseCountryStatesOptions = {}
): UseCountryStatesReturn => {
	const { countryCode = "IN", autoFetch = true } = options;

	const [states, setStates] = useState<State[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(autoFetch);
	const [error, setError] = useState<string | null>(null);

	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	/**
	 * Fetch states from the API
	 * @param _fetchCountryCode - Override country code for this specific fetch (unused for now)
	 */
	const fetchStates = useCallback(
		async (_fetchCountryCode?: string): Promise<void> => {
			if (!accessToken) {
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const requestBody = {
					interaction_type_id: TransactionIds.STATE_TYPE,
				};

				// NOTE: Add country_code to request body when API supports it
				// This is prepared for future API enhancement
				// if (_fetchCountryCode || countryCode) {
				// 	requestBody.country_code = _fetchCountryCode || countryCode;
				// }

				const response: any = await fetcher(
					process.env.NEXT_PUBLIC_API_BASE_URL +
						Endpoints.TRANSACTION,
					{
						token: accessToken,
						body: requestBody,
					},
					generateNewToken
				);

				if (response.status === 0) {
					setStates(response?.param_attributes?.list_elements || []);
				} else {
					const errorMessage: string =
						response.message || "Failed to fetch states";
					setError(errorMessage);
					toast({
						title: "Error fetching states",
						description: errorMessage,
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				}
			} catch (err: any) {
				const errorMessage: string =
					err.message || "Something went wrong while fetching states";
				setError(errorMessage);
				console.error("[useCountryStates] Error:", err);

				toast({
					title: "Error fetching states",
					description: errorMessage,
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			} finally {
				setIsLoading(false);
			}
		},
		[accessToken, generateNewToken]
	);

	// Auto-fetch on mount if enabled
	useEffect(() => {
		if (autoFetch) {
			fetchStates();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoFetch]);

	return useMemo(
		() => ({
			states,
			isLoading,
			error,
			refetch: fetchStates,
			countryCode, // Return current country code for reference
		}),
		[states, isLoading, error, fetchStates, countryCode]
	);
};

export default useCountryStates;
