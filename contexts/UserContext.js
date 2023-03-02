import {
	createUserState,
	getAuthTokens,
	getSessions,
} from "helpers/loginHelper";
import { useRouter } from "next/router";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useReducer,
} from "react";
import { defaultUserState, UserReducer } from "./UserReducer";

const UserContext = createContext();

const UserProvider = ({ children }) => {
	const [state, dispatch] = useReducer(UserReducer, defaultUserState);
	const router = useRouter();

	// Get default session from browser's sessionStorage
	useEffect(() => {
		const Session = getSessions();
		console.log("Executed UserContext: Session", Session);
		if (
			!(
				Session &&
				Session.details &&
				Session.access_token &&
				Session.details.mobile
			)
		) {
			return;
		}

		let sessionState = createUserState(Session);
		console.log("sessionState", sessionState);

		if (sessionState) {
			// Load UserState from sessionStorage
			dispatch({
				type: "INIT_USER_STORE",
				payload: sessionState,
			});
		}
	}, []);

	useEffect(() => {
		if (state.loggedIn) {
			console.log("User Context : ", state.loggedIn);

			if (router.pathname.includes("/admin"))
				router.push(router.pathname);
			else router.replace("/admin/my-network");
		}
	}, [state.loggedIn]);

	const login = (sessionData) => {
		dispatch({
			type: "LOGIN",
			payload: { ...sessionData },
		});
	};

	const logout = () => {
		dispatch({ type: "LOGOUT", payload: state });
	};

	const contextValue = useMemo(() => {
		return {
			userData: state,
			login,
			logout,
		};
	}, [state]);

	return (
		<UserContext.Provider value={contextValue}>
			{children}
		</UserContext.Provider>
	);
};

const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a <UserProvider>");
	}
	return context;
};

export { UserProvider, useUser };
