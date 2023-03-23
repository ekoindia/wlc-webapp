import { createUserState, getSessions } from "helpers/loginHelper";
import Router from "next/router";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from "react";
import { defaultUserState, UserReducer } from "./UserReducer";

const UserContext = createContext();

const UserProvider = ({ children }) => {
	const [state, dispatch] = useReducer(UserReducer, defaultUserState);
	const [isTokenUpdating, setIsTokenUpdating] = useState(false);
	const [loading, setLoading] = useState(true);
	console.log("%cExecuted UserContext: Start ", "color:blue");

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
			console.log("Not logged");
			setLoading(() => {
				console.log("Setting loading state");
				return false;
			});
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
			// setLoading(false);
		}
	}, []);

	// useEffect(() => {
	// 	console.log("User Context : UseEffect", {
	// 		logged: state.loggedIn,
	// 		path: Router.asPath,
	// 	});

	// 	if (state.loggedIn) {
	// 		// setLoading(false)
	// 		console.log("User Context : ", state.loggedIn, Router.asPath);

	// 		if (Router.pathname === '/404') return true
	// 		else if (Router.pathname.includes("/admin")) Router.push(Router.asPath);
	// 		else Router.replace("/admin/my-network");

	// 		// the above condition is for when user refrehes the poge
	// 		// if (!Router.pathname.includes(roleRoutes[state.role])) {
	// 		// 	console.log("Redirect");
	// 		// 	Router.replace(roleInitialRoute[state.role]);
	// 		// }
	// 	}
	// }, [state.loggedIn]);

	const updateUserInfo = (data) => {
		dispatch({
			type: "UPDATE_USER_STORE",
			payload: { ...data },
		});
	};
	const login = (sessionData) => {
		dispatch({
			type: "LOGIN",
			payload: { ...sessionData },
		});
	};

	const logout = () => {
		dispatch({ type: "LOGOUT" });
	};

	const contextValue = useMemo(() => {
		return {
			userData: state,
			login,
			logout,
			loading,
			setLoading,
			updateUserInfo,
			setIsTokenUpdating,
			isTokenUpdating,
		};
	}, [state, loading]);
	console.log("%cExecuted : UserContext: End", "color:blue");
	// if (loading)
	// 	return "loading..."

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
