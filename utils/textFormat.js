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
 * @param {boolean=false} lower Whether all other letters should be lowercased
 * @return {string}
 * @usage
 *   capitalize('fix this string');     // -> 'Fix This String'
 *   capitalize('javaSCrIPT');    // -> 'Javascript'
 *   capitalize('javaSCrIPT', false);   // -> 'JavaSCrIPT'
 */

export const capitalize = (str = "", lower = true) => {
	const regex = /(?:^|\s|[-"'([{])+\S/g;
	return (lower ? str.toLowerCase() : str).replace(regex, (match) =>
		match.toUpperCase()
	);
};

/**
 * Removes null from a given text
 * @param {*} text Text from which null needs to be removed
 * @returns
 */
export const nullRemover = (text) => {
	const _filteredText = text
		.split(/\s*,\s*/)
		.filter((item) => !/^null$/i.test(item.trim()));

	const res = _filteredText.join(", ");

	return res;
};
