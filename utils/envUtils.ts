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
	if (!envVar || envVar.trim() === "") {
		return [];
	}

	return envVar
		.split(",")
		.map((id) => id.trim())
		.filter((id) => id.length > 0)
		.map(Number)
		.filter((id) => !isNaN(id));
};
