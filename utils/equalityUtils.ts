/**
 * Deeply compares two objects to determine if they are equivalent.
 * @param {any} obj1 - The first object to compare.
 * @param {any} obj2 - The second object to compare.
 * @returns {boolean} - Returns true if the objects are deeply equal, false otherwise.
 */
export const areObjectsEqual = (obj1: any, obj2: any): boolean => {
	if (obj1 === obj2) return true;

	if (
		obj1 == null ||
		typeof obj1 !== "object" ||
		obj2 == null ||
		typeof obj2 !== "object"
	) {
		return false;
	}

	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) return false;

	for (let key of keys1) {
		if (!keys2.includes(key) || !areObjectsEqual(obj1[key], obj2[key])) {
			return false;
		}
	}

	return true;
};
