import { useEffect, useState } from "react";
import useSWR from "swr";

const useRequest = ({ method = "GET", baseUrl, timeout, body }) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	console.log("method", method);
	console.log("baseUrl", baseUrl);

	const fetcher = (...args) => fetch(...args).then((res) => res.json());

	const { data: fetchedData, error: fetchedError } = useSWR(
		`${baseUrl}`,
		(url) =>
			fetcher(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: body ? JSON.stringify(body) : null,
			})
	);

	useEffect(() => {
		if (!fetchedData) return;
		setData(fetchedData);
		setError(null);
		setIsLoading(false);
	}, [fetchedData]);

	useEffect(() => {
		if (!fetchedError) return;
		setError(fetchedError);
		setData(null);
		setIsLoading(false);
	}, [fetchedError]);

	return { data, error, isLoading };
};

export default useRequest;
