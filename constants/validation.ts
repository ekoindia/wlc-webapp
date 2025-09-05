/**
 * Centralized validation patterns for form fields across the application
 * Each validation object contains regex pattern and length constraints
 */

interface ValidationConfig {
	readonly regex: RegExp;
	readonly minLength: number;
	readonly maxLength: number;
}

/**
 * Individual validation configurations for selective imports
 */
export const nameValidation = {
	regex: /^(?!(?:(?:([a-z]) *\1(?: *\1)*)|(?:.*?(?:(?:(?:^|[^d])([a-z])\2\2)|(?:d([a-df-z])\3\3)).*)|(?:.*?([a-z]{3,})\4\4).*|(?:.*(?:^|[^a-z])[^aeiou \.]{4,}(?:$|[^a-z]).*))$)(?:[a-z]+\.? ){0,2}[a-z]+$/i,
	minLength: 2,
	maxLength: 50,
} as const satisfies ValidationConfig;

export const shopNameValidation = {
	regex: /^[-a-zA-Z0-9 ,./:]*$/,
	minLength: 2,
	maxLength: 100,
} as const satisfies ValidationConfig;

export const emailValidation = {
	regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	minLength: 5,
	maxLength: 100,
} as const satisfies ValidationConfig;

export const phoneValidation = {
	regex: /^[6-9]\d{9}$/,
	minLength: 10,
	maxLength: 10,
} as const satisfies ValidationConfig;

export const panValidation = {
	regex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
	minLength: 10,
	maxLength: 10,
} as const satisfies ValidationConfig;

export const aadhaarValidation = {
	regex: /^\d{12}$/,
	minLength: 12,
	maxLength: 12,
} as const satisfies ValidationConfig;

export const pincodeValidation = {
	regex: /^\d{6}$/,
	minLength: 6,
	maxLength: 6,
} as const satisfies ValidationConfig;

export const amountValidation = {
	regex: /^\d+(\.\d{1,2})?$/,
	minLength: 1,
	maxLength: 15,
} as const satisfies ValidationConfig;

export const alphanumericValidation = {
	regex: /^[a-zA-Z0-9]+$/,
	minLength: 1,
	maxLength: 50,
} as const satisfies ValidationConfig;

export const descriptionValidation = {
	regex: /^.+$/,
	minLength: 10,
	maxLength: 500,
} as const satisfies ValidationConfig;

export const addressValidation = {
	regex: /^.+$/,
	minLength: 10,
	maxLength: 200,
} as const satisfies ValidationConfig;
