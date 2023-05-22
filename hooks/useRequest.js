import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useRefreshToken from "./useRefreshToken.js";

const useRequest = ({
	method = "GET",
	baseUrl,
	// timeout,
	headers,
	body,
	options = {},
}) => {
	// console.log("::::Api Call started::::");
	// console.log("headers in useRequest", headers["tf-req-uri"]);
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	// const [isLoading, setIsLoading] = useState(true);
	const { generateNewToken } = useRefreshToken();

	const { accessToken } = useSession();

	const controller = new AbortController();

	// console.log("method", method);
	// console.log("baseUrl", baseUrl);
	// const fetcher = (...args) => fetch(...args).then((res) => res.json());

	const {
		data: fetchedData,
		error: fetchedError,
		isLoading,
		// revalidate,
		mutate,
	} = useSWR(
		`${baseUrl}`,
		(url) =>
			fetcher(
				url,
				{
					method,
					headers,
					token: accessToken,
					body,
					controller,
				},
				generateNewToken
			),
		{
			// provider: localStorageProvider,
			revalidateOnFocus: false,
			revalidateOnMount: false,
			...options,
		}
	);

	useEffect(() => {
		if (!fetchedData) return;
		setData(fetchedData);
		setError(null);
		// setIsLoading(false);
	}, [fetchedData]);

	useEffect(() => {
		if (!fetchedError) return;
		setError(fetchedError);
		setData(null);
		// setIsLoading(false);
	}, [fetchedError]);

	return { data, error, isLoading, mutate, controller };
};

export default useRequest;
