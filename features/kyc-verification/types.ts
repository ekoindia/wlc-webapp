/**
 * Types for KYC Verification feature.
 * Used across components, hooks, and API calls.
 */

import { ParamType } from "constants/trxnFramework";

/**
 * Validation rules for a request parameter.
 */
export interface RequestParamValidation {
	pattern?: string;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

/**
 * A single request parameter for a KYC verification service.
 * This structure is compatible with the Form component's parameter_list.
 */
export interface RequestParam {
	/** Whether this parameter is required (1 = required, 0 = optional) */
	is_required: 0 | 1;
	/** Parameter name (used as form field name) */
	name: string;
	/** Display label for the parameter */
	label: string;
	/** Data type of the parameter */
	type: "string" | "array" | "number" | "date";
	/** Validation rules */
	validations?: RequestParamValidation;
	/** Placeholder text */
	placeholder?: string;
	/** Helper text shown below the field */
	helperText?: string;
}

/**
 * A single KYC verification service.
 */
export interface VerificationService {
	/** Unique service code identifier */
	serviceCode: string;
	/** Service name (e.g., "PAN Lite") */
	name: string;
	/** Provider label (e.g., "Cashfree - Pan Lite") */
	label: string;
	/** Category for filtering (e.g., "Identity", "Financial") */
	category?: string;
	/** Short description of the service */
	description?: string;
	/** Icon name from the icon library */
	icon?: string;
	/** List of request parameters for the form */
	requestParams: RequestParam[];
}

/**
 * API response structure for fetching KYC services.
 */
export interface KycServicesResponse {
	response_status_id: number;
	data: {
		verification_service_list: VerificationService[];
	};
	response_type_id: number;
	message: string;
	status: number;
}

/**
 * State for multi-service selection mode.
 */
export interface MultiServiceState {
	/** Whether multi-service selection is enabled */
	isMultiModeEnabled: boolean;
	/** Array of selected service codes */
	selectedServices: string[];
	/** Timestamp for session management */
	timestamp: number;
}

/**
 * Form field structure compatible with tf-components/Form.
 * Maps RequestParam to Form component's parameter_list item.
 */
export interface FormField {
	/** Field name */
	name: string;
	/** Display label */
	label: string;
	/** Whether field is required */
	required: boolean;
	/** Parameter type ID for Form component */
	parameter_type_id: ParamType;
	/** Validation rules for react-hook-form */
	validations?: {
		required?: boolean | string;
		pattern?: {
			value: RegExp;
			message: string;
		};
		minLength?: {
			value: number;
			message: string;
		};
		maxLength?: {
			value: number;
			message: string;
		};
		min?: {
			value: number;
			message: string;
		};
		max?: {
			value: number;
			message: string;
		};
	};
	/** Helper text */
	helperText?: string;
	/** Placeholder text */
	placeholder?: string;
	/** Service(s) that require this field (for multi-service form) */
	requiredBy?: string[];
}

/**
 * Category filter option.
 */
export interface CategoryOption {
	/** Category ID/value */
	value: string;
	/** Display label */
	label: string;
	/** Number of services in this category */
	count?: number;
}
