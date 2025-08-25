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
		.split(",") // Split comma-separated string into array
		.map((id) => {
			const trimmed = id.trim(); // Remove leading/trailing whitespace
			// Convert to number if not empty, otherwise return NaN for filtering
			return trimmed.length > 0 ? Number(trimmed) : NaN;
		})
		.filter((num) => !isNaN(num)); // Remove invalid number conversions
};
