import { usePubSub } from "contexts";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ANDROID_ACTION,
	ANDROID_PERMISSION,
	doAndroidAction,
	isAndroidApp,
} from "utils";

interface UseGeolocationOptions {
	highAccuracy?: boolean;
	maximumAge?: number;
	timeout?: number;
	watchPosition?: boolean;
	decimalPlaces?: number;
	maxWatchUpdates?: number;
	autoRequest?: boolean;
}

type PermissionStateType = "granted" | "prompt" | "denied" | "unsupported";

interface GeolocationResult {
	latitude: number | null;
	longitude: number | null;
	accuracy: number | null;
	timestamp: number | null; // Added: Useful for cache validation
	error: string | null;
	permissionState: PermissionStateType;
	isLoading: boolean;
	requestLocation: () => void;
	stopWatching: () => void;
	/** Request native Android location permission (no-op on web) */
	requestAndroidPermission: () => void;
}

const DEFAULT_OPTIONS: Required<UseGeolocationOptions> = {
	highAccuracy: false,
	maximumAge: 60000,
	timeout: Infinity,
	watchPosition: false,
	decimalPlaces: 6,
	maxWatchUpdates: 0,
	autoRequest: false,
};

const useGeolocation = (
	options: UseGeolocationOptions = {}
): GeolocationResult => {
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
		useState<PermissionStateType>("prompt");
	const [isLoading, setIsLoading] = useState(false);

	const { subscribe, TOPICS } = usePubSub();

	// Refs for tracking IDs and state without triggering re-renders
	const watchIdRef = useRef<number | null>(null);
	const updateCountRef = useRef(0);
	const isRequestingRef = useRef(false);

	// UPGRADE 1: Fix Memory Leak
	// Store the permission status object to clean up the event listener later
	const permissionStatusRef = useRef<PermissionStatus | null>(null);

	// ---- 1. Upgraded Permission Tracking (Safari Safe + Cleanup) ----
	useEffect(() => {
		// UPGRADE 2: Browser Compatibility
		// Safari throws or returns undefined for navigator.permissions
		if (!navigator.permissions) {
			return;
		}

		try {
			navigator.permissions
				.query({ name: "geolocation" as PermissionName })
				.then((status) => {
					permissionStatusRef.current = status;
					setPermissionState(status.state as PermissionStateType);

					// Set up the change listener
					status.onchange = () => {
						setPermissionState(status.state as PermissionStateType);
					};
				})
				.catch(() => {
					// Fail silently, assume prompt state
					console.warn("Permissions API blocked or unavailable.");
				});
		} catch (e) {
			console.warn("Permissions API error", e);
		}

		// CLEANUP: Remove the event listener on unmount
		return () => {
			if (permissionStatusRef.current) {
				permissionStatusRef.current.onchange = null;
			}
		};
	}, []);

	// ---- 2. Stop Watching (Moved up to fix Dependency Cycles) ----
	const stopWatching = useCallback(() => {
		if (watchIdRef.current !== null) {
			navigator.geolocation.clearWatch(watchIdRef.current);
			watchIdRef.current = null;
		}
		updateCountRef.current = 0;
		setIsLoading(false);
		isRequestingRef.current = false;
	}, []);

	// ---- 3. Success Handler ----
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

			// Logic: Stop after X updates if configured
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

	// ---- 3.5 Android Response Handler ----
	useEffect(() => {
		if (isAndroidApp() && subscribe && TOPICS.ANDROID_RESPONSE) {
			const unsubscribe = subscribe(
				TOPICS.ANDROID_RESPONSE,
				(data: any) => {
					if (
						data?.action === ANDROID_ACTION.GEOLOCATION_RESPONSE ||
						data?.action === ANDROID_ACTION.GPS_STATUS_RESPONSE
					) {
						console.log(
							"[useGeolocation] Android Response:",
							data.data
						);
						try {
							let response = data.data;
							if (typeof response === "string") {
								response = JSON.parse(response);
							}

							if (response) {
								const lat =
									response.latitude ||
									response.lat ||
									response.lati;
								const lng =
									response.longitude ||
									response.long ||
									response.longi;
								const acc = response.accuracy || response.acc;

								if (lat && lng) {
									setLatitude(
										parseFloat(
											Number(lat).toFixed(decimalPlaces)
										)
									);
									setLongitude(
										parseFloat(
											Number(lng).toFixed(decimalPlaces)
										)
									);
									setAccuracy(Number(acc || 0));
									setTimestamp(Date.now());
									setError(null);
									setPermissionState("granted");
									setIsLoading(false);
									isRequestingRef.current = false;
								} else if (response.error) {
									setError(response.error);
									setIsLoading(false);
									isRequestingRef.current = false;
								}
							}
						} catch (e) {
							console.error(
								"[useGeolocation] Failed to parse Android response",
								e
							);
							setError("Failed to parse location data");
							setIsLoading(false);
							isRequestingRef.current = false;
						}
					}
				}
			);
			return unsubscribe;
		}
	}, [subscribe, TOPICS.ANDROID_RESPONSE, decimalPlaces]);

	// ---- 4. Error Handler ----
	const errorHandler = useCallback((err: GeolocationPositionError) => {
		if (err.code === 1) {
			setPermissionState("denied");
		}
		setError(err.message);
		setIsLoading(false);
		isRequestingRef.current = false;
	}, []);

	// ---- 5. Request Location (Logic Cleanup) ----
	const requestLocation = useCallback(() => {
		if (!navigator.geolocation) {
			setError("Geolocation not supported");
			setPermissionState("unsupported");
			return;
		}

		// Prevent duplicate requests while one is active
		if (isRequestingRef.current) return;

		isRequestingRef.current = true;
		setIsLoading(true);
		setError(null);

		// On Android WebView, use Native Location Service
		// This bypasses blocking WebView permissions logic
		if (isAndroidApp()) {
			console.log("[useGeolocation] Requesting Android Native Location");
			// Check permission first just in case, or directly request
			// GET_GEOLOCATION usually handles permission checks internally in the wrapper
			doAndroidAction(ANDROID_ACTION.GET_GEOLOCATION);
			// Also prompt to enable GPS if needed
			// doAndroidAction(ANDROID_ACTION.ENABLE_GPS_PROMPT);
			return;
		}

		// UPGRADE 3: Safer Timeout handling
		// Some older browsers trip on Infinity, though modern ones are fine.
		// Using undefined relies on browser default.
		const safeTimeout = timeout === Infinity ? undefined : timeout;

		const geoOptions: PositionOptions = {
			enableHighAccuracy: highAccuracy,
			maximumAge: maximumAge,
			timeout: safeTimeout,
		};

		if (watchPosition) {
			// Clean up any existing watch before starting a new one
			stopWatching();

			// UPGRADE 4: Removed aggressive Interval Logic
			// Native watchPosition is efficient. Restarting it every X seconds
			// kills battery and forces GPS re-acquisition.
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
		highAccuracy,
		maximumAge,
		timeout,
		watchPosition,
		successHandler,
		errorHandler,
		stopWatching,
		permissionState,
	]);

	/**
	 * Explicitly request native Android location permission.
	 * No-op on non-Android platforms.
	 */
	const requestAndroidPermission = useCallback(() => {
		if (isAndroidApp()) {
			doAndroidAction(
				ANDROID_ACTION.GRANT_PERMISSION,
				ANDROID_PERMISSION.LOCATION
			);
		}
	}, []);

	// ---- Auto Request Support ----
	useEffect(() => {
		if (autoRequest) {
			requestLocation();
		}
		return () => {
			stopWatching();
		};
	}, [autoRequest, requestLocation, stopWatching]);

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
		requestAndroidPermission,
	};
};

export default useGeolocation;
