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
