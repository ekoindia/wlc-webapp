import {
	clearAuthTokens,
	createUserState,
	getTokenExpiryTime,
	revokeSession,
	setandUpdateAuthTokens,
	setUserDetails,
} from "helpers/loginHelper";
import { buildUserObjectState } from "utils/userObjectBuilder";

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

export const UserReducer = (state, { type, payload, meta }) => {
	switch (type) {
		case "INIT_USER_STORE": {
			console.log("[UserReducer] initUserState", payload);
			return payload;
		}

		case "UPDATE_USER_STORE": {
			if (payload && payload.access_token && payload.refresh_token) {
				//delete payload["long_session"]; // FIX: Why remove long_session??? // Uncommented , require this variable for biometric login
				let tokenTimeout = getTokenExpiryTime(payload);
				const newState = buildUserObjectState({
					...payload,
					token_timeout: tokenTimeout || state?.token_timeout,
				});

				console.log("[UserReducer] newUserState", newState);
				setandUpdateAuthTokens(
					payload,
					meta?.isAndroid || false,
					false
				);
				setUserDetails(newState);

				sessionStorage.setItem("token_timeout", tokenTimeout);
				return newState;
			}
			break;
		}

		case "UPDATE_SHOP_DETAILS": {
			Object.assign(state?.shopDetails, payload);
			break;
		}
		case "UPDATE_PERSONAL_DETAILS": {
			Object.assign(state?.personalDetails, payload);
			break;
		}

		case "LOGIN": {
			if (
				!(
					(payload && payload.details && payload.access_token) // &&
					// payload.details.code &&
					// payload.details.mobile &&
					// payload.details.mobile.toString().length > 5
				)
			) {
				console.log("login Failed");
				return state;
			}

			const newState = {
				...state,
				...createUserState(payload),
			};
			console.log("[UserReducer] Login new state: ", newState);

			setandUpdateAuthTokens(payload, meta?.isAndroid || false, true);
			setUserDetails(newState);

			return newState;
		}

		case "LOGOUT": {
			revokeSession(state?.userId || 1);
			clearAuthTokens(meta?.isAndroid || false);
			return defaultUserState;
		}

		case "SET_ADMIN_AGENT_MODE": {
			return {
				...state,
				isAdminAgentMode: payload,
			};
		}

		default:
			throw new Error(`Unknown action type: ${type}`);
	}
};
