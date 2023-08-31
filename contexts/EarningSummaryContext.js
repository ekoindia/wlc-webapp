import { ActionIcon } from "components/CommandBar";
import { Endpoints } from "constants";
import { TransactionTypes } from "constants/EpsTransactions";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useDailyCacheState } from "hooks";
import { createContext, useContext, useEffect, useMemo } from "react";
import { formatCurrency } from "utils/numberFormat";
import { useBusinessSearchActions } from "./GlobalSearchContext";

/**
 * @typedef {Object} EarningSummaryValue
 * @property {number} this_month_till_yesterday - This month's earnings till yesterday midnight.
 * @property {number} last_month_till_yesterday - Last month's earnings till the previous day midnight.
 * @property {number} last_month_total - Last month's total earnings.
 * @property {string} asof - The date/time till which the earnings are calculated.
 * @property {string} userId - The user code of the user.
 */

/**
 * The EarningSummary context.
 */
const EarningSummaryContext = createContext();

/**
 * Custom hook to use the EarningSummary context.
 * @returns {EarningSummaryValue} The EarningSummary context.
 */
export const useEarningSummary = () => {
	return useContext(EarningSummaryContext);
};

/**
 * Provider component for the EarningSummary context.
 */
export const EarningSummaryProvider = ({ children }) => {
	const [userEarnings, setUserEarnings, isValid] = useDailyCacheState(
		"inf-earnsummary",
		{
			commission_due: 0,
			this_month_till_yesterday: 0,
			last_month_till_yesterday: 0,
			last_month_total: 0,
			asof: "",
			userId: "",
		}
	); // User earnings

	// Get the logged-in user's data from the UserContext.
	const { isLoggedIn, isAdmin, isOnboarding, accessToken, userId } =
		useSession();

	useEffect(() => {
		if (!isLoggedIn || !accessToken || isOnboarding || isAdmin) return;

		// If the cached data is present & valid (no older than one day),
		// don't fetch from the server.
		if (isValid && userEarnings?.userId && userEarnings?.userId === userId)
			return;

		// Fetch the earnings data from the server after slight delay.
		setTimeout(
			() =>
				fetcher(
					process.env.NEXT_PUBLIC_API_BASE_URL +
						Endpoints.TRANSACTION,
					{
						body: {
							interaction_type_id:
								TransactionTypes.GET_EARNING_SUMMARY,
						},
						token: accessToken,
					}
				)
					.then((data) => {
						if (
							data.data &&
							"this_month" in data.data &&
							data.data.this_month >= 0
						) {
							let yesterday = new Date();
							yesterday.setDate(yesterday.getDate() - 1);

							const asofDate = yesterday.toLocaleString("en-IN", {
								day: "numeric",
								month: "short",
							});
							const dayOfWeek = yesterday.toLocaleString(
								"en-IN",
								{
									weekday: "short",
								}
							);

							const earnings = {
								commission_due: data?.data?.commission_due || 0,
								this_month_till_yesterday: data.data.this_month,
								last_month_till_yesterday:
									data.data.last_month || 0,
								last_month_total: data.data.prev_month || 0,
								asof: `${asofDate} (${dayOfWeek})`,
								userId: userId,
							};
							setUserEarnings(earnings);
						}
					})
					.catch((error) => {
						// Handle any errors that occurred during the fetch
						console.error("[EarningSummaryContext] Error:", error);
					}),
			2000
		);
	}, [isLoggedIn, isAdmin, isOnboarding, accessToken, userId, isValid]);

	// Register the Earning Summary action for Command Bar.
	const earningSummaryAction = useMemo(() => {
		const hasIncreased =
			userEarnings?.this_month_till_yesterday >
			userEarnings?.last_month_till_yesterday
				? true
				: false;
		return userEarnings?.userId && userEarnings?.userId === userId
			? [
					{
						id: "earn-sumry",
						name: `My Earnings (this month till yesterday): ${formatCurrency(
							userEarnings.this_month_till_yesterday
						)}`,
						subtitle: `Last month earning (till yesterday): ${formatCurrency(
							userEarnings.last_month_till_yesterday
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
	}, [userEarnings]);

	useBusinessSearchActions(earningSummaryAction, [earningSummaryAction]);

	return (
		<EarningSummaryContext.Provider value={userEarnings}>
			{children}
		</EarningSummaryContext.Provider>
	);
};
