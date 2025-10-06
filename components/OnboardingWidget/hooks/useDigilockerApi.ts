import { useToast } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRefreshToken } from "hooks";
import { useCallback } from "react";
import type { OnboardingStateHook } from "./useOnboardingState";

interface UseDigilockerApiProps {
	actions: OnboardingStateHook["actions"];
}

interface UseDigilockerApiReturn {
	getDigilockerUrl: () => Promise<void>;
	isLoading: boolean;
}

/**
 * Custom hook for managing Digilocker API integration
 * Handles Digilocker URL fetching and data management
 * @param {UseDigilockerApiProps} params - Hook parameters
 * @param {object} params.actions - State actions from useOnboardingState
 * @returns {UseDigilockerApiReturn} Digilocker API methods and state
 */
export const useDigilockerApi = ({
	actions,
}: UseDigilockerApiProps): UseDigilockerApiReturn => {
	const { accessToken } = useSession();
	const { generateNewToken } = useRefreshToken();
	const toast = useToast();

	/**
	 * Fetches Digilocker redirection URL from the backend
	 */
	const getDigilockerUrl = useCallback(async (): Promise<void> => {
		try {
			actions.setDigilockerLoading(true);

			const data = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
				{
					token: accessToken,
					method: "POST",
					body: {},
					headers: {
						"tf-req-method": "POST",
						"tf-req-uri": "/karza/digilocker-redirection-url",
						"tf-req-uri-root-path": "/ekoicici/v1/marketuat",
					},
				},
				generateNewToken
			);

			if (data?.status === 0) {
				// Handle successful response
				if (data?.data?.link) {
					// Store the response data for future use
					actions.setDigilockerData({
						link: data.data.link,
						requestId: data.data.requestId,
						initiatorId: data.data.initiator_id,
						timestamp: data.data.timestamp,
					});
				}
			} else {
				toast({
					title: data?.message || "Failed to get Digilocker URL",
					status: "error",
					duration: 2000,
				});
			}
		} catch (error: any) {
			console.error("[getDigilockerUrl] Error:", error);
			toast({
				title:
					error?.message ??
					"Something went wrong, please try again later!",
				status: "error",
				duration: 2000,
			});
		} finally {
			actions.setDigilockerLoading(false);
		}
	}, [accessToken, generateNewToken, actions, toast]);

	return {
		getDigilockerUrl,
		isLoading: false, // This could be derived from state if needed
	};
};
