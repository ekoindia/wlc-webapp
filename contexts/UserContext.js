import { createUserState, getSessions } from "helpers/loginHelper";
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from "react";
import { defaultUserState, UserReducer } from "./UserReducer";

const UserContext = createContext();
const SessionContext = createContext();

const UserProvider = ({ userMockData, children }) => {
	const [state, dispatch] = useReducer(UserReducer, defaultUserState);
	const [isTokenUpdating, setIsTokenUpdating] = useState(false);
	const [loading, setLoading] = useState(true);

	// Get default session from browser's sessionStorage
	useEffect(() => {
		// Mock user data for testing
		if (userMockData && userMockData.access_token) {
			dispatch({
				type: "INIT_USER_STORE",
				payload: userMockData,
			});
			return;
		}

		// Get the session data (user-data, tokens) from sessionStorage
		const Session = getSessions();
		if (
			!(
				Session &&
				Session.details &&
				Session.access_token &&
				Session.details.mobile
			)
		) {
			console.log("Not logged");
			setLoading(false);
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

	// useEffect(() => {
	// 	console.log("User Context : UseEffect", {
	// 		logged: state?.loggedIn,
	// 		path: Router.asPath,
	// 	});

	// 	if (state?.loggedIn) {
	// 		// setLoading(false)
	// 		console.log("User Context : ", state?.loggedIn, Router.asPath);

	// 		if (Router.pathname === '/404') return true
	// 		else if (Router.pathname.includes("/admin")) Router.push(Router.asPath);
	// 		else Router.replace("/admin/my-network");

	// 		// the above condition is for when user refrehes the poge
	// 		// if (!Router.pathname.includes(roleRoutes[state?.role])) {
	// 		// 	console.log("Redirect");
	// 		// 	Router.replace(roleInitialRoute[state?.role]);
	// 		// }
	// 	}
	// }, [state?.loggedIn]);

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

	const updateShopDetails = (data) => {
		dispatch({
			type: "UPDATE_SHOP_DETAILS",
			payload: { ...data },
		});
	};
	const updatePersonalDetail = (data) => {
		dispatch({
			type: "UPDATE_PERSONAL_DETAILS",
			payload: { ...data },
		});
	};

	const isLoggedIn =
		state?.loggedIn && state?.access_token && state?.userId > 1;

	const userContextValue = useMemo(() => {
		return {
			isLoggedIn: isLoggedIn,
			isAdmin: state?.is_org_admin ? true : false,
			userId: state?.userId || 0,
			userType: state?.user_type || 0,
			accessToken: state?.access_token || "",
			userData: state || {},
			login,
			logout,
			loading,
			setLoading,
			updateUserInfo,
			isTokenUpdating,
			setIsTokenUpdating,
			updateShopDetails,
			updatePersonalDetail,
		};
	}, [state, isLoggedIn, loading, isTokenUpdating]);

	const sessionContextValue = useMemo(() => {
		return {
			isLoggedIn: isLoggedIn,
			isAdmin: state?.is_org_admin ? true : false,
			userId: state?.userId || 0,
			userType: state?.user_type || 0,
			accessToken: state?.access_token || "",
			isOnboarding: state?.onboarding == 1 ? true : false,
			loading,
			setLoading,
		};
	}, [
		isLoggedIn,
		state?.is_org_admin,
		state?.userId,
		state?.user_type,
		state?.access_token,
		loading,
	]);

	return (
		<UserContext.Provider value={userContextValue}>
			<SessionContext.Provider value={sessionContextValue}>
				{children}
			</SessionContext.Provider>
		</UserContext.Provider>
	);
};

/**
 * Get user profile details.
 * @returns {Object} An object with the following properties:
 * @property {boolean} isLoggedIn - If true, user is logged in
 * @property {boolean} isAdmin - If true, user is an admin
 * @property {number} userId - User ID
 * @property {string} userType - User type
 * @property {string} accessToken - Access token
 * @property {Object} userData - Detailed user profile data object
 * @property {function} login - Login function
 * @property {function} logout - Logout function
 * @property {boolean} loading - If true, user data is being loaded
 * @property {function} setLoading - Set loading state (used by RouteProtector)
 * @property {function} updateUserInfo - Update user info
 * @property {boolean} isTokenUpdating - If true, token is being updated
 * @property {function} setIsTokenUpdating - Set token updating state
 * @property {function} updateShopDetails - Update shop details
 * @property {function} updatePersonalDetail - Update personal details
 * @example
 * const { userData, loading } = useUser();
 */
const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a <UserProvider>");
	}
	return context;
};

/**
 * Get user session details.
 * @returns {Object} An object with the following properties:
 * @property {boolean} isLoggedIn - If true, user is logged in
 * @property {boolean} isAdmin - If true, user is an admin
 * @property {number} userId - User ID
 * @property {string} userType - User type
 * @property {string} accessToken - Access token
 * @property {boolean} loading - If true, user data is being loaded
 * @property {function} setLoading - Set loading state (used by RouteProtector)
 * @example
 * const { isLoggedIn, isAdmin, userId } = useSession();
 */
const useSession = () => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession must be used within a <UserProvider>");
	}
	return context;
};

export { UserProvider, useSession, useUser };
