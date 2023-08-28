import { Endpoints } from "constants/EndPoints";
import { ANDROID_ACTION, buildUserObjectState, doAndroidAction } from "utils";
import { fetcher } from "./apiHelper";

/**
 * Verify OTP and get user details to login the user.
 * @param {number} org_id	Organization ID
 * @param {number} number	User's mobile number
 * @param {function} toast		Function to show toast messages
 * @param {string} sendState	"send" or "resend" for showing proper toast message
 * @param {boolean} isAndroid	Is the user using the Android wrapper app?
 * @returns {boolean} Is SEND-OTP request successful?
 */
async function sendOtpRequest(
	org_id,
	number,
	toast,
	sendState = "send",
	isAndroid = false
) {
	let success = false;
	let errMsg = "";
	let _otp = ""; // Only for UAT

	if (isAndroid) {
		doAndroidAction(ANDROID_ACTION.OTP_FETCH_REQUEST);
	}

	const PostData = {
		platform: isAndroid ? "android" : "web",
		mobile: number,
		// client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
		app: "Eloka",
		org_id: org_id,
	};

	try {
		const data = await fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.SENDOTP,
			{
				body: PostData,
				timeout: 30000,
			}
		);
		if (data?.status == 0) {
			success = true;
			_otp = data?.data?.otp; // Only for UAT
		} else {
			errMsg = data?.message || data?.invalid_params?.csp_id;
		}
	} catch (err) {
		success = false;
		console.error("[ERROR] sendOtpRequest: ", err);
	}

	if (success) {
		// Success toast on UAT only
		if (process.env.NEXT_PUBLIC_ENV !== "production" && toast) {
			toast({
				title: `Demo OTP Sent: ${_otp}`,
				status: "success",
				duration: 5000,
				position: "top-right",
			});
		}
	} else {
		// Failure toast
		toast &&
			toast({
				title:
					`Failed to ${
						sendState === "resend" ? "resend" : "send"
					} OTP. ` + (errMsg ? errMsg : "Please try again."),
				status: "error",
				duration: 6000,
			});
	}

	return success;
}

// TODO: Use proper Input component that returns only unformatted input and make this redundent
function RemoveFormatted(number) {
	return number.replace(/\D/g, "");
}

/**
 * Calculates the expiry time of the token which is 75% of the actual token lifetime.
 * @param {object} data The response data from the login API
 * @param {number} data.token_timeout Already calculated expiry time of the token in milliseconds
 * @param {number} data.token_expiration The token lifetime in seconds
 * @returns {number} The expiry time of the token in milliseconds
 */
function getTokenExpiryTime(data) {
	// console.log("getTokenExpiryTime: data=", data);
	if (!data) return 0;
	if (data.token_timeout) return data.token_timeout;
	if (data.token_expiration) {
		const token_lifetime_75percent = data.token_expiration * 0.75;
		return Date.now() + token_lifetime_75percent * 1000;
	}
	return 0;
}

/**
 * Create userState
 */
function createUserState(data) {
	let token_timeout = getTokenExpiryTime(data);
	const state = buildUserObjectState({
		...data,
		token_timeout: token_timeout,
	});
	return state;
}

/**
 * Set user details in the session storage after a successful login.
 * @param {object} data
 * @param {object} data.userDetails	User details
 * @param {object} data.personalDetails	Personal details
 * @param {object} data.shopDetails	Shop details
 * @param {object} data.accountDetails	Account details
 * @param {number} data.token_timeout	Expiry time of the token in milliseconds
 */
function setUserDetails(data) {
	try {
		sessionStorage.setItem("token_timeout", data.token_timeout);
		sessionStorage.setItem(
			"user_details",
			JSON.stringify(data.userDetails)
		);
		sessionStorage.setItem(
			"personal_details",
			JSON.stringify(data.personalDetails)
		);
		sessionStorage.setItem(
			"shop_details",
			JSON.stringify(data.shopDetails)
		);
		sessionStorage.setItem(
			"account_details",
			JSON.stringify(data.accountDetails)
		);

		// Cache the original login-type (Google / Mobile) and user details in LocalStorage after a sucessful login
		if (
			data?.userDetails?.mobile &&
			data.userDetails.mobile.toString().length > 8
		) {
			const user_login_type = sessionStorage.getItem("login_type") || "";
			const lastLogin = {
				type: user_login_type,
				name: data.userDetails.name,
				mobile: data.userDetails.mobile,
			};
			localStorage.setItem("inf-last-login", JSON.stringify(lastLogin));
		}
	} catch (err) {
		console.warn("Updating to session-storage failed: ", err);
	}
}

/**
 * Set the auth tokens in the session storage.
 * If running under Android wrapper app, send details to the app for caching.
 * @param {object} data	The object with auth tokens
 * @param {string} data.access_token	The full access token used to get transactions for the user based on assigned roles
 * @param {string} data.refresh_token	The refresh token
 * @param {string} data.access_token_lite	The light-weight access token for authenticating regular transactions
 * @param {string} data.access_token_crm	The access token for the CRM API
 * @param {boolean} isAndroid	Is the user using the Android wrapper app?
 * @param {boolean} isNewLogin	Is this a new login?
 */
