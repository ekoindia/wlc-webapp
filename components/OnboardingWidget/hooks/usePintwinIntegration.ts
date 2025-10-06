import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useCallback, useEffect } from "react";
import { createPintwinFormat } from "../../../utils/pintwinFormat";
import type { OnboardingStateHook } from "./useOnboardingState";

interface UsePintwinIntegrationProps {
	state: OnboardingStateHook["state"];
	actions: OnboardingStateHook["actions"];
	userData: any;
}

interface UsePintwinIntegrationReturn {
	getBookletNumber: () => void;
	getBookletKey: () => void;
	formatPintwinData: (_value: any, _key: any) => any;
}

/**
 * Custom hook for managing Pintwin/Booklet integration
 * Handles booklet number/key fetching and pintwin format creation
 * @param {UsePintwinIntegrationProps} params - Hook parameters
 * @param {object} params.state - Onboarding state from useOnboardingState
 * @param {object} params.actions - State actions from useOnboardingState
 * @param {any} params.userData - User data object
 * @returns {UsePintwinIntegrationReturn} Pintwin integration methods
 */
export const usePintwinIntegration = ({
	state,
	actions,
	userData,
}: UsePintwinIntegrationProps): UsePintwinIntegrationReturn => {
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();

	const user_id =
		userData?.userDetails?.mobile || userData?.userDetails.signup_mobile;

	/**
	 * Fetches booklet number from the backend
	 */
	const getBookletNumber = useCallback(() => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: accessToken,
				body: {
					interaction_type_id: TransactionIds?.GET_BOOKLET_NUMBER,
					document_id: "",
					latlong: state.latLong || "27.176670,78.008075,7787",
					user_id,
					locale: "en",
				},
			},
			generateNewToken
		)
			.then((res) => {
				if (res.response_status_id === 0) {
					actions.setBookletNumber(res.data);
				}
			})
			.catch((err) => console.error("[getBookletNumber] Error:", err));
	}, [accessToken, state.latLong, user_id, generateNewToken, actions]);

	/**
	 * Fetches booklet key from the backend
	 */
	const getBookletKey = useCallback(() => {
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: accessToken,
				body: {
					interaction_type_id: TransactionIds?.GET_PINTWIN_KEY,
					document_id: "",
					latlong: state.latLong || "27.176670,78.008075,7787",
					user_id,
					locale: "en",
				},
			},
			generateNewToken
		)
			.then((res) => {
				if (res.response_status_id === 0) {
					actions.addBookletKey(res.data);
				}
			})
			.catch((err) => console.error("[getBookletKey] Error: ", err));
	}, [accessToken, state.latLong, user_id, generateNewToken, actions]);

	/**
	 * Formats pintwin data using the utility function
	 */
	const formatPintwinData = useCallback((value: any, key: any) => {
		return createPintwinFormat(value, key);
	}, []);

	// Auto-fetch booklet key when booklet number is available
	useEffect(() => {
		if (state.pintwin.bookletNumber) {
			getBookletKey();
		}
	}, [state.pintwin.bookletNumber, getBookletKey]);

	return {
		getBookletNumber,
		getBookletKey,
		formatPintwinData,
	};
};
