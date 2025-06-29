import { useEpsV3Fetch } from "hooks/useApiFetch";
import { BbpsProduct } from "../types";
import { mockBillFetchResponse } from "../utils/mockData";
import { transformBillData } from "../utils/transformBillData";

/**
 * Payment request payload structure
 */
interface PaymentRequest {
	payment_amount: number;
	payment_amount_breakup: Array<{
		billid: string;
		bill_payment_amount: number;
	}>;
	// Add other required fields based on API specification
}

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

	const [makePaymentCall, isLoadingPayment] = useEpsV3Fetch(
		"/billpayments/makepayment",
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
	 * Make payment API call
	 * @param paymentRequest Payment request payload
	 */
	const makePayment = async (paymentRequest: PaymentRequest) => {
		// Use mock data if specified in the product config
		if (product?.useMockData) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Return mock success response
			return {
				data: {
					status: 0,
					message: "Payment processed successfully",
					data: {
						transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
						amount: paymentRequest.payment_amount,
						timestamp: new Date().toISOString(),
					},
				},
				error: null,
			};
		}

		// Otherwise use the real API
		try {
			const response = await makePaymentCall({
				body: paymentRequest,
			});
			return { data: response.data, error: null };
		} catch (error) {
			console.error("[BBPS] Payment API Error:", error);
			return {
				data: null,
				error:
					error instanceof Error
						? error.message
						: "Failed to process payment",
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
		makePayment,
		processBillFetchResponse,
		isLoadingBills,
		isLoadingPayment,
	};
};
