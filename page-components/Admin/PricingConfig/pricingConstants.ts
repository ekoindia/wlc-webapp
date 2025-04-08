/**
 * Agent types used in the pricing configuration.
 * @constant
 * @property {string} RETAILERS - Represents the retailer agent type.
 * @property {string} DISTRIBUTOR - Represents the distributor agent type.
 */
export const AGENT_TYPES = {
	RETAILERS: "0",
	DISTRIBUTOR: "2",
} as const;

/**
 * Operation type options for configuring pricing.
 * @constant
 * @type {Array<{value: string, label: string}>}
 * @property {string} value - The operation type value.
 * @property {string} label - The label for the operation type.
 */
export const OPERATION_TYPE_OPTIONS = [
	{ value: "3", label: "Whole Network" },
	{ value: "2", label: "Distributor's Network" },
	{ value: "1", label: "Individual Distributor/Retailer" },
];

/**
 * Pricing types used in the pricing configuration.
 * @constant
 * @property {string} PERCENT - Represents percentage-based pricing.
 * @property {string} FIXED - Represents fixed amount pricing.
 */
export const PRICING_TYPES = {
	PERCENT: "0",
	FIXED: "1",
} as const;

/**
 * Pricing type options for configuring pricing.
 * @constant
 * @type {Array<{id: string, value: string, label: string, isDisabled: boolean}>}
 * @property {string} id - The unique identifier for the pricing type.
 * @property {string} value - The value representing the pricing type.
 * @property {string} label - The label for the pricing type.
 * @property {boolean} isDisabled - Indicates whether the pricing type is disabled.
 */
export const PRICING_TYPE_OPTIONS = [
	{
		id: "percentage",
		value: PRICING_TYPES.PERCENT,
		label: "Percentage (%)",
		isDisabled: false,
	},
	{
		id: "fixed",
		value: PRICING_TYPES.FIXED,
		label: "Fixed (₹)",
		isDisabled: false,
	},
];

/**
 * Operation types for submitting or fetching data.
 * @constant
 * @property {number} SUBMIT - Represents the submit operation.
 * @property {number} FETCH - Represents the fetch operation.
 */
export const OPERATION = {
	SUBMIT: 1,
	FETCH: 0,
} as const;
