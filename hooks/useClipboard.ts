import { useCallback, useState } from "react";

/**
 * CopyState - A type representing the state of copied text.
 * It can be true if the text was successfully copied, or an Error object if the copy operation failed.
 */
type CopyState = { [key: string | number]: true | Error };

/**
 * useClipboard - A hook to copy text to the clipboard. It manages a separate state for each text.
 * @param {number} delay - The delay in milliseconds after which the state for a text is reset. Default is 2500 ms.
 * @returns {Function} copy - A function that takes a string and copies it to the clipboard.
 * @returns {object} state - An object that contains the state for each copied text, mapped to the key for text to copy, or the text itself, if the key is not provided. The state can be true, or an Error object.
 * @example
 * const { copy, state } = useClipboard();
 * copy("Text to copy", "textid1");
 * if (state["textid1"] === true) {
 *  alert("Copied to clipboard!");
 * }
 * copy("Another Text");
 * if (state["Another Text"] === true) {
 * 	alert("Copied to clipboard!");
 * }
 */
const useClipboard = ({ delay = 2500 } = {}) => {
	const [state, setState] = useState<CopyState>({});

	/**
	 * A function to copy text to the clipboard and manage its state.
	 * @param {string} valueToCopy - The text to copy to the clipboard.
	 * @param {string | number} [key] - An optional key to identify the copied text in the state. If not provided, the text itself will be used as the key.
	 * @param {Function} [onCopy] - An optional callback function to execute after the text is copied.
	 * @returns {void}
	 * @throws {Error} If the copy operation fails, an Error object will be set in the state for the corresponding text.
	 */
	const copy = useCallback(
		(valueToCopy: string, key?: string | number, onCopy?: () => void) => {
			if (!valueToCopy) {
				return;
			}

			const copyText = async () => {
				const _key: string | number = key ?? valueToCopy;
				try {
					await navigator.clipboard.writeText(valueToCopy);
					setState(
						(prev) => ({ ...prev, [_key]: true }) as CopyState
					);
					setTimeout(() => {
						setState((prev) => {
							// Remove key from state without assigning false
							const { [_key]: _, ...rest } = prev;
							return rest;
						});
					}, delay);
					onCopy?.(); // Call the onCopy callback if provided
				} catch (error: any) {
					setState((prev) => ({
						...prev,
						[_key]: new Error(error?.message ?? "Copy failed"),
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
