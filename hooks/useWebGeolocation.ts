import { useCallback, useEffect, useRef, useState } from "react";
import type {
	UseGeolocationOptions,
	WebGeolocationResult,
} from "./useGeolocation";

const DEFAULT_OPTIONS: Required<UseGeolocationOptions> = {
	highAccuracy: false,
	maximumAge: 60000,
	timeout: Infinity,
	watchPosition: false,
	decimalPlaces: 6,
	maxWatchUpdates: 0,
	autoRequest: false,
};

/**
 * Web-specific geolocation hook.
 * Uses the browser Permissions API and navigator.geolocation.
 * All effects are gated by `enabled` — when false, the hook is a no-op.
 * @param options
 * @param enabled
 */
const useWebGeolocation = (
	options: UseGeolocationOptions = {},
	enabled: boolean = true
): WebGeolocationResult => {
	const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
	const {
		highAccuracy,
		maximumAge,
		timeout,
		watchPosition,
		decimalPlaces,
		maxWatchUpdates,
		autoRequest,
	} = mergedOptions;

	const [latitude, setLatitude] = useState<number | null>(null);
	const [longitude, setLongitude] = useState<number | null>(null);
	const [accuracy, setAccuracy] = useState<number | null>(null);
	const [timestamp, setTimestamp] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [permissionState, setPermissionState] =
		useState<WebGeolocationResult["permissionState"]>("prompt");
	const [isLoading, setIsLoading] = useState(false);

	const watchIdRef = useRef<number | null>(null);
	const updateCountRef = useRef(0);
	const isRequestingRef = useRef(false);
	const permissionStatusRef = useRef<PermissionStatus | null>(null);

	// Ref to call requestLocation from inside the permission onchange handler
	// without stale closure issues
	const requestLocationRef = useRef<() => void>(() => {});

	// ---- Permission Tracking (Safari Safe + Cleanup) ----
	useEffect(() => {
		if (!enabled) return;

		if (!navigator.permissions) return;

		try {
			navigator.permissions
				.query({ name: "geolocation" as PermissionName })
				.then((status) => {
					permissionStatusRef.current = status;
					setPermissionState(
						status.state as WebGeolocationResult["permissionState"]
					);

					status.onchange = () => {
						const newState =
							status.state as WebGeolocationResult["permissionState"];
						setPermissionState(newState);

						// Permission was just granted (e.g. user reset via lock icon)
						// Clear stale errors and auto-request location
						if (newState === "granted") {
							setError(null);
							isRequestingRef.current = false;
							requestLocationRef.current();
						}
					};
				})
				.catch(() => {
					console.warn("Permissions API blocked or unavailable.");
				});
		} catch (e) {
			console.warn("Permissions API error", e);
		}

		return () => {
			if (permissionStatusRef.current) {
				permissionStatusRef.current.onchange = null;
			}
		};
	}, [enabled]);

	// ---- Stop Watching ----
	const stopWatching = useCallback(() => {
		if (watchIdRef.current !== null) {
			navigator.geolocation.clearWatch(watchIdRef.current);
			watchIdRef.current = null;
		}
		updateCountRef.current = 0;
		setIsLoading(false);
		isRequestingRef.current = false;
	}, []);

	// ---- Success Handler ----
	const successHandler = useCallback(
		(pos: GeolocationPosition) => {
			const {
				coords: { latitude, longitude, accuracy },
				timestamp,
			} = pos;

			setLatitude(parseFloat(latitude.toFixed(decimalPlaces)));
			setLongitude(parseFloat(longitude.toFixed(decimalPlaces)));
			setAccuracy(accuracy);
			setTimestamp(timestamp);
			setError(null);

			updateCountRef.current += 1;

			if (
				watchPosition &&
				maxWatchUpdates > 0 &&
				updateCountRef.current >= maxWatchUpdates
			) {
				stopWatching();
			}

			setIsLoading(false);
			isRequestingRef.current = false;
		},
		[decimalPlaces, watchPosition, maxWatchUpdates, stopWatching]
	);

	// ---- Error Handler ----
	const errorHandler = useCallback((err: GeolocationPositionError) => {
		if (err.code === 1) {
			setPermissionState("denied");
		}
		setError(err.message);
		setIsLoading(false);
		isRequestingRef.current = false;
	}, []);

	// ---- Request Location ----
	const requestLocation = useCallback(() => {
		if (!enabled) return;

		if (!navigator.geolocation) {
			setError("Geolocation not supported");
			setPermissionState("unsupported");
			return;
		}

		if (isRequestingRef.current) return;

		isRequestingRef.current = true;
		setIsLoading(true);
		setError(null);

		const safeTimeout = timeout === Infinity ? undefined : timeout;

		const geoOptions: PositionOptions = {
			enableHighAccuracy: highAccuracy,
			maximumAge: maximumAge,
			timeout: safeTimeout,
		};

		if (watchPosition) {
			stopWatching();
			watchIdRef.current = navigator.geolocation.watchPosition(
				successHandler,
				errorHandler,
				geoOptions
			);
		} else {
			navigator.geolocation.getCurrentPosition(
				successHandler,
				errorHandler,
				geoOptions
			);
		}
	}, [
		enabled,
		highAccuracy,
		maximumAge,
		timeout,
		watchPosition,
		successHandler,
		errorHandler,
		stopWatching,
	]);

	// Keep the ref in sync so the permission onchange handler
	// always calls the latest version of requestLocation
	requestLocationRef.current = requestLocation;

	// ---- Auto Request ----
	useEffect(() => {
		if (!enabled) return;

		if (autoRequest) {
			requestLocation();
		}
		return () => {
			stopWatching();
		};
	}, [enabled, autoRequest, requestLocation, stopWatching]);

	return {
		latitude,
		longitude,
		accuracy,
		timestamp,
		error,
		permissionState,
		isLoading,
		requestLocation,
		stopWatching,
	};
};

export default useWebGeolocation;
