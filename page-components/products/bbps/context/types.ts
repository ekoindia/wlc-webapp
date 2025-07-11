import { BbpsProduct, DynamicField, Operator } from "../types";

export type Step = "product-view" | "search" | "preview" | "payment" | "status";

// Payment status types
export type PaymentStatusType = "success" | "failure" | "pending";

// Payment status data structure
export interface PaymentStatusData {
	status: PaymentStatusType;
	message: string;
	transactionId: string;
	amount: number;
	timestamp: string;
	billIds: string[];
}

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
	billNumber: string;
	billDate: string;
	billDueDate: string;
	customerName: string;
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

export interface BillPaymentRequest {
	sourceid: string;
	customerid: string;
	paymentid: string;
	objectid: string;
	currency: string;
	billerid: string;
	validationid: string;
	source_ref_no: string;
	payment_amount: string;
	biller_name: string;
	biller_category: string;
	authenticators: {
		parameter_name: string;
		value: string;
	}[];
	payment_type: string;
	txn_date_time: string;
	biller_status: string;
	payment_account: {
		objectid: string;
		payment_method: string;
		remarks: string;
	};
	billlist: {
		objectid: string;
		billid: string;
		billerid: string;
		sourceid: string;
		billstatus: string;
		authenticators: {
			parameter_name: string;
			value: string;
		}[];
		billnumber: string;
		billperiod: string;
		net_billamount: string;
		description: string;
		additional_details: {
			seq: string;
			label: string;
			value: string;
		}[];
		validationid: string;
		customer_name: string;
		max_pay_amount: string;
		min_pay_amount: string;
		amount_multiple: string;
		billamount: string;
		billdate: string;
		billduedate: string;
	}[];
	payment_status: string;
	debit_amount: string;
	cou_conv_fee: string;
	bou_conv_fee: string;
	bbps_ref_no: string;
	payment_amount_breakup: {
		billid: string;
		bill_payment_amount: string;
	}[];
}

/* ────────────────────────────────────────── */
/* Update BbpsState                          */
export interface BbpsState {
	currentStep: Step;
	selectedProduct: BbpsProduct | null;
	billFetchResult?: {
		selectionMode: "single" | "multiOptional" | "multiMandatory";
		bills: SelectedBill[];
		arePartialPaymentsAllowed: boolean;
	} | null;
	selectedBills: SelectedBill[];
	totalAmount: number;
	isLoading: boolean;
	error: string | null;
	searchFormData: Record<string, string>;
	useMockData?: boolean;
	mockResponseType?: PaymentStatusType;
	paymentStatus?: PaymentStatusData | null;
	// New dynamic fields properties
	operators: Operator[];
	selectedOperator: Operator | null;
	dynamicFields: DynamicField[];
	isLoadingDynamicData: boolean;
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
	useMockData: false,
	mockResponseType: "success",
	paymentStatus: null,
	// New dynamic fields properties
	operators: [],
	selectedOperator: null,
	dynamicFields: [],
	isLoadingDynamicData: false,
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
	| { type: "SET_CURRENT_STEP"; step: Step }
	| { type: "SET_MOCK_RESPONSE_TYPE"; responseType: PaymentStatusType }
	| { type: "SET_PAYMENT_STATUS"; payload: PaymentStatusData }
	| { type: "SET_MOCK_DATA_FLAG"; useMockData: boolean }
	| { type: "RESET_STATE" }
	// New dynamic fields actions
	| { type: "SET_OPERATORS"; payload: Operator[] }
	| { type: "SET_SELECTED_OPERATOR"; payload: Operator | null }
	| { type: "SET_DYNAMIC_FIELDS"; payload: DynamicField[] }
	| { type: "SET_LOADING_DYNAMIC_DATA"; value: boolean }
	| { type: "RESET_DYNAMIC_FORM" };
