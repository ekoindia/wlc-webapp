/**
 * Function to save/download data to a file
 * @param is_b64 true for file data returned from server, false for locally created text data (eg: csv)
 */
export const saveDataToFile = (data, filename, type, is_b64) => {
	if (is_b64 === true && typeof data === "string") {
		data = b64toByteArrays(data);
	}
	const file = new Blob(data, { type: type });

	if (window.navigator.msSaveOrOpenBlob) {
		// IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	} else {
		// Others

		const a = document.createElement("a");
		a.setAttribute("hidden", "");
		a.style.display = "none";

		let url = window.URL.createObjectURL(file);
		a.href = url;
		a.setAttribute("download", filename || "file");
		a.click();

		// Cleanup (to remove large blobs from memory)
		// document.removeChild(a); // not required; element not appended to document
		window.URL.revokeObjectURL(url);
	}
};

export const b64toByteArrays = (b64Data, sliceSize) => {
	sliceSize = sliceSize || 512;

	let byteCharacters = atob(b64Data);
	let byteArrays = [];
	let byteArray;
	let byteNumbers;
	let i;

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		let slice = byteCharacters.slice(offset, offset + sliceSize);

		byteNumbers = new Array(slice.length);
		for (i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	return byteArrays;
};
