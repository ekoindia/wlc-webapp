import { useAppSource, useUser } from "contexts";
import { loginUsingRefreshToken } from "helpers/loginHelper";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

/** URL query parameter carrying a refresh token for silent login. */
export const REFRESH_TOKEN_QUERY_PARAM = "refresh_token";

/**
 * Silently log the user in when the landing page is opened with a
 * `?refresh_token=` query parameter, e.g. `/?refresh_token=<token>&next=%2Fhistory`.
 *
 * The token is exchanged for a full session via `loginUsingRefreshToken()`
 * (POST /authentication/token -> POST /authentication/refresh-profile -> LOGIN
 * dispatch), after which `RouteProtecter` redirects to `?next=` or the role's
 * landing route. On any failure the session is cleared and the normal login
 * form is shown - no toast, no error screen.
 *
 * SECURITY: a refresh token in a URL is a bearer credential. It is removed from
 * the address bar before the exchange request is made, but the original
 * navigation has already reached browser history, the server access log and any
 * proxy/CDN in between. Links carrying it must be treated as short-lived and
 * single-use.
 * @returns {boolean} True while the silent login is in progress; render a loader instead of the login form.
 */
export const useAutoLoginFromRefreshToken = (): boolean => {
	const router = useRouter();
	const { isLoggedIn, login, logout, updateUserInfo } = useUser();
	const { isAndroid } = useAppSource();
	const [busy, setBusy] = useState(false);
	const hasRun = useRef(false);

	useEffect(() => {
		// Guard against a second run (re-render, React StrictMode double-effect)
		// firing a second token exchange with an already-consumed token.
		if (hasRun.current) return;
		hasRun.current = true;

		// Read window.location rather than router.query: this page is statically
		// optimized, so router.query stays empty until `router.isReady` flips a
		// render later - long enough for the login form to flash before we know a
		// token is present. Same approach as pages/redirect/redirect.jsx.
		const params = new URLSearchParams(window.location.search);
		const refreshToken = params.get(REFRESH_TOKEN_QUERY_PARAM);
		if (!refreshToken) return;

		// Drop only the credential; `next`, `role`, `bv` etc. still matter to
		// RouteProtecter once the login lands.
		params.delete(REFRESH_TOKEN_QUERY_PARAM);
		const remainingParams = params.toString();
		const strippedUrl =
			window.location.pathname +
			(remainingParams ? `?${remainingParams}` : "");

		// Already signed in: just get the credential out of the URL.
		if (isLoggedIn) {
			router.replace(strippedUrl, undefined, { shallow: true });
			return;
		}

		setBusy(true);
		router
			// Awaited so the credential leaves the address bar before any request
			// that could leak it through a Referer header.
			.replace(strippedUrl, undefined, { shallow: true })
			.then(() =>
				loginUsingRefreshToken(
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
