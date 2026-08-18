import { useAppSource, useUser } from "contexts";
import { loginUsingAccessToken } from "helpers/loginHelper";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

/**
 * Bootstrap status of a gateway direct-token (Mode B) session.
 * - `pending`: credential detection or silent login still in progress.
 * - `done`: a login attempt finished — combine with `isLoggedIn` to tell success from failure.
 * - `no_credential`: no `access_token` was present in the URL.
 */
export type GatewayDirectLoginStatus = "pending" | "done" | "no_credential";

/**
 * URL query params treated as credentials on gateway routes. All are stripped
 * from the address bar before any network call. Only `access_token` is
 * consumed (Mode B); `refresh_token` is never accepted here — a gateway link
 * must not rotate the caller's refresh token. `code` is reserved for the
 * future Mode A redeem flow and is stripped unredeemed so it cannot leak or
 * be replayed later.
 */
const GATEWAY_CREDENTIAL_PARAMS = ["access_token", "refresh_token", "code"];

/**
 * Mode B (direct access_token) bootstrap for /gateway/products/* routes.
 *
 * Mirrors the landing page's silent login (`useAutoLoginFromUrlToken`):
 * reads `?access_token=` synchronously from `window.location.search` (not
 * `router.query`, which is empty before hydration), strips every credential
 * param from the URL — awaited, so the token leaves the address bar before any
 * request could leak it via a Referer header — then seeds the session with
 * `loginUsingAccessToken` → refresh-profile → UserContext hydration.
 *
 * Unlike the landing hook, failure must not fall back to a login form: the
 * caller renders a dead-end screen instead. `loginUsingAccessToken` swallows
 * errors (clears the half-written session via `logout`), so success is
 * detected by `isLoggedIn` flipping — the caller combines `status === "done"`
 * with `isLoggedIn`.
 *
 * SECURITY: the token in the URL is a full bearer credential. It is stripped
 * before any network call, but the original navigation has already reached
 * browser history and server/CDN logs — callers must use short-lived tokens
 * and treat the gateway URL itself as a secret. See
 * docs/features/gateway/gateway-v2-api-contract.md §3b.
 * @param {boolean} enabled - Gate for the login attempt (e.g. the ELOKA_GATEWAY feature flag). Credential stripping runs regardless; the login waits until this is true.
 * @returns {GatewayDirectLoginStatus} Current bootstrap status.
 */
export const useGatewayDirectLogin = (
	enabled: boolean
): GatewayDirectLoginStatus => {
	const router = useRouter();
	const { isLoggedIn, login, logout, updateUserInfo } = useUser();
	const { isAndroid } = useAppSource();
	const [status, setStatus] = useState<GatewayDirectLoginStatus>("pending");
	const tokenRef = useRef<string | null>(null);
	const strippedRef = useRef<Promise<boolean> | null>(null);
	const hasDetected = useRef(false);
	const hasLoggedIn = useRef(false);

	// Detection + stripping: once, on mount, independent of `enabled` — the
	// credential must leave the address bar even if the gateway is disabled.
	useEffect(() => {
		// Guard against StrictMode double-effect re-consuming the credential.
		if (hasDetected.current) return;
		hasDetected.current = true;

		const params = new URLSearchParams(window.location.search);
		const hasCredential = GATEWAY_CREDENTIAL_PARAMS.some((param) =>
			params.has(param)
		);
		tokenRef.current = params.get("access_token");

		if (hasCredential) {
			GATEWAY_CREDENTIAL_PARAMS.forEach((param) => params.delete(param));
			const remaining = params.toString();
			strippedRef.current = router.replace(
				window.location.pathname +
					(remaining ? `?${remaining}` : "") +
					window.location.hash,
				undefined,
				{ shallow: true }
			);
		} else {
			strippedRef.current = Promise.resolve(true);
		}

		if (!tokenRef.current) {
			setStatus("no_credential");
		}
	}, []);

	// Login: waits for `enabled` (feature flag resolves async) and for detection.
	useEffect(() => {
		if (
			!enabled ||
			hasLoggedIn.current ||
			!tokenRef.current ||
			!strippedRef.current
		) {
			return;
		}
		hasLoggedIn.current = true;

		// Already signed in (e.g. reload after the strip, or an existing session
		// in this tab): keep that session, ignore the token.
		if (isLoggedIn) {
			setStatus("done");
			return;
		}

		const accessToken = tokenRef.current;
		strippedRef.current
			// Awaited so the credential is out of the address bar before the
			// profile request fires.
			.then(() =>
				loginUsingAccessToken(
					accessToken,
					updateUserInfo,
					login,
					logout,
					isAndroid
				)
			)
			.finally(() => setStatus("done"));
	}, [enabled]);

	return status;
};
