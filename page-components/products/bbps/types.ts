// page-components/products/bbps/types.ts

import { ParamType } from "constants/trxnFramework";

/** Field definition for the dynamic search form */
export interface SearchFieldDef {
	name: string; // key used in form state & API payload
	label: string; // user-facing label
	parameter_type_id: ParamType;
	required?: boolean; // true → show a red asterisk & validate
	validations?: {
		min?: number;
		max?: number;
		minLength?: number;
		maxLength?: number;
		pattern?: {
			value: RegExp;
			message: string;
		};
		message?: string;
	};
	defaultValue?: string;
	// Properties for LIST type fields
	list_elements?: Array<{ value: string; label: string }>;
	// Properties for dynamic behavior
	onChange?: (_value: string) => void;
}

/** Operator from the operators API response */
export interface Operator {
	operator_id: number;
	name: string;
	billFetchResponse: number;
	high_commission_channel: number;
	kyc_required: number;
	operator_category: number;
	location_id: number;
}

/** Dynamic field from the operator-specific fields API response */
export interface DynamicField {
	param_name: string;
	param_label: string;
	param_id: string;
	param_type: string;
	regex?: string;
	error_message?: string;
}

/** Shape for each product/biller tile in the grid */
export interface BbpsProduct {
	id: string; // "electricity", "echallan", …
	label: string; // "Electricity Bill"
	desc: string; // short tagline
	icon: string; // later swap to a React component
	url: string; // url for the product
	categoryId?: string; // category ID for filtering - optional for backward compatibility
	searchFields: SearchFieldDef[]; // drives SearchForm generation
	useMockData?: boolean; // load mock JSON instead of API
	defaultSearchValues?: Record<string, string>; // pre-fill form (optional)
}
