import { useUser } from "contexts/UserContext";
import { generateNewAccessToken } from "helpers/loginHelper";
import { useEffect, useState } from "react";
import useSWR from "swr";

const useRequest = ({
	method = "GET",
	baseUrl,
	timeout,
	headers,
	body,
	options = {},
}) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	let currentTime = new Date().toLocaleString();

	const {
		userData,
		logout,
		updateUserInfo,
		isTokenUpdating,
		setIsTokenUpdating,
	} = useUser();
	console.log("userData", userData);
	const fetcher = (...args) => fetch(...args).then((res) => res.json());
	// console.log("method", method);
	// console.log("baseUrl", baseUrl);
	if (!userData.access_token || isTokenUpdating) {
		return;
	} else if (userData.token_timeout <= currentTime) {
		setIsTokenUpdating(true);
		generateNewAccessToken(
			userData.refresh_token,
			logout,
			updateUserInfo,
			setIsTokenUpdating
		);
	}

	const {
		data: fetchedData,
		error: fetchedError,
		mutate: fetchData,
	} = useSWR(
		`${baseUrl}`,
		(url) =>
			fetcher(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					authorization: `Bearer ${userData.access_token}`,
					...headers,
				},
				body: body ? JSON.stringify(body) : null,
			}),
		{ revalidateOnFocus: false, revalidateOnMount: false, ...options }
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

	return { data, error, isLoading, fetchData };
};

export default useRequest;
