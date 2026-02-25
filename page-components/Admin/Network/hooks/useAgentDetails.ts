import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useCallback, useEffect, useState } from "react";

/**
 * Detailed agent data structure from /network/agents endpoint
 */
export interface DetailedAgentData {
	agent_mobile: string;
	agent_name: string;
	agent_type: string;
	user_type_id: string;
	user_id: string;
	eko_code: string;
	account_status: string;
	account_status_id: string;
	onboarded_on: string;
	line_1?: string;
	line_2?: string;
	city?: string;
	state?: string;
	zip?: string;
	location?: string;
	profile?: {
		account_type?: string;
		eko_code?: string;
		shop_type?: string;
		wallet_balance?: string;
		shop_name?: string;
		plan_name?: string;
	};
	personal_information?: {
		marital_status?: string;
		gender?: string;
		dob?: string;
		monthly_income?: string;
	};
	contact_information?: {
		mobile_number?: string;
		email?: string | null;
	};
	address_details?: {
		address?: string;
		lattitude?: string;
		longitude?: string;
		ownership_type?: string;
	};
	[key: string]: any;
}

/**
 * Cached agent entry structure
 */
interface CachedAgent {
	data: DetailedAgentData;
	fetchedAt: number;
	userId: string;
}

/**
 * Return type for useAgentDetails hook
 */
export interface UseAgentDetailsReturn {
	agent: DetailedAgentData | null;
	loading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
	clearCache: () => void;
}

/**
 * Module-level cache map (shared across all hook instances)
 * Key format: `${userId}-${mobile}`
 */
const agentCache = new Map<string, CachedAgent>();

/**
 * Cache expiry duration in milliseconds (5 minutes)
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Clear all cached agent data
 */
export const clearAllAgentCache = () => {
	agentCache.clear();
};

/**
 * Custom hook to fetch and cache agent details.
 *
 * Features:
 * - In-memory session cache with 5-minute TTL
 * - User-scoped cache keys (prevents cross-user data contamination)
 * - Automatic cache invalidation on user change
 * - Manual refetch capability
 * - Shared cache across all hook instances
 * @param {string | undefined} mobile - Agent mobile number to fetch details for
 * @returns {UseAgentDetailsReturn} Agent data, loading state, error, and utility functions
 * @example
 * ```tsx
 * const { agent, loading, error, refetch } = useAgentDetails(mobile);
 *
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * if (!agent) return <NotFound />;
 *
 * // After updating agent data:
 * await updateAgent(data);
 * refetch(); // Fetch fresh data
 * ```
 */
const useAgentDetails = (mobile: string | undefined): UseAgentDetailsReturn => {
	const { accessToken, userId } = useSession();
	const [agent, setAgent] = useState<DetailedAgentData | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	/**
	 * Fetch agent details from API
	 */
	const fetchAgentDetails = useCallback(
		async (forceRefresh = false) => {
			if (!mobile || !accessToken) {
				setAgent(null);
				setLoading(false);
				return;
			}

			const cacheKey = `${userId}-${mobile}`;
			const cached = agentCache.get(cacheKey);

			// Check cache validity
			const isCacheValid =
				!forceRefresh &&
				cached &&
				cached.userId === userId &&
				Date.now() - cached.fetchedAt < CACHE_TTL;

			if (isCacheValid && cached) {
				// Use cached data
				setAgent(cached.data);
				setLoading(false);
				setError(null);
				return;
			}

			// Fetch from API
			setLoading(true);
			setError(null);
			setAgent(null); // Clear previous agent data to prevent showing stale data

			try {
				const response = await fetcher(
					process.env.NEXT_PUBLIC_API_BASE_URL +
						Endpoints.TRANSACTION,
					{
						headers: {
							"tf-req-uri-root-path": "/ekoicici/v1",
							"tf-req-uri": `/network/agents?record_count=1&search_value=${mobile}`,
							"tf-req-method": "GET",
						},
						body: {},
						token: accessToken,
					}
				);

				// Check for successful response (response_type_id: 1827)
				if (
					response?.response_type_id === 1827 &&
					response?.data?.agent_details?.[0]
				) {
					const agentData = response.data.agent_details[0];

					// Cache the fetched data
					agentCache.set(cacheKey, {
						data: agentData,
						fetchedAt: Date.now(),
						userId,
					});
					setAgent(agentData);
					setError(null);
				} else {
					// No agent found
					setAgent(null);
					setError(new Error(response?.message || "Agent not found"));
				}
			} catch (err) {
				console.error("[useAgentDetails] Fetch error:", err);
				setAgent(null);
				setError(
					err instanceof Error
						? err
						: new Error("Failed to fetch agent details")
				);
			} finally {
				setLoading(false);
			}
		},
		[mobile, accessToken, userId]
	);

	/**
	 * Force refetch agent details (bypasses cache)
	 */
	const refetch = useCallback(async () => {
		await fetchAgentDetails(true);
	}, [fetchAgentDetails]);

	/**
	 * Clear cache for current agent
	 */
	const clearCache = useCallback(() => {
		if (mobile && userId) {
			const cacheKey = `${userId}-${mobile}`;
			agentCache.delete(cacheKey);
		}
	}, [mobile, userId]);

	// Fetch agent details on mount or when mobile/userId changes
	useEffect(() => {
		fetchAgentDetails();
	}, [fetchAgentDetails]);

	// Clear cache for previous user when userId changes
	useEffect(() => {
		return () => {
			// Cleanup: clear old user's cache entries when userId changes
			if (userId) {
				// Note: We don't clear on every unmount, only when user changes
				// This is handled by checking userId in cache validation
			}
		};
	}, [userId]);

	return {
		agent,
		loading,
		error,
		refetch,
		clearCache,
	};
};

export default useAgentDetails;
