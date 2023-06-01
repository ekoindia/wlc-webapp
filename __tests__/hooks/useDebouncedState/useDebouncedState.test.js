import { useDebouncedState } from "hooks";
import { act, renderHook } from "test-utils";

// jest.useFakeTimers();
// jest.spyOn(global, "setTimeout");

describe("useDebouncedState", () => {
	// jest.useFakeTimers();
	beforeAll(() => {
		jest.useFakeTimers();
	});
	afterEach(() => {
		jest.clearAllTimers();
	});
	afterAll(() => {
		jest.useRealTimers();
	});

	it("should be defined", () => {
		expect(useDebouncedState).toBeDefined();
	});

	it("should render", () => {
		const { result } = renderHook(() => useDebouncedState(undefined, 200));
		expect(result.error).toBeUndefined();
	});

	it("should debounce state set", () => {
		const { result } = renderHook(() =>
			useDebouncedState("initialstate", 200)
		);
		expect(result.current[0]).toBe("initialstate");
		result.current[1]("Hello world!");
		act(() => {
			jest.advanceTimersByTime(199);
		});
		expect(result.current[0]).toBe("initialstate");
		act(() => {
			jest.advanceTimersByTime(1);
		});
		expect(result.current[0]).toBe("Hello world!");
	});

	it("should return initial state correctly", () => {
		const { result } = renderHook(() => useDebouncedState("test", 1000));
		expect(result.current[0]).toBe("test");
	});

	it("should set new state after delay", () => {
		const { result } = renderHook(() => useDebouncedState("test", 1000));

		act(() => {
			result.current[1]("newTest");
		});

		expect(result.current[0]).toBe("test");

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(result.current[0]).toBe("newTest");
	});

	it("should not set state if delay has not passed", () => {
		const { result } = renderHook(() => useDebouncedState("test", 1000));

		act(() => {
			result.current[1]("newTest");
		});

		expect(result.current[0]).toBe("test");

		act(() => {
			jest.advanceTimersByTime(500);
		});

		expect(result.current[0]).toBe("test");
	});

	it("should set new state after maxWait even if delay has not passed", () => {
		const { result } = renderHook(() =>
			useDebouncedState("test", 5000, 1000)
		);

		act(() => {
			result.current[1]("newTest");
		});

		expect(result.current[0]).toBe("test");

		act(() => {
			jest.advanceTimersByTime(1100);
		});

		expect(result.current[0]).toBe("newTest");
	});

	it("should set new state after multiple debounces", () => {
		const { result } = renderHook(() => useDebouncedState("test", 1000));

		act(() => {
			result.current[1]("newTest");
		});

		expect(result.current[0]).toBe("test");

		act(() => {
			jest.advanceTimersByTime(500);
		});

		expect(result.current[0]).toBe("test");

		act(() => {
			result.current[1]("newTest2");
		});

		act(() => {
			jest.advanceTimersByTime(700);
		});

		expect(result.current[0]).toBe("test");

		act(() => {
			jest.advanceTimersByTime(800);
		});

		expect(result.current[0]).toBe("newTest2");
	});

	jest.useRealTimers();
});
