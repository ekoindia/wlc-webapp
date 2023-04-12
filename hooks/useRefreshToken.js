import { useUser } from "contexts/UserContext";
import { generateNewAccessToken } from "helpers/loginHelper";
import { useCallback } from "react";

/**
 * @name useRefreshAccessToken
 * @description Use this hook to refresh access_token from any component or hook or context
 * @example const { generateNewToken } =  useRefreshAccessToken();
 */
const useRefreshAccessToken = () => {
	// Taken out the data from userContext
	const {
		userData,
		updateUserInfo,
		isTokenUpdating,
		setIsTokenUpdating,
		logout,
	} = useUser();

	// console.log('userData ::=> ', userData)
	// Extract refresh_token & token_timeout from userdata
	const { refresh_token, token_timeout } = userData;

	// Here, using useCallback to memorize the generateNewAccessToken so that it cannot create in pre-renders
	const generateNewToken = useCallback(() => {
		if (
			refresh_token &&
			token_timeout &&
			isTokenUpdating !== true &&
			token_timeout <= Date.now()
		) {
			// Fetch new access-token using the refresh-token...
			generateNewAccessToken(
				refresh_token,
				updateUserInfo,
				isTokenUpdating,
				setIsTokenUpdating,
				logout
			);
		}
	});

	// generateNewToken function is used to generate new token access token
	return { generateNewToken };
};

export default useRefreshAccessToken;
