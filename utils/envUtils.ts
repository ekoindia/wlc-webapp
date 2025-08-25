/**
 * Utility functions for parsing environment variables
 */

/**
 * Converts comma-separated environment variable to array of numbers
 * @param {string | undefined} envVar - Environment variable value (e.g., "101,259")
 * @returns {number[]} Array of numbers
 * @example
 * 	parseOrgIds("101,259") // [101, 259]
 * 	parseOrgIds("101, 259 ,300") // [101, 259, 300]
 * 	parseOrgIds("") // []
 * 	parseOrgIds(undefined) // []
 */
export const parseOrgIds = (envVar: string | undefined): number[] => {
	if (!envVar) {
		return [];
	}

	return envVar
		.split(",") // Split comma-separated string into array
		.map((id) => parseInt(id.trim(), 10)) // Parse as base-10 integer, handles empty strings as NaN
		.filter((num) => !isNaN(num)); // Remove invalid number conversions
};
