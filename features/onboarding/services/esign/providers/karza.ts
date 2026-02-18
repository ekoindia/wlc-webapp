/**
 * Karza E-sign Provider
 *
 * Karza uses the Leegality SDK internally, so this delegates to the Leegality provider.
 */
import type { IEsignProvider } from "../types";
import { leegalityProvider } from "./leegality";

/**
 * Karza provider implementation
 * Uses Leegality SDK under the hood
 */
export const karzaProvider: IEsignProvider = {
	requiresScript: leegalityProvider.requiresScript,
	loadScript: leegalityProvider.loadScript,
	openSigning: leegalityProvider.openSigning,
};
