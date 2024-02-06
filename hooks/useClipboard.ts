import { useState } from "react";
type CopyState = "READY" | "SUCCESS" | Error;

/**
 * useClipboard - A hook to copy text to the clipboard
 * @param param0
 * @example
 * const { copy, state } = useClipboard();
 * copy("Text to copy");
 * if (state === "SUCCESS") {
 *  alert("Copied to clipboard!");
 * }
 */
const useClipboard = ({ delay = 2500 } = {}) => {
	const [state, setState] = useState<CopyState>("READY");
	const [copyTimeout, setCopyTimeout] =
		useState<ReturnType<typeof setTimeout>>();

	function handleCopyResult(result: CopyState) {
		setState(result);
		clearTimeout(copyTimeout);
		setCopyTimeout(setTimeout(() => setState("READY"), delay));
	}

	function copy(valueToCopy: string) {
		if ("clipboard" in navigator) {
			navigator.clipboard
				.writeText(valueToCopy)
				.then(() => handleCopyResult("SUCCESS"))
				.catch(
					(error) => error instanceof Error && handleCopyResult(error)
				);
		} else {
			handleCopyResult(new Error("Clipboard is not supported"));
		}
	}

	return { copy, state };
};

export default useClipboard;
