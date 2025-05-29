import { useToast } from "@chakra-ui/react";
import { useUser } from "contexts/UserContext";
import { generateNewAccessToken } from "helpers/loginHelper";
import { useCallback } from "react";

const SESSION_EXPIRY_TOAST_ID = "session-expiry-toast";

/**
 * @name useRefreshToken
 * @description Use this hook to refresh access_token from any component or hook or context
 * @example const { generateNewToken } = useRefreshToken();
 */
const useRefreshToken = () => {
	// Taken out the data from userContext
	const {
		userData,
		updateUserInfo,
		isTokenUpdating,
		setIsTokenUpdating,
		logout,
	} = useUser();

	const toast = useToast();

	// console.log('userData ::=> ', userData)
	// Extract refresh_token & token_timeout from userdata
	const { refresh_token, token_timeout } = userData;

	/**
	 * @name generateNewToken
	 * @description Function to generate new token access-token, only when the current access-token is expired, and the refresh-token is valid.
	 * @param {boolean} logout_on_failure If true, then logout the user if the token is expired and is not updated.
	 * @returns {boolean} Returns true if the token is expired and is updated, else false.
	 */
	const generateNewToken = useCallback(
		(logout_on_failure) => {
			let status = false;
			if (
				refresh_token &&
				token_timeout &&
				isTokenUpdating !== true &&
				token_timeout <= Date.now()
			) {
				// Fetch new access-token using the refresh-token...
				status = generateNewAccessToken(
					refresh_token,
					updateUserInfo,
					isTokenUpdating,
					setIsTokenUpdating,
					logout
				);
			}

			if (logout_on_failure && status !== true) {
				// Logout user
				console.log(
					"[generateNewToken] Token update failed. Logging out user..."
				);
				logout();
				if (!toast.isActive(SESSION_EXPIRY_TOAST_ID)) {
					toast({
						id: SESSION_EXPIRY_TOAST_ID,
						title: "Session Expired. Please login again.",
						status: "warning",
						duration: 2000,
					});
				}
			}

			return status;
		},
		[refresh_token, token_timeout, isTokenUpdating]
	);

	// generateNewToken function is used to generate new access-token
	return { generateNewToken };
};

export default useRefreshToken;
