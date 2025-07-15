// page-components/products/bbps/types.ts

import { ParamType } from "constants/trxnFramework";

/**
 * Field definition for the dynamic search form
 * Used to generate form fields dynamically based on product configuration
 * @interface SearchFieldDef
 */
export interface SearchFieldDef {
	name: string;
	label: string;
	parameter_type_id: ParamType;
	required?: boolean;
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
	value?: string;
	list_elements?: Array<{ value: string; label: string }>;
	onChange?: (_value: string) => void;
	meta?: {
		force_dropdown?: boolean;
	};
}

/**
 * Operator from the operators API response
 * Represents a biller/operator that can process bill payments
 * @interface Operator
 */
export interface Operator {
	operator_id: number;
	name: string;
	billFetchResponse: number;
	high_commission_channel: number;
	kyc_required: number;
	operator_category: number;
	location_id: number;
}

/**
 * Dynamic field from the operator-specific fields API response
 * Represents additional form fields required by specific operators
 * @interface DynamicField
 */
export interface DynamicField {
	param_name: string;
	param_label: string;
	param_id: string;
	param_type: string;
	regex?: string;
	error_message?: string;
}

/**
 * Shape for each product/biller tile in the grid
 * Defines the configuration for a BBPS product/service
 * @interface BbpsProduct
 */
export interface BbpsProduct {
	id: string;
	label: string;
	desc: string;
	icon: string;
	url: string;
	categoryId?: string;
	searchFields: SearchFieldDef[];
	useMockData?: boolean;
	defaultSearchValues?: Record<string, string>;
}
