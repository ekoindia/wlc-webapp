import { useRouter } from "next/router";
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
	// User/Session State (Logged-out by default)
	const [state, dispatch] = useReducer(UserReducer, defaultUserState);
	const router = useRouter();
	const [redirect, setRedirect] = useState("/admin/my-network");

	// Get default session from browser's sessionStorage
	useEffect(() => {
		const strSession = sessionStorage.getItem("ConnectSession");
		if (!strSession) {
			return;
		}

		let sessionState;
		try {
			sessionState = JSON.parse(strSession);
		} catch (e) {
			console.error(e);
			return;
		}

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
			console.log("User Context : ", state.loggedIn, redirect);
			router.push(redirect);
		}
	}, [state.loggedIn, redirect]);

	const login = (sessionData) => {
		console.log("Login : Executed");
		dispatch({
			type: "LOGIN",
			payload: {
				...sessionData,
			},
		});
	};
	const logout = () => dispatch({ type: "LOGOUT" });

	const contextValue = useMemo(() => {
		return {
			userData: state,
			redirect,
			setRedirect,
			login,
			logout,
		};
	}, [state]);

	// console.log(state);

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
