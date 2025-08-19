/**
 * Centralized validation patterns for form fields across the application
 * These patterns are used for client-side validation in forms
 */

/**
 * Name validation pattern
 * - Complex pattern that validates realistic names
 * - Prevents excessive repetition and unrealistic character sequences
 * - Case insensitive validation
 */
const NAME_PATTERN =
	/^(?!(?:(?:([a-z]) *\1(?: *\1)*)|(?:.*?(?:(?:(?:^|[^d])([a-z])\2\2)|(?:d([a-df-z])\3\3)).*)|(?:.*?([a-z]{3,})\4\4).*|(?:.*(?:^|[^a-z])[^aeiou \.]{4,}(?:$|[^a-z]).*))$)(?:[a-z]+\.? ){0,2}[a-z]+$/i;

/**
 * Shop name validation pattern
 * - Allows alphanumeric characters, spaces, and common punctuation
 * - Suitable for business/shop names
 */
const SHOP_NAME_PATTERN = /^[-a-zA-Z0-9 ,./:]*$/;

/**
 * Email validation pattern
 * - Standard email format validation
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone number validation pattern (Indian format)
 * - Allows 10 digits starting with 6-9
 */
const PHONE_PATTERN = /^[6-9]\d{9}$/;

/**
 * PAN number validation pattern
 * - Indian PAN format: 5 letters, 4 digits, 1 letter
 */
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

/**
 * Aadhaar number validation pattern
 * - 12 digits, no spaces
 */
const AADHAAR_PATTERN = /^\d{12}$/;

/**
 * Pin code validation pattern
 * - 6 digits
 */
const PINCODE_PATTERN = /^\d{6}$/;

/**
 * Amount validation pattern
 * - Allows decimal numbers with up to 2 decimal places
 * - No negative values
 */
const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

/**
 * Alphanumeric validation pattern
 * - Letters and numbers only
 */
const ALPHANUMERIC_PATTERN = /^[a-zA-Z0-9]+$/;

/**
 * Validation patterns object with all common patterns
 */
export const VALIDATION_PATTERNS = {
	name: NAME_PATTERN,
	shopName: SHOP_NAME_PATTERN,
	email: EMAIL_PATTERN,
	phone: PHONE_PATTERN,
	pan: PAN_PATTERN,
	aadhaar: AADHAAR_PATTERN,
	pincode: PINCODE_PATTERN,
	amount: AMOUNT_PATTERN,
	alphanumeric: ALPHANUMERIC_PATTERN,
} as const;

/**
 * Common validation lengths for form fields
 */
export const VALIDATION_LENGTHS = {
	name: {
		min: 2,
		max: 50,
	},
	shopName: {
		min: 2,
		max: 100,
	},
	email: {
		min: 5,
		max: 100,
	},
	phone: {
		min: 10,
		max: 10,
	},
	pan: {
		min: 10,
		max: 10,
	},
	aadhaar: {
		min: 12,
		max: 12,
	},
	pincode: {
		min: 6,
		max: 6,
	},
	description: {
		min: 10,
		max: 500,
	},
	address: {
		min: 10,
		max: 200,
	},
} as const;

/**
 * Validation error messages
 */
export const VALIDATION_MESSAGES = {
	name: {
		required: "Name is required",
		pattern: "Please enter a valid name",
		minLength: "Name must be at least 2 characters",
		maxLength: "Name cannot exceed 50 characters",
	},
	shopName: {
		required: "Shop name is required",
		pattern: "Shop name contains invalid characters",
		minLength: "Shop name must be at least 2 characters",
		maxLength: "Shop name cannot exceed 100 characters",
	},
	email: {
		required: "Email is required",
		pattern: "Please enter a valid email address",
	},
	phone: {
		required: "Phone number is required",
		pattern: "Please enter a valid 10-digit phone number",
	},
	pan: {
		required: "PAN number is required",
		pattern: "Please enter a valid PAN number (e.g., ABCDE1234F)",
	},
	aadhaar: {
		required: "Aadhaar number is required",
		pattern: "Please enter a valid 12-digit Aadhaar number",
	},
	pincode: {
		required: "Pin code is required",
		pattern: "Please enter a valid 6-digit pin code",
	},
	amount: {
		required: "Amount is required",
		pattern: "Please enter a valid amount",
		min: "Amount must be greater than 0",
	},
} as const;
