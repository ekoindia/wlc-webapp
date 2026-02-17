/**
 * Leegality E-sign Provider
 *
 * Handles the Leegality SDK integration for e-signatures.
 * Supports both web (SDK popup) and Android WebView flows.
 */
import { ANDROID_ACTION, doAndroidAction, isAndroidApp } from "utils";
import type { EsignCallbackResult, IEsignProvider } from "../types";

const SCRIPT_ID = "legality";
const SCRIPT_SRC = "/scripts/leegalityv5.min.js";

/**
 * Leegality provider implementation
 */
export const leegalityProvider: IEsignProvider = {
	requiresScript: true,

	async loadScript(): Promise<void> {
		// Skip if already loaded
		if (document.getElementById(SCRIPT_ID)) {
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = SCRIPT_SRC;
			script.id = SCRIPT_ID;

			script.onload = () => resolve();
			script.onerror = () =>
				reject(new Error("Failed to load Leegality script"));

			document.body.appendChild(script);
		});
	},

	openSigning(
		url: string,
		options: {
			documentId?: string;
			logo?: string;
			isAndroid?: boolean;
			onCallback?: (_result: EsignCallbackResult) => void;
		}
	): void {
		const { documentId, logo, isAndroid, onCallback } = options;

		// Android WebView flow
		if (isAndroid || isAndroidApp()) {
			doAndroidAction(
				ANDROID_ACTION.LEEGALITY_ESIGN_OPEN,
				JSON.stringify({
					signing_url: url,
					document_id: documentId,
				})
			);
			return;
		}

		// Web SDK flow
		if (!(window as any).Leegality) {
			console.error("[LeegalityProvider] SDK not loaded");
			onCallback?.({ error: "SDK not loaded" });
			return;
		}

		const handleCallback = (res: any) => {
			console.log("[LeegalityProvider] Callback received:", res);
			if (res.error) {
				onCallback?.({ error: res.error });
			} else {
				onCallback?.({ documentId: res.documentId });
			}
		};

		const leegality = new (window as any).Leegality({
			callback: handleCallback,
			logo: logo,
		});

		leegality.init();
		leegality.esign(url);
	},
};
