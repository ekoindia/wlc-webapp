import { useDynamicPopup } from "hooks";

/**
 * Hook to open ImageEditor
 */
const useImageEditor = () => {
	const { status, result, showDialog } = useDynamicPopup("ImageEditor");

	/**
	 * Open the ImageEditor dialog
	 * @param {string} url - The URL of the image.
	 * @param image
	 * @param {object} options - Options to pass to the editor.
	 * @param {number} [options.fileName] - Name of the file being edited.
	 * @param {boolean} [options.detectFace] - Detect face in the image.
	 * @param {number} [options.minFaceCount] - Minimum number of faces required to be detected (if detectFace is true).
	 * @param {number} [options.maxFaceCount] - Maximum number of faces allowed to be detected (if detectFace is true).
	 * @param {number} [options.maxLength] - Maximum length or width of the image.
	 * @param {number} [options.aspectRatio] - Aspect ratio of the image. E.g., 1 for square, 16/9 for widescreen.
	 * @param {boolean} [options.disableCrop] - Disable cropping.
	 * @param {boolean} [options.disableRotate] - Disable rotation.
	 * @param {boolean} [options.disableImageEdit] - Disable image editing. Just show the confirmation dialog.
	 * @param {string} [options.watermark] - Watermark text to add to bottom-left of the edited image.
	 * @param {Function} onResponse - Callback function to handle the response when the dialog is closed. The function should accept the result of the dialog as a JSON object.
	 */
	const editImage = (image, options, onResponse) =>
		showDialog(
			{
				image,
				...options,
			},
			onResponse
		);

	return { status, result, editImage };
};

export default useImageEditor;
