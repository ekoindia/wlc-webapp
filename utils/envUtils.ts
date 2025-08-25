/**
 * Utility functions for parsing environment variables
 */

/**
 * Converts comma-separated environment variable to array of numbers or strings
 * @param {string | undefined} envVar - Environment variable value (e.g., "101,259" or "ABC,XYZ,123")
 * @returns {(string | number)[]} Array of numbers for numeric IDs, strings for alphanumeric IDs
 * @example
 * 	parseOrgIds("101,259") // [101, 259]
 * 	parseOrgIds("ABC,XYZ") // ["ABC", "XYZ"]
 * 	parseOrgIds("101, ABC ,XYZ") // [101, "ABC", "XYZ"]
 * 	parseOrgIds("") // []
 * 	parseOrgIds(undefined) // []
 */
export const parseOrgIds = (
	envVar: string | undefined
): (string | number)[] => {
	if (!envVar || envVar.trim() === "") {
		return [];
	}

	return envVar
		.split(",")
		.map((id) => id.trim())
		.filter((id) => id.length > 0)
		.map((id) => {
			// Try to convert to number if it's numeric, otherwise keep as string
			const numericId = Number(id);
			return !isNaN(numericId) && isFinite(numericId) ? numericId : id;
		});
};
