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
				console.log("login nahi hua");
				return state;
			}

			const newState = {
				...state,
				loggedIn: true,
				role: "producer", // TODO: Deduce user role (developer/producer)
				userId: payload.userId,
				sessionKey: payload.sessionKey,
				userDetails: payload.userDetails,
				profileDetails: payload.profileDetails || {},
			};

			sessionStorage.setItem("ConnectSession", JSON.stringify(newState));
			return newState;
		}

		case "LOGOUT": {
			sessionStorage.setItem(
				"ConnectSession",
				JSON.stringify(defaultUserState)
			);
			return defaultUserState;
		}

		default:
			throw new Error(`Unknown action type: ${type}`);
	}
};
