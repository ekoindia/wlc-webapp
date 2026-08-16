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
	userId: "",
	access_token: "",
	userDetails: {},
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
			// `refresh_token` is deliberately NOT required: a session seeded from
			// a URL `?access_token=` has no refresh token, and requiring one here
			// used to drop the update (and, before the trailing `return state`
			// below, wipe the whole session).
			if (payload && payload.access_token) {
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

		// Both of these return a NEW state object: mutating the nested details in
		// place and returning the same reference does not re-render consumers.
		case "UPDATE_SHOP_DETAILS": {
			return {
				...state,
				shopDetails: { ...state?.shopDetails, ...payload },
			};
		}
		case "UPDATE_PERSONAL_DETAILS": {
			return {
				...state,
				personalDetails: { ...state?.personalDetails, ...payload },
			};
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

	// Any `break` above lands here. Without this the reducer returns `undefined`
	// and React replaces the whole session state with it — a silent logout.
	return state;
};
