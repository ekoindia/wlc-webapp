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

// Raw API response structure (for reference)
export interface BillDetailItem {
	billAmount: string;
	maxBillPayAmount: string;
	authenticator4: string | null;
	bharatBillReferenceNumber: string;
	billDate: string;
	amount_multiple: string;
	billNumber: string;
	billDueDate: string;
	filler1: string;
	filler2: string | null;
	minBillPayAmount: string;
}

export interface BillFetchResponse {
	response_status_id: number;
	data: {
		billerid: string;
		amount: string;
		bbpstrxnrefid: string;
		ifsc_status: number;
		utilitycustomername: string;
		billfetchresponse: string;
		billerstatus: string;
		payMultipleBills: string;
		postalcode: string;
		billDetailsList: BillDetailItem[];
		geocode: string;
		billdate: string;
		customer_id: string;
		billDueDate: string;
		billername: string;
	};
	response_type_id: number;
	message: string;
	status: number;
}

/* ────────────────────────────────────────── */
/* Update BbpsState                          */
export interface BbpsState {
	currentStep: Step;
	selectedProduct: BbpsProduct | null;
	billFetchResult?: {
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
	currentStep: "search",
	isLoading: false,
	error: null,
	selectedProduct: null,
	searchFormData: {},
	billFetchResult: null,
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
			payload: BbpsState["billFetchResult"];
	  }
	| { type: "SET_SEARCH_PAYLOAD"; payload: Record<string, string> }
	| { type: "TOGGLE_BILL_SELECTION"; billid: string }
	| { type: "UPDATE_BILL_AMOUNT"; billid: string; amount: number }
	| { type: "SET_LOADING"; value: boolean }
	| { type: "SET_ERROR"; message: string | null }
	| { type: "SET_CURRENT_STEP"; step: Step };
