import { useEffect, useState } from "react";

interface UseGeolocationOptions {
	highAccuracy?: boolean;
	maximumAge?: number;
	timeout?: number;
	watchPosition?: boolean;
	positionWatchTimeBuffer?: number;
	decimalPlaces?: number;
	maxWatchUpdates?: number;
}

interface GeolocationResult {
	latitude: number | null;
	longitude: number | null;
	accuracy: number | null;
	error: string | null;
}

const DEFAULT_OPTIONS: Required<UseGeolocationOptions> = {
	highAccuracy: false,
	maximumAge: 60000,
	timeout: Infinity,
	watchPosition: false,
	positionWatchTimeBuffer: 6000,
	decimalPlaces: 6,
	maxWatchUpdates: 0,
};

/**
 * Custom hook to get the user's geolocation.
 * @param {UseGeolocationOptions} options - Options for geolocation.
 * @param {boolean} options.highAccuracy - Whether to use high accuracy (default: false).
 * @param {number} options.maximumAge - Maximum age of a cached position (default: 60000ms).
 * @param {number} options.timeout - Timeout for geolocation request (default: Infinity).
 * @param {boolean} options.watchPosition - Whether to watch the position (default: false).
 * @param {number} options.positionWatchTimeBuffer - Time buffer for watching position (default: 6000ms).
 * @param {number} options.decimalPlaces - Number of decimal places for latitude and longitude (default: 6).
 * @param {number} options.maxWatchUpdates - Maximum number of watch updates (default: 0).
 * @returns {GeolocationResult} - Geolocation result containing latitude, longitude, accuracy, and error message.
 */
const useGeolocation = (
	options: UseGeolocationOptions = {}
): GeolocationResult => {
	const {
		highAccuracy,
		maximumAge,
		timeout,
		watchPosition,
		positionWatchTimeBuffer,
		decimalPlaces,
		maxWatchUpdates,
	} = { ...DEFAULT_OPTIONS, ...options };
	const [position, setPosition] = useState<GeolocationResult>({
		latitude: null,
		longitude: null,
		accuracy: null,
		error: null,
	});
	const [updateCount, setUpdateCount] = useState<number>(0);

	useEffect(() => {
		let watchId: number | null = null;
		let interval: any = null;

		const successHandler = (pos) => {
			const {
				coords: { latitude, longitude, accuracy },
			} = pos;

			setPosition({
				latitude: parseFloat(latitude.toFixed(decimalPlaces)),
				longitude: parseFloat(longitude.toFixed(decimalPlaces)),
				accuracy,
				error: null,
			});

			setUpdateCount((prevCount) => prevCount + 1);
		};

		const errorHandler = (error) => {
			setPosition({
				latitude: null,
				longitude: null,
				accuracy: null,
				error: error.message,
			});
		};

		const options = {
			enableHighAccuracy: highAccuracy,
			maximumAge,
			timeout,
		};

		const stopWatching = () => {
			if (watchId !== null) {
				navigator.geolocation.clearWatch(watchId);
				watchId = null;
			}
			if (interval !== null) {
				clearInterval(interval);
				interval = null;
			}
		};

		if (watchPosition) {
			watchId = navigator.geolocation.watchPosition(
				successHandler,
				errorHandler,
				options
			);

			interval = setInterval(() => {
				if (watchId !== null) {
					navigator.geolocation.clearWatch(watchId);
					watchId = navigator.geolocation.watchPosition(
						successHandler,
						errorHandler,
						options
					);
				}
			}, positionWatchTimeBuffer);

			return () => {
				stopWatching();
			};
		} else {
			navigator.geolocation.getCurrentPosition(
				successHandler,
				errorHandler,
				options
			);
		}

		if (maxWatchUpdates > 0 && updateCount >= maxWatchUpdates) {
			stopWatching();
		}

		return () => {
			stopWatching();
		};
	}, [
		highAccuracy,
		maximumAge,
		timeout,
		watchPosition,
		positionWatchTimeBuffer,
		decimalPlaces,
		maxWatchUpdates,
	]);

	return position;
};

export default useGeolocation;
