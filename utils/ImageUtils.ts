/**
 * Converts a data URL to a Blob object for secure file operations
 *
 * This function safely converts base64-encoded data URLs (e.g., from canvas screenshots)
 * to Blob objects without requiring 'data:' in CSP connect-src directive.
 * @param {string} dataUrl - The data URL to convert (format: "data:mime/type;base64,data")
 * @returns {Blob} The converted blob object with proper MIME type
 * @throws {Error} When data URL format is invalid or malformed
 * @example
 * ```typescript
 * const dataUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRg...";
 * const blob = dataURLtoBlob(dataUrl);
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
