import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Custom hook for voice recording functionality
 * @param {object} options - Options for the voice capture
 * @param {Function} options.onStop - Callback function to be called when recording stops. It receives the recorded audio URL as an argument.
 * @param {number} [options.maxDurationMs] - Maximum duration for recording in milliseconds (defaul: 30000 ms)
 * @param {number} [options.maxSizeBytes] - Maximum size for recording in bytes (default: 25 * 1024 * 1024 bytes or 25 MB)
 * @param {number} [options.silenceTimeoutMs] - Timeout for silence detection in milliseconds (default: 0 or no timeout). It stops recording if no speech is detected for this duration.
 * @param {string} [options.pushToTalkKey] - Key to trigger push-to-talk functionality (for example, " " for spacebar). If provided, recording starts on key down and stops on key up.
//  * @param {number} [options.vadAggressiveness] - Voice Activity Detection (VAD) aggressiveness (0–3, default: 2)
 * @returns {object} Object containing recording state and control functions
 * @returns {string} .status - Current recording state ("recording", "idle", or "unsupported")
 * @returns {Function} .start - Function to start audio recording
 * @returns {Function} .stop - Function to stop audio recording
 */
const useVoiceCapture = (options) => {
	const {
		onStop,
		maxDurationMs = 30000, // Default max duration is 30 seconds
		maxSizeBytes = 25 * 1024 * 1024, // Default maximum size is 25 MB
		silenceTimeoutMs = 0, // Default silence timeout is 0 ms (no timeout)
		pushToTalkKey, // Key to trigger push-to-talk (for example, " " for spacebar)
		// vadAggressiveness = 2, // WebRTC‑VAD aggressiveness (0–3). Default is 2.
	} = options;

	// ---------------------------------------------------------------------------
	// internal refs & state
	// ---------------------------------------------------------------------------
	const [status, setStatus] = useState("idle"); // "recording" | "idle" | "unsupported"
	const [mediaBlobUrl, setMediaBlobUrl] = useState(null); // recorded audio URL
	const [volume, setVolume] = useState(0); // for UI meters (0–1)
	const [voiceType, setVoiceType] = useState("");
	const [error, setError] = useState(null); // error state
	// Refs to persist values between renders without causing re-renders
	const mediaRecorder = useRef(null); // MediaRecorder instance
	const audioChunks = useRef([]); // Store audio chunks
	const vadNodeRef = useRef(null); // AudioWorkletNode for VAD
	const audioCtxRef = useRef(null); // AudioContext instance
	const totalSizeRef = useRef(0); // For tracking total size of recorded audio
	const lastSpeechRef = useRef(0); // Last speech activity start timestamp
	const lastSilenceRef = useRef(0); // Last silence start timestamp (after a speech activity)
	const hasSpeechStartedRef = useRef(false); // Flag to track if speech has started
	const totalSpeechTimeRef = useRef(0); // Total speech time in milliseconds

	// Timer references
	const timeoutRef = useRef(null); // For auto-stop on timeout
	const speechTimeoutRef = useRef(null); // For speech detection timeout

	// ---------------------------------------------------------------------------
	// Safe browser check - needed for MediaRecorder API
	// ---------------------------------------------------------------------------
	const isBrowser = typeof window !== "undefined";

	/**
	 * Starts audio recording using browser's MediaRecorder API
	 * @async
	 * @returns {Promise<void>}
	 */
	const start = useCallback(async () => {
		try {
			// Request microphone access
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			mediaRecorder.current = new MediaRecorder(stream);

			// Event handler for when audio data is available
			mediaRecorder.current.ondataavailable = (event) => {
				if (hasSpeechStartedRef.current !== true) {
					// Speech has not been detected yet. Skip silence chunks.
					return;
				}
				audioChunks.current.push(event.data);
				totalSizeRef.current += event.data.size;
				if (totalSizeRef.current > maxSizeBytes) {
					stop();
					console.warn(
						"Recording stopped: maximum size exceeded: ",
						totalSizeRef.current
					);

					setError(
						new Error(
							`Recording stopped: maximum size of ${maxSizeBytes} bytes exceeded`
						)
					);
					return;
				}
			};

			// Event handler for when recording stops
			mediaRecorder.current.onstop = () => {
				const audioBlob = new Blob(audioChunks.current, {
					type: "audio/webm",
				});
				const audioUrl = URL.createObjectURL(audioBlob);
				setMediaBlobUrl(audioUrl);
				if (onStop) {
					onStop(audioBlob, audioUrl);
				}
				teardown();
				audioChunks.current = [];
			};

			// Setup Voice Activity Detection (VAD)
			await setupVAD(stream);

			// Start recording
			mediaRecorder.current.start();
			setStatus("recording");

			// Hard stop after maxDurationMs
			timeoutRef.current = setTimeout(() => stop(), maxDurationMs);
		} catch (error) {
			console.error("Error starting recording:", error);
			teardown();
			setError(
				error instanceof Error
					? error
					: new Error("Unknown error starting recording")
			);
		}
	}, []);

	/**
	 * Stops the current audio recording if active
	 * @returns {void}
	 */
	const stop = useCallback(() => {
		console.trace("useVoiceCapture.stop() called");
		if (
			mediaRecorder.current &&
			mediaRecorder.current.state === "recording"
		) {
			mediaRecorder.current.stop();
			setStatus("idle");
		}
	}, []);

	// ---------------------------------------------------------------------------
	//  push‑to‑talk keyboard handler (space by default)
	// ---------------------------------------------------------------------------
	useEffect(() => {
		if (!isBrowser) return;

		const down = (e) => {
			if (e.key === pushToTalkKey && status !== "recording") start();
		};
		const up = (e) => {
			if (e.key === pushToTalkKey && status === "recording") stop();
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
		};
	}, [pushToTalkKey, status, start, stop, isBrowser]);

	// ---------------------------------------------------------------------------
	//  Private Helpers
	// ---------------------------------------------------------------------------

	/**
	 * Sets up Voice Activity Detection (VAD) using Web Audio API.
	 * This function creates an AudioContext, connects a MediaStreamSource to an AudioWorkletNode,
	 * and listens for messages from the worklet to determine speech activity.
	 * - It updates the volume state and tracks the last speech activity time.
	 * - It automatically stops recording if no speech is detected for a specified duration.
	 * This is useful for applications that need to detect when the user is speaking
	 * and adjust the recording behavior accordingly.
	 * MARK: Setup VAD
	 * @see https://github.com/echogarden-project/fvad-wasm
	 * @see https://github.com/thurti/vad-audio-worklet
	 * @param {MediaStream} stream - The MediaStream containing audio input from the user. This stream is typically obtained from the user's microphone.
	 */
	const setupVAD = async (stream) => {
		if (!isBrowser) return;

		const audioContext = new AudioContext({ sampleRate: 16_000 });
		audioCtxRef.current = audioContext;
		const src = audioContext.createMediaStreamSource(stream);

		// The worklet is responsible for feeding 16 kHz PCM frames into the WASM
		// WebRTC‑VAD module and posting { type, volume } messages back.
		await audioContext.audioWorklet.addModule(
			"/wasm/vad-audio/vad-audio-worklet.js"
		);

		const node = new AudioWorkletNode(audioContext, "vad", {
			processorOptions: {
				sampleRate: audioContext.sampleRate, // sample rate of the audio input
				fftSize: 128, // optional change fft size, default: 128
				// aggressiveness: vadAggressiveness,
			},
		});
		vadNodeRef.current = node;

		// import("public/wasm/vad-audio/fvad.wasm.js").then(
		// 	({ default: createFvad }) => {
		// 		createFvad({
		// 			locateFile: () => "public/wasm/vad-audio/fvad.wasm",
		// 		}).then((mod) => {
		// 			// Send the ready-to-use exports across
		// 			node.port.postMessage({
		// 				id: "fvad-module",
		// 				exports: mod.exports,
		// 			});
		// 		});
		// 	}
		// );

		console.log("Start lastSpeechRef.current: ", lastSpeechRef.current);

		node.port.onmessage = (evt) => {
			// const { type, volume: vol } = evt.data;
			const { cmd: type } = evt.data;
			console.log("VAD message received:", evt.data);

			// setVolume(vol);
			setVoiceType(type);

			if (type === "speech") {
				// Speech detected...
				lastSpeechRef.current = Date.now();
				hasSpeechStartedRef.current = true;
				if (speechTimeoutRef.current) {
					clearTimeout(speechTimeoutRef.current);
					speechTimeoutRef.current = null;
				}
			} else if (type === "silence" && lastSpeechRef.current) {
				// Silence detected...
				lastSilenceRef.current = Date.now();
				const speechFor =
					lastSilenceRef.current - lastSpeechRef.current;
				totalSpeechTimeRef.current += speechFor;
				console.log("Speech for:", speechFor, "ms");

				if (silenceTimeoutMs) {
					speechTimeoutRef.current = setTimeout(() => {
						if (
							mediaRecorder.current &&
							mediaRecorder.current.state === "recording"
						) {
							console.log(
								"Stopping recording due to silence timeout"
							);
							stop();
						}
					}, silenceTimeoutMs); // Stop after 3 seconds of silence
				}

				// if (silentFor >= 4000) {
				// 	// debounce trailing phonemes
				// 	setTimeout(() => {
				// 		if (Date.now() - lastSpeechRef.current >= 4250) stop();
				// 	}, 250);
				// }
			}
		};

		src.connect(node);
	};

	/**
	 * Cleanup function to reset all references and states
	 * MARK: Teardown
	 * @returns {void}
	 */
	const teardown = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		if (speechTimeoutRef.current) {
			clearTimeout(speechTimeoutRef.current);
			speechTimeoutRef.current = null;
		}

		if (
			mediaRecorder.current &&
			mediaRecorder.current.state === "recording"
		) {
			mediaRecorder.current.stop();
		}

		if (audioCtxRef.current) {
			audioCtxRef.current.close();
			audioCtxRef.current = null;
		}
		vadNodeRef.current = null;

		totalSizeRef.current = 0;
		lastSpeechRef.current = 0;
		audioChunks.current = [];
		setVolume(0);
		setVoiceType("");
		setStatus("idle");
	};

	// Cleanup effect to stop recording when component unmounts
	// MARK: Cleanup
	useEffect(() => {
		return () => {
			if (
				mediaRecorder.current &&
				mediaRecorder.current.state === "recording"
			) {
				mediaRecorder.current.stop();
			}
		};
	}, []);

	return {
		status,
		start,
		stop,
		volume, // 0–1, update every ~10 ms; useful for level meter UI
		voiceType, // "speech" | "silence" | "unknown"
		totalSpeechTime: totalSpeechTimeRef.current,
		mediaBlobUrl,
		error,
	};
};

export default useVoiceCapture;
