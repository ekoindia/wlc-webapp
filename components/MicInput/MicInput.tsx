import { Box, Flex } from "@chakra-ui/react";
import useVoiceCapture from "hooks/useVoiceCapture";
import { useEffect } from "react";
import { MdOutlineMic, MdOutlineStopCircle } from "react-icons/md";

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
	const { start, stop, status, voiceType } = useVoiceCapture({
		maxDurationMs,
		maxSizeBytes,
		silenceTimeoutMs,
		onStop: (blob, url) => {
			console.log("Voice capture stopped.", { blob, url });
			onCapture(blob, url);
		},
		onCancel,
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

			{/* <Box ml={2}>{speech ? "Speaking..." : "Idle"}</Box> */}
		</Flex>
	);
};

export default MicInput;
