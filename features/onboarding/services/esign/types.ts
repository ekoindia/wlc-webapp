/**
 * Esign Service Types
 *
 * Type definitions for the e-signature service layer.
 * Supports multiple providers: Leegality, Karza, Signzy
 */

/**
 * E-sign provider types matching backend `pipe` values
 * @see constants/ProductDetails.js - agreementProvider
 */
export const EsignProviderType = {
	DIGIO: 0,
	KARZA: 1,
	SIGNZY: 2,
	LEEGALITY: 3,
} as const;

export type EsignProviderTypeValue =
	(typeof EsignProviderType)[keyof typeof EsignProviderType];

/**
 * E-sign session status state machine
 */
export type EsignStatus =
	| "idle"
	| "loading"
	| "ready"
	| "signing"
	| "verifying"
	| "success"
	| "error";

/**
 * Configuration for initializing an e-sign session
 */
export interface EsignConfig {
	agreementId: string | number;
	mobile: string;
	latLong?: string;
	logo?: string;
}

/**
 * Response from getSignUrl API
 */
export interface EsignUrlData {
	short_url: string;
	document_id: string;
	pipe: EsignProviderTypeValue;
	[key: string]: unknown;
}

/**
 * Callback result from e-sign SDK
 */
export interface EsignCallbackResult {
	documentId?: string;
	error?: string;
	[key: string]: unknown;
}

/**
 * Interface that all e-sign providers must implement
 */
export interface IEsignProvider {
	/**
	 * Load any required scripts/SDKs
	 * @returns Promise that resolves when ready
	 */
	loadScript(): Promise<void>;

	/**
	 * Open the signing flow
	 * @param url - The signing URL
	 * @param options - Provider-specific options
	 */
	openSigning(
		_url: string,
		_options: {
			documentId?: string;
			logo?: string;
			isAndroid?: boolean;
			onCallback?: (_result: EsignCallbackResult) => void;
		}
	): void;

	/**
	 * Check if this provider requires script loading
	 */
	requiresScript: boolean;
}
