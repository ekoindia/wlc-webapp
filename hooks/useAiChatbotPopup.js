import { usePubSub } from "contexts";

/**
 * Hook to open the "AI Chatbot" popup dialog
 * @returns {object} - A function `showAiChatBot` to show the dialog.
 */
const useAiChatbotPopup = () => {
	const { publish, /* subscribe, */ TOPICS } = usePubSub();

	const showAiChatBot = (message) => {
		publish(TOPICS.SHOW_DIALOG_FEATURE, {
			feature: "AiChatWidget",
			options: {
				initialMessage: message,
			},
		});
	};

	return { showAiChatBot };
};

export default useAiChatbotPopup;
