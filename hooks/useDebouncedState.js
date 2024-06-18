import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "utils";

/**
 * A custom hook to create a debounced state setter.
 * @param {(() => any) | any} initialState - The initial state. Could be a value or a function.
 * @param {number} delay - The amount of milliseconds to delay the state setter.
 * @param {number} [maxWait] - The maximum time callback is allowed to be delayed before it's invoked. 0 means no max wait.
 * @returns {[any, (newState: any) => void]} The state and its debounced setter.
 */
function useDebouncedState(initialState, delay, maxWait = 0) {
	const [state, setState] = useState(initialState);

	// Use useRef to create a new debounced function only once during the entire lifecycle of the component
	// and not on every render. This is important to avoid creating new timers on each render.
	const debouncedSetStateRef = useRef(
		debounce(
			(newState) => {
				setState(newState);
			},
			delay,
			maxWait
		)
	);

	// Since the debounced function was created with useRef,
	// we need to make sure we cancel any pending executions when the component is unmounted
	// to avoid setting state on an unmounted component.
	useEffect(() => {
		return () => {
			debouncedSetStateRef.current.cancel();
		};
	}, []);

	const setDebouncedState = useCallback((newState) => {
		debouncedSetStateRef.current.debouncedFunc(newState);
	}, []);

	return [state, setDebouncedState];
}

export default useDebouncedState;
