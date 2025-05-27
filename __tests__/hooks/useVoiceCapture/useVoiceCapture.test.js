import { useVoiceCapture } from "hooks";
import { act, renderHook } from "test-utils";

// Use fake timers for testing time-dependent functionality
jest.useFakeTimers();

// ---------------------------------------------------------------------------
//  Mock browser audio APIs that aren't available in Node.js testing environment
// ---------------------------------------------------------------------------

// Mock MediaStream
class MockMediaStream {
	constructor() {
		this.tracks = [];
	}
	getTracks() {
		return this.tracks;
	}
	addTrack(track) {
		this.tracks.push(track);
	}
}
global.MediaStream = MockMediaStream;

// Mock AudioContext with audioWorklet
class MockAudioContext {
	constructor() {
		this.state = "running";
		this.sampleRate = 16000;
		this.destination = { channelCount: 2 };
		this.audioWorklet = {
			addModule: jest.fn().mockResolvedValue(undefined),
		};
	}

	createMediaStreamSource() {
		return { connect: jest.fn() };
	}

	close() {
		this.state = "closed";
		return Promise.resolve();
	}
}
global.AudioContext = MockAudioContext;

// Mock AudioWorkletNode with port for VAD simulation
// let vadOnMessageCallback = null;
// class MockAudioWorkletNode {
// 	constructor() {
// 		this.port = {
// 			onmessage: null,
// 			postMessage: jest.fn(),
// 		};
// 	}

// 	connect() {
// 		// Store the callback for simulation in tests
// 		setTimeout(() => {
// 			vadOnMessageCallback = this.port.onmessage;

// 			// Immediately simulate speech detection
// 			if (this.port.onmessage) {
// 				this.port.onmessage({ data: { type: "speech", volume: 0.8 } });
// 			}
// 		}, 0);
// 		return this;
// 	}

// 	disconnect() {
// 		return this;
// 	}
// }
// global.AudioWorkletNode = MockAudioWorkletNode;

// Mock getUserMedia
Object.defineProperty(navigator, "mediaDevices", {
	value: {
		getUserMedia: jest.fn().mockResolvedValue(new MockMediaStream()),
	},
	configurable: true,
});

// ---------------------------------------------------------------------------
//  Mock react-media-recorder hook with controllable callbacks
// ---------------------------------------------------------------------------
const startRecording = jest.fn().mockResolvedValue(undefined);
const stopRecording = jest.fn();
let dataAvailableCallback = null;
// let stopCallback = null;

// jest.mock("react-media-recorder", () => ({
// 	useReactMediaRecorder: ({ onStop, onDataAvailable }) => {
// 		// Store callbacks for test manipulation
// 		stopCallback = onStop;
// 		dataAvailableCallback = onDataAvailable;

// 		return {
// 			startRecording,
// 			stopRecording: () => {
// 				stopRecording();
// 				if (stopCallback) {
// 					const mockBlobUrl = "blob:mock";
// 					const mockBlob = new Blob([], { type: "audio/webm" });
// 					stopCallback(mockBlobUrl, mockBlob);
// 				}
// 			},
// 			status: "idle",
// 			error: null,
// 		};
// 	},
// }));

