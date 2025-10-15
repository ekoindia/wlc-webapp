/**
 * Truncate text to a maximum length and add postfix (...)
 * @param {*} text	Text to be truncated
 * @param {*} maxLength	Maximum length for the text
 * @param {*} postfix	Postfix to be added to the text, if truncated
 * @returns
 */
export const limitText = (text, maxLength, postfix = "…") => {
	return text.length <= maxLength
		? text
		: text.substring(0, maxLength) + postfix;
};

export const getFirstWord = (text) => {
	return text ? text.split(" ")[0] : "";
};

/**
 * Capitalizes first letters of words in string.
 * @param {string} str String to be modified
 * @param {boolean=true} lower Whether all other letters should be lowercased
 * @returns {string} String with first letters capitalized
 * @example
 *   capitalize('fix this string');     // -> 'Fix This String'
 *   capitalize('javaSCrIPT');    // -> 'Javascript'
 *   capitalize('javaSCrIPT', false);   // -> 'JavaSCrIPT'
 */
export const capitalize = (str, lower = true) => {
	if (!str) return "";

	const regex = /(?:^|\s|[-"'([{])+\S/g;
	return (lower ? str.toLowerCase() : str).replace(regex, (match) =>
		match.toUpperCase()
	);
};

/**
 * Converts a label to a kebab-case formatted string (lowercase with hyphens).
 * Replaces all spaces with hyphens and converts the string to lowercase.
 * @param {string} label - The input label to format.
 * @returns {string} The formatted string in kebab-case.
 * @example
 * toKebabCase("Agent Pricing"); // Returns "agent-pricing"
 */
export const toKebabCase = (label) => label.toLowerCase().replace(/\s+/g, "-"); // Convert spaces to '-'

/**
 * Removes all instances of the word "null" from text, preserving list structure
 * @param {string} text - Text from which null needs to be removed
 * @returns {string} Text without null values, properly formatted with commas
 * @example
 * nullRemover("null, text, null, text") // returns "text, text"
 * nullRemover("text null text") // returns "text text"
 */
export const nullRemover = (text) => {
	if (!text) return "";

	// Split by commas, clean each part, and filter out empty/null parts
	const cleanParts = text
		.split(",")
		.map((part) =>
			part
				.replace(/\b(null)\b/gi, "") // Remove the word "null" (case insensitive)
				.trim()
		)
		.filter((part) => part.length > 0);

	// Join parts back with commas and clean any extra spaces
	return cleanParts.join(", ").trim();
};

/**
 * Removes numbers from a given text
 * @param {*} text Text from which numbers need to be removed
 * @returns {string} Text without numbers
 */
export const numberRemover = (text) => {
	const regex = /\b\d+\b/g;
	const withoutNumbers = text.replace(regex, "");
	return withoutNumbers;
};

/**
 * Get initials from a given text in upper-case
 * @param {string} text Text from which initials need to be extracted
 * @param {number} len Number of characters to extract
 * @returns {string} Initials of length `len` characters
 */
export const getInitials = (text, len = 2) => {
	if (!text || typeof text !== "string") return "";

	return text
		.split(/[^a-zA-Z0-9]/)
		.slice(0, len)
		.map((word) => word[0])
		.join("")
		.toUpperCase();
};
