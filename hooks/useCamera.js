import { useDynamicPopup } from "hooks";

/**
 * Hook to open Camera popup dialog
 */
const useCamera = () => {
	const { status, result, showDialog } = useDynamicPopup("Camera");

	/**
	 * Open the Camera dialog
	 * @param {object} [options] - Options to pass to the editor.
	 * @param {number} [options.aspectRatio] - Aspect ratio of the image. E.g., 1 for square, 16/9 for widescreen.
	 * @param {number} [options.maxLength] - Maximum length or width of the image.
	 * @param {number} [options.aspectRatio] - Aspect ratio of the image. E.g., 1 for square, 16/9 for widescreen.
	 * @param {boolean} [options.disableCrop] - Disable cropping.
	 * @param {boolean} [options.disableRotate] - Disable rotation.
	 * @param {boolean} [options.disableImageEdit] - Disable image editing. Just show the confirmation dialog.
	 * @param {Function} onResponse - Callback function to handle the response when the dialog is closed. The function should accept the result of the dialog as a JSON object.
	 */
	const openCamera = (options, onResponse) => showDialog(options, onResponse);

	return { status, result, openCamera };
};

export default useCamera;
