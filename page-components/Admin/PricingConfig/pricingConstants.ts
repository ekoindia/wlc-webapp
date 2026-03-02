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
	{ value: "3", label: "Entire Network" },
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

/**
 * Filters and transforms operation type options based on org metadata.
 * - If user type 2 or 3 has disable_partial_account_creation=true, removes "Individual Distributor/Retailer" option
 * - If user type 1 has disable_partial_account_creation=true, removes "Distributor's Network" option
 * - Replaces "Distributor's Network" label with "{UserType1Label} Network"
 * @param {object} [userTypeMetadata] - User type metadata from org context, keyed by user type ID
 * @param {object} [userTypeLabels] - User type labels from org context, keyed by user type ID
 * @returns {Array<{value: string, label: string}>} - Filtered operation type options
 *
 
 * const filtered = getFilteredOperationTypeOptions(metadata, userTypeLabels);
 */
export const getFilteredOperationTypeOptions = (
	userTypeMetadata: Record<string, any> = {},
	userTypeLabels: Record<number, string> = {}
): Array<{ value: string; label: string }> => {
	// Start with the base operation type options
	let filteredOptions = [...OPERATION_TYPE_OPTIONS];

	// Check if user types 2 or 3 have disable_partial_account_creation set to true
	const hasDisablePartialCreation = ["2", "3"].some((typeId) => {
		const typeMetadata = userTypeMetadata[typeId];
		return typeMetadata?.disable_partial_account_creation === true;
	});

	// Remove "Individual Distributor/Retailer" (value "1") if partial account creation is disabled
	if (hasDisablePartialCreation) {
		filteredOptions = filteredOptions.filter(
			(option) => option.value !== "1"
		);
	}

	// Check if user type 1 has disable_partial_account_creation set to true
	const userType1HasDisablePartialCreation =
		userTypeMetadata["1"]?.disable_partial_account_creation === true;

	// Remove "Distributor's Network" (value "2") if user type 1 has disable_partial_account_creation
	if (userType1HasDisablePartialCreation) {
		filteredOptions = filteredOptions.filter(
			(option) => option.value !== "2"
		);
	}

	// Update the label for "Distributor's Network" to use user type 1 label if available
	const userType1Label = userTypeLabels[1];
	filteredOptions = filteredOptions.map((option) => {
		if (option.value === "2" && userType1Label) {
			return {
				...option,
				label: `${userType1Label} Network`,
			};
		}
		return option;
	});

	return filteredOptions;
};
