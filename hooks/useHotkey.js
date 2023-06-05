import { useEffect } from "react";
import tinykeys from "tinykeys";

/**
 * Hook for Hotkey
 * @param {Object} keyFunctionMap - Map of key and function to be executed.
 * @param {Object} target - Target element to listen for keypress (Default: window).
 */
const useHotkey = (keyFunctionMap, target = window) => {
	useEffect(() => {
		if (!target) return;
		if (!Object.keys(keyFunctionMap || {}).length) return;

		// Disable on SSR
		if (typeof window === "undefined") return;

		// Setup keypress listener using tinykeys
		const unsubscribe = tinykeys(target, keyFunctionMap);

		return () => {
			unsubscribe();
		};
	}, [target, keyFunctionMap]);
};

export default useHotkey;
