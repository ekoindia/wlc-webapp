import { useDynamicPopup } from "hooks";

/**
 * Hook to open the "Raising Issue" popup dialog
 * @returns {object} - The status of the dialog (`status`), the result of the dialog (`result`), and a function to show the dialog (`showRaiseIssueDialog`).
 */
const useRaiseIssue = () => {
	const { status, result, showDialog } = useDynamicPopup("Feedback");

	/**
	 * Open the "Raise Issue" dialog
	 * @see {@link page-components/RaiseIssueCard/RaiseIssueCard.tsx} for a list of supported options.
	 * @param {object} options - Options to pass to the dialog. It supports all the properties accepted by the `RaiseIssueCard` component.
	 * @param {Function} onResponse - Callback function to handle the response when the dialog is closed. The function should accept the result of the dialog as a JSON object.
	 */
	const showRaiseIssueDialog = (options, onResponse) =>
		showDialog(options, onResponse);

	return { status, result, showRaiseIssueDialog };
};

export default useRaiseIssue;
