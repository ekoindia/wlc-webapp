/**
 * Wrapper functions for date-fns library
 * @see https://date-fns.org/
 * @see https://date-fns.org/v2.30.0/docs/format
 * @see https://date-fns.org/v2.30.0/docs/parse
 * @see https://date-fns.org/v2.30.0/docs/I18n
 * @see https://date-fns.org/v2.30.0/docs/Unicode-Tokens
 */
import { format } from "date-fns";

/**
 * Helper function to format a date string.
 * @param {string} dateString - The date string
 * @param {string} formatString - The date format specified as [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table). Defaults to `dd/MM/yyyy`.
 * @returns {string} - Formatted date string. Returns empty string if the `dateString` is empty. Returns the `dateString` if it is not a valid date string.
 */
export const formatDate = (dateString, formatString = "dd/MM/yyyy") => {
	if (!dateString) return "";
	const dateObj = new Date(dateString);
	if (isNaN(dateObj)) {
		return dateString;
	}

	// Fix basic format issues
	formatString = formatString.replace(/ AA/, " a");

	return format(dateObj, formatString);
};

/**
 * Helper function to format a date-time string.
 * Same as `formatDate` function but defaults to `dd/MM/yyyy hh:mm a`.
 * @param {string} dateString - The date-time string
 * @param {string} formatString - The date-time format specified as [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table). Defaults to `dd/MM/yyyy hh:mm a`.
 * @returns {string} - Formatted date-time string. Returns empty string if the `dateString` is empty. Returns the `dateString` if it is not a valid date-time string.
 */
export const formatDateTime = (
	dateString,
	formatString = "dd/MM/yyyy hh:mm a"
) => formatDate(dateString, formatString);

/**
 * Get the "when" string for the given Date object. Eg: "Today", "Yesterday", "Tomorrow".
 * @param {Date} date - The Date object
 * @returns {string} - The "when" string
 * @example
 * getWhenString(new Date()); // "Today"
 * getWhenString(new Date(Date.now() - 24 * 60 * 60 * 1000)); // "Yesterday"
 * getWhenString(new Date(Date.now() + 24 * 60 * 60 * 1000)); // "Tomorrow"
 */
export const getWhenString = (date) => {
	if (!date) return "";

	const today = new Date();
	if (date.toDateString() === today.toDateString()) {
		return "Today";
	}

	const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
	if (date.toDateString() === yesterday.toDateString()) {
		return "Yesterday";
	}

	const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
	if (date.toDateString() === tomorrow.toDateString()) {
		return "Tomorrow";
	}

	return "";
};
