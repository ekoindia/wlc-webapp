import { Box, Flex } from "@chakra-ui/react";
import useVoiceCapture from "hooks/useVoiceCapture";
import { useEffect, useState } from "react";
import { MdOutlineMic, MdOutlineStopCircle } from "react-icons/md";
import { useSound } from "react-sounds";

// Declare the props interface
interface MicInputProps {
	prop1?: string;
	// size: "lg" | "md" | "sm" | "xs" | string;
	[key: string]: any;
}

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
 * @param props.onCancel
 * @returns {JSX.Element} The rendered mic input component
 */
const MicInput = ({
	maxDurationMs,
	maxSizeBytes,
	silenceTimeoutMs,
	isDisabled,
	onCapture,
	onCancel,
	onStatusChange,
	...rest
}: MicInputProps) => {
	const { play: startSound } = useSound("ui/item_select", {
		volume: 0.5,
		rate: 1.5,
	}); // button_soft
	const { play: submitSound } = useSound("ui/item_deselect", { volume: 0.5 });
	const { play: cancelSound } = useSound("ui/blocked", {
		volume: 0.5,
		rate: 1.3,
	});

	const [recordingTime, setRecordingTime] = useState(0);

	const { start, stop, status, voiceType } = useVoiceCapture({
		maxDurationMs,
		maxSizeBytes,
		silenceTimeoutMs,
		onStop: (blob, url) => {
			// Voice capture finished successfully
			submitSound();
			onCapture(blob, url);
			console.log("Voice capture finished:", { blob, url });
			setRecordingTime(0);
		},
		onCancel: () => {
			// Voice capture was cancelled
			console.log("Voice capture cancelled.");
			cancelSound();
			onCancel?.();
			setRecordingTime(0);
		},
		onRecordingTimeUpdate: setRecordingTime,
	});

	/**
	 * Start the recording with an audio cue
	 */
	const _start = () => {
		if (isDisabled) return;
		startSound();
		start();
	};

	/**
	 * Update the status when the recording starts or stops
	 */
	useEffect(() => {
		onStatusChange && onStatusChange(status);
	}, [status, onStatusChange]);

	const isRecording = status === "recording";
	const speech = voiceType === "speech";

	// MARK: JSX
	return (
		<Flex
			direction="row"
			align="center"
			pointerEvents={isDisabled ? "none" : "auto"}
			opacity={isDisabled ? 0.5 : 1}
			{...rest}
		>
			<Flex
				aria-label={isRecording ? "Stop Recording" : "Start Recording"}
				width="var(--input-height, 3rem)"
				height="var(--input-height, 3rem)"
				// m="2px"
				// ml="6px"
				onClick={
					isDisabled
						? undefined
						: status === "recording"
							? stop
							: _start
				}
				cursor="pointer"
				align="center"
				justify="center"
				borderRadius="full" // "10px"
				bg={isRecording ? (speech ? "#FF8A7D" : "#FFB8B1") : "white"}
				boxShadow="md"
				transition="background 0.3s ease"
				overflow="hidden"
				tabIndex={0}
				_focus={{
					boxShadow: "0 0 0 2px #3182ce",
					outline: "none",
				}}
				_active={{
					bg: "#E2E8F0",
				}}
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
				width={isRecording ? "38px" : "0px"}
				overflow="hidden"
				transition="width 0.2s ease"
			>
				{/* Define mic-wave animation keyframes */}
				<style>
					{`
						@keyframes mic-wave {
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
					pl="8px"
					w="38px"
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
									? `mic-wave ${1 + index * 0.1}s infinite`
									: "none"
							}
							sx={{
								animationDelay: `${index * 0.1}s`,
							}}
						/>
					))}
				</Flex>
			</Flex>

			{isRecording ? (
				<Box ml={2} fontSize="sm" color="gray.500">
					{formatMilliseconds(recordingTime)}
				</Box>
			) : null}
		</Flex>
	);
};

/**
 * Helper function to format milliseconds into MM:SS format
 * @param {number} ms - The time in milliseconds to format
 * @returns {string} The formatted time string in MM:SS format
 */
const formatMilliseconds = (ms) => {
	if (typeof ms !== "number" || isNaN(ms) || ms < 0) {
		return "";
	}

	const minutes = Math.floor(ms / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);

	const paddedMinutes = minutes.toString().padStart(2, "0");
	const paddedSeconds = seconds.toString().padStart(2, "0");

	return `${paddedMinutes}:${paddedSeconds}`;
};

export default MicInput;
