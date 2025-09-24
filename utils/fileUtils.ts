/**
 * Utility functions for file operations including saving/downloading files
 */

/**
 * Function to save/download data to a file
 * @param {string | Uint8Array[]} data - The data to save (string or byte arrays)
 * @param {string} filename - The name of the file to save
 * @param {string} type - MIME type of the file
 * @param {boolean} [isB64] - True for file data returned from server, false for locally created text data (e.g., CSV)
 * @returns {void}
 */
export const saveDataToFile = (
	data: string | Uint8Array[],
	filename: string,
	type: string,
	isB64?: boolean
): void => {
	let processedData: string | Uint8Array[] = data;

	if (isB64 === true && typeof data === "string") {
		processedData = b64toByteArrays(data);
	}

	const file = new Blob([processedData] as BlobPart[], { type });

	// IE10+ compatibility
	if ((window.navigator as any).msSaveOrOpenBlob) {
		(window.navigator as any).msSaveOrOpenBlob(file, filename);
		return;
	}

	// Modern browsers
	const a = document.createElement("a");
	a.setAttribute("hidden", "");
	a.style.display = "none";

	const url = window.URL.createObjectURL(file);
	a.href = url;
	a.setAttribute("download", filename);
	a.click();

	// Cleanup to remove large blobs from memory
	window.URL.revokeObjectURL(url);
};

/**
 * Converts base64 string to byte arrays for file operations
 * @param {string} b64Data - Base64 encoded data string
 * @param {number} [sliceSize] - Size of each slice in bytes (default: 512)
 * @returns {Uint8Array[]} Array of byte arrays
 */
export const b64toByteArrays = (
	b64Data: string,
	sliceSize: number = 512
): Uint8Array[] => {
	const byteCharacters = atob(b64Data);
	const byteArrays: Uint8Array[] = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);
		const byteNumbers = new Array(slice.length);

		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	return byteArrays;
};

/**
 * Converts a data URL to a Blob object for secure file operations
 *
 * This function safely converts base64-encoded data URLs (e.g., from canvas screenshots)
 * to Blob objects without requiring 'data:' in CSP connect-src directive.
 * @param {string} dataUrl - The data URL to convert (format: "data:mime/type;base64,data")
 * @returns {object} The converted blob object with proper MIME type
 * @throws {Error} When data URL format is invalid or malformed
 * @example
 * ```typescript
 * const dataUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRg...";
 * const blob = dataUrlToBlob(dataUrl);
 * const file = new File([blob], "image.jpg", { type: blob.type });
 * ```
 * TODO: Use this util function instead of all such custom implementations (for eg: createSupportTicket.ts)
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
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
