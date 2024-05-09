import { usePubSub } from "contexts";
import { useEffect, useState } from "react";

/**
 * Hook to open the "Raising Issue" popup dialog
 * @returns {object} - The status of the dialog, the result of the dialog, and a function to show the dialog.
 */
const useRaiseIssue = () => {
	const { publish, subscribe, TOPICS } = usePubSub();
	const [status, setStatus] = useState("idle");
	const [result, setResult] = useState(null);
	const [resultHandler, setResultHandler] = useState(null);

	const ResultTopic = TOPICS.SHOW_DIALOG_FEATURE + ".Feedback.Result";

	/**
	 * Open the "Raise Issue" dialog
	 * @param {object} options - Options to pass to the dialog.
	 * @param {function} onResponse - Callback function to handle the response when the dialog is closed. The function should accept the result of the dialog as a JSON object.
	 */
	const showRaiseIssueDialog = (options, onResponse) => {
		// Set the result handler
		setResultHandler(onResponse);

		// Show the dialog
		publish(TOPICS.SHOW_DIALOG_FEATURE, {
			feature: "Feedback",
			options: options,
			resultTopic: ResultTopic,
		});

		setStatus("open");
	};

	/**
	 * Subscribe to the result topic to get the result of the "Raise Issue" dialog
	 * The data object should contain:
	 * - module: The module to load
	 * - options: Options to pass to the module
	 * - resultTopic: The topic to publish the result to
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

	return { status, result, showRaiseIssueDialog };
};

export default useRaiseIssue;
