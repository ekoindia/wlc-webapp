/**
 * Signzy E-sign Provider
 *
 * Signzy uses a simple URL redirect flow without any SDK.
 */
import type { IEsignProvider } from "../types";

/**
 * Signzy provider implementation
 * Opens signing URL in a new window (no SDK required)
 */
export const signzyProvider: IEsignProvider = {
	requiresScript: false,

	async loadScript(): Promise<void> {
		// Signzy doesn't require any script loading
		return Promise.resolve();
	},

	openSigning(url: string): void {
		// Simple window open for Signzy
		window.open(url, "SignAgreementWindow");
	},
};
