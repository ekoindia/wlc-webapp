import { useState } from "react";

/**
 * The useLocalStorage hook. Provides a wrapper around the LocalStorage object.
 * The stored state value is preserved in the LocalStorage.
 * Supports SSR: if the window object is not present (as in SSR), returns the default value.
 * @param {string} key - The key to store the value under.
 * @param {any} initialValue - The initial/default value to store.
 * @param {object} [options] - Additional options.
 * @param {boolean} [options.dontStoreInitialValue] - If true, if the value passed to the setValue function is equal to the initial value, it will not be stored in LocalStorage.
 * @returns {Array} - A tuple containing the value and a setter function.
 * @example <caption>Basic usage</caption>
 * 		const [value, setValue] = useLocalStorage("myKey", "myValue");
 * 		console.log(value); // "myValue"
 * 		setValue("myNewValue");
 * 		console.log(value); // "myNewValue"
 */
export default function useLocalStorage<T>(
	key: string,
	initialValue: T,
	options?: {
		dontStoreInitialValue?: boolean;
	}
) {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === "undefined") {
			return initialValue;
		}
		try {
			// Get from local storage by key
			const item = window.localStorage.getItem(key);
			// Parse stored json or if none return initialValue
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			// If error also return initialValue
			console.log(error);
			return initialValue;
		}
	});
	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = (value) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore =
				value instanceof Function ? value(storedValue) : value;
			// Save state
			setStoredValue(valueToStore);
			// Save to local storage
			if (typeof window !== "undefined") {
				// If value is null or undefined, remove the item from local storage
				if (
					valueToStore === null ||
					typeof valueToStore === "undefined"
				) {
					console.warn(
						"valueToStore is null or undefined:",
						valueToStore
					);

					window.localStorage.removeItem(key);
					return;
				}

				// Stringify the value for comparison and storage
				const strValueToStore = JSON.stringify(valueToStore);

				// If the value is the same as the initial value and the option is set, remove the item from local storage
				if (
					options?.dontStoreInitialValue &&
					initialValue !== null &&
					typeof initialValue !== "undefined"
				) {
					const strInitialValue = JSON.stringify(initialValue);
					if (strValueToStore === strInitialValue) {
						console.warn(
							"Value is the same as the initial value:",
							strInitialValue,
							strValueToStore
						);
						window.localStorage.removeItem(key);
						return;
					}
				}

				// Save to local storage
				window.localStorage.setItem(key, strValueToStore);
			}
		} catch (error) {
			console.error(
				"[useLocalStorage] Error setting LocalStorage:",
				error
			);
		}
	};

	return [storedValue, setValue] as const;
}
