import React from "react";
type CopyState = "READY" | "SUCCESS" | Error;

const useClipboard = ({ delay = 2500 } = {}) => {
	const [state, setState] = React.useState<CopyState>("READY");
	const [copyTimeout, setCopyTimeout] =
		React.useState<ReturnType<typeof setTimeout>>();

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
			handleCopyResult(
				new Error(
					"`useClipboard`: Navigation Clipboard is not supported"
				)
			);
		}
	}

	return { copy, state };
};

export default useClipboard;
