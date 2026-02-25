import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRefreshToken } from ".";

// Types
interface Bank {
	label: string;
	value: string | number;
	[key: string]: any;
}

/**
 * Cached bank list entry structure
 */
interface BankListCacheEntry {
	data: Bank[];
	fetchedAt: number;
	userId: string;
}

interface UseBankListReturn {
	banks: Bank[];
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	clearCache: () => void;
}

/**
 * Module-level cache map (shared across all hook instances)
 * Key format: `bank-list-${userId}`
 */
const bankListCache = new Map<string, BankListCacheEntry>();

/**
 * Cache expiry duration in milliseconds (5 minutes)
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Clear all cached bank list data
 */
export const clearAllBankListCache = () => {
	bankListCache.clear();
};

/**
 * Custom hook for fetching bank list from the API
 * @returns {UseBankListReturn} An object containing banks data, loading state, error state, and refetch function
 * @example
 * const { banks, isLoading, error, refetch } = useBankList();
 */
const useBankList = (): UseBankListReturn => {
	const [banks, setBanks] = useState<Bank[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { accessToken, userId } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	/**
	 * Clear cache for bank list
	 */
	const clearCache = useCallback(() => {
		if (userId) {
			const cacheKey = `bank-list-${userId}`;
			bankListCache.delete(cacheKey);
		}
	}, [userId]);

	/**
	 * Fetch bank list from the API with caching
	 */
	const fetchBankList = useCallback(
		async (forceRefresh = false): Promise<void> => {
			if (!accessToken || !userId) {
				setIsLoading(false);
				return;
			}

			const cacheKey = `bank-list-${userId}`;
			const cached = bankListCache.get(cacheKey);

			// Check cache validity
			const isCacheValid =
				!forceRefresh &&
				cached &&
				cached.userId === userId &&
				Date.now() - cached.fetchedAt < CACHE_TTL;

			if (isCacheValid && cached) {
				// Use cached data
				setBanks(cached.data);
				setIsLoading(false);
				setError(null);
				return;
			}

			// Fetch from API
			setIsLoading(true);
			setError(null);

			try {
				const response: any = await fetcher(
					process.env.NEXT_PUBLIC_API_BASE_URL +
						Endpoints.TRANSACTION,
					{
						token: accessToken,
						body: {
							interaction_type_id: TransactionIds.BANK_LIST,
							bank_id: "",
							locale: "en",
						},
					},
					generateNewToken
				);

				if (response.status === 0) {
					const banksData =
						response?.param_attributes?.list_elements || [];

					// Cache the fetched data
					bankListCache.set(cacheKey, {
						data: banksData,
						fetchedAt: Date.now(),
						userId,
					});

					setBanks(banksData);
					setError(null);
				} else {
					const errorMessage: string =
						response.message || "Failed to fetch bank list";
					setError(errorMessage);
					toast({
						title: "Error fetching bank list",
						description: errorMessage,
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				}
			} catch (err: any) {
				const errorMessage: string =
					err.message ||
					"Something went wrong while fetching bank list";
				setError(errorMessage);
				console.error("[useBankList] Error:", err);

				toast({
					title: "Error fetching bank list",
					description: errorMessage,
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			} finally {
				setIsLoading(false);
			}
		},
		[accessToken, userId, generateNewToken, toast]
	);

	// Auto-fetch on mount
	useEffect(() => {
		fetchBankList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return useMemo(
		() => ({
			banks,
			isLoading,
			error,
			refetch: async () => await fetchBankList(true),
			clearCache,
		}),
		[banks, isLoading, error, fetchBankList, clearCache]
	);
};

export default useBankList;
