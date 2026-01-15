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

interface UseShopTypesReturn {
	shopTypes: ShopType[];
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

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

	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	/**
	 * Fetch shop types from the API
	 */
	const fetchShopTypes = useCallback(async (): Promise<void> => {
		if (!accessToken) {
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response: any = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					token: accessToken,
					body: {
						interaction_type_id: TransactionIds.SHOP_TYPE,
					},
				},
				generateNewToken
			);

			if (response.status === 0) {
				setShopTypes(response?.param_attributes?.list_elements || []);
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
				err.message || "Something went wrong while fetching shop types";
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
	}, [accessToken, generateNewToken]);

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
			refetch: fetchShopTypes,
		}),
		[shopTypes, isLoading, error, fetchShopTypes]
	);
};

export default useShopTypes;
