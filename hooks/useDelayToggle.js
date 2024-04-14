import { useEffect, useState } from "react";

/**
 * A simple hook to toggle a boolean value once after a delay.
 * @param {number} delayInMs - Delay in milliseconds
 * @param {boolean} initialValue - Initial value of the toggle. Default is `false`.
 */
const useDelayToggle = (delayInMs = 0, initialValue = false) => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setValue((value) => !value);
		}, delayInMs);

		return () => clearTimeout(timeout);
	}, [delayInMs]);

	return [value];
};

export default useDelayToggle;
