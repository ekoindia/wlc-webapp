/**
 * Converts a data URL to a Blob object
 * @param {string} dataUrl - The data URL to convert to a blob
 * @returns {object} The converted blob object
 */
export const dataURLtoBlob = (dataUrl: string): Blob => {
	const arr = dataUrl.split(",");
	const mimeMatch = arr[0].match(/:(.*?);/);

	if (!mimeMatch) {
		throw new Error("Invalid data URL format");
	}

	const mime = mimeMatch[1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new Blob([u8arr], { type: mime });
};
