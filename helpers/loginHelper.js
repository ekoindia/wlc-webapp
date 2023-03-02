import { Endpoints } from "constants/EndPoints";

function sendOtpRequest(number, toast, sendState) {
	const PostData = {
		platfom: "web",
		mobile: number,
		client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
		app: "Connect",
	};

	fetch(process.env.NEXT_PUBLIC_API_AUTHENTICATION_URL + Endpoints.SENDOTP, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(PostData),
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				const err = new Error("Response not Ok");
				err.response = response;
				throw err;
			}
		})
		.then((data) => {
			if (sendState === "resend")
				toast({
					title: "Resend Otp Successfully",
					status: "success",
					duration: 2000,
					isClosable: true,
					position: "top-right",
				});
			else
				toast({
					title: "Send Otp Successfully",
					status: "success",
					duration: 2000,
					isClosable: true,
					position: "top-right",
				});
		})
		.catch((e) =>
			toast({
				title: "Something went wrong",
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

/*
 * createUserState(data) is used to create userState.
 *
 */

function createUserState(data) {
	const state = {
		loggedIn: true,
		role: "admin",
		access_token: data.access_token,
		refresh_token: data.refresh_token,
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
	fetch(process.env.NEXT_PUBLIC_API_AUTHENTICATION_URL + Endpoints.LOGOUT, {
		method: "post",
		body: {
			user_id: user_id,
			refresh_token: refresh_token,
		},
	}).then(function (res) {
		console.log("REFRESH TOKEN REVOKED", res);
	});
}

function getAccessTokenUsingRefreshToken() {}

export {
	sendOtpRequest,
	RemoveFormatted,
	setandUpdateAuthTokens,
	getAuthTokens,
	clearAuthTokens,
	revokeSession,
	getAccessTokenUsingRefreshToken,
	getSessions,
	createUserState,
};
