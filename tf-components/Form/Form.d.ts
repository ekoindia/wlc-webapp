import { GridProps } from "@chakra-ui/react";
import { ParamType } from "constants/trxnFramework";
import { CSSProperties, ReactNode } from "react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

/**
 * Validation rules for a form field
 */
export interface FieldValidations {
	required?: string | boolean;
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
}

/**
 * List element option for select/radio fields
 */
export interface ListElement {
	label: string;
	value: string | number;
}

/**
 * Parameter configuration for a form field
 */
export interface FormParameter {
	/** Field name (used as form key) */
	name: string;
	/** Field label text */
	label: string;
	/** Custom styles for the label */
	labelStyle?: CSSProperties;
	/** Whether field is required */
	required?: boolean;
	/** Field value (for fixed/display fields) */
	value?: unknown;
	/** Whether field is disabled */
	disabled?: boolean;
	/** Options for LIST type */
	list_elements?: ListElement[];
	/** Default value for controlled fields */
	defaultValue?: unknown;
	/** Field type ID from ParamType enum */
	parameter_type_id?: ParamType;
	/** Enable multi-select for LIST type */
	is_multi?: boolean;
	/** Field metadata */
	meta?: {
		force_dropdown?: boolean;
		[key: string]: unknown;
	};
	/** Custom renderer for multi-select values */
	multiSelectRenderer?: (_value: unknown) => ReactNode;
	/** react-hook-form validation rules */
	validations?: FieldValidations;
	/** Helper text shown below field */
	helperText?: string;
	/** Whether field is inactive/hidden */
	is_inactive?: boolean;
	/** Min lines for textarea (> 1 enables textarea) */
	lines_min?: number;
	/** Name of parameter that controls visibility */
	visible_on_param_name?: string;
	/** Regex to test against controlling parameter value */
	visible_on_param_value?: RegExp;
	/** Min date for date fields (YYYY-MM-DD) */
	minDate?: string;
	/** Max date for date fields (YYYY-MM-DD) */
	maxDate?: string;
	/** Placeholder text */
	placeholder?: string;
}

/**
 * Props for the Form component
 */
export interface FormProps extends Omit<GridProps, "children"> {
	/** Array of field configurations */
	parameter_list: FormParameter[];
	/** react-hook-form register function */
	register: UseFormRegister<Record<string, unknown>>;
	/** Current form values from watch() */
	formValues: Record<string, unknown>;
	/** react-hook-form control object */
	control: Control<Record<string, unknown>>;
	/** react-hook-form errors object */
	errors: FieldErrors<Record<string, unknown>>;
	/** Size of form components */
	size?: "sm" | "md" | "lg";
	/** Hide "(optional)" text on non-required fields */
	hideOptionalMark?: boolean;
	/** Callback function for Enter key press (used by OTP input on complete) */
	onEnter?: (_e?: React.BaseSyntheticEvent) => void | Promise<void>;
}

/**
 * A dynamic Form component that renders form fields based on a parameter list configuration.
 */
declare const Form: React.FC<FormProps>;

export default Form;
