import { useCallback, useState } from "react";
type CopyState = { [key: string]: true | Error };

/**
 * useClipboard - A hook to copy text to the clipboard. It manages a separate state for each text.
 * @param {number} delay - The delay in milliseconds after which the state for a text is reset. Default is 2500.
 * @returns {Function} copy - A function that takes a string and copies it to the clipboard.
 * @returns {Object} state - An object that contains the state for each text. The state can be true, or an Error object.
 * @example
 * const { copy, state } = useClipboard();
 * copy("Text to copy");
 * if (state["Text to copy"] === true) {
 *  alert("Copied to clipboard!");
 * }
 */
const useClipboard = ({ delay = 2500 } = {}) => {
	const [state, setState] = useState<CopyState>({});

	const copy = useCallback(
		(valueToCopy: string) => {
			const copyText = async () => {
				try {
					await navigator.clipboard.writeText(valueToCopy);
					setState((prev) => ({ ...prev, [valueToCopy]: true }));
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
