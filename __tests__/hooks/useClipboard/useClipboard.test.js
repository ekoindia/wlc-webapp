import { useClipboard } from "hooks";
import { act, renderHook } from "test-utils";

/**
 * Test cases for useClipboard hook:
 *
 * 1. Initialization
 *    - Should initialize with default delay (2500ms)
 *    - Should initialize with custom delay
 *
 * 2. Copy functionality
 *    - Should copy text to clipboard successfully
 *    - Should copy text with custom key
 *    - Should execute callback function after copying
 *    - Should do nothing when copying empty string
 *    - Should handle clipboard API errors
 *
 * 3. State management
 *    - Should update state on successful copy
 *    - Should clean up state after delay
 *    - Should update state with error on copy failure
 *
 * 4. Timing
 *    - Should respect custom delay for state cleanup
 *    - Should handle multiple copies with different keys
 */

// Mock clipboard API
const mockClipboard = {
	writeText: jest.fn(),
};

// Mock setTimeout
jest.useFakeTimers();

// Setup global navigator object for tests
Object.defineProperty(global.navigator, "clipboard", {
	value: mockClipboard,
	writable: true,
});

describe("useClipboard hook", () => {
	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();
		// Reset timers
		jest.clearAllTimers();
	});

	test("renders hook with correct structure", () => {
		const { result } = renderHook(() => useClipboard());
		expect(result.current).toBeDefined();
		expect(result.current.copy).toBeDefined();
		expect(result.current.copy).toBeInstanceOf(Function);
		expect(result.current.state).toBeDefined();
		expect(result.current.state).toBeInstanceOf(Object);
	});

	describe("Initialization", () => {
		test("should initialize with default delay (2500ms)", async () => {
			// We can't directly test the delay value as it's a closure variable
			// But we can test its effect by triggering a copy and advancing timers
			const { result } = renderHook(() => useClipboard());

			// Mock successful clipboard write
			mockClipboard.writeText.mockResolvedValueOnce(undefined);

			// Call copy function - using async act because clipboard.writeText returns a Promise
			await act(async () => {
				result.current.copy("test text");
			});

			// Verify state is updated
			expect(result.current.state["test text"]).toBe(true);

			// Advance timer by default delay (2500ms)
			act(() => {
				jest.advanceTimersByTime(2500);
			});

			// Verify state is cleaned up
			expect(result.current.state["test text"]).toBeUndefined();
		});

		test("should initialize with custom delay", async () => {
			const customDelay = 1000;
			const { result } = renderHook(() =>
				useClipboard({ delay: customDelay })
			);

			// Mock successful clipboard write
			mockClipboard.writeText.mockResolvedValueOnce(undefined);

			// Call copy function - using async act because clipboard.writeText returns a Promise
			await act(async () => {
				result.current.copy("test text");
			});

			// Verify state is updated
			expect(result.current.state["test text"]).toBe(true);

			// Advance timer by half the custom delay
			act(() => {
				jest.advanceTimersByTime(customDelay / 2);
			});

			// State should still be true
			expect(result.current.state["test text"]).toBe(true);

			// Advance timer to full delay
			act(() => {
				jest.advanceTimersByTime(customDelay / 2);
			});

			// Verify state is cleaned up
			expect(result.current.state["test text"]).toBeUndefined();
		});
	});

	describe("Copy functionality", () => {
		test("should copy text to clipboard successfully", async () => {
			const { result } = renderHook(() => useClipboard());
			const textToCopy = "test copy text";

			// Mock successful clipboard write
			mockClipboard.writeText.mockResolvedValueOnce(undefined);

			// Call copy function
			await act(async () => {
				result.current.copy(textToCopy);
			});

			// Verify clipboard API was called with correct text
			expect(mockClipboard.writeText).toHaveBeenCalledWith(textToCopy);
			expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);

			// Verify state is updated
			expect(result.current.state[textToCopy]).toBe(true);
		});

		test("should copy text with custom key", async () => {
			const { result } = renderHook(() => useClipboard());
			const textToCopy = "test copy text";
			const customKey = "custom-key-1";

			// Mock successful clipboard write
			mockClipboard.writeText.mockResolvedValueOnce(undefined);

			// Call copy function with custom key
			await act(async () => {
				result.current.copy(textToCopy, customKey);
			});

			// Verify clipboard API was called with correct text
			expect(mockClipboard.writeText).toHaveBeenCalledWith(textToCopy);

			// Verify state is updated with custom key
			expect(result.current.state[customKey]).toBe(true);
			expect(result.current.state[textToCopy]).toBeUndefined();
		});

		test("should execute callback function after copying", async () => {
			const { result } = renderHook(() => useClipboard());
			const textToCopy = "test copy text";
			const mockCallback = jest.fn();

			// Mock successful clipboard write
			mockClipboard.writeText.mockResolvedValueOnce(undefined);

			// Call copy function with callback
			await act(async () => {
				result.current.copy(textToCopy, undefined, mockCallback);
			});

			// Verify callback was called
			expect(mockCallback).toHaveBeenCalledTimes(1);
		});

		test("should do nothing when copying empty string", async () => {
			const { result } = renderHook(() => useClipboard());

			// Call copy function with empty string
			await act(async () => {
				result.current.copy("");
			});

			// Verify clipboard API was not called
			expect(mockClipboard.writeText).not.toHaveBeenCalled();
		});

		test("should handle clipboard API errors", async () => {
			const { result } = renderHook(() => useClipboard());
			const textToCopy = "test copy text";
			const mockError = new Error("Clipboard write failed");

			// Mock failed clipboard write
			mockClipboard.writeText.mockRejectedValueOnce(mockError);

			// Call copy function
			await act(async () => {
				result.current.copy(textToCopy);
			});

			// Verify state contains error
			expect(result.current.state[textToCopy]).toBeInstanceOf(Error);
			expect(result.current.state[textToCopy].message).toBe(
				"Clipboard write failed"
			);
		});
	});

	describe("State management", () => {
		test("should update state on successful copy", async () => {
			const { result } = renderHook(() => useClipboard());
			const textToCopy = "test state text";

			// Mock successful clipboard write
			mockClipboard.writeText.mockResolvedValueOnce(undefined);

			// Verify initial state is empty
			expect(Object.keys(result.current.state).length).toBe(0);

			// Call copy function
			await act(async () => {
				result.current.copy(textToCopy);
			});

			// Verify state is updated with true for successful copy
			expect(result.current.state[textToCopy]).toBe(true);
		});

		test("should clean up state after delay", async () => {
			const { result } = renderHook(() => useClipboard({ delay: 1000 }));
			const textToCopy = "test cleanup text";

			// Mock successful clipboard write
			mockClipboard.writeText.mockResolvedValueOnce(undefined);

			// Call copy function
			await act(async () => {
				result.current.copy(textToCopy);
			});

			// Verify state contains the key
			expect(result.current.state[textToCopy]).toBe(true);

			// Advance timer to trigger cleanup
			act(() => {
				jest.advanceTimersByTime(1000);
			});

			// Verify state no longer contains the key
			expect(result.current.state[textToCopy]).toBeUndefined();
		});

		test("should update state with error on copy failure", async () => {
			const { result } = renderHook(() => useClipboard());
			const textToCopy = "test error text";

			// Mock failed clipboard write
			mockClipboard.writeText.mockRejectedValueOnce(
				new Error("Copy failed")
			);

			// Call copy function
			await act(async () => {
				result.current.copy(textToCopy);
			});

			// Verify state contains error
			expect(result.current.state[textToCopy]).toBeInstanceOf(Error);
			expect(result.current.state[textToCopy].message).toBe(
				"Copy failed"
			);
		});
	});

	describe("Timing", () => {
		test("should respect custom delay for state cleanup", async () => {
			const customDelay = 3000;
			const { result } = renderHook(() =>
				useClipboard({ delay: customDelay })
			);
			const textToCopy = "test timing text";

			// Mock successful clipboard write
			mockClipboard.writeText.mockResolvedValueOnce(undefined);

			// Call copy function
			await act(async () => {
				result.current.copy(textToCopy);
			});

			// Verify state is updated
			expect(result.current.state[textToCopy]).toBe(true);

			// Advance timer by less than the delay
			act(() => {
				jest.advanceTimersByTime(customDelay - 500);
			});

			// Verify state still contains the key
			expect(result.current.state[textToCopy]).toBe(true);

			// Advance timer to complete the delay
			act(() => {
				jest.advanceTimersByTime(500);
			});

			// Verify state no longer contains the key
			expect(result.current.state[textToCopy]).toBeUndefined();
		});

		test("should handle multiple copies with different keys", async () => {
			const { result } = renderHook(() => useClipboard({ delay: 1000 }));

			// Mock first successful clipboard write
			mockClipboard.writeText.mockResolvedValueOnce(undefined);

			// Call copy function for first text
			await act(async () => {
				result.current.copy("text1", "key1");
			});

			// Mock second successful clipboard write
			mockClipboard.writeText.mockResolvedValueOnce(undefined);

			// Call copy function for second text after 500ms
			act(() => {
				jest.advanceTimersByTime(500);
			});

			await act(async () => {
				result.current.copy("text2", "key2");
			});

			// Verify both keys are in state
			expect(result.current.state["key1"]).toBe(true);
			expect(result.current.state["key2"]).toBe(true);

			// Advance timer by another 500ms (total 1000ms)
			act(() => {
				jest.advanceTimersByTime(500);
			});

			// Verify first key is removed but second remains
			expect(result.current.state["key1"]).toBeUndefined();
			expect(result.current.state["key2"]).toBe(true);

			// Advance timer by final 500ms
			act(() => {
				jest.advanceTimersByTime(500);
			});

			// Verify both keys are now removed
			expect(result.current.state["key1"]).toBeUndefined();
			expect(result.current.state["key2"]).toBeUndefined();
		});
	});
});
