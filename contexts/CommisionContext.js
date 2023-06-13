import { ActionIcon } from "components/CommandBar";
import { TransactionTypes } from "constants/EpsTransactions";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useDailyCacheState } from "hooks";
import { createContext, useContext, useEffect, useMemo } from "react";
import { formatCurrency } from "utils/numberFormat";
import { useBusinessSearchActions } from "./GlobalSearchContext";

const response = {
	response_status_id: 0,
	data: {
		client_ref_id: "202306110030123456",
		pricing_commission_data: [
			{
				slab_from: "",
				min_value: 10.0,
				slab_to: "",
				value: "1.0",
				calc_type: 1,
				max_value: 100.0,
				product: "DMT",
				biller_name: "",
				tx_type_id: 81,
			},
			{
				slab_from: 1.0,
				product: "AePS",
				biller_name: "",
				tx_type_id: 345,
				product_id: 424,
				biller_id: "",
				slab_to: 100.0,
				value: "₹0.0",
				calc_type: 0,
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
		"inf-earnsummary",
		{
			this_month_till_yesterday: 0,
			last_month_till_yesterday: 0,
			last_month_total: 0,
			asof: "",
			userId: "",
		}
	);
	const { isLoggedIn, isAdmin, isOnboarding, accessToken, userId } =
		useSession();

	useEffect(() => {
		// if (!isLoggedIn || !accessToken || isOnboarding || isAdmin) return;

		// if (
		// 	isValid &&
		// 	userCommision?.userId &&
		// 	userCommision?.userId === userId
		// )
		// return;

		setTimeout(
			() =>
				fetcher(
					process.env.NEXT_PUBLIC_API_BASE_URL +
						"/agent/pricing_commission?initiator_id=9911572989&user_code=99012699&org_id=1&source=WLC&client_ref_id=202306110030123456",
					{
						body: {
							interaction_type_id:
								TransactionTypes.GET_EARNING_SUMMARY,
						},
						token: accessToken,
					}
				)
					.then((data) => {
						setUserCommision(response);
						// if (
						// 	data.data &&
						// 	"this_month" in data.data &&
						// 	data.data.this_month >= 0
						// ) {
						// 	let yesterday = new Date();
						// 	yesterday.setDate(yesterday.getDate() - 1);

						// 	const asofDate = yesterday.toLocaleString("en-IN", {
						// 		day: "numeric",
						// 		month: "short",
						// 	});
						// 	const dayOfWeek = yesterday.toLocaleString("en-IN", {
						// 		weekday: "short",
						// 	});

						// 	const commision = {
						// 		this_month_till_yesterday: data.data.this_month,
						// 		last_month_till_yesterday:
						// 			data.data.last_month || 0,
						// 		last_month_total: data.data.prev_month || 0,
						// 		asof: `${asofDate} (${dayOfWeek})`,
						// 		userId: userId,
						// 	};
						// 	setUserCommision(commision);
						// }
					})
					.catch((error) => {
						// Handle any errors that occurred during the fetch
						// console.error("ErrorMSG:", error);
						setUserCommision(response);
					}),
			2000
		);
	}, [isLoggedIn, isAdmin, isOnboarding, accessToken, userId, isValid]);

	const CommisionAction = useMemo(() => {
		const hasIncreased =
			userCommision?.this_month_till_yesterday >
			userCommision?.last_month_till_yesterday
				? true
				: false;
		return userCommision?.userId && userCommision?.userId === userId
			? [
					{
						id: "earn-sumry",
						name: `My Earnings (this month till yesterday): ${formatCurrency(
							userCommision.this_month_till_yesterday
						)}`,
						subtitle: `Last month earning (till yesterday): ${formatCurrency(
							userCommision.last_month_till_yesterday
						)}`,
						keywords: "business commission",
						icon: (
							<ActionIcon
								icon={hasIncreased ? "increase" : "decrease"}
								iconSize="md"
								color={hasIncreased ? "success" : "error"}
							/>
						),
					},
			  ]
			: [];
	}, [userCommision]);

	useBusinessSearchActions(CommisionAction, [CommisionAction]);

	return (
		<CommisionContext.Provider value={userCommision}>
			{children}
		</CommisionContext.Provider>
	);
};
