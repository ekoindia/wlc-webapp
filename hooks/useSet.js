import { useState, useMemo } from "react";

/**
 * State hook based on the Set data structure which is an array-like that only retains unique values added to it.
 * @param {Array} defaultValue	Default array to store in the set. Duplicate values will be removed.
 * @returns {object} An object with the following properties:
 * - values: An array of unique values in the set.
 * - add: Function to add a unique value to the set.
 * - delete: Function to remove a value from the set. Returns true, if value was found in the set.
 * - set: Function to set a new list of values in the set.
 * - has: Function to check if a value exists in the set.
 * - clear: Function to clear the set.
 */
const useSet = (defaultValue) => {
	const [list, setList] = useState(new Set(defaultValue));

	const setAction = useMemo(() => {
		return {
			values: [...list],
			add: (value) => {
				setList((prev) => new Set([...prev, value]));
			},
			delete: (value) => {
				let found = false;
				setList((prev) => {
					const newList = new Set(prev);
					found = newList.delete(value);
					return newList;
				});
				return found;
			},
			set: (values) => setList(new Set(values)),
			has: (value) => list.has(value),
			clear: () => setList(new Set()),
		};
	}, [list, setList]);

	return setAction;
};

export default useSet;
