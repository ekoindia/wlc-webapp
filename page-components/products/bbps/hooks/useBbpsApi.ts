import { useEpsV3Fetch } from "hooks/useApiFetch";
import { BbpsProduct } from "../types";
import { mockBillFetchResponse } from "../utils/mockData";
import { transformBillData } from "../utils/transformBillData";

/**
 * Hook to handle BBPS API calls with mock data support
 * @param product
 */
export const useBbpsApi = (product?: BbpsProduct) => {
	const [fetchBills, isLoadingBills] = useEpsV3Fetch(
		"/billpayments/fetchbill",
		{
			method: "POST",
		}
	);

	/**
	 * Fetch bills from either the API or mock data
	 * @param data
	 */
	const fetchBillsWithMockSupport = async (data: Record<string, string>) => {
		// Use mock data if specified in the product config or if API is not available
		if (product?.useMockData) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Return mock response
			return {
				data: mockBillFetchResponse,
				error: null,
			};
		}

		// Otherwise use the real API
		try {
			const response = await fetchBills({
				body: data,
			});
			return { data: response.data, error: null };
		} catch (error) {
			console.error("[BBPS] API Error:", error);
			return {
				data: null,
				error:
					error instanceof Error
						? error.message
						: "Failed to fetch bills",
			};
		}
	};

	/**
	 * Transform the API response into the format expected by the context
	 * @param response
	 */
	const processBillFetchResponse = (response: any) => {
		if (!response) return null;

		// Transform the response
		return transformBillData(response);
	};

	return {
		fetchBills: fetchBillsWithMockSupport,
		processBillFetchResponse,
		isLoadingBills,
	};
};
