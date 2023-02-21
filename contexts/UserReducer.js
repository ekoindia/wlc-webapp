export const defaultUserState = {
	loggedIn: false,
	role: "public",
	userId: "",
	sessionKey: "",
	userDetails: {},
	profileDetails: {},
};

export const UserReducer = (state, { type, payload }) => {
	// console.log("🙋🏻‍♀️ USER-ACTION::: ", type, payload);
	// console.trace();

	switch (type) {
		case "INIT_USER_STORE": {
			return payload;
		}

		case "LOGIN": {
			if (
				!(
					payload &&
					payload.userId &&
					payload.sessionKey &&
					payload.userDetails
				)
			) {
				console.log("login Failed");
				return state;
			}

			const newState = {
				...state,
				loggedIn: true,
				userId: payload.userId,
				sessionKey: payload.sessionKey,
				userDetails: payload.userDetails,
				profileDetails: payload.profileDetails || {},
			};
			console.log("newState", newState);
			sessionStorage.setItem("ConnectSession", JSON.stringify(newState));
			// sessionStorage.setItem("access_token", JSON.stringify(newState));
			// sessionStorage.setItem("refresh_token", JSON.stringify(newState));
			// sessionStorage.setItem("access_token_lite", JSON.stringify(newState));
			// sessionStorage.setItem("access_token_crm", JSON.stringify(newState));
			// sessionStorage.setItem("user_details", JSON.stringify(newState));
			// sessionStorage.setItem("account_details", JSON.stringify(newState));
			// sessionStorage.setItem("personal_details", JSON.stringify(newState));
			// sessionStorage.setItem("shop_details", JSON.stringify(newState));
			return newState;
		}

		case "LOGOUT": {
			sessionStorage.removeItem("ConnectSession");
			return defaultUserState;
		}

		default:
			throw new Error(`Unknown action type: ${type}`);
	}
};
