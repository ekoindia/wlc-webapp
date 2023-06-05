import { useEffect } from "react";
import tinykeys from "tinykeys";

/**
 * Hook for setting Hotkey actions.
 * Uses [tinykeys library](https://github.com/jamiebuilds/tinykeys).
 * @param {Object} keyFunctionMap - Map of key and function to be executed.
 * @param {Object} target - Target element to listen for keypress (Default: window).
 * @returns {void}
 * @example
 * // Example usage:
 * const keyFunctionMap = {
 * 	"Escape": () => {
 * 		console.log("Escape pressed");
 * 	},
 * 	"Shift+Enter": () => {
 * 		console.log("Shift+Enter pressed");
 * 	},
 * };
 * useHotkey(keyFunctionMap);
 *
 * // Example usage with target:
 * const target = document.getElementById("myElement");
 * useHotkey(keyFunctionMap, target);
 *
 * // Example key configs:
 * "d" or "KeyD" - the "d" key
 * "$mod+D" - Meta/Control+D
 * "$mod+Shift+D" - Meta/Control+Shift+D
 * "g i" - the "g" key followed by the "i" key (sequence)
 * Other key examples: Space, Enter, ArrowUp, Control
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
