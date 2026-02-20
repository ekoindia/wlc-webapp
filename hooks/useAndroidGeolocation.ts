import { usePubSub } from "contexts";
import { useCallback, useEffect, useRef, useState } from "react";
import { ANDROID_ACTION, ANDROID_PERMISSION, doAndroidAction } from "utils";
import type {
	AndroidGeolocationResult,
	UseGeolocationOptions,
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
 * Android-specific geolocation hook.
 * Uses PubSub to communicate with the native Android wrapper.
 * All effects are gated by `enabled` — when false, the hook is a no-op.
 * @param options
 * @param enabled
 */
const useAndroidGeolocation = (
	options: UseGeolocationOptions = {},
	enabled: boolean = true
): AndroidGeolocationResult => {
	const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
	const { decimalPlaces, autoRequest } = mergedOptions;

	const [latitude, setLatitude] = useState<number | null>(null);
	const [longitude, setLongitude] = useState<number | null>(null);
	const [accuracy, setAccuracy] = useState<number | null>(null);
	const [timestamp, setTimestamp] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [permissionState, setPermissionState] =
		useState<AndroidGeolocationResult["permissionState"]>("prompt");
	const [isLoading, setIsLoading] = useState(false);

	const isRequestingRef = useRef(false);

	const { subscribe, TOPICS } = usePubSub() || {};

	// ---- Android Response Handler ----
	// Listens for permission checks, geolocation responses, and GPS status
	useEffect(() => {
		if (!enabled || !subscribe || !TOPICS.ANDROID_RESPONSE) return;

		const unsubscribe = subscribe(TOPICS.ANDROID_RESPONSE, (data: any) => {
			// ── Permission check response (after GRANT_PERMISSION) ──
			if (
				data?.action ===
				ANDROID_ACTION.ANDROID_PERMISSION_CHECK_RESPONSE
			) {
				const granted =
					String(data.data) === "0" ||
					data.data === true ||
					data.data === "true";

				console.log(
					"[useGeolocation:Android] Permission check response:",
					data.data,
					"granted:",
					granted
				);

				if (granted) {
					setPermissionState("granted");
					setError(null);
					// Permission just granted — automatically request location
					isRequestingRef.current = false;
					doAndroidAction(ANDROID_ACTION.GET_GEOLOCATION);
					setIsLoading(true);
				} else {
					setPermissionState("denied");
					setError("Location permission denied");
					setIsLoading(false);
					isRequestingRef.current = false;
				}
				return;
			}

			// ── Geolocation / GPS status response ──
			if (
				data?.action === ANDROID_ACTION.GEOLOCATION_RESPONSE ||
				data?.action === ANDROID_ACTION.GPS_STATUS_RESPONSE
			) {
				console.log(
					"[useGeolocation:Android] Location response:",
					data.data
				);

				try {
					let response = data.data;
					if (typeof response === "string") {
						response = JSON.parse(response);
					}

					if (response) {
						// Permission denied (code 1)
						if (response.code === 1) {
							console.log(
								"[useGeolocation:Android] Permission denied",
								response
							);
							setPermissionState("denied");
							setError(
								response.message ||
									response.error ||
									"Location permission denied"
							);
							setIsLoading(false);
							isRequestingRef.current = false;
							return;
						}

						const lat =
							response.latitude || response.lat || response.lati;
						const lng =
							response.longitude ||
							response.long ||
							response.longi;
						const acc = response.accuracy || response.acc;

						if (lat && lng) {
							setLatitude(
								parseFloat(Number(lat).toFixed(decimalPlaces))
							);
							setLongitude(
								parseFloat(Number(lng).toFixed(decimalPlaces))
							);
							setAccuracy(Number(acc || 0));
							setTimestamp(Date.now());
							setError(null);
							setPermissionState("granted");
							setIsLoading(false);
							isRequestingRef.current = false;
						} else if (response.error || response.message) {
							setError(response.error || response.message);
							setIsLoading(false);
							isRequestingRef.current = false;
						}
					}
				} catch (e) {
					console.error(
						"[useGeolocation:Android] Failed to parse response",
						e
					);
					setError("Failed to parse location data");
					setIsLoading(false);
					isRequestingRef.current = false;
				}
			}
		});

		return unsubscribe;
	}, [enabled, subscribe, TOPICS.ANDROID_RESPONSE, decimalPlaces]);

	// ---- Request Location ----
	const requestLocation = useCallback(() => {
		if (!enabled) return;
		if (isRequestingRef.current) return;

		isRequestingRef.current = true;
		setIsLoading(true);
		setError(null);

		console.log("[useGeolocation:Android] Requesting native location");
		doAndroidAction(ANDROID_ACTION.GET_GEOLOCATION);
	}, [enabled]);

	// ---- Request Android Permission ----
	const requestAndroidPermission = useCallback(() => {
		if (!enabled) return;

		setPermissionState("prompt");
		setError(null);
		doAndroidAction(
			ANDROID_ACTION.GRANT_PERMISSION,
			ANDROID_PERMISSION.LOCATION
		);
	}, [enabled]);

	// ---- Auto Request ----
	useEffect(() => {
		if (!enabled) return;

		if (autoRequest) {
			requestLocation();
		}
	}, [enabled, autoRequest, requestLocation]);

	return {
		latitude,
		longitude,
		accuracy,
		timestamp,
		error,
		permissionState,
		isLoading,
		requestLocation,
		requestAndroidPermission,
	};
};

export default useAndroidGeolocation;
