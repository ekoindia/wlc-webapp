/**
 * The useSessionStorage hook. Provides a wrapper around the sessionStorage object.
 * @module hooks/useSessionStorage
 */

import { useEffect, useState } from "react";

/**
 * The useSessionStorage hook. Provides a wrapper around the SessionStorage object.
 * The stored state value is preserved in the SessionStorage.
 * Supports SSR: if the window object is not present (as in SSR), returns the default value.
 * @param {string} key - The key to store the value under.
 * @param {any} initialValue - The initial/default value to store.
 * @returns {Array} - A tuple containing the value and a setter function.
 * @example <caption>Basic usage</caption>
 * 		const [value, setValue] = useSessionStorage("myKey", "myValue");
 * 		console.log(value); // "myValue"
 * 		setValue("myNewValue");
 * 		console.log(value); // "myNewValue"
 */
export default function useSessionStorage(key, initialValue) {
	const [value, setValue] = useState(() => {
		if (typeof window === "undefined") {
			return initialValue;
		}

		try {
			const storedValue = window.sessionStorage.getItem(key);
			return storedValue ? JSON.parse(storedValue) : initialValue;
		} catch (err) {
			console.warn("Error getting sessionStorage: ", err);
			return initialValue;
		}
	});

	useEffect(() => {
		try {
			const serializedValue = JSON.stringify(value);
			window.sessionStorage.setItem(key, serializedValue);
		} catch (err) {
			console.error(
				"[useSessionStorage] Error setting sessionStorage:",
				err
			);
		}
	}, [key, value]);

	return [value, setValue];
}
