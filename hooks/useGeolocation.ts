import { useCallback } from "react";
import { isAndroidApp } from "utils";
import useAndroidGeolocation from "./useAndroidGeolocation";
import useWebGeolocation from "./useWebGeolocation";

// ---- Shared Types ----

export interface UseGeolocationOptions {
	highAccuracy?: boolean;
	maximumAge?: number;
	timeout?: number;
	watchPosition?: boolean;
	decimalPlaces?: number;
	maxWatchUpdates?: number;
	autoRequest?: boolean;
}

export type PermissionStateType =
	| "granted"
	| "prompt"
	| "denied"
	| "unsupported";

/** Common state returned by both platform hooks */
export interface GeolocationState {
	latitude: number | null;
	longitude: number | null;
	accuracy: number | null;
	timestamp: number | null;
	error: string | null;
	permissionState: PermissionStateType;
	isLoading: boolean;
	requestLocation: () => void;
}

/** Web-specific result — includes stopWatching (browser watchPosition) */
export interface WebGeolocationResult extends GeolocationState {
	stopWatching: () => void;
}

/** Android-specific result — includes requestAndroidPermission (native) */
export interface AndroidGeolocationResult extends GeolocationState {
	requestAndroidPermission: () => void;
}

/** Full result exposed to consumers — union of both platform methods */
export interface GeolocationResult extends GeolocationState {
	stopWatching: () => void;
	/** Request native Android location permission (no-op on web) */
	requestAndroidPermission: () => void;
}

// ---- No-op stubs ----
const noop = () => {};

// ---- Orchestrator ----

/**
 * Platform-aware geolocation hook.
 *
 * On Android, delegates to native location services via PubSub.
 * On web, uses the browser Permissions API + navigator.geolocation.
 *
 * Both paths return the same `GeolocationResult` interface so consumers
 * don't need to care about the platform. Platform-specific methods that
 * don't apply are provided as no-ops.
 * @param options
 */
const useGeolocation = (
	options: UseGeolocationOptions = {}
): GeolocationResult => {
	const isAndroid = isAndroidApp();

	// Both hooks always run (React rules of hooks), but only the active
	// platform's hook enables its effects via the `enabled` flag.
	const androidResult = useAndroidGeolocation(options, isAndroid);
	const webResult = useWebGeolocation(options, !isAndroid);

	const noopStable = useCallback(noop, []);

	if (isAndroid) {
		return {
			...androidResult,
			stopWatching: noopStable, // no browser watch on Android
		};
	}

	return {
		...webResult,
		requestAndroidPermission: noopStable, // no native permission on web
	};
};

export default useGeolocation;
