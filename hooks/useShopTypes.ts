import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRefreshToken } from ".";

// Types
interface ShopType {
	label: string;
	value: string | number;
	[key: string]: any;
}

/**
 * Cached shop types entry structure
 */
interface ShopTypesCacheEntry {
	data: ShopType[];
	fetchedAt: number;
	userId: string;
}

interface UseShopTypesReturn {
	shopTypes: ShopType[];
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	clearCache: () => void;
}

/**
 * Module-level cache map (shared across all hook instances)
 * Key format: `shop-types-${userId}`
 */
const shopTypesCache = new Map<string, ShopTypesCacheEntry>();

/**
 * Cache expiry duration in milliseconds (5 minutes)
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Clear all cached shop types data
 */
export const clearAllShopTypesCache = () => {
	shopTypesCache.clear();
};

/**
 * Custom hook for fetching shop types from the API
 * @returns {UseShopTypesReturn} An object containing shopTypes data, loading state, error state, and refetch function
 * @example
 * const { shopTypes, isLoading, error, refetch } = useShopTypes();
 */
const useShopTypes = (): UseShopTypesReturn => {
	const [shopTypes, setShopTypes] = useState<ShopType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { accessToken, userId } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	/**
	 * Clear cache for shop types
	 */
	const clearCache = useCallback(() => {
		if (userId) {
			const cacheKey = `shop-types-${userId}`;
			shopTypesCache.delete(cacheKey);
		}
	}, [userId]);

	/**
	 * Fetch shop types from the API with caching
	 */
	const fetchShopTypes = useCallback(
		async (forceRefresh = false): Promise<void> => {
			if (!accessToken || !userId) {
				setIsLoading(false);
				return;
			}

			const cacheKey = `shop-types-${userId}`;
			const cached = shopTypesCache.get(cacheKey);

			// Check cache validity
			const isCacheValid =
				!forceRefresh &&
				cached &&
				cached.userId === userId &&
				Date.now() - cached.fetchedAt < CACHE_TTL;

			if (isCacheValid && cached) {
				// Use cached data
				setShopTypes(cached.data);
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
							interaction_type_id: TransactionIds.SHOP_TYPE,
						},
					},
					generateNewToken
				);

				if (response.status === 0) {
					const shopTypesData =
						response?.param_attributes?.list_elements || [];

					// Cache the fetched data
					shopTypesCache.set(cacheKey, {
						data: shopTypesData,
						fetchedAt: Date.now(),
						userId,
					});

					setShopTypes(shopTypesData);
					setError(null);
				} else {
					const errorMessage: string =
						response.message || "Failed to fetch shop types";
					setError(errorMessage);
					toast({
						title: "Error fetching shop types",
						description: errorMessage,
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				}
			} catch (err: any) {
				const errorMessage: string =
					err.message ||
					"Something went wrong while fetching shop types";
				setError(errorMessage);
				console.error("[useShopTypes] Error:", err);

				toast({
					title: "Error fetching shop types",
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
		fetchShopTypes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return useMemo(
		() => ({
			shopTypes,
			isLoading,
			error,
			refetch: async () => await fetchShopTypes(true),
			clearCache,
		}),
		[shopTypes, isLoading, error, fetchShopTypes, clearCache]
	);
};

export default useShopTypes;
