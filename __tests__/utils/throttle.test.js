import { throttle } from "utils";

jest.useFakeTimers();

describe("throttle", () => {
	it("should call the function immediately on first invocation", () => {
		const fn = jest.fn();
		const throttledFn = throttle(fn, 1000);

		throttledFn("test");
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith("test");
	});

	it("should ignore subsequent calls within wait time", () => {
		const fn = jest.fn();
		const throttledFn = throttle(fn, 1000);

		throttledFn();
		throttledFn();
		throttledFn();
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("should allow call after wait time has passed", () => {
		const fn = jest.fn();
		const throttledFn = throttle(fn, 1000);

		throttledFn();
		jest.advanceTimersByTime(1000);
		throttledFn();
		expect(fn).toHaveBeenCalledTimes(2);
	});

	it("should preserve the `this` context", () => {
		const context = {
			value: 42,
			getValue() {
				return this.value;
			},
		};

		const spy = jest.fn(function () {
			return this.getValue();
		});

		const throttled = throttle(spy, 1000);
		throttled.call(context);

		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy.mock.results[0].value).toBe(42);
	});

	it("should not call again if time hasn’t passed", () => {
		const fn = jest.fn();
		const throttledFn = throttle(fn, 1000);

		throttledFn();
		jest.advanceTimersByTime(500);
		throttledFn();
		expect(fn).toHaveBeenCalledTimes(1);

		jest.advanceTimersByTime(500); // Total = 1000ms
		throttledFn();
		expect(fn).toHaveBeenCalledTimes(2);
	});
});
