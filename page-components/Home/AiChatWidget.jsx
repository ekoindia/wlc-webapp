import { Box, Flex, Text } from "@chakra-ui/react";
import { Icon, Input, Markdown } from "components";
import { useAiChat, useVoiceCapture } from "hooks";
import { useEffect, useRef, useState } from "react";
import { MdOutlineMic, MdOutlineStopCircle } from "react-icons/md";
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
 * @returns {JSX.Element} - The rendered widget component
 */
const AiChatWidget = ({
	label = "Ask AI",
	initialMessage,
	isPopupMode = false,
	onClose,
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

		sendChatInput,
		setVoiceInput,
		clearChat,
		setInputValue,

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
				display: isEmpty ? "none" : "block",
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

				<Flex direction="row" align="center" gap="2px">
					<MicInput
						silenceTimeoutMs={3000}
						// onClick={status === "recording" ? stop : start}
						onCapture={(blob) => setVoiceInput(blob)}
						// isRecording={status === "recording"}
						// speech={voiceType === "speech"}
						onStatusChange={setStatus}
						isDisabled={isDisabled}
						m="2px"
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
					<Markdown>{msg}</Markdown>
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

/**
 * Input field for AI Chatbot
 * MARK: Input
 * @param {object} props - The component props
 * @param {string} props.value - The current value of the input field
 * @param {string} [props.state] - The state of the input field (e.g., "ready", "busy", "limit-reached")
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
			maxLength={100} //will work when type is text
			m="2px"
			w="calc(100% - 4px)"
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
 * Mic input icon button with sound wave animation whan it detects sound
 * MARK: Mic
 * @param {object} props - The component props
 * @param {number} [props.maxDurationMs] - Maximum recording duration in milliseconds (default: 30000 ms)
 * @param {number} [props.maxSizeBytes] - Maximum recording size in bytes (default: 25 * 1024 * 1024 bytes or 25 MB)
 * @param {number} [props.silenceTimeoutMs] - Timeout for silence detection in milliseconds (default: no timeout)
 * @param {boolean} [props.isDisabled] - Flag to indicate if the mic input is disabled
 * @param {Function} props.onCapture - Callback function to handle captured audio blob and URL.
 * @param {Function} [props.onStatusChange] - Callback function to handle status changes (e.g., "idle", "recording", "stopped").
 * @returns {JSX.Element} The rendered mic input component
 */
const MicInput = ({
	// onClick,
	// isRecording,
	// speech,
	maxDurationMs,
	maxSizeBytes,
	silenceTimeoutMs,
	isDisabled,
	onCapture,
	onStatusChange,
	...rest
}) => {
	const { start, stop, status, voiceType } = useVoiceCapture({
		maxDurationMs,
		maxSizeBytes,
		silenceTimeoutMs,
		onStop: (blob, url) => {
			console.log("Voice capture stopped. Blob:", blob);
			onCapture(blob, url);
		},
	});

	/**
	 * Update the status when the recording starts or stops
	 */
	useEffect(() => {
		onStatusChange && onStatusChange(status);
	}, [status, onStatusChange]);

	const isRecording = status === "recording";
	const speech = voiceType === "speech";

	return (
		<Flex
			direction="row"
			align="center"
			pointerEvents={isDisabled ? "none" : "auto"}
			opacity={isDisabled ? 0.5 : 1}
			{...rest}
		>
			<Flex
				width="var(--input-height, 3rem)"
				height="var(--input-height, 3rem)"
				m="2px"
				ml="6px"
				onClick={
					isDisabled
						? undefined
						: status === "recording"
							? stop
							: start
				}
				cursor="pointer"
				align="center"
				justify="center"
				borderRadius="full" // "10px"
				bg={isRecording ? (speech ? "#FF8A7D" : "#FFB8B1") : "white"}
				boxShadow="md"
				transition="background 0.3s ease"
			>
				{isRecording ? (
					<MdOutlineStopCircle size="20px" />
				) : (
					<MdOutlineMic size="20px" />
				)}
			</Flex>

			<Flex
				boxSizing="border-box"
				// transform={isRecording && speech ? "scaleX(1)" : "scaleX(0)"}
				// transformOrigin={"left"}
				width={isRecording ? "32px" : "0px"}
				pl="6px"
				overflow="hidden"
				transition="width 0.2s ease"
			>
				{/* Define wave animation keyframes */}
				<style>
					{`
						@keyframes wave {
							0%, 100% { transform: scaleY(0.4); }
							50% { transform: scaleY(1); }
						}
					`}
				</style>
				<Flex
					direction="row"
					align="center"
					// justify="space-between"
					gap="2px"
					w="32px"
					h={isRecording && speech ? "25px" : "14px"}
					bg="transparent"
					transition="height 0.2s ease-out"
					transitionDuration={speech ? "0.2s" : "1.5s"}
				>
					{[...Array(6)].map((_, index) => (
						<Box
							key={index}
							w="4px"
							h="100%"
							bg={speech ? "gray.600" : "gray.400"}
							transition="background 0.3s ease-out"
							borderRadius="full"
							animation={
								isRecording
									? `wave ${1 + index * 0.1}s infinite`
									: "none"
							}
							animationDelay={`${index * 0.1}s`}
						/>
					))}
				</Flex>
			</Flex>

			{/* <Box ml={2}>{speech ? "Speaking..." : "Waiting..."}</Box> */}
		</Flex>
	);
};

export default AiChatWidget;
