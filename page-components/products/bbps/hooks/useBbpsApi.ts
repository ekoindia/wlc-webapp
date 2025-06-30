import { useEpsV3Fetch } from "hooks/useApiFetch";
import { PaymentStatusType } from "../context/types";
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
 * @param {BbpsProduct} [product] Product configuration
 * @returns {object} API functions and loading states
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
	 * @param {Record<string, string>} data Request data
	 * @returns {Promise<{data: any, error: string | null}>} API response
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
	 * @param {PaymentRequest} paymentRequest Payment request payload
	 * @param {PaymentStatusType} [mockResponseType] Mock response type (success, pending, error)
	 * @returns {Promise<{data: any, error: string | null}>} API response
	 */
	const makePayment = async (
		paymentRequest: PaymentRequest,
		mockResponseType: PaymentStatusType = "success"
	) => {
		// Use mock data if specified in the product config
		if (product?.useMockData) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const success = mockResponseType === "success";
			const pending = mockResponseType === "pending";

			// Return mock response based on type
			return {
				data: {
					status: success ? 0 : pending ? 2 : 1,
					message: `Payment ${mockResponseType}`,
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
	 * @param {any} response API response
	 * @returns {any} Transformed response
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
