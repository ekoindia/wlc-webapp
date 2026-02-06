/**
 * Esign Service
 *
 * Factory and API methods for the e-signature service.
 * Handles provider selection, URL fetching, and status verification.
 */
import { Endpoints } from "constants/EndPoints";
import { TransactionIds } from "constants/EpsTransactions";
import { fetcher } from "helpers";
import { karzaProvider } from "./providers/karza";
import { leegalityProvider } from "./providers/leegality";
import { signzyProvider } from "./providers/signzy";
import {
	EsignProviderType,
	type EsignConfig,
	type EsignProviderTypeValue,
	type EsignUrlData,
	type IEsignProvider,
} from "./types";

/**
 * Get the appropriate provider implementation based on provider type
 * @param providerType - The provider type from API response
 * @returns The provider implementation
 */
export const getProvider = (
	providerType: EsignProviderTypeValue
): IEsignProvider => {
	switch (providerType) {
		case EsignProviderType.LEEGALITY:
			return leegalityProvider;
		case EsignProviderType.KARZA:
			return karzaProvider;
		case EsignProviderType.SIGNZY:
			return signzyProvider;
		case EsignProviderType.DIGIO:
			// DIGIO not currently supported, fallback to Leegality
			console.warn(
				"[EsignService] DIGIO provider not supported, using Leegality"
			);
			return leegalityProvider;
		default:
			console.warn(
				`[EsignService] Unknown provider type: ${providerType}, using Leegality`
			);
			return leegalityProvider;
	}
};

/**
 * Fetch the e-sign URL from the backend
 * @param config - The esign configuration
 * @param accessToken - The access token for authentication
 * @param generateNewToken - Function to refresh token
 * @returns Promise with the esign URL data
 */
export const getSignUrl = async (
	config: EsignConfig,
	accessToken: string,
	generateNewToken: (_logout_on_failure?: boolean) => boolean
): Promise<EsignUrlData> => {
	const response = await fetcher(
		process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
		{
			token: accessToken,
			body: {
				interaction_type_id:
					TransactionIds?.USER_ONBOARDING_GET_AGREEMENT_URL,
				document_id: "",
				agreement_id: config.agreementId ?? 5,
				latlong: config.latLong || "27.176670,78.008075,7787",
				csp_id: config.mobile || "",
				user_id: config.mobile,
			},
		},
		generateNewToken
	);

	if (!response?.data?.short_url) {
		throw new Error(
			response?.message ||
				"E-sign initialization failed, please try again."
		);
	}

	return response.data as EsignUrlData;
};
