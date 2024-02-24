import { useCallback, useState } from "react";
type CopyState = { [key: string]: "READY" | "SUCCESS" | Error };

/**
 * useClipboard - A hook to copy text to the clipboard. It manages a separate state for each text.
 * @param {number} delay - The delay in milliseconds after which the state for a text is reset. Default is 2500.
 * @returns {Function} copy - A function that takes a string and copies it to the clipboard.
 * @returns {Object} state - An object that contains the state for each text. The state can be "READY", "SUCCESS", or an Error object.
 * @example
 * const { copy, state } = useClipboard();
 * copy("Text to copy");
 * if (state["Text to copy"] === "SUCCESS") {
 *  alert("Copied to clipboard!");
 * }
 */
const useClipboard = ({ delay = 2500 } = {}) => {
	const [state, setState] = useState<CopyState>({});
	console.log("state", state);

	const copy = useCallback(
		(valueToCopy: string) => {
			const copyText = async () => {
				try {
					await navigator.clipboard.writeText(valueToCopy);
					setState((prev) => ({ ...prev, [valueToCopy]: "SUCCESS" }));

					setTimeout(() => {
						setState((prev) => {
							const newState = { ...prev };
							delete newState[valueToCopy];
							return newState;
						});
					}, delay);
				} catch (error) {
					setState((prev) => ({
						...prev,
						[valueToCopy]: new Error(error.message),
					}));
				}
			};

			copyText();
		},
		[delay]
	);

	return { copy, state };
};

export default useClipboard;
