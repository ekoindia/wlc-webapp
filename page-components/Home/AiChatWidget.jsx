import { Box, Flex, Text } from "@chakra-ui/react";
import { CopyButton, Icon, Input, Markdown, MicInput } from "components";
import { useSession } from "contexts";
import { useAiChat } from "hooks";
import { useEffect, useRef, useState } from "react";
import { BsStars } from "react-icons/bs";
import {
	MdOutlineThumbDown,
	MdOutlineThumbUp,
	MdThumbDown,
	MdThumbUp,
} from "react-icons/md";
import { RiChatAiLine } from "react-icons/ri";
import { VscRobot } from "react-icons/vsc";
import { WidgetBase } from ".";

/**
 * A widget component for AI chatbot
 * @param {object} props - The component props
 * @param {string} [props.label] - The label for the widget
 * @param {string} [props.initialMessage] - The initial user message to start the conversation with AI
 * @param {boolean} [props.isPopupMode] - Flag to indicate if the widget is in popup mode (default: false)
 * @param {Function} [props.onClose] - Callback function to handle widget close event (in Popup mode)
 * @param {Function} [props.setAllowCloseOnEscape] - Function to set whether the widget can be closed with the Escape key
 * @returns {JSX.Element} - The rendered widget component
 */
const AiChatWidget = ({
	label = "Ask AI",
	initialMessage,
	isPopupMode = false,
	onClose,
	setAllowCloseOnEscape,
}) => {
	console.log("[GPT] Initial message: ", initialMessage);

	const [status, setStatus] = useState("");
	const scrollRef = useRef(null);

	const {
		chatLines,
		inputValue,
		busy,
		isDisabled,
		isLoggedIn,
		samplePrompts,
		lastRating,

		sendChatInput,
		setVoiceInput,
		clearChat,
		setInputValue,
		rateChat,

		isEmpty,
		chatState,
	} = useAiChat({
		initialMessage,
		maxChatLines: 10,
		onChatLinesChange: () => {
			// Scroll to last chat when chatLines change
			scrollToLastChat();
		},
	});

	const scrollToLastChat = () => {
		scrollRef.current?.lastElementChild?.scrollIntoView({
			behavior: "smooth",
		});
	};

	// Scroll to last chat line when busy state changes
	useEffect(() => {
		scrollToLastChat();
	}, [busy]);

	// Set allowCloseOnEscape to false when recording audio
	// so that Esc key can be used to stop recording
	useEffect(() => {
		if (setAllowCloseOnEscape) {
			setAllowCloseOnEscape(status !== "recording");
		}
	}, [status, setAllowCloseOnEscape]);

	const isLastChatFromSystem =
		chatLines?.length && chatLines[chatLines.length - 1]?.from === "system";

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
				display: isPopupMode !== true && isEmpty ? "none" : "block",
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
			<Flex
				direction="column"
				h="calc(100% - 70px)"
				maxH="calc(100vh - 84px)"
			>
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
							<>
								<ChatBubble
									key={0}
									from="system"
									msg="Hi there! 👋🏼 Ask me **anything** about your business"
									isLast={
										chatLines?.length || busy ? false : true
									}
									mt={
										chatLines?.length || busy ? "0" : "40px"
									}
								/>
								{/* Show sample prompts */}
								{samplePrompts && !chatLines?.length ? (
									<SamplePrompts
										prompts={samplePrompts}
										onPromptClick={(prompt) =>
											sendChatInput(prompt)
										}
									/>
								) : null}
							</>
						)
					}

					{/*
						MARK: Chat Lines
					*/}
					{chatLines.map((line, i) => (
						<ChatBubble
							key={i + 1}
							messageId={line.id}
							from={line.from}
							msg={line.msg}
							at={line.at}
							isLast={i === chatLines.length - 1 && !busy}
							rateChat={rateChat}
							lastRating={lastRating}
							isDisabled={isDisabled}
						/>
					))}

					{
						// IF 'busy', show a "Thinking" chat bubble from the Bot
						busy ? <BusyAiBubble /> : null
					}
				</Box>

				{isLastChatFromSystem ? (
					<Flex
						align="center"
						justify="center"
						color="light"
						opacity="0.8"
						fontSize="xxs"
						// fontStyle="italic"
					>
						AI can make mistakes, double-check important
						information.
					</Flex>
				) : null}

				<Flex direction="row" align="center" gap="4px" p="6px">
					<MicInput
						silenceTimeoutMs={3000}
						onCapture={(blob) => setVoiceInput(blob)}
						onStatusChange={setStatus}
						isDisabled={isDisabled}
						// m="2px"
					/>
					{/* Chat Text Input Field */}
					{status === "recording" ? null : (
						<ChatInput
							value={inputValue}
							isDisabled={isDisabled}
							state={chatState}
							onChange={setInputValue}
							onSubmit={sendChatInput}
							onRestart={clearChat}
							flex={1}
						/>
					)}
				</Flex>
			</Flex>
		</WidgetBase>
	);
};

