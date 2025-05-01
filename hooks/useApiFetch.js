import { useSession } from "contexts";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { useEffect, useState } from "react";

/**
 * Hook for fetching data from the Eloka internal APIs (using the fetcher utility). It's a wrapper around the fetcher utility which automatically takes care of token refresh and other common API-related tasks.
 * @param {string} defaultUrlEndpoint - The default URL endpoint to fetch data from. If not provided, it can be overwritten later during the actual fetch call.
 * @param {object} [settings] - The default options to be passed to the fetcher utility. If not provided, it can be overwritten later during the actual fetch call.
 * @param {string} [settings.method] - The HTTP method to use for the fetch request. Default is "POST".
 * @param {Function} [settings.onSuccess] - The callback function to be called on successful fetch.
 * @param {Function} [settings.onError] - The callback function to be called on fetch error.
 * @param {boolean} [settings.noAuth] - Flag to indicate if the fetch request should skip passing the access token. Default is `false`.
//  * @param {boolean} [settings.noClientRefId] - Flag to indicate if the fetch request should skip passing the unique client-reference-ID. Default is `false`.
 * @returns {Array} An array containing the function to fetch the API data, function to cancel the fetch request, and a boolean flag indicating if the fetch request is in progress.
 * TODO:
 * - Convert to TypeScript
 * - Error Boundaries and Retry Logic
 * - httpCache: cache header for HTTPS caching: https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
 * - local cache mechanism: localStorage, sessionStorage, or IndexedDB
 * - pagination support
 * - transformRequest
 * - transformResponse
 * - schema: use normalizr or similar library to normalize the response data
 * - noClientRefId flag to skip passing the client reference ID
 * - passDataToResponse flag to pass the data to the response interceptor
 * - OpenTelemetry
 * - interceptors - request, response (useful for logging, error handling, etc.). Can be implemented using the fetcher utility. This can be done by passing the interceptor functions as options to the fetcher utility, which will do the following: `fetcher(url, { interceptors: { request: [interceptor1, interceptor2], response: [interceptor3, interceptor4] } })`. This should work like Redux middleware. The interceptors can be async functions that can modify the request or response data. The request interceptors can be used to modify the request data before sending it to the server. The response interceptors can be used to modify the response data before passing it to the caller. The interceptors can be used for logging, error handling, etc.
 * - support for multiple fetch requests at the same time
 * - support for multiple fetch requests in a queue
 * - support for only one fetch request at a time. If a new fetch request is made while the previous one is still in progress, the previous one is cancelled.
 * @example
 * const [getUsers, cancel, loading] = useApiFetch("/api/v1/users", {
 * 		method: "GET",
 * });
 * useEffect(() => {
 * 		getUsers().then((data) => {
 * 			console.log("Users data:", data);
 * 		});
 * }, []);
 */
const useApiFetch = (defaultUrlEndpoint, settings) => {
	const {
		onSuccess,
		onError,
		noAuth = false,
		// noClientRefId = false,
		...options
	} = settings || {};

	const [endpoint] = useState(defaultUrlEndpoint);
	// const [options] = useState(otherOptions);
	const [controller, setController] = useState();

	const { generateNewToken } = useRefreshToken();
	const { accessTokenLite } = useSession();

	const [loading, setLoading] = useState(false);

	/**
	 * Function to cancel the fetch request.
	 * @param {string} [reason] - The reason for cancelling the fetch request.
	 */
	const cancelFetch = (reason) => {
		if (loading && controller) {
			controller.abort(reason || "Cancelled");
			setLoading(false);
			setController(null);
		}
	};

	// Cancel fetch on unmount
	useEffect(() => {
		return () => {
			cancelFetch("Component unmounted");
		};
	}, [cancelFetch]);

	/**
	 * Function to fetch data from the API.
	 * @param {object} [options] - The options to be passed to the fetcher utility. If not provided, the default options are used.
	 * @param {string} [options.url_endpoint] - The URL endpoint (or, complete URL) to fetch data from. If not provided, the default URL endpoint is used.
	 * @param {string} [options.method] - The HTTP method to use for the fetch request. Default is "POST".
	 * @param {object} [options.headers] - Additional headers to be passed with the fetch request.
	 * @param {object} [options.body] - The body data to be passed with the fetch request.
	 * @param {number} [options.timeout] - The timeout (in milliseconds) for the fetch request.
	 * @param {string} [options.token] - The access token to be used for the fetch request. The `access_token_lite` is used by default.
	 * @param {boolean} [options.isMultipart] - Flag to indicate if the request is a multipart form data request. Defaults to `false`.
	 * @returns {object} An object containing the fetched data, and any error information: { data, error, aborted, timedout, errorObject }
	 * - `data` is the fetched data (if successful).
	 * - `error` is `true` if there was an error.
	 * - `aborted` is `true` if the request was aborted using the cancelFetch() function.
	 * - `timedout` is `true` if the request timed out.
	 * - `errorObject` contains the Error object (if any).
	 */
	const fetchApiData = async ({
		url_endpoint,
		method,
		headers,
		body = {},
		timeout,
		token,
		isMultipart,
	} = {}) => {
		setLoading(true);
		setController(new AbortController());

		let url = url_endpoint || endpoint;

		if (!url) {
			console.error("[useApiFetch] URL not provided.");
			return null;
		}

		if (!url.toLowerCase().startsWith("http")) {
			url = process.env.NEXT_PUBLIC_API_BASE_URL + url;
		}

		const fetcherOptions = {
			...{
				body: {
					...options?.body,
					...body,
				},
				method: method || options?.method,
				headers: headers || options?.headers,
				timeout: timeout || options?.timeout,
				token:
					token ||
					options?.token ||
					(noAuth ? null : accessTokenLite),
				controller: controller,
				isMultipart: isMultipart || options?.isMultipart,
			},
		};
		console.log("Final Request Details:", fetcherOptions);

		// Summary of the request, to be used for logging and debugging
		const requestSummary = {
			url: url,
			body: fetcherOptions.body,
			method: fetcherOptions.method,
			headers: fetcherOptions.headers,
			isMultipart: fetcherOptions.isMultipart,
		};

		try {
			const data = await fetcher(url, fetcherOptions, generateNewToken);
			onSuccess && onSuccess(data, requestSummary);
			return { data, request: requestSummary };
		} catch (err) {
			const errResponse = {
				data: err?.response,
				status: err?.status,
				error: true,
				errorObject: err,
				request: requestSummary,
			};

			// Was the request was aborted?
			if (err.name === "AbortError") {
				errResponse.aborted = true;
			}

			// Did the request time-out?
			if (err.name === "TimeoutError") {
				errResponse.timedout = true;
			}

			console.error("[useApiFetch] Error: ", errResponse);

			onError && onError(errResponse);
			return errResponse;
		} finally {
			setLoading(false);
		}
	};

	return [fetchApiData, loading, cancelFetch];
};

