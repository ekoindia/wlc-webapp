import { Endpoints } from "constants/EndPoints";
import { fetcher } from "./apiHelper";

function sendOtpRequest(org_id, number, toast, sendState) {
	const PostData = {
		platfom: "web",
		mobile: number,
		// client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
		app: "Connect",
		org_id: org_id,
	};

	fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.SENDOTP, {
		body: PostData,
		timeout: 30000,
	})
		.then((data) => {
			// Show otp hint in the toast only in development environments
			if (process.env.NEXT_PUBLIC_ENV !== "production") {
				toast({
					title: `${
						sendState === "resend" ? "Resent" : "Sent"
					} Otp Successfully: ${data.data.otp}`,
					status: "success",
					duration: 3000,
					position: "top-right",
				});
			}
		})
		.catch(
			() =>
				toast({
					title: `${
						sendState === "resend" ? "Resend" : "Send"
					} Otp failed. Please try again.`,
					status: "error",
					duration: 2000,
				}) // TODO: Go back to submit mobile screen
		);
}

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

/*
 * createUserState(data) is used to create userState.
 */
function createUserState(data) {
	let tokenTimeout = getTokenExpiryTime(data);
	console.log("tokenTimeout", tokenTimeout);
	const state = {
		loggedIn: true,
		is_org_admin: data?.details?.is_org_admin || 0,
		access_token: data.access_token,
		refresh_token: data.refresh_token,
		token_timeout: tokenTimeout,
		userId: data?.details?.mobile,
		uid: data.details?.uid,
		userDetails: {
			...data.details,
		},
		personalDetails: data?.personal_details,
		shopDetails: data?.shop_details,
		accountDetails: data?.account_details,
	};

	return state;
}

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
	} catch (err) {
		console.warn("Updating to session-storage failed: ", err);
	}
}

function setandUpdateAuthTokens(data) {
	try {
		sessionStorage.setItem("access_token", data?.access_token);
		sessionStorage.setItem("refresh_token", data?.refresh_token);
		sessionStorage.setItem("access_token_lite", data?.access_token_lite);
		sessionStorage.setItem("access_token_crm", data?.access_token_crm);
	} catch (err) {
		console.warn("Updating to session-storage failed: ", err);
	}
}

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
function clearAuthTokens() {
	for (var i = 0; i < sessionStorage.length; i++) {
		var key = sessionStorage.key(i);
		if (key !== "org_detail") {
			sessionStorage.removeItem(key);
		}
	}
	// sessionStorage.clear();
}

/**
 * Revoke server-side refresh-token for this session. Used during logout.
 * @param {*} user_id	The User-ID of the user
 */
function revokeSession(user_id) {
	if (user_id === 1) {
		console.log("REFRESH TOKEN ALREADY REVOKED");
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
		.catch((err) => console.log("REFRESH TOKEN REVOKE ERROR: ", err));
}

function generateNewAccessToken(
	refresh_token,
	updateUserInfo,
	isTokenUpdating,
	setIsTokenUpdating,
	logout
) {
	console.log("refresh_token", refresh_token);

	if (!(refresh_token && refresh_token.length > 1)) {
		console.warn("Please provide valid refresh token.");
		return;
	}

	if (isTokenUpdating) {
		console.warn("Already refreshing token.");
		return;
	}

	setIsTokenUpdating(true);

	fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.GENERATE_TOKEN, {
		body: {
			refresh_token: refresh_token,
		},
		timeout: 60000,
	})
		.then((data) => {
			updateUserInfo(data);
		})
		.catch((err) => {
			console.error("Error refreshing token: ", err);
			logout && logout();
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
