// import { ActionIcon } from "components/CommandBar";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useDailyCacheState } from "hooks";
import { createContext, useContext, useEffect } from "react";
import { validateResp } from "utils/validateResponse";
// import { useBusinessSearchActions } from "./GlobalSearchContext";

const CommissionContext = createContext();

/**
 * Hook to get the commission details for the user
 */
export const useCommissionSummary = () => {
	return useContext(CommissionContext);
};

/**
 * Format the commission data to be used in the UI
 * @param {Object} data - Commission data
 */
const formatCommissionData = (data) => {
	const newData = {};
	if (!data) {
		return newData;
	}

	data.forEach((item) => {
		if (!item.product_id) {
			return;
		}

		const slug = item.product
			? item.product
					.trim()
					.toLowerCase()
					.replace(/[^a-z0-9]+/, "_")
			: item.product_id;

		if (!newData[slug]) {
			newData[slug] = {
				id: item.product_id,
				label: item.product || `Prod-${item.product_id}`,
				slabs: [],
			};
		}

		newData[slug].slabs.push(item);
	});

	return newData;
};

export const CommissionSummaryProvider = ({ children }) => {
	const [userCommission, setUserCommission, isValid] = useDailyCacheState(
		"inf-commission",
		{
			pricing_commission_data: [],
			userId: "",
		}
	);
	const { isLoggedIn, isAdmin, isOnboarding, accessToken, userId } =
		useSession();

	useEffect(() => {
		if (!isLoggedIn || !accessToken || isOnboarding || isAdmin) {
			return;
		}

		if (
			isValid &&
			userCommission?.userId &&
			userCommission?.userId === userId
		) {
			return;
		}

		// Fetch the commissions data from the API after a delay of 2 seconds
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
						if (
							validateResp(response) &&
							response.data?.pricing_commission_data
						) {
							setUserCommission({
								data: formatCommissionData(
									response.data?.pricing_commission_data
								),
								userId: userId,
							});
						}
					})
					.catch((error) => {
						// Handle any errors that occurred during the fetch
						console.error("[Commission] Error:", error);
					}),
			2000
		);
	}, [
		isLoggedIn,
		isAdmin,
		isOnboarding,
		accessToken,
		isValid,
		setUserCommission,
		userCommission?.userId,
		userId,
	]);

	// const CommissionAction = useMemo(() => {
	// 	const actionData = userCommission?.pricing_commission_data?.map(
	// 		({ product }) => ({
	// 			id: `know-your-commission-${product}`,
	// 			name: product,
	// 			subtitle: `${product} commissions`,
	// 			keywords: `business commission ${product}`,
	// 			icon: <ActionIcon iconSize="md" color={"success"} />,
	// 		})
	// 	);
	// 	return userCommission?.userId && userCommission?.userId === userId
	// 		? actionData
	// 		: [];
	// }, [userCommission]);

	// useBusinessSearchActions(CommissionAction, [CommissionAction]);

	return (
		<CommissionContext.Provider value={userCommission}>
			{children}
		</CommissionContext.Provider>
	);
};
