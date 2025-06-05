import { useSession, useUser } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { useRefreshToken } from "hooks";
import { useEffect, useState } from "react";

// API Endpoints for AI chat and voice assistants
const CHAT_ASSISTANT_ENDPOINT = "/gpt/tfassistant";
const VOICE_ASSISTANT_ENDPOINT = "/gpt/tfvoiceassistant";
const CHAT_RATING_ENDPOINT = "/gpt/rate";

/**
 * Sample prompt messages for AI chat
 */
const SAMPLE_PROMPTS_COLLECTION = [
	"Give a summary of my business",
	"How was my business yesterday?",
	"Who are my top users?",
	"मेरे व्यवसाय का कल का हाल बताएं",
	"मेरा व्यवसाय कैसा चल रहा है?",
];

// MOCK CHAT RESPONSE
// const MOCK_CHAT_RESPONSE =
// 	"This is a _sample message._ Here is a **table**:\n\n| Name | Age |\n|------|-----|\n| John | 30  |\n| Jane | 25  |\n\n\nAlso, here is a bulleted list with long sentences:\n- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n- Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n- Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

/**
 * Custom hook for AI chat functionality
 * @param {object} options - Configuration options for the chat
 * @param {string} [options.initialMessage] - Initial message to start the conversation
 * @param {number} [options.maxChatLines] - Maximum number of chat lines allowed
 * @param {Function} [options.onChatLinesChange] - Callback when chat lines change
 * @param {Function} [options.onBusyStateChange] - Callback when busy state changes
 * @returns {object} Chat state and functions:
 * - chatLines: Array of chat messages
 * - inputValue: Current input value
 * - busy: Boolean indicating if the chat is busy processing
 * - isDisabled: Boolean indicating if the chat is disabled (busy or max lines reached)
 * - hasReachedLimit: Boolean indicating if the max chat lines limit has been reached
 * - isLoggedIn: Boolean indicating if the user is logged in
 * - samplePrompts: Array of sample prompts for the chat
 * - lastRating: Last rating given by the user
 * - sendChatInput: Function to send a chat message
 * - sendCurrentInput: Function to send the current input value
 * - clearChat: Function to clear the chat history
 * - setInputValue: Function to set the input value
 * - setVoiceInput: Function to set voice input (Blob)
 * - rateChat: Function to rate the last chat response
 * - isEmpty: Boolean indicating if the chat is empty
 * - chatState: Current state of the chat ("ready", "busy", or "limit-reached")
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
	const [samplePrompts, setSamplePrompts] = useState([]);

	const [lastRating, setLastRating] = useState(null);
	const [busyRating, setBusyRating] = useState(false);

	const { generateNewToken } = useRefreshToken(); // For re-generating access-token, required by fetcher()

	// Initialize samplePrompts with 3 random selection from the collection
	useEffect(() => {
		const copyPrompts = [...SAMPLE_PROMPTS_COLLECTION];
		const randomPrompts = [];
		for (let i = 0; i < 3; i++) {
			const randomIndex = Math.floor(Math.random() * copyPrompts.length);
			randomPrompts.push(copyPrompts[randomIndex]);
			copyPrompts.splice(randomIndex, 1);
		}
		setSamplePrompts(randomPrompts);
	}, []);

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
		setLastRating(null);
	};

	/**
	 * Clear the chat history
	 */
	const clearChat = () => {
		setChatLines([]);
		setInitialMessageProcessed(false);
		setLastRating(null);
	};

	/**
	 * Send a message using the current input value
	 */
	const sendCurrentInput = () => {
		sendChatInput(inputValue);
	};

	/**
	 * Rate the last chat response
	 * MARK: RateChat
	 * @param {string} message_id - The ID of the message to rate (usually the last message)
	 * @param {number} rating - The rating to send (1 = "Thumb Down", 2 = "Thumb Up")
	 */
	const rateChat = (message_id, rating) => {
		if (busyRating) {
			console.warn("[GPT] Already rating, please wait.");
			return;
		}

		setBusyRating(true);
		setLastRating(rating);

		if (!isLoggedIn) {
			console.warn("[GPT] User is not logged in, cannot rate.");
			return;
		}

		if (![1, 2].includes(rating)) {
			console.error("[GPT] Invalid rating: ", rating);
			return;
		}
		if (!(chatLines?.length > 0)) {
			console.warn("[GPT] No chat history available to rate.");
			return;
		}

		const lastMsg = chatLines?.[chatLines.length - 1];

		if (!(lastMsg && lastMsg.from === "system" && lastMsg.id)) {
			console.warn("[GPT] No valid last message to rate.");
			return;
		}

		console.log("[GPT] Sending rating for last message: ", {
			lastMsg,
			rating,
		});

		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + CHAT_RATING_ENDPOINT,
			{
				body: {
					message_id: lastMsg.id,
					rating: rating,
				},
				token: accessToken,
				timeout: 5000,
			},
			generateNewToken
		)
			.then((data) => {
				console.log("[GPT] Rating response: ", data);
			})
			.catch((error) => {
				console.error("[GPT] Rating error:", error);
				setLastRating(null);
			})
			.finally(() => {
				setBusyRating(false);
			});
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

		const voiceSentAt = Date.now();
		const _voice = voiceInput;
		setVoiceInput(null); // Reset voice input after processing

		setBusy(true);

		// TODO: REMOVE THIS - Only for testing
		// MARK: DUMMY 🗣️
		// if (process.env.NEXT_PUBLIC_ENV === "development") {
		// 	setChatInput("");
		// 	setTimeout(() => {
		// 		setChatLines([
		// 			...chatLines,
		// 			{ from: "user", msg: "Your voice message goes here" },
		// 			{
		// 				from: "system",
		// 				msg: MOCK_CHAT_RESPONSE,
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
				timeout: 60000,
			},
			generateNewToken
		)
			.then((data) => {
				// Success response from the voice assistant API
				console.log("[GPT] Voice Response: ", data);
				if (data?.reply && typeof data.reply === "string") {
					setChatLines((prevLines) => [
						...prevLines,
						{ from: "user", msg: data.input, at: voiceSentAt },
						{
							from: "system",
							msg: data.reply,
							at: Date.now(),
							id: data.id,
						},
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
		// MARK: DUMMY 💬
		// if (process.env.NEXT_PUBLIC_ENV === "development") {
		// 	setChatInput("");
		// 	setTimeout(() => {
		// 		setChatLines([
		// 			...chatLines,
		// 			{
		// 				from: "system",
		// 				msg: MOCK_CHAT_RESPONSE,
		// 				at: Date.now(),
		// 				id: Date.now(),
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
				timeout: 60000,
			},
			generateNewToken
		)
			.then((data) => {
				console.log("[GPT] Response: ", data);
				if (data?.reply && typeof data.reply === "string") {
					setChatLines((prevLines) => [
						...prevLines,
						{
							from: "system",
							msg: data.reply,
							at: Date.now(),
							id: data.id,
						},
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
		samplePrompts,
		lastRating,

		// Actions
		sendChatInput,
		sendCurrentInput,
		clearChat,
		setInputValue,
		setVoiceInput,
		rateChat,

		// Computed state
		isEmpty: chatLines.length === 0,
		chatState: hasReachedLimit ? "limit-reached" : busy ? "busy" : "ready",
	};
};

export default useAiChat;
