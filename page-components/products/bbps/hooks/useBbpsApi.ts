import { Endpoints } from "constants/EndPoints";
import { TransactionTypes } from "constants/EpsTransactions";
import { useApiFetch } from "hooks";
import { useCallback } from "react";
import { PaymentStatusType } from "../context/types";
import { BbpsProduct, DynamicField, Operator } from "../types";
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
	const [fetchBills, isLoadingBills] = useApiFetch(Endpoints.TRANSACTION, {});

	const [makePaymentCall, isLoadingPayment] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{}
	);

	// New API endpoints for operators and dynamic fields
	const [fetchOperatorsCall, isLoadingOperators] = useApiFetch(
		Endpoints.TRANSACTION,
		{
			method: "POST",
			headers: {
				"tf-req-uri-root-path": `/ekoicici/v2`,
				"tf-req-method": "GET",
				"tf-req-uri": `/billpayments/operators?category=${product?.categoryId}`,
				"Content-Type": "application/json",
			},
		} as any
	);

	const [fetchDynamicFieldsCall, isLoadingDynamicFields] = useApiFetch(
		Endpoints.TRANSACTION,
		{
			method: "POST",
			headers: {
				"tf-req-uri-root-path": `/ekoicici/v2`,
				"tf-req-method": "GET",
				"tf-req-uri": `/billpayments/operators`, // Will append operator_id dynamically
				"Content-Type": "application/json",
			},
		} as any
	);

	/**
	 * Fetch operators from API or mock data
	 * @param {string} _categoryId Category ID to fetch operators for (unused - passed in defaultUrlEndpoint)
	 * @returns {Promise<{data: Operator[], error: string | null}>} API response
	 */
	const fetchOperators = useCallback(
		async (_categoryId: string) => {
			// Use mock data if specified in the product config
			if (product?.useMockData) {
				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Return mock operators
				const mockOperators: Operator[] = [
					{
						operator_id: 1,
						name: "Sample Gas Provider",
						billFetchResponse: 0,
						high_commission_channel: 1,
						kyc_required: 0,
						operator_category: 2,
						location_id: 27,
					},
					{
						operator_id: 2,
						name: "Sample Electricity Board",
						billFetchResponse: 0,
						high_commission_channel: 1,
						kyc_required: 0,
						operator_category: 1,
						location_id: 24,
					},
				];

				return { data: mockOperators, error: null };
			}

			// Otherwise use the real API
			try {
				const response = await fetchOperatorsCall();

				if (response.error) {
					return { data: [], error: response.error };
				}

				// Extract operators array from the API response
				// API response structure: { data: [{ operator_id: ..., name: ... }] }
				const operators = response.data?.data || response.data || [];

				// Ensure we have an array
				if (!Array.isArray(operators)) {
					console.error(
						"[BBPS] Invalid operators response format:",
						response
					);
					return { data: [], error: "Invalid response format" };
				}

				return { data: operators, error: null };
			} catch (error) {
				console.error("[BBPS] fetchOperators error:", error);
				return { data: [], error: "Failed to fetch operators" };
			}
		},
		[product?.useMockData]
	);

	/**
	 * Fetch dynamic fields from API or mock data
	 * @param {number | { value: string; label: string }} operatorId Operator ID to fetch dynamic fields for (can be number or select object)
	 * @returns {Promise<{data: DynamicField[], error: string | null}>} API response
	 */
	const fetchDynamicFields = useCallback(
		async (operatorId: number | { value: string; label: string }) => {
			// Extract operator ID value from the select object (similar to DmtRetailer pattern)
			const actualOperatorId =
				typeof operatorId === "object" &&
				operatorId !== null &&
				"value" in operatorId
					? parseInt(operatorId.value, 10)
					: typeof operatorId === "number"
						? operatorId
						: parseInt(String(operatorId), 10);

			console.log(
				"[BBPS] operatorId",
				operatorId,
				"actualOperatorId",
				actualOperatorId
			);
			// Use mock data if specified in the product config
			if (product?.useMockData) {
				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Return mock dynamic fields
				const mockDynamicFields: DynamicField[] = [
					{
						param_name: "customer_id",
						param_label: "Customer ID",
						regex: "^[0-9]{10}$",
						error_message:
							"Please enter a valid 10 digit Customer ID",
						param_id: "1",
						param_type: "Numeric",
					},
					{
						param_name: "customer_number",
						param_label: "Mobile Number",
						regex: "^[0-9]{10}$",
						error_message:
							"Please enter a valid 10 digit Mobile Number",
						param_id: "2",
						param_type: "Numeric",
					},
				];

				return { data: mockDynamicFields, error: null };
			}

			// Otherwise use the real API
			try {
				const response = await fetchDynamicFieldsCall({
					headers: {
						"tf-req-uri": `/billpayments/operators/${actualOperatorId}`,
					},
				});

				if (response.error) {
					return { data: [], error: response.error };
				}

				// Extract dynamic fields array from the API response
				// API response structure: { "operator_name": "...", "data": [{ param_name: ..., param_label: ... }] }
				const dynamicFields =
					response.data?.data || response.data || [];

				// Ensure we have an array
				if (!Array.isArray(dynamicFields)) {
					console.error(
						"[BBPS] Invalid dynamic fields response format:",
						response
					);
					return { data: [], error: "Invalid response format" };
				}

				return { data: dynamicFields, error: null };
			} catch (error) {
				console.error("[BBPS] fetchDynamicFields error:", error);
				return { data: [], error: "Failed to fetch dynamic fields" };
			}
		},
		[product?.useMockData]
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
				body: {
					interaction_type_id: TransactionTypes.FETCH_BILLS,
					...data,
				},
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

			console.log(
				"[BBPS API] Creating mock response for type:",
				mockResponseType
			);

			// Map the response type to the appropriate status code
			let statusCode: number;
			let message: string;

			switch (mockResponseType) {
				case "success":
					statusCode = 0; // Success
					message = "Payment successful";
					break;
				case "failure":
					statusCode = 1; // Failure
					message = "Payment failed";
					break;
				case "pending":
					statusCode = 2; // Pending
					message = "Payment is being processed";
					break;
				default:
					statusCode = 0; // Default to success
					message = "Payment processed";
			}

			// Return mock response based on type
			return {
				data: {
					status: statusCode,
					message: message,
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
				body: {
					interaction_type_id: TransactionTypes.MAKE_PAYMENT,
					...paymentRequest,
				},
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

		// Transform the selectedOperator
		return transformBillData(response);
	};

	return {
		fetchBills: fetchBillsWithMockSupport,
		makePayment,
		processBillFetchResponse,
		fetchOperators,
		fetchDynamicFields,
		isLoadingBills,
		isLoadingPayment,
		isLoadingOperators,
		isLoadingDynamicFields,
	};
};
