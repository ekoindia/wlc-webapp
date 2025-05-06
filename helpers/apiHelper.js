const DEFAULT_HEADERS = {
	"Content-Type": "application/json",
};

const DEFAULT_DATA = {
	source: "WLC",
};

const DEFAULT_METHOD = "POST"; // Connect API uses POST by default
const DEFAULT_TIMEOUT = 120000; // 2 minutes

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
	response;
	status;

	/**
	 * Constructor for ApiError
	 * @param {string} message - Error message
	 * @param {Response} [response] - Response object (optional)
	 */
	constructor(message, response) {
		super(message);
		this.name = "ApiError";
		this.response = response;
		this.status = response?.status;
	}
}

/**
 * Custom error class for expired or invalid access tokens
 */
class UnauthorizedError extends ApiError {
	/**
	 * Constructor for UnauthorizedError
	 * @param {Response} [response] - Response object (optional)
	 */
	constructor(response) {
		super("Unauthorized: Session expired", response);
		this.name = "UnauthorizedError";
	}
}

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

	console.log("📡 Starting Fetch:", {
		url,
		options,
	});

	// Combine a timeout signal with the caller's AbortController signal if provided
	const combinedSignal = createSignalWithTimeout(
		timeout || DEFAULT_TIMEOUT,
		controller?.signal
	);

	const _method = (method || DEFAULT_METHOD).toUpperCase();
	const isGetType = _method === "GET" || _method === "DELETE";

	// Add client_ref_id to the request body, if not already present
	if (!isGetType) {
		body.client_ref_id ??=
			Date.now() + "" + Math.floor(Math.random() * 1000);
	}

	const headersData = {
		...DEFAULT_HEADERS,
		Authorization: token ? `Bearer ${token}` : undefined,
		...headers,
	};

	const bodyData = {
		...DEFAULT_DATA,
		...body,
	};

	// If the combined signal is already aborted, return early
	if (combinedSignal.aborted) {
		console.warn("📡 Fetch Aborted:", { url, options });
		return;
	}

	// For GET/DELETE requests, append bodyData (if any) as query parameters to URL
	const finalUrl = isGetType ? buildUrlWithParams(url, bodyData) : url;

	// Final options for the fetch request
	const finalOptions = {
		method: _method,
		headers: headersData,
		body: isGetType ? undefined : prepareRequestBody(bodyData, isMultipart),
		signal: combinedSignal,
		...restOptions,
	};

	const fetchPromise = fetch(finalUrl, finalOptions).then((res) => {
		if (res.ok) {
			console.log("📡 Fetch Result:", {
				finalUrl,
				finalOptions,
				res,
			});
			return res.json();
		} else {
			res.text().then((text) => {
				console.error("📡 Fetch Error:", {
					finalUrl,
					finalOptions,
					res,
					body: text,
				});
			});

			if (res.status === 401) {
				// Unauthorized User. Access-token has expired.
				// Generate new access-token or logout user
				console.warn("📡 Session expired. Trying to refresh token.");
				if (typeof generateNewToken === "function") {
					generateNewToken(true);
					return;
				} else {
					console.error("📡 No function to refresh token.");
					throw new UnauthorizedError(res);
				}
			}

			throw new ApiError(`API Error: ${res.status}`, res);
		}
	});

	// Attempt to update the access-token, if token is nearing expiry
	if (typeof generateNewToken === "function") {
		generateNewToken();
	}

	return fetchPromise;
}

/**
 * Prepares the request body based on method and content type
 * @param {object} body - Data to be sent in the request body
 * @param {boolean} [isMultipart] - Flag to indicate if the request is multipart/form-data
 * @returns {FormData|string|undefined} - FormData object for multipart requests & JSON string for other requests
 * - If isMultipart is true, returns FormData object with the body
 * - If isMultipart is false, returns JSON string with the body
 * - If body is not an object, returns undefined
 */
function prepareRequestBody(body, isMultipart) {
	if (!body || typeof body !== "object") return undefined;

	if (isMultipart) {
		const formData = new FormData();
		Object.entries(body).forEach(([key, value]) => {
			if (value !== null && typeof value !== undefined) {
				formData.append(key, value);
			}
		});
		return formData;
	}

	return JSON.stringify(body);
}

/**
 * Builds the final URL with query parameters for GET/DELETE requests
 * @param url
 * @param params
 */
function buildUrlWithParams(url, params) {
	if (params && Object.keys(params).length === 0) return url;

	try {
		const urlObj = new URL(url, window?.location?.origin);
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				urlObj.searchParams.append(key, String(value));
			}
		});
		return urlObj.toString();
	} catch (error) {
		console.error("Error constructing URL to add query-params:", error);
		return url;
	}
}

/**
 * Creates a combined AbortSignal with timeout
 * @param {number} timeout - Timeout in milliseconds
 * @param {AbortSignal} [controllerSignal] - Optional AbortSignal from an AbortController
 */
function createSignalWithTimeout(timeout, controllerSignal) {
	const timeoutSignal = AbortSignal.timeout(timeout);
	return controllerSignal
		? AbortSignal.any([controllerSignal, timeoutSignal])
		: timeoutSignal;
}

/**
 * Processes the API response
 * @param {Response} response - The response object from the fetch request
 * @param {string} url - The URL of the request (used for logging)
 * @param {object} options - The options used in the fetch request (used for logging)
 * @param {Function} [generateNewToken] - Function to generate a new token (optional)
 * @returns {Promise} - A promise that resolves to the response data
 * @throws {ApiError} - Throws an ApiError if the response is not ok
 * @throws {UnauthorizedError} - Throws an UnauthorizedError if the response status is 401
 * @throws {Error} - Throws a generic error if the response is not ok
 */
// async function processResponse(response, url, options, generateNewToken) {
// 	if (response.ok) {
// 		console.log("📡 Fetch Result:", { url, options, response });
// 		return await response.json();
// 	}

// 	const errorText = await response.text();
// 	console.error("📡 Fetch Error:", {
// 		url,
// 		options,
// 		response,
// 		body: errorText,
// 	});

// 	// Handle session expiration. Try to refresh token.
// 	if (response.status === 401) {
// 		console.warn("📡 Session expired. Trying to refresh token.");
// 		if (typeof generateNewToken === "function") {
// 			generateNewToken(true);
// 			return;
// 		} else {
// 			console.error("📡 No function to refresh token.");
// 			throw new UnauthorizedError(response);
// 		}
// 	}

// 	throw new ApiError(`API Error: ${response.status}`, response);
// }
