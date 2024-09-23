import { Box, Flex, Text } from "@chakra-ui/react";
import { Icon, Input } from "components";
import { /* useMenuContext, */ useSession, useUser } from "contexts";
import { fetcher } from "helpers/apiHelper";
// import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { WidgetBase } from ".";

const THINKING_DIALOGUES = [
	"🤔 Ummm...",
	"🤖 Processing...",
	"🧐 Thinking...",
	"🔮 Just a moment...",
	"🧐 I'm on it...",
	"🧐 Lost in thought...",
];

const getRandomThinkingDialogue = () => {
	const randomIndex = Math.floor(Math.random() * THINKING_DIALOGUES.length);
	return THINKING_DIALOGUES[randomIndex];
};

/**
 * A widget component for GPT conversations
 * TODO: Move chat interface to K-Bar + modal dialog
 */
const GptChatBetaWidget = () => {
	// const router = useRouter();
	const { accessToken } = useSession();
	const { isLoggedIn /*, isAdminAgentMode, isAdmin */ } = useUser();
	// const { interactions } = useMenuContext();
	// const { trxn_type_prod_map } = interactions;

	const scrollRef = useRef(null);

	const [busy, setBusy] = useState(false);
	const [chatLines, setChatLines] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [chatInput, setChatInput] = useState("");

	const scrollToLastChat = () => {
		scrollRef.current?.lastElementChild?.scrollIntoView({
			behavior: "smooth",
		});
	};

	// Function to send the chat input to GPT
	const sendChatInput = (value) => {
		if (!value) return;
		if (chatLines?.length >= 20) return;

		setChatInput(value);
		setChatLines([...chatLines, { from: "user", msg: value }]);
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

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + "/gpt/tfassistant", {
			body: {
				history: chatLines,
				message: chatInput,
				source: "WLC",
			},
			token: accessToken,
		})
			.then((data) => {
				console.log("[GPT] Response::::::::::::: ", data);
				if (data.reply) {
					setChatLines([
						...chatLines,
						{ from: "system", msg: data.reply },
					]);
				}
			})
			.catch((error) => {
				// Handle any errors that occurred during the fetch
				console.error("[GPT] Error:", error);
				setChatLines([
					...chatLines,
					{ from: "system", msg: "Sorry, I didn't get that" },
				]);
			})
			.finally(() => {
				setChatInput("");
				setBusy(false);
			});
	}, [chatInput, accessToken, chatLines, busy]);

	if (!isLoggedIn) return null;

	return (
		<WidgetBase
			title="Ask ElokaGPT"
			noPadding
			pb="0"
			linkLabel="Clear"
			linkOnClick={clearChat}
			linkProps={{ display: chatLines.length ? "block" : "none" }}
		>
			<Flex direction="column" h="calc(100% - 56px)">
				<Box
					ref={scrollRef}
					className="customScrollbars"
					flex={1}
					p="1em"
					overflowY="auto"
				>
					<ChatBubble
						key={0}
						from="system"
						msg="Hi there! 👋🏼"
					></ChatBubble>

					{chatLines.map((line, i) => (
						<ChatBubble
							key={i + 1}
							from={line.from}
							msg={line.msg}
						></ChatBubble>
					))}

					{/* IF 'busy', show a chat bubble from the Bot saying 'thinking...' */}
					{busy && (
						<Flex direction="column" alignItems="flex-end" mb="1em">
							<Text
								bg="hint"
								color="dark"
								borderRadius="md"
								p="0.5em 0.8em"
								maxW="70%"
							>
								{getRandomThinkingDialogue()}
							</Text>
						</Flex>
					)}
				</Box>

				{/* Chat Text Input Field */}
				<Input
					placeholder="Ask your question and press Enter"
					inputLeftElement={
						<Icon name="chat-outline" size="18px" color="light" />
					}
					inputRightElement={
						<Icon
							name="send"
							size="18px"
							color="light"
							cursor="pointer"
							onClick={(value) => {
								sendChatInput(value);
							}}
						/>
					}
					maxLength={100} //will work when type is text
					m="2px"
					w="calc(100% - 4px)"
					value={inputValue}
					disabled={busy || chatLines?.length >= 20}
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

// Component to chow a chat bubble with a message
const ChatBubble = ({ from, msg }) => {
	if (!msg) return null;

	return (
		<Flex
			direction="column"
			alignItems={from === "system" ? "flex-end" : "flex-start"}
			mb="1em"
		>
			<Text
				className="customScrollbars"
				bg={from === "system" ? "light" : "accent.light"}
				color={from === "system" ? "white" : "light"}
				borderRadius={
					from === "system" ? "8px 0 8px 8px" : "8px 8px 8px 0"
				}
				p="0.5em 0.8em"
				maxW="85%"
				fontSize="sm"
				position="relative"
				_before={{
					content: from === "system" ? '"🤖"' : '""',
					fontSize: "xl",
					position: "absolute",
					top: "-8px",
					left: from === "system" ? "-28px" : "auto",
				}}
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
		</Flex>
	);
};

export default GptChatBetaWidget;