/**
 * Component to show a chat bubble with a message.
 * MARK: Bubble
 * @param {object} props - The component props
 * @param {string} props.messageId - Unique identifier for the message
 * @param {string} props.from - The sender of the message (user or system)
 * @param {string} props.msg - The message content
 * @param {number} props.at - The timestamp of the message in milliseconds
 * @param {boolean} props.isLast - Flag to indicate if this is the last message
 * @param {object} props.rest - Additional props to pass to the Text component
 * @param props.rateChat
 * @param props.lastRating
 * @param props.isDisabled
 * @returns {JSX.Element|null} - The rendered chat bubble component or null if no message is provided
 */
const ChatBubble = ({
	messageId,
	from,
	msg,
	at,
	isLast,
	rateChat,
	lastRating,
	isDisabled = false,
	...rest
}) => {
	if (!msg) return null;

	if (typeof msg !== "string") {
		console.warn("[GPT] Message is not a string: ", msg);
		return;
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
					bg={from === "user" ? "#8e2de2" : "#FFF"} // "light"
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
					<Markdown>{msg}</Markdown>
				</Text>

				{/*
					Bottom toolbar: time, rating, copy
					MARK: Toolbar
				*/}
				<Flex
					direction="row"
					align="center"
					mt="0.4em"
					px="0.5em"
					gap="1em"
					color="light"
					w="100%"
				>
					{at ? (
						// Show the time of the message
						<Text as="span" fontSize="xxs" opacity={0.8}>
							{new Date(at).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
					) : null}
					<Box flex={1} />
					{from === "system" && isLast && messageId ? (
						// Show the following icon buttons: Thumbs Up, Thumbs Down, and Copy
						<>
							<RatingButton
								type="up"
								messageId={messageId}
								rateChat={rateChat}
								selected={lastRating === 2}
								disabled={isDisabled || lastRating > 0}
							/>
							<RatingButton
								type="down"
								rateChat={rateChat}
								selected={lastRating === 1}
								disabled={isDisabled || lastRating > 0}
							/>
							<CopyButton text={msg} size="16px" />
						</>
					) : null}
				</Flex>
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
	const { isAdmin } = useSession();

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
			{isAdmin ? (
				<img src="images/ai/eloka-favicon.png" />
			) : (
				<VscRobot size="100%" />
			)}
		</Flex>
	);
};

/**
 * Input field for AI Chatbot
 * MARK: Input
 * @param {object} props - The component props
 * @param {string} props.value - The current value of the input field
 * @param {string} [props.state] - The state of the input field (e.g., "ready", "busy", "limit-reached")
 * @param {number} [props.maxLength] - The maximum allowed length of the input (default: 100)
 * @param {boolean} [props.isDisabled] - Flag to indicate if the input field is disabled
 * @param {Function} props.onChange - Callback function to handle input value change
 * @param {Function} [props.onSubmit] - Callback function to handle input submission
 * @param {Function} [props.onRestart] - Callback function to handle chat reset
 * @param {object} [props.rest] - Additional props to pass to the Input component
 * @returns {JSX.Element} The rendered input field component
 */
const ChatInput = ({
	value,
	state,
	maxLength = 100,
	isDisabled,
	onChange,
	onSubmit,
	onRestart,
	...rest
}) => {
	const placeholder =
		state === "limit-reached"
			? "Chat limit reached. Please start a new chat"
			: state === "busy"
				? "Please wait..."
				: "Ask your question and press Enter";
	return (
		<Input
			placeholder={placeholder}
			inputLeftElement={
				<Icon
					name="chat-outline"
					size="18px"
					color="light"
					opacity={isDisabled ? 0.5 : 1}
				/>
			}
			inputRightElement={
				state === "limit-reached" ? (
					<Icon
						name="refresh"
						size="38px"
						bg="error"
						color="white"
						p={2}
						borderRadius="full"
						cursor="pointer"
						onClick={onRestart}
						opacity={isDisabled ? 0.5 : 1}
					/>
				) : (
					<Icon
						name="send"
						size="18px"
						color="light"
						cursor="pointer"
						pointerEvents={isDisabled ? "none" : "auto"}
						onClick={(val) => {
							onSubmit(val);
						}}
						opacity={isDisabled ? 0.5 : 1}
					/>
				)
			}
			maxLength={maxLength} //will work when type is text
			// m="2px"
			w="100%"
			borderRadius="full"
			value={value}
			disabled={isDisabled}
			autoComplete="off"
			// invalid={invalid}
			// errorMsg={errorMsg}
			onChange={(e) => onChange(e.target.value)}
			onEnter={(val) => {
				onSubmit(val);
			}}
			_placeholder={{ fontSize: "xs" }}
			{...rest}
		/>
	);
};

/**
 * Thumb up/down rating component for AI chat messages
 * MARK: Rating
 * @param root0
 * @param root0.type
 * @param root0.messageId
 * @param root0.rateChat
 * @param root0.selected
 * @param root0.disabled
 */
const RatingButton = ({
	type = "up",
	messageId,
	rateChat,
	selected,
	disabled,
	...rest
}) => {
	const Icon =
		type === "up"
			? selected
				? MdThumbUp
				: MdOutlineThumbUp
			: selected
				? MdThumbDown
				: MdOutlineThumbDown;

	return (
		<Flex
			padding={2}
			borderRadius="full"
			bg="#00000010"
			_hover={{
				bg: "#00000020",
			}}
			aria-label={`Give a Thumbs-${type === "up" ? "Up" : "Down"}`}
			cursor="pointer"
			opacity={disabled ? 0.7 : 1}
			pointerEvents={disabled ? "none" : "auto"}
			onClick={() =>
				disabled ? null : rateChat(messageId, type === "up" ? 2 : 1)
			}
			{...rest}
		>
			<Icon size="16px" />
		</Flex>
	);
};

/**
 * Display sample prompts for the AI chat widget
 * MARK: SamplePrompts
 * @param prompts.prompts
 * @param {Array} prompts - Array of sample prompts to display
 * @param {Function} onPromptClick - Callback function to handle prompt click
 * @param prompts.onPromptClick
 * @returns {JSX.Element} - The rendered sample prompts component
 */
const SamplePrompts = ({ prompts, onPromptClick }) => {
	if (!prompts || !prompts.length) return null;

	return (
		<Flex
			direction="column"
			my="2em"
			gap="8px"
			align="center"
			opacity={0.8}
		>
			<Text fontWeight="bold" fontSize="sm" color="#666">
				Try an example
			</Text>
			<Flex
				direction="row"
				align="center"
				justify="center"
				flexWrap="wrap"
				gap="8px"
			>
				{prompts?.map((prompt, i) => (
					<Flex
						key={i + 1}
						direction="row"
						align="center"
						gap="6px"
						cursor="pointer"
						border="1px dotted #ccc"
						p="8px"
						borderRadius="6px"
						fontSize="xs"
						bg="white"
						color="#666"
						_hover={{
							bg: "#fbfbfb",
							color: "primary",
						}}
						onClick={() => onPromptClick(prompt)}
					>
						<BsStars size="14px" color="#4a00e0" />
						<Text>{prompt}</Text>
					</Flex>
				))}
			</Flex>
		</Flex>
	);
};

export default AiChatWidget;
