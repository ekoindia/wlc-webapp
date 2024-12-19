/**
 * @file Contains utility functions for the Android wrapper app.
 * The following functions are available:
 * - isAndroidApp: Checks if the web-app is running inside the Android wrapper app.
 * - doAndroidAction: Sends a message to the Android app.
 * - The functionality to "listen to Android Messages" is implemented in the Layout component.
 */

/**
 * Name of the Android interface as defined in the Android wrapper app.
 * This is available as a global variable in the web-app.
 * @type {string}
 */
const ANDROID_INTERFACE_NAME = "Android";

/**
 * Set of permissions that the user has to grant on the Android wrapper app.
 */
export const ANDROID_PERMISSION = {
	LOCATION: "LOCATION",
	CAMERA: "CAMERA",
	STORAGE: "STORAGE",
};

/**
 * Set of actions supported by the Android wrapper app.
 */
export const ANDROID_ACTION = {
	WEBAPP_READY: "connect_ready", // Webapp is ready to receive messages from the Android app

	NOT_SUPPORTED: "not_supported", // Action is not supported by the Android app

	SET_NATIVE_VERSION: "set_native_version", // Set the native version of the Android app SDK

	// Safetynet process
	// # Android to Webapp
	CACHED_REFRESH_TOKEN: "cached_refresh_token",
	ATTESTATION_TOKEN_RESP: "attestation_token_response",

	// # Webapp to Android
	SAVE_REFRESH_TOKEN: "save_refresh_token",
	CLEAR_REFRESH_TOKEN: "clear_refresh_token",
	GET_ATTESTATION_TOKEN: "get_attestation_token",

	// Login process
	CHECK_ACTIVE_LOGIN: "check_active_login",
	GOOGLE_LOGIN: "google_login",
	GOOGLE_LOGOUT: "google_logout",
	FACEBOOK_LOGIN: "fb_login",
	FACEBOOK_LOGOUT: "fb_logout",

	MOBILE_REQUEST_HINT: "mobile_request_hint",
	MOBILE_HINT_RESPONSE: "mobile_hint_response",

	OTP_FETCH_REQUEST: "otp_fetch_request",
	OTP_FETCH_RESPONSE: "otp_fetch_response",

	DISCOVER_RDSERVICE: "discover_rdservice",
	RDSERVICE_DISCOVERY_FAILED: "rdservice_discovery_failed",
	RDSERVICE_INFO: "rdservice_info",
	CAPTURE_RDSERVICE: "capture_rdservice",
	RDSERVICE_RESP: "rdservice_resp",

	FCM_PUSH_REGISTER_TOKEN: "fcm_push_token",
	FCM_PUSH_MSG: "fcm_push_msg",

	// DIGIO_ESIGN_OPEN: "digio_esign_open",
	// DIGIO_ESIGN_RESPONSE: "digio_esign_response",

	LEEGALITY_ESIGN_OPEN: "leegality_esign_open",
	LEEGALITY_ESIGN_RESPONSE: "leegality_esign_response",
	RAZORPAY_OPEN: "razorpay_open",
	RAZORPAY_RESPONSE: "razorpay_response",

	SAVE_FILE_BLOB: "save_file_blob",

	PRINT_PAGE: "print_page",

	CHECK_ANDROID_PERMISSION: "check_android_permission",
	GRANT_PERMISSION: "grant_permission", // Prompt/ask user to grant permission
	ANDROID_PERMISSION_CHECK_RESPONSE: "android_permission_check_response",
	OPEN_APP_SYSTEM_SETTINGS: "open_app_sys_settings",
	ENABLE_GPS_PROMPT: "enable_gps_prompt",
	GPS_STATUS_RESPONSE: "gps_status_response",
	GET_GEOLOCATION: "get_geolocation",
	GEOLOCATION_RESPONSE: "geolocation_response",

	UPI_PAYMENT_OPEN: "open_upi_payment",
	UPI_PAYMENT_RESPONSE: "upi_payment_response",

	// Track analytics events coming from Android app
	TRACK_EVENT: "track_event",
	// TRACK_TIME: "track_time",
	// TRACK_ERROR: "track_error",

	// Custom action URL for Connect (eg: ekoconnect://action/parameters)
	OPEN_CONNECT_URL: "open_connect_url",

	SHARE: "share",
};

/**
 * Checks if the web-app is running inside the Android wrapper app.
 * @returns {boolean} - True if the web-app is running inside the Android wrapper app, false otherwise.
 */
export const isAndroidApp = () => {
	return window[ANDROID_INTERFACE_NAME] !== undefined;
};

/**
 * Sends a message to the Android app.
 * @param {string} action - Action to be performed by the Android app.
 * @param {any} data - Data to be sent to the Android app.
 * @returns {boolean} - True if the message was sent successfully, false otherwise.
 */
export const doAndroidAction = (action: string, data?: any): boolean => {
	if (
		isAndroidApp() &&
		ANDROID_INTERFACE_NAME in window &&
		typeof window[ANDROID_INTERFACE_NAME].doAction === "function"
	) {
		let data_str = data;

		if (typeof data === "object") {
			try {
				data_str = JSON.stringify(data);
			} catch (e) {
				console.error(
					"[doAndroidAction] Error while stringifying data:",
					e
				);
				return false; // Return false if stringifying fails
			}
		}

		try {
			window[ANDROID_INTERFACE_NAME].doAction(action, data_str);
			return true; // Return true if action is successfully sent
		} catch (e) {
			console.error(
				`[doAndroidAction] Error while invoking Android action "${action}":`,
				e
			);
			return false; // Return false if doAction throws an error
		}
	}
	return false; // Return false if not running inside Android app
};
