import { useLocalStorage } from "hooks";
import { useMemo, useState } from "react";

/**
 * Hook for caching data for one month. After one month, the isValid status is returned as false.
 * @param {string} defaultValue
 * @param key
 * @param initialValue
 * @returns {Array} [value, setValue, isValid]
 */
const useMonthlyCacheState = (key, initialValue) => {
	const [dt] = useState(new Date());

	const this_month = useMemo(() => dt.getMonth(), [dt]);

	const [cachedValue, setCachedValue] = useLocalStorage(key, {
		cachedAt: this_month,
		data: initialValue,
	});

	const setValue = (value) => {
		setCachedValue({
			cachedAt: this_month,
			data: value,
		});
	};

	// If the cached value is from this_month, it is valid.
	return [
		cachedValue.data,
		setValue,
		cachedValue?.cachedAt === this_month ? true : false,
	];
};

export default useMonthlyCacheState;
