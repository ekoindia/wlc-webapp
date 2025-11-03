import { useSession } from "contexts";
import { useLocalStorage } from "hooks";
import { useMemo, useState } from "react";

/**
 * Hook for caching data for one month, for the current user.
 * After one month (or, for a different user), the `isValid` status is returned as false.
 * @param {string} defaultValue
 * @param key
 * @param initialValue
 * @returns {Array} [value, setValue, isValid]
 */
const useMonthlyCacheState = (key, initialValue) => {
	const [dt] = useState(new Date());
	const { userId } = useSession();

	const this_month = useMemo(() => dt.getMonth(), [dt]);

	const [cachedValue, setCachedValue] = useLocalStorage(key, {
		cachedAt: this_month,
		id: userId,
		data: initialValue,
	});

	/**
	 * Set the cached value with this_month and current user-id.
	 * @param {*} value - New value to be cached
	 */
	const setValue = (value) => {
		setCachedValue({
			cachedAt: this_month,
			id: userId,
			data: value,
		});
	};

	// If the cached value is from this_month, it is valid.
	return [
		cachedValue.data,
		setValue,
		cachedValue?.cachedAt === this_month && cachedValue?.id === userId
			? true
			: false,
	];
};

export default useMonthlyCacheState;
