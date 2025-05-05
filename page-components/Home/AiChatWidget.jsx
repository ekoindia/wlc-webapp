import { Box, Flex, Text } from "@chakra-ui/react";
import { Icon, Input } from "components";
import { /* useMenuContext, */ useSession, useUser } from "contexts";
import { fetcher } from "helpers/apiHelper";
// import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { RiChatAiLine } from "react-icons/ri";
import { VscRobot } from "react-icons/vsc";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { WidgetBase } from ".";

// const THINKING_DIALOGUES = [
// 	"🤔 Ummm...",
// 	"🤖 Processing...",
// 	"🧐 Thinking...",
// 	"🔮 Just a moment...",
// 	"🧐 I'm on it...",
// 	"🧐 Lost in thought...",
// ];

// const TEST_ERROR = true; // TODO:: remove this

// const getRandomThinkingDialogue = () => {
// 	const randomIndex = Math.floor(Math.random() * THINKING_DIALOGUES.length);
// 	return THINKING_DIALOGUES[randomIndex];
// };

/**
 * A widget component for AI chatbot
 * @param {object} props - The component props
 * @param {string} [props.label] - The label for the widget
 * @param {string} [props.initialMessage] - The initial user message to start the conversation with AI
 * @param {boolean} [props.isPopupMode] - Flag to indicate if the widget is in popup mode (default: false)
 * @param {Function} [props.onClose] - Callback function to handle widget close event (in Popup mode)
 * @returns {JSX.Element} - The rendered widget component
 */
