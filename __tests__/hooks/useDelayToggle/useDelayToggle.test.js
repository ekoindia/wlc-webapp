import { useDelayToggle } from "hooks";
import { act, renderHook } from "test-utils";

describe("useDelayToggle", () => {
	// Enable fake timers before each test
	beforeEach(() => {
		jest.useFakeTimers();
	});

	// Restore real timers after each test
	afterEach(() => {
		jest.useRealTimers();
	});

	it("should return the initial value immediately", () => {
		const initialValue = true;
		const delay = 500;
		const { result } = renderHook(() =>
			useDelayToggle(delay, initialValue)
		);

		// Check the initial state
		expect(result.current[0]).toBe(initialValue);
	});

	it("should return the default initial value (false) if not provided", () => {
		const delay = 500;
		const { result } = renderHook(() => useDelayToggle(delay));

		// Check the default initial state
		expect(result.current[0]).toBe(false);
	});

	it("should not toggle the value before the delay has passed", () => {
		const initialValue = false;
		const delay = 1000;
		const { result } = renderHook(() =>
			useDelayToggle(delay, initialValue)
		);

		// Check initial state
		expect(result.current[0]).toBe(initialValue);

		// Advance time by less than the delay
		act(() => {
			jest.advanceTimersByTime(delay - 1);
		});

		// Value should still be the initial value
		expect(result.current[0]).toBe(initialValue);
	});

	it("should toggle the value after the specified delay", () => {
		const initialValue = false;
		const delay = 1000;
		const { result } = renderHook(() =>
			useDelayToggle(delay, initialValue)
		);

		// Check initial state
		expect(result.current[0]).toBe(initialValue);

		// --- Important: Wrap timer advancement and the subsequent state update in act ---
		act(() => {
			jest.advanceTimersByTime(delay);
		});
		// --- End act wrapper ---

		// Value should now be toggled
		expect(result.current[0]).toBe(!initialValue); // Expect true
	});

	it("should toggle the value correctly when initial value is true", () => {
		const initialValue = true;
		const delay = 500;
		const { result } = renderHook(() =>
			useDelayToggle(delay, initialValue)
		);

		expect(result.current[0]).toBe(initialValue);

		act(() => {
			jest.advanceTimersByTime(delay);
		});

		expect(result.current[0]).toBe(!initialValue); // Expect false
	});

	it("should clear the timeout on unmount", () => {
		const initialValue = false;
		const delay = 1000;
		const { result, unmount } = renderHook(() =>
			useDelayToggle(delay, initialValue)
		);

		expect(result.current[0]).toBe(initialValue);

		// Unmount the hook before the timer fires
		unmount();

		// Advance time past the delay
		// No need to wrap this specific advanceTimersByTime in act,
		// as the state update *should not* happen because of the unmount cleanup.
		// However, using act here is also safe and doesn't hurt.
		act(() => {
			jest.advanceTimersByTime(delay);
		});

		// The value should NOT have toggled because the timeout was cleared
		expect(result.current[0]).toBe(initialValue);
	});

	it("should handle a delay of 0ms", () => {
		const initialValue = false;
		const delay = 0;
		const { result } = renderHook(() =>
			useDelayToggle(delay, initialValue)
		);

		expect(result.current[0]).toBe(initialValue);

		// Advance timers by the smallest possible amount (or just 0)
		// to trigger pending timeouts scheduled with setTimeout(..., 0)
		act(() => {
			jest.advanceTimersByTime(0);
		});

		// Value should be toggled immediately (in the next tick)
		expect(result.current[0]).toBe(!initialValue);
	});
});
