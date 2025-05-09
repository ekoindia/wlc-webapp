import { useDynamicPopup } from "hooks";

/**
 * Hook to open the "AI Chatbot" popup dialog
 * @returns {object} - A function `showAiChatBot` to show the dialog.
 */
const useAiChatbotPopup = () => {
	const { showDialog } = useDynamicPopup("AiChatWidget");

	const showAiChatBot = (message) =>
		showDialog({
			initialMessage: message,
		});

	return { showAiChatBot };
};

export default useAiChatbotPopup;
