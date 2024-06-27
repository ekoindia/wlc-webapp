import { formatDate } from "libs";

/**
 * Calculates the date occurring before the given date by a specified number of days.
 * Formats the resulting date in the provided format if format is specified.
 * @param {Date} date - The date from which to calculate the previous date.
 * @param {number} daysBefore - The number of days to subtract from the given date.
 * @param {string} [format] - (Optional) The format in which the date should be formatted.
 * @returns {(Date|string)} - The calculated date occurring before the given date by the specified days.
 */
export const calculateDateBefore = (date, daysBefore, format) => {
	const previousDate = new Date(date);
	previousDate.setDate(previousDate.getDate() - daysBefore);

	if (format) {
		return formatDate(previousDate, format);
	}

	return previousDate;
};
