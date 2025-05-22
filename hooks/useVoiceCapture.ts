import { useCallback, useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

/**
 * Options accepted by the voice‑capture hook.
 */
export interface VoiceCaptureOptions {
	/** Called when the recording ends and the final blob is ready. */
	onStop?: (_blob: Blob) => void;
	/** Chunk callback (useful for progressive upload). */
	onDataChunk?: (_chunk: Blob) => void;
	/** WebRTC‑VAD aggressiveness (0–3). Default is 2. */
	vadAggressiveness?: 0 | 1 | 2 | 3;
	/** Keyboard key that behaves as push‑to‑talk. Default is space (" "). */
	pushToTalkKey?: string;
	/** Maximum allowed duration in **milliseconds** (default 25 000 ms). */
	maxDurationMs?: number;
	/** Maximum file size in bytes (default 25 MiB). */
	maxSizeBytes?: number;
}

/**
 * React hook that records WebM/Opus audio, auto‑stops on silence/timeout/size,
 * and exposes a simple API for UI components.
 * @param options
 */
const useVoiceCapture = (options: VoiceCaptureOptions = {}) => {
	const {
		onStop,
		onDataChunk,
		vadAggressiveness = 2,
		pushToTalkKey = " ",
		maxDurationMs = 25_000,
		maxSizeBytes = 25 * 1024 * 1024, // 25 MiB
	} = options;

	// ---------------------------------------------------------------------------
	// internal refs & state
	// ---------------------------------------------------------------------------
	const [status, setStatus] = useState<"idle" | "recording">("idle");
	const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
	const [volume, setVolume] = useState(0); // for UI meters (0–1)
	const totalSizeRef = useRef(0);
	const lastSpeechRef = useRef<number>(Date.now());
	const vadNodeRef = useRef<AudioWorkletNode>();
	const audioCtxRef = useRef<AudioContext>();
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

	// ---------------------------------------------------------------------------
	//  react‑media‑recorder (handles MediaRecorder boiler‑plate for webm/opus)
	// ---------------------------------------------------------------------------
	const { startRecording, stopRecording, error } = useReactMediaRecorder({
		audio: true,
		video: false,
		blobPropertyBag: { type: "audio/webm" },
		mediaRecorderOptions: { mimeType: "audio/webm;codecs=opus" },

		onStop: (_blobUrl: string, blob: Blob) => {
			setMediaBlobUrl(_blobUrl);
			onStop?.(blob);
			teardown();
		},

		onDataAvailable: (chunk: Blob) => {
			totalSizeRef.current += chunk.size;
			onDataChunk?.(chunk);
			if (totalSizeRef.current >= maxSizeBytes) {
				stop();
			}
		},
	} as any);

	// ---------------------------------------------------------------------------
	//  private helpers
	// ---------------------------------------------------------------------------
	const setupVAD = async (stream: MediaStream) => {
		const audioContext = new AudioContext({ sampleRate: 16_000 });
		audioCtxRef.current = audioContext;
		const src = audioContext.createMediaStreamSource(stream);

		// The worklet is responsible for feeding 16 kHz PCM frames into the WASM
		// WebRTC‑VAD module and posting { type, volume } messages back.
		await audioContext.audioWorklet.addModule("/lib/vad-worklet.js");

		const node = new AudioWorkletNode(audioContext, "vad-worklet", {
			processorOptions: { aggressiveness: vadAggressiveness },
		});
		vadNodeRef.current = node;

		node.port.onmessage = (evt) => {
			const { type, volume: vol } = evt.data as {
				type: "speech" | "silence";
				volume: number;
			};
			setVolume(vol);

			if (type === "speech") {
				lastSpeechRef.current = Date.now();
			} else {
				const silentFor = Date.now() - lastSpeechRef.current;
				if (silentFor >= 4000) {
					// debounce trailing phonemes
					setTimeout(() => {
						if (Date.now() - lastSpeechRef.current >= 4250) stop();
					}, 250);
				}
			}
		};

		src.connect(node);
	};

	const teardown = () => {
		clearTimeout(timeoutRef.current);
		timeoutRef.current = undefined;
		totalSizeRef.current = 0;
		audioCtxRef.current?.close();
		audioCtxRef.current = undefined;
		vadNodeRef.current = undefined;
		setStatus("idle");
	};

	// ---------------------------------------------------------------------------
	//  public API: start & stop
	// ---------------------------------------------------------------------------
	const start = useCallback(async () => {
		if (status === "recording") return;

		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
		});
		await setupVAD(stream);

		lastSpeechRef.current = Date.now();
		await startRecording();
		setStatus("recording");

		// hard stop after maxDurationMs
		timeoutRef.current = setTimeout(() => stop(), maxDurationMs);
	}, [status, startRecording]);

	const stop = useCallback(() => {
		if (status !== "recording") return;
		stopRecording(); // will trigger onStop -> teardown
	}, [status, stopRecording]);

	// ---------------------------------------------------------------------------
	//  push‑to‑talk keyboard handler (space by default)
	// ---------------------------------------------------------------------------
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === pushToTalkKey && status !== "recording") start();
		};
		const up = (e: KeyboardEvent) => {
			if (e.key === pushToTalkKey && status === "recording") stop();
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
		};
	}, [pushToTalkKey, status, start, stop]);

	// ---------------------------------------------------------------------------
	//  ARIA live‑region support (optional, consumer must add an element)
	// ---------------------------------------------------------------------------
	useEffect(() => {
		const node = document.getElementById("voice-capture-status");
		if (node && node.hasAttribute("aria-live")) {
			node.textContent = status === "recording" ? "Recording" : "Idle";
		}
	}, [status]);

	return {
		status,
		start,
		stop,
		mediaBlobUrl,
		volume, // 0–1, update every ~10 ms; useful for level meter UI
		error,
	} as const;
};

export default useVoiceCapture;
