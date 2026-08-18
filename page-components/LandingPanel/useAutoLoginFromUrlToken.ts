import { useAppSource, useUser } from "contexts";
import {
	loginUsingAccessToken,
	loginUsingRefreshToken,
} from "helpers/loginHelper";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

/**
 * URL query parameters carrying a credential for silent login, in precedence
 * order. `access_token` wins: redeeming a refresh token rotates it server-side,
 * which would break the session of whichever app handed us the link.
 */
export const CREDENTIAL_QUERY_PARAMS = ["access_token", "refresh_token"];

/**
 * Silently log the user in when the landing page is opened with a credential in
 * the URL - `/?access_token=<token>` or `/?refresh_token=<token>` - e.g.
 * `/?access_token=<token>&next=%2Fhistory`.
 *
 * `access_token` is preferred and seeds the session directly
 * (`loginUsingAccessToken`), leaving the caller's tokens untouched. The
 * resulting session cannot renew itself, so expiry is terminal: the existing
 * 401 handling logs out and shows "Session Expired". `refresh_token` is only
 * used when no access token is supplied; it is exchanged via
 * `loginUsingRefreshToken`, which ROTATES it - fine for first-party links, never
 * for a token borrowed from another app.
 *
 * On any failure the session is cleared and the normal login form is shown - no
 * toast, no error screen.
 *
 * SECURITY: either credential in a URL is a bearer token. Both are removed from
 * the address bar before the network call, but the original navigation has
 * already reached browser history, the server access log and any proxy/CDN in
 * between. Links carrying one must be short-lived and single-use.
 * @returns {boolean} True while the silent login is in progress; render a loader instead of the login form.
 */
export const useAutoLoginFromUrlToken = (): boolean => {
	const router = useRouter();
	const { isLoggedIn, login, logout, updateUserInfo } = useUser();
	const { isAndroid } = useAppSource();
	const [busy, setBusy] = useState(false);
	const hasRun = useRef(false);

	useEffect(() => {
		// Guard against a second run (re-render, React StrictMode double-effect)
		// firing a second login with an already-consumed credential.
		if (hasRun.current) return;
		hasRun.current = true;

		// Read window.location rather than router.query: this page is statically
		// optimized, so router.query stays empty until `router.isReady` flips a
		// render later - long enough for the login form to flash. Same approach
		// as pages/redirect/redirect.jsx.
		const params = new URLSearchParams(window.location.search);
		if (!CREDENTIAL_QUERY_PARAMS.some((param) => params.has(param))) return;

		const accessToken = params.get("access_token");
		const refreshToken = params.get("refresh_token");

		// Strip every credential key that is present, even an empty one, before
		// deciding whether we can actually log in. Everything else survives -
		// `next`, `role` and `bv` still matter to RouteProtecter, and the hash is
		// not part of the query at all.
		CREDENTIAL_QUERY_PARAMS.forEach((param) => params.delete(param));
		const remainingParams = params.toString();
		const strippedUrl =
			window.location.pathname +
			(remainingParams ? `?${remainingParams}` : "") +
			window.location.hash;

		const stripCredentials = () =>
			router.replace(strippedUrl, undefined, { shallow: true });

		// Already signed in, or the param was present but empty: just get the
		// credential out of the URL.
		if (isLoggedIn || !(accessToken || refreshToken)) {
			stripCredentials();
			return;
		}

		setBusy(true);
		stripCredentials()
			// Awaited so the credential leaves the address bar before any request
			// that could leak it through a Referer header.
			.then(() =>
				accessToken
					? loginUsingAccessToken(
							accessToken,
							updateUserInfo,
							login,
							logout,
							isAndroid
						)
					: loginUsingRefreshToken(
							refreshToken,
							updateUserInfo,
							login,
							logout,
							isAndroid
						)
			)
			.finally(() => setBusy(false));
	}, []);

	return busy;
};
