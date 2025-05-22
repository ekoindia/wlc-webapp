import { useVoiceCapture } from "hooks";
import { act, renderHook } from "test-utils";

// Use fake timers so we can simulate long‑running audio.
jest.useFakeTimers();

// ---------------------------------------------------------------------------
//  mocks for navigator.mediaDevices & MediaRecorder (vanilla JS)
// ---------------------------------------------------------------------------
class MockMediaRecorder {
	constructor() {
		this.ondataavailable = null;
		this.onstop = null;
		this._chunks = [];
	}
	start(/* timeslice */) {
		/* noop */
	}
	stop() {
		if (this.onstop) this.onstop();
	}
	requestData() {
		const blob = new Blob(this._chunks, { type: "audio/webm" });
		const event = { data: blob };
		if (this.ondataavailable) this.ondataavailable(event);
	}
}

// Attach to global so useReactMediaRecorder can instantiate it.
global.MediaRecorder = MockMediaRecorder;

// Mock getUserMedia to return a stub stream.
Object.defineProperty(navigator, "mediaDevices", {
	value: {
		getUserMedia: jest.fn().mockResolvedValue(new MediaStream()),
	},
});

// ---------------------------------------------------------------------------
//  mock react-media-recorder hook
// ---------------------------------------------------------------------------
const startRecording = jest.fn();
const stopRecording = jest.fn();
let dataAvailableCb;

jest.mock("react-media-recorder", () => ({
	useReactMediaRecorder: () => ({
		startRecording: (...args) => startRecording(...args),
		stopRecording: (...args) => stopRecording(...args),
		onDataAvailable: (cb) => {
			dataAvailableCb = cb;
		},
		status: "idle",
		error: null,
	}),
}));

// ---------------------------------------------------------------------------
//  TESTS
// ---------------------------------------------------------------------------

describe("useVoiceCapture", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("auto‑stops after 25 s", () => {
		const { result } = renderHook(() => useVoiceCapture());

		act(() => {
			result.current.start();
		});

		// Fast‑forward 25 000 ms
		act(() => {
			jest.advanceTimersByTime(25000);
		});

		expect(stopRecording).toHaveBeenCalled();
	});

	it("stops when size limit is exceeded", () => {
		const { result } = renderHook(() => useVoiceCapture());
		act(() => result.current.start());

		// Simulate a giant chunk (26 MiB)
		const hugeBlob = new Blob([new ArrayBuffer(26 * 1024 * 1024)], {
			type: "audio/webm",
		});

		act(() => {
			// invoke the onDataAvailable mock
			dataAvailableCb(hugeBlob);
		});

		expect(stopRecording).toHaveBeenCalled();
	});

	it("stops after 4 s of silence + 250 ms debounce", () => {
		const { result } = renderHook(() => useVoiceCapture());
		act(() => result.current.start());

		// Fake: speech happens now
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		// Fake: 4 s of silence
		act(() => {
			jest.advanceTimersByTime(4000);
		});

		// Debounce window (250 ms)
		act(() => {
			jest.advanceTimersByTime(250);
		});

		expect(stopRecording).toHaveBeenCalled();
	});

	it("responds to push‑to‑talk key (space)", () => {
		/* const { result } = */ renderHook(() => useVoiceCapture());

		// Press spacebar -> should start
		act(() => {
			window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
		});
		expect(startRecording).toHaveBeenCalled();

		// Release spacebar -> should stop
		act(() => {
			window.dispatchEvent(new KeyboardEvent("keyup", { key: " " }));
		});
		expect(stopRecording).toHaveBeenCalled();
	});
});