/**
 * Wrapper around the `useApiFetch` hook to fetch data from the Eko's EPS API v3 APIs.
 * This is a specialized version of the `useApiFetch` hook that is tailored for the EPS API v3.
 * @param {string} defaultUrlEndpoint - The default URL endpoint to fetch data from. If not provided, it can be overwritten later during the actual fetch call.
 * @param {object} [settings] - The default options to be passed to the fetcher utility. If not provided, it can be overwritten later during the actual fetch call.
 * @param {string} [settings.method] - The HTTP method to use for the fetch request. Default is "GET".
 * @param {Function} [settings.onSuccess] - The callback function to be called on successful fetch.
 * @param {Function} [settings.onError] - The callback function to be called on fetch error.
 * @param {boolean} [settings.noAuth] - Flag to indicate if the fetch request should skip passing the access token. Default is `false`.
//  * @param {boolean} [settings.noClientRefId] - Flag to indicate if the fetch request should skip passing the unique client-reference-ID. Default is `false`.
 * @returns {Array} An array containing the function to fetch the API data, function to cancel the fetch request, and a boolean flag indicating if the fetch request is in progress.
 * @example
 * If the URL is "POST https://api.eko.in/ekoicici/v3/tools/kyc/pan", use the following:
 * ```javascript
 * const [fetchPan, loading, cancelFetchPan] = useEpsV3Fetch(
 * 	"/tools/kyc/pan", {
 * 		method: "POST",
 * 		body: {
 * 			pan: "ABCDE1234F",
 * 			// other body parameters...
 * 		},
 * 		onSuccess: (data) => {
 * 			console.log("Success: ", data);
 * 		},
 * 		onError: (error) => {
 * 			console.error("Error: ", error);
 * 		},
 * 	}
 * );
 * ```
 */
// Define centralized backend endpoints
const Endpoints = {
	TRANSACTION_JSON: "/transactions/dojson", // Example backend endpoint
};

/**
 * Custom hook to fetch data from the Eko's EPS API v3 APIs.
 * This is a specialized version of the `useApiFetch` hook that is tailored for the EPS API v3.
 * It automatically sets the required headers and query parameters for the EPS API v3.
 * MARK: useEpsV3Fetch
 * @param {string} defaultUrlEndpoint - The default URL endpoint to fetch data from. If not provided, it can be overwritten later during the actual fetch call.
 * @param {object} [settings] - The default options to be passed to the fetcher utility. If not provided, it can be overwritten later during the actual fetch call.
 * @returns {Array} An array containing the function to fetch the API data, function to cancel the fetch request, and a boolean flag indicating if the fetch request is in progress.
 */
export const useEpsV3Fetch = (defaultUrlEndpoint, settings) => {
	const method = (settings?.method || "GET").toUpperCase();
	const isGetRequest = method === "GET";

	console.log("useEpsV3Fetch - START: ", {
		defaultUrlEndpoint,
		settings,
		isGetRequest,
	});

	let tfReqUri = defaultUrlEndpoint;
	if (
		isGetRequest &&
		settings?.queryParams &&
		Object.keys(settings.queryParams).length > 0
	) {
		const queryParams = new URLSearchParams(
			settings.queryParams
		).toString();
		tfReqUri = `${defaultUrlEndpoint}?${queryParams}`;
	}

	const headers = {
		...settings?.headers,
		"tf-req-method": method,
		"tf-req-uri-root-path": "/ekoicici/v3",
		"tf-req-uri": tfReqUri,
		...(isGetRequest ? {} : { "Content-Type": "application/json" }),
	};

	const finalSettings = {
		method: "POST",
		headers,
		...(isGetRequest
			? {}
			: settings?.body
				? { body: JSON.stringify(settings.body) }
				: {}),
	};

	const urlToCall = Endpoints.TRANSACTION_JSON;

	console.log("useEpsV3Fetch - Final URL:", urlToCall);
	console.log("useEpsV3Fetch - Final Settings:", finalSettings);

	return useApiFetch(urlToCall, finalSettings);
};

export default useApiFetch;
