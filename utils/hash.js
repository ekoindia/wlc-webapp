/**
 * Create a numeric hash for the provided input string
 * @param {*} s the provided input string
 * @returns the numeric hash of the string
 */
const numericHash = (s) => {
	let h = 0;
	for (let i = 0; i < s.length; i++)
		h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;

	return Math.abs(h);
};

export { numericHash };
