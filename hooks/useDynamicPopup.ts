import { usePubSub } from "contexts";
import { type ModuleNameType } from "layout-components/DynamicPopupModuleLoader/DynamicPopupModuleLoader";
import { useEffect, useState } from "react";

/**
 * Generic hook to open a DynamicPopupModule dialog.
 * @param moduleName
 * @see {@link layout-components/DynamicPopupModuleLoader/DynamicPopupModuleLoader.tsx}
 * @returns {object} - The status of the dialog, the result of the dialog, and a function to show the dialog.
 * @example
 * const { status, result, showDialog } = useDynamicPopup("MyModule");
 * showDialog({ title: "My Dialog" }, (result) => {
 *   console.log("Dialog closed with result:", result);
 * });
 */
const useDynamicPopup = (moduleName: ModuleNameType) => {
	const { publish, subscribe, TOPICS } = usePubSub();
	const [status, setStatus] = useState("idle");
	const [result, setResult] = useState(null);
	const [resultHandler, setResultHandler] = useState(null);

	const ResultTopic = `${TOPICS.SHOW_DIALOG_FEATURE}.${moduleName}.Result`;

	/**
	 * Open the DynamicPopupModule dialog
	 * @see {@link layout-components/DynamicPopupModuleLoader/DynamicPopupModuleLoader.tsx}
	 * @param {object} options - Options to pass to the dialog. These will be pased to the dynamic popup module as props.
	 * @param {Function} onResponse - Callback function to handle the response when the dialog is closed. The function should accept the result of the dialog as a JSON object.
	 */
	const showDialog = (options, onResponse) => {
		// Set the result handler
		setResultHandler(() => onResponse);

		// Show the dialog
		publish(TOPICS.SHOW_DIALOG_FEATURE, {
			feature: moduleName,
			options: options,
			resultTopic: ResultTopic,
		});

		setStatus("open");
	};

	/**
	 * Subscribe to the result topic to get the result of the DynamicPopupModule dialog
	 */
	useEffect(() => {
		// If the dialog is not open, do not listen to the result topic
		if (status !== "open") return;

		const unsubscribe = subscribe(ResultTopic, (data) => {
			setResult(data);
			setStatus("result");
			resultHandler && resultHandler(data);
		});

		return unsubscribe; // Unsubscribe on component unmount
	}, [status]);

	return { status, result, showDialog };
};

export default useDynamicPopup;