describe("useVoiceCapture hook", () => {
	beforeAll(() => {
		jest.useFakeTimers();
	});
	beforeEach(() => {
		jest.clearAllMocks();
		startRecording.mockClear();
		stopRecording.mockClear();
		// vadOnMessageCallback = null;
		dataAvailableCallback = null;
		stopCallback = null;
		jest.clearAllTimers();
	});
	afterAll(() => {
		jest.useRealTimers();
	});

	it("initializes with idle status", () => {
		const { result } = renderHook(() => useVoiceCapture());
		expect(result.current.status).toBe("idle");
		expect(typeof result.current.start).toBe("function");
		expect(typeof result.current.stop).toBe("function");
	});

	it("auto-stops recording after maxDurationMs (25s by default)", async () => {
		const { result } = renderHook(() => useVoiceCapture());

		// Start recording
		await act(async () => {
			await result.current.start();
		});

		expect(startRecording).toHaveBeenCalled();
		expect(result.current.status).toBe("recording");

		// Fast-forward time to just before timeout
		act(() => {
			jest.advanceTimersByTime(24999);
		});
		expect(stopRecording).not.toHaveBeenCalled();

		// Fast-forward to timeout
		act(() => {
			jest.advanceTimersByTime(2);
		});

		expect(stopRecording).toHaveBeenCalled();
	});

	it("stops when size limit is exceeded", async () => {
		const { result } = renderHook(() => useVoiceCapture());

		await act(async () => {
			await result.current.start();
		});

		// Simulate a large data chunk
		const hugeBlob = new Blob([new ArrayBuffer(26 * 1024 * 1024)], {
			type: "audio/webm",
		});

		act(() => {
			if (dataAvailableCallback) {
				dataAvailableCallback(hugeBlob);
			}
		});

		expect(stopRecording).toHaveBeenCalled();
	});

	/*
	it("stops after silence detection (4s of silence + 250ms debounce)", async () => {
		const { result } = renderHook(() => useVoiceCapture());

		await act(async () => {
			await result.current.start();
		});

		// Allow port.onmessage to be stored
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 10));
		});

		// Ensure vadOnMessageCallback was set
		expect(vadOnMessageCallback).not.toBeNull();

		// Simulate speech detection
		act(() => {
			if (vadOnMessageCallback) {
				vadOnMessageCallback({ data: { type: "speech", volume: 0.8 } });
			}
		});

		// Fast forward 1 second - still speaking
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		// Switch to silence
		act(() => {
			if (vadOnMessageCallback) {
				vadOnMessageCallback({
					data: { type: "silence", volume: 0.1 },
				});
			}
		});

		// Advance time by 3.9 seconds (not enough for auto-stop)
		act(() => {
			jest.advanceTimersByTime(3900);
		});
		expect(stopRecording).not.toHaveBeenCalled();

		// Advance time past the 4s silence threshold + debounce
		act(() => {
			jest.advanceTimersByTime(350);
		});

		expect(stopRecording).toHaveBeenCalled();
	});

	it("responds to push-to-talk key (space by default)", async () => {
		const { result } = renderHook(() => useVoiceCapture());

		// Small delay to ensure hook is fully set up
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 10));
		});

		// Simulate space key down
		act(() => {
			window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
		});
		expect(startRecording).toHaveBeenCalled();

		// Simulate space key up
		act(() => {
			window.dispatchEvent(new KeyboardEvent("keyup", { key: " " }));
		});
		expect(stopRecording).toHaveBeenCalled();
	});

	it("accepts custom options", async () => {
		// Test with custom options
		const onStop = jest.fn();
		const onDataChunk = jest.fn();

		const { result } = renderHook(() =>
			useVoiceCapture({
				onStop,
				onDataChunk,
				vadAggressiveness: 3,
				pushToTalkKey: "Enter",
				maxDurationMs: 10000,
				maxSizeBytes: 10 * 1024 * 1024,
			})
		);

		await act(async () => {
			await result.current.start();
		});

		// Test custom timeout
		act(() => {
			jest.advanceTimersByTime(9999);
		});
		expect(stopRecording).not.toHaveBeenCalled();

		act(() => {
			jest.advanceTimersByTime(1);
		});
		expect(stopRecording).toHaveBeenCalled();

		// Manually trigger stop callback to test onStop
		act(() => {
			if (stopCallback) {
				const mockBlobUrl = "blob:mock";
				const mockBlob = new Blob([], { type: "audio/webm" });
				stopCallback(mockBlobUrl, mockBlob);
			}
		});

		expect(onStop).toHaveBeenCalled();

		// Test custom push-to-talk key
		startRecording.mockClear();
		stopRecording.mockClear();

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keydown", { key: "Enter" })
			);
		});
		expect(startRecording).toHaveBeenCalled();

		act(() => {
			window.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter" }));
		});
		expect(stopRecording).toHaveBeenCalled();
	});

	it("handles onDataChunk callback", async () => {
		const onDataChunk = jest.fn();
		renderHook(() => useVoiceCapture({ onDataChunk }));

		await act(async () => {
			// Allow hook to initialize
			await new Promise((resolve) => setTimeout(resolve, 10));
		});

		// Simulate data available
		const mockBlob = new Blob(["test"], { type: "audio/webm" });

		act(() => {
			if (dataAvailableCallback) {
				dataAvailableCallback(mockBlob);
			}
		});

		expect(onDataChunk).toHaveBeenCalledWith(mockBlob);
	});

	it("updates volume state on VAD events", async () => {
		const { result } = renderHook(() => useVoiceCapture());

		await act(async () => {
			await result.current.start();
		});

		// Allow port.onmessage to be stored
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 10));
		});

		// Simulate VAD event with volume
		act(() => {
			if (vadOnMessageCallback) {
				vadOnMessageCallback({
					data: { type: "speech", volume: 0.75 },
				});
			}
		});

		expect(result.current.volume).toBe(0.75);
	});
    */
});
