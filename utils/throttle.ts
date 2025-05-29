/**
 * Creates a throttled version of the provided function that ensures the function
 * is invoked at most once within the specified wait time.
 * @template T - The type of the function to throttle.
 * @param {T} func - The function to throttle. This function will be executed at most once per wait interval.
 * @param {number} wait - The number of milliseconds to wait before allowing the next invocation.
 * @returns {(...args: Parameters<T>) => void} - A throttled version of the input function that delays subsequent calls.
 * @example
 * // Example usage:
 * const throttledLog = throttle((message: string) => console.log(message), 1000);
 * throttledLog("Hello"); // Logs "Hello"
 * throttledLog("World"); // Ignored if called within 1 second of the previous call
 */
export function throttle<T extends (..._args: any[]) => any>(
	func: T,
	wait: number
): (..._args: Parameters<T>) => void {
	let lastCallTime: number | null = null;

	return function (this: any, ...args: Parameters<T>) {
		const now = Date.now();
		if (lastCallTime === null || now - lastCallTime >= wait) {
			lastCallTime = now;
			func.apply(this, args);
		}
	};
}
