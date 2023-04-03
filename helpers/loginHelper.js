import { Endpoints } from "constants/EndPoints";
import jwt from "jsonwebtoken";

function sendOtpRequest(number, toast, sendState) {
	const PostData = {
		platfom: "web",
		mobile: number,
		client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
		app: "Connect",
	};

	fetch(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.SENDOTP, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(PostData),
	})
		.then((response) => {
			console.log("response", response);
			if (response.ok) {
				return response.json();
			} else {
				const err = new Error("Response not Ok");
				err.response = response;
				throw err;
			}
		})
		.then((data) => {
			toast({
				title: `${
					sendState === "resend" ? "Resend" : "Send"
				} Otp Successfully: ${data.data.otp}`,
				status: "success",
				duration: 2000,
				isClosable: true,
				position: "top-right",
			});
		})
		.catch((e) =>
			toast({
				title: `${
					sendState === "resend" ? "Resend" : "Send"
				} Otp failed`,
				status: "error",
				duration: 2000,
				isClosable: true,
				position: "top-right",
			})
		);
}

function RemoveFormatted(number) {
	return number.replace(/\D/g, "");
}

function getTokenExpiryTime(data) {
	console.log("data", data);
	let tokenTimeout = data?.token_timeout;
	if (!data.token_timeout) {
		const decoded = jwt.decode(data.access_token);
		const token_lifetime = (data.token_expiration * 75) / 100; // 25% of token_Expiration
		const tokenExpiryInMS = (decoded.iat + token_lifetime) * 1000;
		tokenTimeout = new Date(tokenExpiryInMS).toLocaleString();
	}
	return tokenTimeout;
}

/*
 * createUserState(data) is used to create userState.
 */
function createUserState(data) {
	let tokenTimeout = getTokenExpiryTime(data);
	console.log("tokenTimeout", tokenTimeout);
	const state = {
		loggedIn: true,
		role: "non-admin",
		isAdmin: 0,
		// role: data.is_org_admin ? "admin" : "non-admin",
		// is_org_admin: data.is_org_admin === 1  ? true : false,		// 0 or 1
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

function clearAuthTokens() {
	sessionStorage.removeItem("access_token");
	sessionStorage.removeItem("refresh_token");
	sessionStorage.removeItem("access_token_lite");
	sessionStorage.removeItem("access_token_crm");
	sessionStorage.clear();
}

function revokeSession(user_id) {
	const refresh_token = sessionStorage.getItem("refresh_token");
	if (user_id === 1) {
		console.log("REFRESH TOKEN REVOKED", res);
		return;
	}
	fetch(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.LOGOUT, {
		method: "post",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({
			user_id: user_id,
			refresh_token: refresh_token,
		}),
	}).then(function (res) {
		console.log("REFRESH TOKEN REVOKED", res);
	});
}

function generateNewAccessToken(
	refresh_token,
	logout,
	updateUserInfo,
	setIsTokenUpdating
) {
	console.log("refresh_token", refresh_token);
	if (!(refresh_token && refresh_token.length > 1)) {
		console.log("Please provide valid refresh token.");
		return;
	}

	fetch(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.GENERATE_TOKEN, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({
			refresh_token: refresh_token,
		}),
	})
		.then((response) => {
			console.log("response", response);
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Failed");
			}
		})
		.then((data) => {
			updateUserInfo(data);
		})
		.catch((err) => {
			console.log("err", err);
			console.log("logout");
			// logout();
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
