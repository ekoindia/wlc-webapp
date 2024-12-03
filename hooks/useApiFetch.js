import { useState, useEffect } from "react";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";

/**
 * Hook for fetching data from the Eloka internal APIs (using the fetcher utility). It's a wrapper around the fetcher utility which automatically takes care of token refresh and other common API-related tasks.
 * @param {string} defaultUrlEndpoint - The default URL endpoint to fetch data from. If not provided, it can be overwritten later during the actual fetch call.
 * @param {object} defaultOptions - The default options to be passed to the fetcher utility. If not provided, it can be overwritten later during the actual fetch call.
 * @returns {Array} An array containing the function to fetch the API data, function to cancel the fetch request, and a boolean flag indicating if the fetch request is in progress.
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
const useApiFetch = (defaultUrlEndpoint, defaultOptions) => {
	const [endpoint] = useState(defaultUrlEndpoint);
	const [options] = useState(defaultOptions);
	const [controller] = useState(new AbortController());

	const { generateNewToken } = useRefreshToken();
	const { accessToken } = useSession();

	const [loading, setLoading] = useState(false);

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
	 * @param {object} [otherFetchOptions] - Any other options to be passed to the fetcher utility.
	 * @returns {Promise} A promise object representing the fetch response.
	 */
	const fetchApiData = async ({
		url_endpoint,
		method,
		headers,
		body = {},
		timeout,
		token,
		isMultipart,
		...otherFetchOptions
	}) => {
		setLoading(true);

		let url = url_endpoint || endpoint;

		if (!url) {
			console.error("[useApiFetch] URL not provided.");
			return null;
		}

		if (!url.toLowerCase().startsWith("http")) {
			url = process.env.NEXT_PUBLIC_API_BASE_URL + url;
		}

		try {
			const data = await fetcher(
				url,
				{
					...{
						controller: controller,
						token: accessToken,
					},
					...options,
					...{
						body: {
							...options?.body,
							...body,
						},
						method,
						headers,
						timeout,
						token,
						isMultipart,
						...otherFetchOptions,
					},
				},
				generateNewToken
			);
			return data;
		} catch (err) {
			console.error("[useApiFetch] error: ", err);
			return null;
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Function to cancel the fetch request.
	 */
	const cancelFetch = () => {
		controller.abort();
	};

	// Cancel fetch on unmount
	useEffect(() => {
		return () => {
			cancelFetch();
		};
	}, []);

	return [fetchApiData, cancelFetch, loading];
};

export default useApiFetch;
