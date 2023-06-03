/**
 * Convert an object (key/value pairs) to a URL-encoded query parameters
 * @param {*} obj the key/value pairs
 * @returns the url-encoded query parameters string.
 */
const obj2queryparams = (obj) =>
	Object.keys(obj)
		.map(function (key) {
			return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
		})
		.join("&");

export { obj2queryparams };
