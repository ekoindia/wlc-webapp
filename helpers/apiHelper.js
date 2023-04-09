import { generateNewAccessToken } from "helpers/loginHelper";

const DEFAULT_HEADERS = {
	"Content-Type": "application/json",
};

const DEFAULT_DATA = {
	source: "WLC",
	client_ref_id: Date.now() + "" + Math.floor(Math.random() * 1000),
};

const DEFAULT_METHOD = "POST"; // Connect API uses POST by default
const DEFAULT_TIMEOUT = 120000; // 2 minutes

/**
 * Wrapper helper for fetch() function that uses default headers and handles errors.
 * - Adds default headers: Content-Type=application/json
 * - Uses default method: POST
 * - Adds default data: { source: "WLC", client_ref_id: "...") }
 * - Handles timeout: 2 minutes by default
 * - Handles errors: 401 (unauthorized), etc
 * - Rotates access-token if nearing expiry
 * @param {string} url
 * @param {object} options
 * @param {string} options.method	HTTP method (default: "POST")
 * @param {object} options.headers	Additional headers
 * @param {object} options.body		Additional data (as JSON object)
 * @param {number} options.timeout	Timeout (in milliseconds. Default: 120000)
 * @param {string} options.token	Authorization access-token (if required)
 * @param {object} tokenOptions
 * @param {number} tokenOptions.token_timeout	Access-token expiry time (in milliseconds)
 * @param {string} tokenOptions.refreshToken	Refresh-token
 * @param {function} tokenOptions.updateUserInfo	Function to update user info
 * @param {boolean} tokenOptions.isTokenUpdating	Flag to check if token is already being updated
 * @param {function} tokenOptions.setIsTokenUpdating	Function to set isTokenUpdating flag
 * @returns {Promise} Promise object represents the response
 * - If response is ok, returns the response as JSON
 * @throws {Error} If response is not ok, throws an error
 * - Error object has extra properties: response, status
 * - If access-token has expired, error object has name: "Unauthorized"
 * - If response has timed-out, error object has name: "AbortError"
 */
export function fetcher(url, options, tokenOptions) {
	const { method, headers, body, timeout, token, ...restOptions } = options;

	// Timeout controller for the fetch request
	const controller = new AbortController();
	const timeout_id = setTimeout(
		() => controller.abort(),
		timeout || DEFAULT_TIMEOUT
	);

	const fetchPromise = fetch(url, {
		method: method || DEFAULT_METHOD,
		headers: {
			...DEFAULT_HEADERS,
			Authorization: token ? `Bearer ${token}` : undefined,
			...headers,
		},
		body: JSON.stringify({
			...DEFAULT_DATA,
			...(body || {}),
		}),
		...restOptions,
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				console.error("📡 Fetch Error:", { url, options, res });
				const err = new Error("Failed");
				err.response = res;
				err.status = res.status;
				if (res.status === 401) {
					err.name = "Unauthorized";
					// TODO: Handle unauthorized error by refreshing token
				}
				// TODO: Handle timeout error
				throw err;
			}
		})
		.finally(() => {
			// Cancel aborting the fetch request after timeout
			clearTimeout(timeout_id);
		});

	// Try to update the access-token, if token is nearing expiry
	if (tokenOptions) {
		const {
			token_timeout,
			refresh_token,
			updateUserInfo,
			isTokenUpdating,
			setIsTokenUpdating,
		} = tokenOptions;

		if (
			refresh_token &&
			token_timeout &&
			isTokenUpdating !== true &&
			token_timeout <= Date.now()
		) {
			// Fetch new access-token using the refresh-token...
			generateNewAccessToken(
				refresh_token,
				updateUserInfo,
				isTokenUpdating,
				setIsTokenUpdating
			);
		}
	}

	return fetchPromise;
}