const AiChatWidget = ({
	label = "Ask AI",
	initialMessage,
	isPopupMode = false,
	onClose,
}) => {
	console.log("[GPT] Initial message: ", initialMessage);

	// const router = useRouter();
	const { accessToken } = useSession();
	const { isLoggedIn /*, isAdminAgentMode, isAdmin */ } = useUser();
	// const { interactions } = useMenuContext();
	// const { trxn_type_prod_map } = interactions || {};

	const scrollRef = useRef(null);

	const [busy, setBusy] = useState(false);
	const [chatLines, setChatLines] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [chatInput, setChatInput] = useState("");
	const [initialMessageProcessed, setInitialMessageProcessed] =
		useState(false);

	const MAX_CHAT_LINES = 10;

	const isDisabled = busy || chatLines?.length >= MAX_CHAT_LINES;

	// Start chat with user's initial message, if provided
	useEffect(() => {
		if (initialMessage && !chatLines.length && !initialMessageProcessed) {
			setInitialMessageProcessed(true);
			sendChatInput(initialMessage);
		}
	}, [initialMessage, chatLines, initialMessageProcessed]);

	const scrollToLastChat = () => {
		scrollRef.current?.lastElementChild?.scrollIntoView({
			behavior: "smooth",
		});
	};

	// Function to send the chat input to GPT
	const sendChatInput = (value) => {
		if (!value) return;
		if (chatLines?.length >= MAX_CHAT_LINES) return;
		if (typeof value !== "string") {
			console.error("[GPT] Invalid chat input: ", value);
			return;
		}

		setChatInput(value);
		setChatLines([
			...chatLines,
			{ from: "user", msg: value, at: Date.now() },
		]);
		setInputValue("");
	};

	// Clear chat history
	const clearChat = () => {
		setChatLines([]);
	};

	// Scroll to last chat line when chatLines change
	useEffect(() => {
		scrollToLastChat();
	}, [chatLines, busy]);

	// Fetch GPT response when chatInput changes
	useEffect(() => {
		if (!chatInput) return;
		if (busy) return;

		setBusy(true);

		// if (TEST_ERROR) {
		// 	setChatInput("");
		// 	setTimeout(() => {
		// 		setChatLines([
		// 			...chatLines,
		// 			{
		// 				from: "system",
		// 				msg: "Sorry, I didn't get that",
		// 				at: Date.now(),
		// 			},
		// 		]);
		// 		setBusy(false);
		// 	}, 2000);
		// 	return;
		// }

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + "/gpt/tfassistant", {
			body: {
				history: chatLines,
				message: chatInput,
				source: "WLC",
			},
			token: accessToken,
		})
			.then((data) => {
				console.log("[GPT] Response: ", data);
				if (data && data.reply && typeof data.reply === "string") {
					setChatLines([
						...chatLines,
						{ from: "system", msg: data.reply, at: Date.now() },
					]);
				} else {
					setChatLines([
						...chatLines,
						{
							from: "system",
							msg: "Unexpected response",
							at: Date.now(),
						},
					]);
				}
			})
			.catch((error) => {
				// Handle any errors that occurred during the fetch
				console.error("[GPT] Error:", error);
				setChatLines([
					...chatLines,
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
	}, [chatInput, accessToken, chatLines, busy]);

	if (!isLoggedIn) return null;

	// MARK: jsx
	return (
		<WidgetBase
			title={label} //"Ask Saathi" // ElokaGPT
			titleIcon={<RiChatAiLine size="1.8em" />}
			noPadding
			pb="0"
			bg="#efeee9"
			w={isPopupMode ? "100%" : "auto"}
			autoHeight={isPopupMode}
			maxH="99vh"
			linkLabel={isPopupMode ? "Close" : "Clear"}
			linkOnClick={isPopupMode ? onClose : clearChat}
			linkProps={{
				display: chatLines.length ? "block" : "none",
				color: "white",
			}}
			titleProps={{
				fontSize: "lg",
				fontWeight: "bold",
			}}
			headerProps={{
				bg: "linear-gradient(to right, #8e2de2, #4a00e0)",
				color: "white",
			}}
		>
			<Flex direction="column" h="calc(100% - 70px)">
				<Box
					ref={scrollRef}
					className="customScrollbars"
					flex={1}
					p="16px"
					overflowY="auto"
				>
					{
						// Show AI greeting message if user's initial message is not provided
						initialMessage ? null : (
							<ChatBubble
								key={0}
								from="system"
								msg="Hi there! 👋🏼"
								isLast={
									chatLines?.length || busy ? false : true
								}
								mt={chatLines?.length || busy ? "0" : "40px"}
							/>
						)
					}

					{chatLines.map((line, i) => (
						<ChatBubble
							key={i + 1}
							from={line.from}
							msg={line.msg}
							at={line.at}
							isLast={i === chatLines.length - 1 && !busy}
						/>
					))}

					{
						// IF 'busy', show a "Thinking" chat bubble from the Bot
						busy ? <BusyAiBubble /> : null
					}
				</Box>

				{/* Chat Text Input Field */}
				{/* TODO: Migrate to ChatInput component */}
				<Input
					placeholder="Ask your question and press Enter"
					inputLeftElement={
						<Icon
							name="chat-outline"
							size="18px"
							color="light"
							opacity={isDisabled ? 0.5 : 1}
						/>
					}
					inputRightElement={
						<Icon
							name="send"
							size="18px"
							color="light"
							cursor="pointer"
							pointerEvents={isDisabled ? "none" : "auto"}
							onClick={(value) => {
								sendChatInput(value);
							}}
							opacity={isDisabled ? 0.5 : 1}
						/>
					}
					maxLength={100} //will work when type is text
					m="2px"
					w="calc(100% - 4px)"
					value={inputValue}
					disabled={isDisabled}
					autoComplete="off"
					// invalid={invalid}
					// errorMsg={errorMsg}
					onChange={(e) => setInputValue(e.target.value)}
					onEnter={(value) => {
						sendChatInput(value);
					}}
					_placeholder={{ fontSize: "xs" }}
				/>
			</Flex>
		</WidgetBase>
	);
};

/**
 * Component to show a chat bubble with a message.
 * MARK: Bubble
 * @param {object} props - The component props
 * @param {string} props.from - The sender of the message (user or system)
 * @param {string} props.msg - The message content
 * @param {number} props.at - The timestamp of the message in milliseconds
 * @param {boolean} props.isLast - Flag to indicate if this is the last message
 * @param {object} props.rest - Additional props to pass to the Text component
 * @returns {JSX.Element|null} - The rendered chat bubble component or null if no message is provided
 */
const ChatBubble = ({ from, msg, at, isLast, ...rest }) => {
	if (!msg) return null;

	if (typeof msg !== "string") {
		console.trace("[GPT] Message is not a string: ", msg);
		return;
		// msg = JSON.stringify(msg);
	}

	const bubbleRadius = "18px";
	const userBubbleRadius = `${bubbleRadius} ${bubbleRadius} 0 ${bubbleRadius}`;
	const systemBubbleRadius = `0 ${bubbleRadius} ${bubbleRadius} ${bubbleRadius}`;

	return (
		<Flex
			direction="column"
			alignItems={from === "user" ? "flex-end" : "flex-start"}
			mb="1em"
			{...rest}
		>
			<Flex
				direction="column"
				alignItems={from === "user" ? "flex-end" : "flex-start"}
				maxW="85%"
				position="relative"
			>
				{from === "system" && isLast ? (
					<AiAvatar
						size="32px"
						position="absolute"
						left="-6px"
						top="-34px"
					/>
				) : null}
				<Text
					as="div"
					className="customScrollbars"
					bg={from === "user" ? "light" : "#FFF"}
					color={from === "user" ? "white" : "light"}
					borderRadius={
						from === "user" ? userBubbleRadius : systemBubbleRadius
					}
					border="2px solid transparent"
					borderColor={from === "system" ? "#d7d0c1" : undefined}
					p="0.6em 1em"
					fontSize="sm"
					position="relative"
				>
					<Markdown
						className="markdown-body"
						remarkPlugins={[remarkGfm]}
						sx={{
							"& table": {
								fontSize: "0.8em",
								borderCollapse: "collapse",
								borderSpacing: 0,
								display: "block",
								width: "max-content",
								maxWidth: "100%",
								overflow: "auto",
								margin: "0.5em 0",
							},
							"& table td, table th": {
								padding: "6px 10px",
								border: "1px solid #888",
							},
						}}
					>
						{msg}
					</Markdown>
				</Text>
				{at ? (
					<Text
						as="span"
						fontSize="xxs"
						color="light"
						ml="0.5em"
						mt="0.2em"
						opacity={0.8}
					>
						{new Date(at).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</Text>
				) : null}
			</Flex>
		</Flex>
	);
};

/**
 * Busy AI Bubble Animation Widget
 * MARK: Thinking
 */
const BusyAiBubble = () => {
	return (
		<Flex
			direction="row"
			align="center"
			justify="flex-start"
			mb="1em"
			// opacity={0.8}
			color="light"
		>
			<AiAvatar size="48px" p="10px" />
			<TypingLoader />
			{/* <Text
				// bg="hint"
				color="dark"
				// borderRadius="md"
				p="0.5em 0.8em"
				maxW="70%"
			>
				{getRandomThinkingDialogue()}
			</Text> */}
		</Flex>
	);
};

/**
 * Typing Loader Animation
 * MARK: Loader
 * @returns
 */
const TypingLoader = () => {
	const loaderStyle = {
		width: "8px",
		height: "8px",
		borderRadius: "50%",
		animation: "typing 1.2s linear infinite alternate",
	};

	const keyframes = `@keyframes typing {
		0% {
			background-color: rgba(100, 100, 100, 1);
			box-shadow: 14px 0px 0px 0px rgba(100, 100, 100, 0.2),
						28px 0px 0px 0px rgba(100, 100, 100, 0.2);
		}
		25% {
			background-color: rgba(100, 100, 100, 0.4);
			box-shadow: 14px 0px 0px 0px rgba(100, 100, 100, 1),
						28px 0px 0px 0px rgba(100, 100, 100, 0.2);
		}
		75% {
			background-color: rgba(100, 100, 100, 0.4);
			box-shadow: 14px 0px 0px 0px rgba(100, 100, 100, 0.2),
						28px 0px 0px 0px rgba(100, 100, 100, 1);
		}
	}`;

	return (
		<Box w="150px" p="5px 10px">
			<style>{keyframes}</style>
			<div style={loaderStyle}></div>
		</Box>
	);
};

/**
 * Avatar icon for AI Chatbot
 * MARK: Avatar
 * @param {object} props - The component props
 * @param {string} props.size - The size of the avatar (default: "32px")
 * @param {object} props.rest - Additional props to pass to the Box component
 * @returns {JSX.Element} The rendered avatar component
 */
const AiAvatar = ({ size = "32px", ...rest }) => {
	return (
		<Flex
			w={size}
			h={size}
			p="6px"
			borderRadius="full"
			bg="linear-gradient(to right, #8e2de2, #4a00e0)"
			color="white"
			align="center"
			justify="center"
			{...rest}
		>
			<VscRobot size="100%" />
		</Flex>
	);
};

export default AiChatWidget;
