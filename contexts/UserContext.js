import { Endpoints } from "constants";
import { fetcher } from "helpers/apiHelper";
import { createUserState, getSessions } from "helpers/loginHelper";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from "react";
import { useAppSource } from ".";
import { defaultUserState, UserReducer } from "./UserReducer";

const UserContext = createContext();
const SessionContext = createContext();

/**
 * Context provider for user & session data.
 * @param {object} param - Props for the UserProvider component
 * @param {object} param.userMockData - Mock static user data for testing
 * @param {ReactNode} param.children - Child components to be rendered within the provider
 */
const UserProvider = ({ userMockData, children }) => {
	const [state, dispatch] = useReducer(UserReducer, defaultUserState);
	const [isTokenUpdating, setIsTokenUpdating] = useState(false);
	const [loading, setLoading] = useState(true);

	const { isAndroid } = useAppSource();

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

	/**
	 * Fetch the user profile data again and update the userState.
	 */
	const refreshUser = useCallback(() => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.REFRESH_PROFILE,
			{
				body: {
					// TODO: Confirm if `last_refresh_token` is required and is being used by EPS.
					last_refresh_token: state?.access_token,
				},
				token: state?.access_token,
			}
		)
			.then((res) => {
				updateUserInfo(res);
			})
			.catch((err) => console.error("[refreshUser] Error:", err));
	}, [state?.access_token]);

	/**
	 * Update userState.
	 * @param {*} data - User data to be updated.
	 */
	const updateUserInfo = (data) => {
		console.log("updateUserInfo:", data);
		dispatch({
			type: "UPDATE_USER_STORE",
			payload: { ...data },
			meta: { isAndroid: isAndroid },
		});
	};

	/**
	 * Mark the user as logged in in the userState.
	 * @param {object} sessionData - User data to be updated.
	 */
	const login = (sessionData) => {
		dispatch({
			type: "LOGIN",
			payload: { ...sessionData },
			meta: { isAndroid: isAndroid },
		});
	};

	/**
	 * Mark the user as logged out in the userState.
	 * @param {object} options - Options to logout.
	 * @param {boolean} options.isForced - If true, user has force logged-out using the Logout menu-option.
	 */
	const logout = ({ isForced = false } = {}) => {
		// If forced-logout by the user, store it in the sessionStorage
		if (isForced) {
			sessionStorage.setItem("inf-forced-logout", "1");
		}

		dispatch({ type: "LOGOUT", meta: { isAndroid: isAndroid } });
	};

	/**
	 * Update shop details in the userState.
	 * @param {*} data - Shop details to be updated.
	 */
	const updateShopDetails = (data) => {
		dispatch({
			type: "UPDATE_SHOP_DETAILS",
			payload: { ...data },
		});
	};

	/**
	 * Update personal details in the userState.
	 * @param {*} data - Personal details to be updated.
	 */
	const updatePersonalDetail = (data) => {
		dispatch({
			type: "UPDATE_PERSONAL_DETAILS",
			payload: { ...data },
		});
	};

	/**
	 * Set "Agent Mode" for the Admin. When active, the organization admin sees the app as an agent.
	 * @param {boolean} agent_mode - If true, agent mode is active.
	 */
	const setAdminAgentMode = (agent_mode = false) => {
		dispatch({
			type: "SET_ADMIN_AGENT_MODE",
			payload: agent_mode,
		});
	};

	/**
	 * Check if the user is logged in.
	 */
	const isLoggedIn = state?.loggedIn && state?.access_token ? true : false; // && state?.userId > 1;

	/**
	 * Check if the user is an admin.
	 */
	const isAdmin = state?.is_org_admin ? true : false;

	/**
	 * Check if the user is in onboarding/signup stage
	 */
	const isOnboarding =
		state?.onboarding == 1 || state?.userId == "1" ? true : false;

	// MARK: useUser()
	const userContextValue = useMemo(() => {
		return {
			isLoggedIn: isLoggedIn,
			isAdmin: isAdmin,
			isAdminAgentMode: isAdmin ? state?.isAdminAgentMode : false,
			userId: state?.userId || 0,
			userType: state?.userDetails?.user_type || 0,
			accessToken: state?.access_token || "",
			accessTokenLite:
				state?.access_token_lite || state?.access_token || "",
			accessTokenCrm:
				state?.access_token_crm || state?.access_token || "",
			isOnboarding: isOnboarding,
			userData: state || {},
			login,
			logout,
			loading,
			setLoading,
			refreshUser,
			updateUserInfo,
			isTokenUpdating,
			setIsTokenUpdating,
			updateShopDetails,
			updatePersonalDetail,
			setAdminAgentMode,
		};
	}, [state, isLoggedIn, loading, isTokenUpdating, isAdmin, refreshUser]);

	// MARK: useSession()
	const sessionContextValue = useMemo(() => {
		return {
			isLoggedIn: isLoggedIn,
			isAdmin: isAdmin,
			isAdminAgentMode: isAdmin ? state?.isAdminAgentMode : false,
			userId: state?.userId || 0,
			userType: state?.userDetails?.user_type || 0,
			accessToken: state?.access_token || "",
			accessTokenLite:
				state?.access_token_lite || state?.access_token || "",
			accessTokenCrm:
				state?.access_token_crm || state?.access_token || "",
			isOnboarding: isOnboarding,
			loading,
			setLoading,
			refreshUser,
			logout,
		};
	}, [
		isLoggedIn,
		isAdmin,
		state?.isAdminAgentMode,
		state?.userId,
		state?.userDetails?.user_type,
		state?.access_token,
		state?.access_token_lite,
		state?.access_token_crm,
		isOnboarding,
		loading,
		refreshUser,
		logout,
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
 * @returns {object} An object with the following properties:
 * @property {boolean} isLoggedIn - If true, user is logged in
 * @property {boolean} isAdmin - If true, user is an admin
 * @property {number} userId - User ID
 * @property {string} userType - User type
 * @property {string} accessToken - Access token
 * @property {object} userData - Detailed user profile data object
 * @property {Function} login - Login function
 * @property {Function} logout - Logout function
 * @property {boolean} loading - If true, user data is being loaded
 * @property {Function} setLoading - Set loading state (used by RouteProtector)
 * @property {Function} refreshUser - Fetch fresh user profile data from the server
 * @property {Function} updateUserInfo - Update user info
 * @property {boolean} isTokenUpdating - If true, token is being updated
 * @property {Function} setIsTokenUpdating - Set token updating state
 * @property {Function} updateShopDetails - Update shop details
 * @property {Function} updatePersonalDetail - Update personal details
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
 * @returns {object} An object with the following properties:
 * @property {boolean} isLoggedIn - If true, user is logged in
 * @property {boolean} isAdmin - If true, user is an admin
 * @property {number} userId - User ID
 * @property {string} userType - User type
 * @property {string} accessToken - Access token
 * @property {boolean} loading - If true, user data is being loaded
 * @property {Function} setLoading - Set loading state (used by RouteProtector)
 * @property {Function} refreshUser - Fetch fresh user profile data from the server
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
