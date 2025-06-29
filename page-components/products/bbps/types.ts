// page-components/products/bbps/types.ts

import { ParamType } from "constants/trxnFramework";

/** Field definition for the dynamic search form */
export interface SearchFieldDef {
	name: string; // key used in form state & API payload
	label: string; // user-facing label
	parameter_type_id: ParamType;
	required?: boolean; // true → show a red asterisk & validate
	pattern?: RegExp; // optional client-side regex
	validations?: {
		min?: number;
		max?: number;
		minLength?: number;
		maxLength?: number;
		pattern?: RegExp;
		message?: string;
	};
}

/** Shape for each product/biller tile in the grid */
export interface BbpsProduct {
	id: string; // "electricity", "echallan", …
	label: string; // "Electricity Bill"
	desc: string; // short tagline
	icon: string; // later swap to a React component
	url: string; // url for the product
	searchFields: SearchFieldDef[]; // drives SearchForm generation
	useMockData?: boolean; // load mock JSON instead of API
	defaultSearchValues?: Record<string, string>; // pre-fill form (optional)
}
