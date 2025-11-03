import { useSession } from "contexts";
import { useLocalStorage } from "hooks";
import { useEffect, useMemo, useState } from "react";

/**
 * Hook for caching data for one day.
 * After one day (or, for a different user), the `isValid` status is returned as false.
 * @param {string} defaultValue
 * @param key
 * @param initialValue
 * @returns {Array} [value, setValue, isValid]
 */
const useDailyCacheState = (key, initialValue) => {
	const [dt, setDt] = useState(new Date());
	const { userId } = useSession();

	// Set a timer to update the date/time every day at midnight.
	// The timer triggers after the amount time left for the day to end.
	// Eg: If the time is 23:00:00, the timer will trigger after 1 hour.
	useEffect(() => {
		const timer = setTimeout(
			() => {
				setDt(new Date());
			},
			1000 * 60 * 60 * 24 -
				(dt.getHours() * 60 * 60 +
					dt.getMinutes() * 60 +
					dt.getSeconds()) *
					1000 +
				1000
		);
		return () => clearTimeout(timer);
	}, [dt]);

	const today = useMemo(() => dt.getDate() + "-" + dt.getMonth(), [dt]);

	const [cachedValue, setCachedValue] = useLocalStorage(key, {
		cachedAt: today,
		id: userId,
		data: initialValue,
	});

	/**
	 * Set the cached value with today's date and current user-id.
	 * @param {*} value - New value to be cached
	 */
	const setValue = (value) => {
		setCachedValue({
			cachedAt: today,
			id: userId,
			data: value,
		});
	};

	// If the cached value is valid, if it was stored today and for the current user.
	return [
		cachedValue.data,
		setValue,
		cachedValue?.cachedAt === today && cachedValue?.id === userId
			? true
			: false,
	];
};

export default useDailyCacheState;
