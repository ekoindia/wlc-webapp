const DEFAULT_HEADERS = {
	"Content-Type": "application/json",
};

const DEFAULT_DATA = {
	source: "WLC",
};

const DEFAULT_METHOD = "POST"; // Connect API uses POST by default
const DEFAULT_TIMEOUT = 120000; // 2 minutes

/**
 * Wrapper helper for fetch() function that uses default headers and handles errors.
 * - Adds default headers: Content-Type=application/json
 * - Uses default method: POST
 * - Adds default data: source(="WLC") & client_ref_id (if not already present)
 * - Handles timeout: 2 minutes by default
 * - Handles errors: 401 (unauthorized), etc
 * - Rotates access-token if nearing expiry
 * @param {string} url - The URL to fetch
 * @param {object} options - Additional options for the fetch request
 * @param {string} [options.method] - HTTP method (default: "POST")
 * @param {object} [options.headers] - Additional headers (optional)
 * @param {object} options.body - Additional data for the request
 * @param {number} [options.timeout] - Timeout (in milliseconds. Default: 120000)
 * @param {string} options.token - Authorization access-token (if required)
 * @param {object} [options.controller] - AbortController instance
 * @param {boolean} [options.isMultipart] - Flag to indicate multipart form data
 * @param {Function} [generateNewToken] - Function to generate new access token (when current token is nearing expiry, or token-expired error is returned by the server)
 * @returns {Promise} Promise object represents the response
 * - If response is ok, returns the response as JSON
 * @throws {Error} If response is not ok, throws an error
 * - Error object has extra properties: response, status
 * - If access-token has expired, error object has name: "Unauthorized"
 * - If response was aborted using AbortController, error object has name: "AbortError"
 * - If response has timed-out, error object has name: "TimeoutError"
 */
export function fetcher(url, options, generateNewToken) {
	const {
		method,
		headers,
		body = {},
		timeout,
		token,
		controller = null,
		isMultipart,
		...restOptions
	} = options || {};

	// Use AbortSignal.timeout to set a timeout for the fetch request
	const requestTimeout = timeout || DEFAULT_TIMEOUT;
	const timeoutSignal = AbortSignal.timeout(requestTimeout);

	// Combine the timeout signal with the caller's AbortController signal if provided
	const combinedSignal = controller
		? AbortSignal.any([controller.signal, timeoutSignal])
		: timeoutSignal;

	const _method = (method || DEFAULT_METHOD).toUpperCase();
	const isGetType = _method === "GET" || _method === "DELETE";

	// Add client_ref_id to the request body, if not already present
	if (!isGetType) {
		body.client_ref_id ??=
			Date.now() + "" + Math.floor(Math.random() * 1000);
	}

	console.log("📡 Starting Fetch:", {
		url,
		options,
	});
	const headersData = {
		...DEFAULT_HEADERS,
		Authorization: token ? `Bearer ${token}` : undefined,
		...headers,
	};
	const bodyData = {
		...DEFAULT_DATA,
		...body,
	};
	if (isMultipart) {
		// delete headersData["Content-Type"];
		delete bodyData.client_ref_id;
		delete bodyData.source;
	}

	// If the combined signal is already aborted, return early
	if (combinedSignal.aborted) {
		console.warn("📡 Fetch Aborted:", { url, options });
		return;
	}

	const fetchPromise = fetch(url, {
		signal: combinedSignal,
		method: _method,
		headers: headersData,
		body: isGetType ? undefined : JSON.stringify(bodyData),
		...restOptions,
	}).then((res) => {
		if (res.ok) {
			console.log("📡 Fetch Result:", {
				url,
				options,
				res,
			});
			return res.json();
		} else {
			res.text().then((text) => {
				console.error("📡 Fetch Error:", {
					url,
					options,
					res,
					body: text,
				});
			});

			const err = new Error("FetchError");
			err.response = res;
			err.status = res.status;
			if (res.status === 401) {
				// Unauthorized User. Access-token has expired.
				// Generate new access-token or logout user
				err.name = "Unauthorized";
				console.warn("📡 Session expired. Trying to refresh token.");
				if (typeof generateNewToken === "function") {
					generateNewToken(true);
					return;
				} else {
					console.error("📡 No function to refresh token.");
				}
			}
			throw err;
		}
	});

	// Attempt to update the access-token, if token is nearing expiry
	if (typeof generateNewToken === "function") {
		generateNewToken();
	}

	return fetchPromise;
}