function setandUpdateAuthTokens(data, isAndroid, isNewLogin = false) {
	try {
		sessionStorage.setItem("access_token", data?.access_token);
		sessionStorage.setItem("refresh_token", data?.refresh_token);
		sessionStorage.setItem("access_token_lite", data?.access_token_lite);
		sessionStorage.setItem("access_token_crm", data?.access_token_crm);
	} catch (err) {
		console.warn("Updating to session-storage failed: ", err);
	}

	if (isAndroid) {
		doAndroidAction(
			ANDROID_ACTION.SAVE_REFRESH_TOKEN,
			JSON.stringify({
				refresh_token: data?.refresh_token,
				long_session: data?.long_session,
				new_login: isNewLogin,
			})
		);
	}
}

/**
 * Get the auth tokens from the session storage.
 * @returns {object} The auth tokens
 */
function getAuthTokens() {
	const tokenData = {
		access_token: sessionStorage.getItem("access_token"),
		refresh_token: sessionStorage.getItem("refresh_token"),
		access_token_lite: sessionStorage.getItem("access_token_lite"),
		access_token_crm: sessionStorage.getItem("access_token_crm"),
	};

	return tokenData;
}

function ParseJson(data) {
	return data !== "undefined" ? JSON.parse(data) : "";
}

/**
 * Get stored session from sessionStorage
 * @returns {object} The stored session data (user details, auth tokens, etc.)
 */
function getSessions() {
	const userData = {
		...getAuthTokens(),
		token_timeout: sessionStorage.getItem("token_timeout"),
		details: ParseJson(sessionStorage.getItem("user_details")),
		account_details: ParseJson(sessionStorage.getItem("account_details")),
		personal_details: ParseJson(sessionStorage.getItem("personal_details")),
		shop_details: ParseJson(sessionStorage.getItem("shop_details")),
	};
	return userData;
}

/**
 * Clears all the auth tokens from the session storage.
 */
function clearAuthTokens(isAndroid) {
	for (var i = 0; i < sessionStorage.length; i++) {
		var key = sessionStorage.key(i);
		if (key !== "org_detail") {
			sessionStorage.removeItem(key);
		}
	}

	if (isAndroid) {
		doAndroidAction(ANDROID_ACTION.CLEAR_REFRESH_TOKEN);
	}
	// sessionStorage.clear();
}

/**
 * Revoke server-side refresh-token for this session. Used during logout.
 * @param {*} user_id	The User-ID of the user
 */
function revokeSession(user_id) {
	if (user_id === 1) {
		console.log("Refresh token already revoked");
		return;
	}

	const refresh_token = sessionStorage.getItem("refresh_token");
	fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.LOGOUT, {
		body: {
			user_id: user_id,
			refresh_token: refresh_token,
		},
		timeout: 5000,
	})
		// .then((data) => console.log("REFRESH TOKEN REVOKED: ", data))
		.catch((err) => console.log("Refresh Token Revoke Error: ", err));
}

/**
 * Generate a new access token using the refresh token.
 * @param {string} refresh_token	The refresh token
 * @param {function} updateUserInfo	Function to update the userState
 * @param {boolean} isTokenUpdating	Is the token already being updated?
 * @param {function} setIsTokenUpdating	Function to set the token update status
 * @param {function} logout	Function to logout the user
 * @returns
 */
function generateNewAccessToken(
	refresh_token,
	updateUserInfo,
	isTokenUpdating,
	setIsTokenUpdating,
	logout
) {
	console.log("[generateNewAccessToken] refresh_token:", refresh_token);

	if (!(refresh_token && refresh_token.length > 1)) {
		console.warn("[generateNewAccessToken] Invalid refresh token.");
		return false;
	}

	if (isTokenUpdating) {
		console.warn("[generateNewAccessToken] Already refreshing token.");
		return false;
	}

	setIsTokenUpdating(true);

	fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.GENERATE_TOKEN, {
		body: {
			refresh_token: refresh_token,
		},
		timeout: 60000,
	})
		.then((data) => {
			console.log(
				"[generateNewAccessToken] token generated. Updating user info:",
				data
			);
			updateUserInfo(data);
			return true;
		})
		.catch((err) => {
			console.error(
				"[generateNewAccessToken] Error refreshing token: ",
				err
			);
			logout && logout();
			return false;
		})
		.finally(setIsTokenUpdating(false));
}

export {
	sendOtpRequest,
	RemoveFormatted,
	setandUpdateAuthTokens,
	getAuthTokens,
	clearAuthTokens,
	revokeSession,
	generateNewAccessToken,
	getSessions,
	createUserState,
	setUserDetails,
	getTokenExpiryTime,
};
