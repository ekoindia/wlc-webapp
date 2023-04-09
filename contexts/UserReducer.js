import {
	clearAuthTokens,
	createUserState,
	getTokenExpiryTime,
	revokeSession,
	setandUpdateAuthTokens,
	setUserDetails,
} from "helpers/loginHelper";

export const defaultUserState = {
	loggedIn: false,
	role: "public",
	userId: "",
	access_token: "",
	userDetails: {},
	profileDetails: {},
	shopDetails: {},
	accountDetails: {},
};

export const UserReducer = (state, { type, payload }) => {
	switch (type) {
		case "INIT_USER_STORE": {
			return payload;
		}

		case "UPDATE_USER_STORE": {
			if (payload && payload.access_token && payload.refresh_token) {
				console.log("Updated userStore");
				delete payload["long_session"]; // FIX: Why remove long_session???
				let tokenTimeout = getTokenExpiryTime(payload);
				const newState = {
					...state,
					...payload,
					token_timeout: tokenTimeout || state.token_timeout, // Persist the old token_timeout if the new one is not available
				};
				console.log("newUserState", newState);
				setandUpdateAuthTokens(payload);
				sessionStorage.setItem("token_timeout", tokenTimeout);
				return newState;
			}
			break;
		}

		case "LOGIN": {
			if (
				!(
					payload &&
					payload.details &&
					payload.access_token &&
					payload.details.mobile
				)
			) {
				console.log("login Failed");
				return state;
			}

			const newState = {
				...state,
				...createUserState(payload),
			};
			console.log("newState", newState);
			// const newState = {
			// 	...state,
			// 	loggedIn: true,
			// 	access_token: payload.access_token,
			// 	refresh_token: payload.refresh_token,
			// 	userId: payload.details.mobile,
			// 	uid: payload.details?.uid,
			// 	userDetails: {
			// 		...payload.details
			// 	},
			// 	personalDetails: payload?.personal_details,
			// 	shopDetails: payload?.shop_details,
			// 	accountDetails: payload?.account_details,
			// }

			setandUpdateAuthTokens(payload);
			setUserDetails(newState);

			return newState;
		}

		case "LOGOUT": {
			revokeSession(state.userId || 1);
			clearAuthTokens();
			return defaultUserState;
		}

		default:
			throw new Error(`Unknown action type: ${type}`);
	}
};
