// import { ActionIcon } from "components/CommandBar";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useDailyCacheState } from "hooks";
import { createContext, useContext, useEffect } from "react";
import { validateResp } from "utils/validateResponse";
// import { useBusinessSearchActions } from "./GlobalSearchContext";

const CommisionContext = createContext();

export const useCommisionSummary = () => {
	return useContext(CommisionContext);
};

export const CommisionSummaryProvider = ({ children }) => {
	const [userCommision, setUserCommision, isValid] = useDailyCacheState(
		"inf-commission",
		{
			pricing_commission_data: [],
			userId: "",
		}
	);
	const { isLoggedIn, isAdmin, isOnboarding, accessToken, userId } =
		useSession();

	useEffect(() => {
		if (!isLoggedIn || !accessToken || isOnboarding || isAdmin) return;

		if (
			isValid &&
			userCommision?.userId &&
			userCommision?.userId === userId
		)
			return;

		setTimeout(
			() =>
				fetcher(
					process.env.NEXT_PUBLIC_API_BASE_URL +
						Endpoints.TRANSACTION,
					{
						headers: {
							"Content-Type": "application/json",
							"tf-req-uri-root-path": "/ekoicici/v1",
							"tf-req-uri": "/network/agent/pricing_commission",
							"tf-req-method": "GET",
						},
						token: accessToken,
					}
				)
					.then((response) => {
						if (validateResp(response)) {
							setUserCommision({
								pricing_commission_data:
									response.data?.pricing_commission_data,
								userId: userId,
							});
						}
					})
					.catch((error) => {
						// Handle any errors that occurred during the fetch
						console.error("ErrorMSG:", error);
					}),
			2000
		);
	}, [
		isLoggedIn,
		isAdmin,
		isOnboarding,
		accessToken,
		isValid,
		setUserCommision,
		userCommision?.userId,
		userId,
	]);

	// const CommisionAction = useMemo(() => {
	// 	const actionData = userCommision?.pricing_commission_data?.map(
	// 		({ product }) => ({
	// 			id: `know-your-commission-${product}`,
	// 			name: product,
	// 			subtitle: `${product} commissions`,
	// 			keywords: `business commission ${product}`,
	// 			icon: <ActionIcon iconSize="md" color={"success"} />,
	// 		})
	// 	);
	// 	return userCommision?.userId && userCommision?.userId === userId
	// 		? actionData
	// 		: [];
	// }, [userCommision]);

	// useBusinessSearchActions(CommisionAction, [CommisionAction]);

	return (
		<CommisionContext.Provider value={userCommision}>
			{children}
		</CommisionContext.Provider>
	);
};
