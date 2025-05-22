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
 * Removes null from a text representing comma-separated values
 * @param {*} text Text from which null needs to be removed
 * @returns {string} Text without null values
 */
export const nullRemover = (text) => {
	if (!text) return "";

	const _filteredText = text
		.split(/\s*,\s*/)
		.filter((item) => !/^null$/i.test(item.trim()));

	const res = _filteredText.join(", ");

	return res;
};

/**
 * Removes numbers from a given text
 * @param {*} text Text from which numbers need to be removed
 * @returns Text without numbers
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
 * @returns Initials of length `len` characters
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
