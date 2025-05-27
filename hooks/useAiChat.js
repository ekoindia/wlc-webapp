import { useSession, useUser } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useState } from "react";

// API Endpoints for AI chat and voice assistants
const CHAT_ASSISTANT_ENDPOINT = "/gpt/tfassistant";
const VOICE_ASSISTANT_ENDPOINT = "/gpt/tfvoiceassistant";

/**
 * Custom hook for AI chat functionality
 * @param {object} options - Configuration options for the chat
 * @param {string} [options.initialMessage] - Initial message to start the conversation
 * @param {number} [options.maxChatLines] - Maximum number of chat lines allowed
 * @param {Function} [options.onChatLinesChange] - Callback when chat lines change
 * @param {Function} [options.onBusyStateChange] - Callback when busy state changes
 * @returns {object} Chat state and functions
 */
const useAiChat = ({
	initialMessage,
	maxChatLines = 10,
	onChatLinesChange,
	onBusyStateChange,
} = {}) => {
	const { accessToken } = useSession();
	const { isLoggedIn } = useUser();

	const [busy, setBusy] = useState(false);
	const [chatLines, setChatLines] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [chatInput, setChatInput] = useState("");
	const [voiceInput, setVoiceInput] = useState(null);
	const [initialMessageProcessed, setInitialMessageProcessed] =
		useState(false);

	// Derived state
	const isDisabled = busy || chatLines?.length >= maxChatLines;
	const hasReachedLimit = chatLines?.length >= maxChatLines;

	/**
	 * Sets only the first message for the AI Chat
	 * MARK: setInitMsg
	 * @param {string} value - The initial message to set
	 */
	const setInitialMessage = (value) => {
		if (!value || typeof value !== "string") {
			console.error("[GPT] Invalid initial message: ", value);
			return;
		}
		if (chatLines?.length > 0) {
			console.warn(
				"[GPT] Initial message already set, ignoring: ",
				value
			);
			return;
		}
		console.log("[GPT] Setting initial message: ", value);
		setChatInput(value);
		setChatLines([{ from: "user", msg: value, at: Date.now() }]);
		setInputValue("");
	};

	/**
	 * Send a message to the AI chat
	 * MARK: SendChatTxt
	 * @param {string} value - The message to send
	 */
	const sendChatInput = (value) => {
		if (!value) return;
		console.log("[GPT] Sending chat input: ", value);

		if (chatLines?.length >= maxChatLines) return;
		if (typeof value !== "string") {
			console.error("[GPT] Invalid chat input: ", value);
			return;
		}

		setChatInput(value);
		setChatLines((prevLines) => [
			...prevLines,
			{ from: "user", msg: value, at: Date.now() },
		]);
		setInputValue("");
	};

	/**
	 * Clear the chat history
	 */
	const clearChat = () => {
		setChatLines([]);
		setInitialMessageProcessed(false);
	};

	/**
	 * Send a message using the current input value
	 */
	const sendCurrentInput = () => {
		sendChatInput(inputValue);
	};

	// Notify parent components of state changes
	useEffect(() => {
		onChatLinesChange?.(chatLines);
	}, [chatLines, onChatLinesChange]);

	useEffect(() => {
		onBusyStateChange?.(busy);
	}, [busy, onBusyStateChange]);

	// Start chat with user's initial message, if provided
	useEffect(() => {
		if (initialMessage && !chatLines.length && !initialMessageProcessed) {
			setInitialMessageProcessed(true);
			setInitialMessage(initialMessage);
		}
	}, [initialMessage]);

	// Handle voice input if provided. Use fetcher call API with voice data (voiceInput) in the `file` field.
	// MARK: FetchVoice
	useEffect(() => {
		if (!voiceInput) {
			return;
		}
		if (!(voiceInput instanceof Blob)) {
			console.error("[GPT] Invalid voice format: ", voiceInput);
			return;
		}
		if (busy) return;
		if (!isLoggedIn) return;

		const _voice = voiceInput;
		setVoiceInput(null); // Reset voice input after processing

		setBusy(true);

		// TODO: REMOVE THIS - Only for testing
		// if (process.env.NEXT_PUBLIC_ENV === "development") {
		// 	setChatInput("");
		// 	setTimeout(() => {
		// 		setChatLines([
		// 			...chatLines,
		// 			{ from: "user", msg: "Your voice message goes here" },
		// 			{
		// 				from: "system",
		// 				msg: "This is a _sample message._ Here is a **table**:\n\n| Name | Age |\n|------|-----|\n| John | 30  |\n| Jane | 25  |\n\n\nAlso, here is a bulleted list with long sentences:\n- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n- Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n- Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n- Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		// 				at: Date.now(),
		// 			},
		// 		]);
		// 		setBusy(false);
		// 	}, 2000);
		// 	return;
		// }

		console.log("[GPT] Sending voice input: ", _voice);

		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + VOICE_ASSISTANT_ENDPOINT,
			{
				files: {
					file: _voice,
				},
				token: accessToken,
			}
		)
			.then((data) => {
				// Success response from the voice assistant API
				console.log("[GPT] Voice Response: ", data);
				if (data?.reply && typeof data.reply === "string") {
					setChatLines((prevLines) => [
						...prevLines,
						{ from: "user", msg: data.input },
						{ from: "system", msg: data.reply, at: Date.now() },
					]);
				} else {
					// Handle unexpected response format
					setChatLines((prevLines) => [
						...prevLines,
						{
							from: "system",
							msg: "Unexpected response",
							at: Date.now(),
						},
					]);
				}
			})
			.catch((error) => {
				// Handle errors from the voice assistant API
				console.error("[GPT] Voice Error:", error);
				setChatLines((prevLines) => [
					...prevLines,
					{
						from: "system",
						msg: "Sorry, I didn't get that",
						at: Date.now(),
					},
				]);
			})
			.finally(() => {
				setChatInput("");
				setBusy(false);
			});
	}, [voiceInput, accessToken, busy, isLoggedIn]);

	// Fetch GPT response when chatInput changes
	// MARK: FetchChat
	useEffect(() => {
		if (!chatInput) return;
		if (busy) return;
		if (!isLoggedIn) return;

		setBusy(true);

		// TODO: REMOVE THIS - Only for testing
		// if (process.env.NEXT_PUBLIC_ENV === "development") {
		// 	setChatInput("");
		// 	setTimeout(() => {
		// 		setChatLines([
		// 			...chatLines,
		// 			{
		// 				from: "system",
		// 				msg: "This is a _sample message._ Here is a **table**:\n\n| Name | Age |\n|------|-----|\n| John | 30  |\n| Jane | 25  |\n\n\nAlso, here is a bulleted list with long sentences:\n- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n- Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n- Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n- Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		// 				at: Date.now(),
		// 			},
		// 		]);
		// 		setBusy(false);
		// 	}, 2000);
		// 	return;
		// }

		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + CHAT_ASSISTANT_ENDPOINT,
			{
				body: {
					history: chatLines,
					message: chatInput,
					source: "WLC",
				},
				token: accessToken,
			}
		)
			.then((data) => {
				console.log("[GPT] Response: ", data);
				if (data?.reply && typeof data.reply === "string") {
					setChatLines((prevLines) => [
						...prevLines,
						{ from: "system", msg: data.reply, at: Date.now() },
					]);
				} else {
					setChatLines((prevLines) => [
						...prevLines,
						{
							from: "system",
							msg: "Unexpected response",
							at: Date.now(),
						},
					]);
				}
			})
			.catch((error) => {
				console.error("[GPT] Error:", error);
				setChatLines((prevLines) => [
					...prevLines,
					{
						from: "system",
						msg: "Sorry, I didn't get that",
						at: Date.now(),
					},
				]);
			})
			.finally(() => {
				setChatInput("");
				setBusy(false);
			});
	}, [chatInput, accessToken, chatLines, busy, isLoggedIn]);

	// MARK: Hook Return
	return {
		// State
		chatLines,
		inputValue,
		busy,
		isDisabled,
		hasReachedLimit,
		isLoggedIn,

		// Actions
		sendChatInput,
		sendCurrentInput,
		clearChat,
		setInputValue,
		setVoiceInput,

		// Computed state
		isEmpty: chatLines.length === 0,
		chatState: hasReachedLimit ? "limit-reached" : busy ? "busy" : "ready",
	};
};

export default useAiChat;
