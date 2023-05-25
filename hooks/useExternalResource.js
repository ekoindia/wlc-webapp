import { useEffect, useState } from "react";

/**
 * A custom hook for loading an external script or stylesheet.
 * The hook returns a state variable and a reload function.
 * The state variable represents the current status of the element (idle, loading, ready, error).
 * The reload function can be used to reload the resource.
 *
 * @param {string} src - The source URL of the external resource.
 * @param {string} type - The type of the external resource ('script' or 'link').
 * @param {string} rel - The rel attribute of the link element (only used if type is 'link').
 * @returns {[string, Function]} - The state of the resource and the reload function.
 * @returns {string} state - The state of the resource ('idle', 'loading', 'ready', 'error').
 * @returns {Function} reload - The reload function.
 * @example
 * const [state, reload] = useExternalResource("https://example.com/script.js", "script");
 * if (state === "ready") {
 * 	// Do something when the script is ready.
 * }
 * if (state === "error") {
 * 	// Do something when there is an error loading the script.
 * }
 * if (state === "loading") {
 * 	// Do something while the script is loading.
 * }
 */
function useExternalResource(src, type = "script", rel) {
	const MAX_RETRIES = 3; // Maximum number of retry attempts.
	const [state, setState] = useState("idle"); // Initial state is 'idle'.

	// Function to load the resource.
	const loadResource = () => {
		// Check if the resource already exists in the document.
		const existingElement = document.querySelector(`${type}[src="${src}"]`);

		if (existingElement) {
			// If the resource already exists, return and don't reload it.
			setState("ready");
			return;
		}

		setState("loading"); // Set state to 'loading'.

		const element = document.createElement(type);
		element.src = src;

		if (type === "script") {
			element.async = true;
		}

		if (type === "link" && rel) {
			element.rel = rel;
		}

		element.onload = () => {
			setState("ready"); // Set state to 'ready' when the resource has loaded.
		};

		element.onerror = () => {
			setState("error"); // Set state to 'error' if there was an error loading the resource.
		};

		// Append the element to the head of the document.
		document.head.appendChild(element);
	};

	const reloadResource = () => {
		setState("idle"); // Set state back to 'idle'.

		// Remove the existing resource from document before reloading
		const existingElement = document.querySelector(`${type}[src="${src}"]`);
		if (existingElement) {
			existingElement.remove();
		}

		loadResource(); // Reload the resource.
	};

	// Function to handle retry logic.
	const retry = async (fn, retries = MAX_RETRIES) => {
		try {
			return await fn();
		} catch (err) {
			if (retries > 0) {
				return retry(fn, retries - 1);
			} else {
				throw err;
			}
		}
	};

	// Function to reload the resource.
	const reload = () => {
		setState("idle"); // Set state back to 'idle'.
		retry(reloadResource); // Retry loading the resource.
	};

	useEffect(() => {
		loadResource();
	}, [src, type]); // Run the loadResource function whenever the src or type prop changes.

	return [state, reload];
}

export default useExternalResource;
