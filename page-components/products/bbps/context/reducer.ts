import { Action, BbpsState, initialState } from "./types";

/**
 * Reducer function for managing BBPS state transitions
 * @param {BbpsState} state - Current state
 * @param {Action} action - Action to perform
 * @returns {BbpsState} New state after applying the action
 */
export const bbpsReducer = (state: BbpsState, action: Action): BbpsState => {
	switch (action.type) {
		case "SET_SELECTED_PRODUCT":
			return {
				...state,
				selectedProduct: action.payload,
				selectedBills: [],
				billFetchResult: null,
				totalAmount: 0,
				searchFormData: {},
				error: null,
				paymentStatus: null,
				useMockData: action.payload?.useMockData || false,
			};

		case "SET_VALIDATION_RESPONSE":
			return {
				...state,
				billFetchResult: action.payload,
				// Reset selected bills and auto-select for mandatory mode
				selectedBills:
					action.payload &&
					action.payload.selectionMode === "multiMandatory"
						? action.payload.bills
						: [], // Always reset to empty for non-mandatory modes
				// Reset totalAmount when new bills are loaded
				totalAmount:
					action.payload &&
					action.payload.selectionMode === "multiMandatory"
						? action.payload.bills.reduce(
								(sum, bill) => sum + bill.amount,
								0
							)
						: 0,
			};

		case "SET_SEARCH_PAYLOAD":
			return {
				...state,
				searchFormData: action.payload,
			};

		case "TOGGLE_BILL_SELECTION":
			// Find the bill to toggle
			const billToToggle = state.billFetchResult?.bills.find(
				(bill) => bill.billid === action.billid
			);

			if (!billToToggle) {
				return state;
			}

			// Handle single selection mode
			if (state.billFetchResult?.selectionMode === "single") {
				return {
					...state,
					selectedBills: [billToToggle],
					totalAmount: billToToggle.amount,
				};
			}

			// Handle multiple selection (optional or mandatory)
			const isBillSelected = state.selectedBills.some(
				(bill) => bill.billid === action.billid
			);

			// If bill is already selected, remove it (unless it's mandatory)
			if (isBillSelected) {
				if (state.billFetchResult?.selectionMode === "multiMandatory") {
					// Can't deselect in mandatory mode
					return state;
				}

				const updatedBills = state.selectedBills.filter(
					(bill) => bill.billid !== action.billid
				);

				return {
					...state,
					selectedBills: updatedBills,
					totalAmount: updatedBills.reduce(
						(sum, bill) => sum + bill.amount,
						0
					),
				};
			}
			// If bill is not selected, add it
			else {
				const updatedBills = [...state.selectedBills, billToToggle];

				return {
					...state,
					selectedBills: updatedBills,
					totalAmount: updatedBills.reduce(
						(sum, bill) => sum + bill.amount,
						0
					),
				};
			}

		case "UPDATE_BILL_AMOUNT":
			// Update the amount for a specific bill
			const updatedBills = state.selectedBills.map((bill) =>
				bill.billid === action.billid
					? { ...bill, amount: action.amount }
					: bill
			);

			return {
				...state,
				selectedBills: updatedBills,
				totalAmount: updatedBills.reduce(
					(sum, bill) => sum + bill.amount,
					0
				),
			};

		case "SET_LOADING":
			return {
				...state,
				isLoading: action.value,
			};

		case "SET_ERROR":
			return {
				...state,
				error: action.message,
			};

		case "SET_CURRENT_STEP":
			return {
				...state,
				currentStep: action.step,
			};

		case "SET_MOCK_RESPONSE_TYPE":
			return {
				...state,
				mockResponseType: action.responseType,
			};

		case "SET_PAYMENT_STATUS":
			return {
				...state,
				paymentStatus: action.payload,
			};

		case "SET_MOCK_DATA_FLAG":
			return {
				...state,
				useMockData: action.useMockData,
			};

		case "RESET_STATE":
			return {
				...initialState,
				currentStep: state.currentStep, // Preserve current step
			};

		default:
			return state;
	}
};
