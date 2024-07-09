import { usePubSub } from "contexts";
import { useEffect, useState } from "react";

/**
 * Hook to open Camera popup dialog
 */
const useCamera = () => {
	const { publish, subscribe, TOPICS } = usePubSub();
	const [status, setStatus] = useState("idle");
	const [result, setResult] = useState(null);
	const [resultHandler, setResultHandler] = useState(null);

	const ResultTopic = TOPICS.SHOW_DIALOG_FEATURE + ".Camera.Result";

	/**
	 * Subscribe to the result topic to get the result of the Camera dialog
	 * The data object should contain:
	 * - image: the edited image
	 * - accepted (true/false): if the user accepted the changes
	 * - edited: if the image was edited
	 */
	useEffect(() => {
		// If the dialog is not open, do not listen to the result topic
		if (status !== "open") return;

		const unsubscribe = subscribe(ResultTopic, (data) => {
			console.log("[useCamera] Result: ", {
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
	const openCamera = (options, onResponse) => {
		console.log("[useCamera] Opening: ", {
			options,
			onResponse,
		});

		// Set the result handler
		setResultHandler(() => onResponse);

		publish(TOPICS.SHOW_DIALOG_FEATURE, {
			feature: "Camera",
			options: {
				...options,
			},
			resultTopic: ResultTopic,
		});

		setStatus("open");
	};

	return { status, result, openCamera };
};

export default useCamera;
