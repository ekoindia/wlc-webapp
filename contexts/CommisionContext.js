// import { ActionIcon } from "components/CommandBar";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useDailyCacheState } from "hooks";
import { createContext, useContext, useEffect } from "react";
import { validateResp } from "utils/validateResponse";
// import { useBusinessSearchActions } from "./GlobalSearchContext";
// 1% (min: $10, max: $20)
const response = {
	response_status_id: 0,
	data: {
		client_ref_id: "202306110030123456",
		pricing_commission_data: [
			{
				slab_from: "",
				min_value: 10.0,
				slab_to: "",
				value: "₹1.0",
				calc_type: 1,
				max_value: 100.0,
				product: "DMT",
				biller_name: "LMN",
				tx_type_id: 81,
			},
			{
				slab_from: 1.0,
				product: "AePS",
				biller_name: "PQR",
				tx_type_id: 345,
				product_id: 424,
				biller_id: "",
				slab_to: 100.0,
				value: "₹0.0",
				calc_type: 0,
			},
			{
				slab_from: 100,
				product: "AePS",
				biller_name: "abc",
				tx_type_id: 345,
				product_id: 424,
				biller_id: "",
				slab_to: 200.0,
				value: "₹0.0",
				calc_type: 0,
			},
			{
				slab_from: 500,
				product: "AePS",
				biller_name: "pqr",
				tx_type_id: 345,
				product_id: 424,
				biller_id: "",
				slab_to: 2000.0,
				value: "₹0.0",
				calc_type: 0,
			},
			{
				slab_from: 20.0,
				product: "Bharat Bill Pay",
				biller_name: "ABC",
				tx_type_id: 400,
				product_id: 500,
				biller_id: "",
				slab_to: 1000.0,
				value: "₹10.0",
				calc_type: 2,
			},
			{
				slab_from: 200.0,
				product: "Bharat Bill Pay",
				biller_name: "abc",
				tx_type_id: 400,
				product_id: 500,
				biller_id: "",
				slab_to: 10000.0,
				value: "₹10.0",
				calc_type: 2,
			},
			{
				slab_from: 50.0,
				product: "Bharat Bill Pay",
				biller_name: "xyz",
				tx_type_id: 400,
				product_id: 500,
				biller_id: "",
				slab_to: 5000.0,
				value: "₹10.0",
				calc_type: 2,
			},
		],
		user_code: "99012699",
		initiator_id: "9911572989",
		org_id: 1,
		tid: "2886123635",
	},
	response_type_id: 1895,
	message: "Agent product pricing and commission details found",
	status: 0,
};

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
					.then((data) => {
						console.log("Data", data);
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
						setUserCommision({
							pricing_commission_data:
								response.data?.pricing_commission_data,
							userId: userId,
						});
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
