import { BbpsProduct } from "../types";

export type Step = "product-view" | "search" | "preview" | "payment" | "status";

// ✧ NEW helper for amount constraints
export interface AmountRules {
	min?: number;
	max?: number;
	multiple?: number;
}

// ✧ Selected bill for Preview/Pay
export interface SelectedBill {
	billid: string;
	label: string;
	amount: number; // agent-editable
	amountRules: AmountRules;
}

/* ────────────────────────────────────────── */
/* Update BbpsState                          */
export interface BbpsState {
	currentStep: Step;
	selectedProduct: BbpsProduct | null;
	validationResponse?: {
		selectionMode: "single" | "multiOptional" | "multiMandatory";
		bills: SelectedBill[];
	} | null;
	selectedBills: SelectedBill[];
	totalAmount: number;
	isLoading: boolean;
	error: string | null;
	searchFormData: Record<string, string>;
}

/* Initial values */
export const initialState: BbpsState = {
	currentStep: "product-view",
	isLoading: false,
	error: null,
	selectedProduct: null,
	searchFormData: {},
	validationResponse: null,
	selectedBills: [],
	totalAmount: 0,
};

/* ────────────────────────────────────────── */
/* Extend Action union                       */
export type Action =
	| {
			type: "SET_SELECTED_PRODUCT";
			payload: BbpsProduct;
	  }
	| {
			type: "SET_VALIDATION_RESPONSE";
			payload: BbpsState["validationResponse"];
	  }
	| { type: "SET_SEARCH_PAYLOAD"; payload: Record<string, string> }
	| { type: "TOGGLE_BILL_SELECTION"; billid: string }
	| { type: "UPDATE_BILL_AMOUNT"; billid: string; amount: number }
	| { type: "SET_LOADING"; value: boolean }
	| { type: "SET_ERROR"; message: string | null }
	| { type: "SET_CURRENT_STEP"; step: Step };
