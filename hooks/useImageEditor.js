import { usePubSub } from "contexts";
import { useEffect, useState } from "react";

/**
 * Hook to open ImageEditor
 */
const useImageEditor = () => {
	const { publish, subscribe, TOPICS } = usePubSub();
	const [status, setStatus] = useState("idle");
	const [result, setResult] = useState(null);
	const [resultHandler, setResultHandler] = useState(null);

	const ResultTopic = TOPICS.SHOW_DIALOG_FEATURE + ".ImageEditor.Result";

	/**
	 * Subscribe to the result topic to get the result of the ImageEditor dialog
	 * The data object should contain:
	 * - image: the edited image (as base64 string)
	 * - file: the edited image (as File object)
	 * - accepted (true/false): if the user accepted the changes
	 * - edited: if the image was edited
	 */
	useEffect(() => {
		// If the dialog is not open, do not listen to the result topic
		if (status !== "open") return;

		const unsubscribe = subscribe(ResultTopic, (data) => {
			console.log("[useImageEditor] Result: ", {
				data,
				resultHandler,
			});
			setResult(data);
			setStatus("result");
			resultHandler && resultHandler(data);
		});

		return unsubscribe; // Unsubscribe on component unmount
	}, [status, resultHandler]);

	/**
	 * Open the ImageEditor dialog
	 * @param {string} url - The URL of the image.
	 * @param {object} options - Options to pass to the editor.
	 * @param {number} [options.fileName] - Name of the file being edited.
	 * @param {boolean} [options.detectFace=false] - Detect face in the image.
	 * @param {number} [options.maxLength] - Maximum length or width of the image.
	 * @param {number} [options.aspectRatio] - Aspect ratio of the image. E.g., 1 for square, 16/9 for widescreen.
	 * @param {boolean} [options.disableCrop=false] - Disable cropping.
	 * @param {boolean} [options.disableRotate=false] - Disable rotation.
	 * @param {boolean} [options.disableImageEdit=false] - Disable image editing. Just show the confirmation dialog.
	 * @param {string} [options.watermark] - Watermark text to add to bottom-left of the edited image.
	 * @param {function} onResponse - Callback function to handle the response when the dialog is closed. The function should accept the result of the dialog as a JSON object.
	 */
	const editImage = (image, options, onResponse) => {
		console.log("[useImageEditor] Opening: ", {
			image,
			options,
			onResponse,
		});

		// Set the result handler
		setResultHandler(() => onResponse);

		publish(TOPICS.SHOW_DIALOG_FEATURE, {
			feature: "ImageEditor",
			options: {
				image: image,
				...options,
			},
			resultTopic: ResultTopic,
		});

		setStatus("open");
	};

	return { status, result, editImage };
};

export default useImageEditor;
