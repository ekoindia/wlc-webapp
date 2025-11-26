import { useDynamicPopup } from "hooks";

/**
 * Hook to open the "About" popup dialog
 * @returns {object} - The status of the dialog (`status`), the result of the dialog (`result`), and a function to show the dialog (`showAboutDialog`).
 */
const useAbout = () => {
	const { showDialog } = useDynamicPopup("About");

	/**
	 * Open the "About" dialog
	 */
	const showAbout = () => showDialog({}, null);

	return { showAbout };
};

export default useAbout;
