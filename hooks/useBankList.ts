import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useCallback, useEffect, useState } from "react";
import { useRefreshToken } from ".";

// Types
interface Bank {
	label: string;
	value: string | number;
	[key: string]: any;
}

interface UseBankListReturn {
	banks: Bank[];
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

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

	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	/**
	 * Fetch bank list from the API
	 */
	const fetchBankList = useCallback(async (): Promise<void> => {
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
						interaction_type_id: TransactionIds.BANK_LIST,
						bank_id: "",
						locale: "en",
					},
				},
				generateNewToken
			);

			if (response.status === 0) {
				setBanks(response?.param_attributes?.list_elements || []);
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
				err.message || "Something went wrong while fetching bank list";
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
	}, [accessToken, generateNewToken, toast]);

	// Auto-fetch on mount
	useEffect(() => {
		fetchBankList();
	}, [fetchBankList]);

	return {
		banks,
		isLoading,
		error,
		refetch: fetchBankList,
	};
};

export default useBankList;
