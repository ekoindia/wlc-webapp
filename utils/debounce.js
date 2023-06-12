/**
 * Creates a debounced function that delays invoking the provided function until after delay milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param {function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @param {number} [maxWait=0] - The maximum time func is allowed to be delayed before it's invoked.
 * @returns {function} - Returns the new debounced function.
 */
export function debounce(func, delay, maxWait = 0) {
	let timeoutId;
	let maxTimeoutId;
	// let lastCall = Date.now();

	const debouncedFunc = function (...args) {
		clearTimeout(timeoutId);

		if (maxWait && !maxTimeoutId) {
			maxTimeoutId = setTimeout(() => {
				func(...args);
				// lastCall = Date.now();
				maxTimeoutId = undefined;
			}, maxWait);
		}

		// timeoutId = setTimeout(() => {
		// 	if (Date.now() - lastCall < maxWait) {
		// 		func(...args);
		// 		lastCall = Date.now();
		// 	}
		// }, delay);
		timeoutId = setTimeout(() => {
			// lastInvocationTime = Date.now();
			func(...args);
		}, delay);
	};

	const cancel = () => {
		clearTimeout(timeoutId);
		if (maxWait) {
			clearTimeout(maxTimeoutId);
		}
	};

	return { debouncedFunc, cancel };
}
