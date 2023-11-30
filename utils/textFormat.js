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
