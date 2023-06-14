import { ActionIcon } from "components/CommandBar";
import { Endpoints } from "constants/EndPoints";
import { useSession } from "contexts/UserContext";
import { fetcher } from "helpers/apiHelper";
import { useDailyCacheState } from "hooks";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo } from "react";
import { formatCurrency } from "utils";
import { validateResp } from "utils/validateResponse";
import { useBusinessSearchActions } from "./GlobalSearchContext";

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

		const tx_value = !(item.slab_from || item.slab_to)
			? "Any"
			: `₹${item.slab_from || 0} - ₹${item.slab_to || "Any"}`;

		let commission;
		if (item.calc_type === 1) {
			commission = `${item.value || 0}%`;
			if (item.min_value || item.max_value) {
				commission += " (";
				if (item.min_value) {
					commission += `min: ${formatCurrency(
						item.min_value,
						"INR",
						false,
						true
					)}`;
				}
				if (item.max_value) {
					if (item.min_value) {
						commission += ", ";
					}
					commission += `max: ${formatCurrency(
						item.max_value,
						"INR",
						false,
						true
					)}`;
				}
				commission += ")";
			}
		} else {
			commission = item.value;
		}

		newData[slug].slabs.push({
			transaction_value: tx_value,
			commission,
			biller_name: item.biller_name || "",
		});
	});

	return newData;
};

export const CommissionSummaryProvider = ({ children }) => {
	const router = useRouter();

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

	// Generate search actions for CommandBar
	const CommissionAction = useMemo(() => {
		const actionList = [
			{
				id: "know-your-commissions",
				name: "Know Your Commissions",
				subtitle: "Get product-wise commission details",
				keywords: `earning pricing`,
				icon: (
					<ActionIcon
						icon="high-commission"
						iconSize="28px"
						// color={"success"}
					/>
				),
				perform: false,
				priority: 1,
			},
		];

		const commissionProdIds = Object.keys(userCommission?.data || {});

		if (!commissionProdIds.length) {
			return [];
		}

		// const commissionProducts = commissionProdIds.map((id) => ({
		// 	id,
		// 	label: commissionData?.data[id].label || id,
		// }));

		commissionProdIds.forEach((id) => {
			const prod = userCommission?.data[id];
			if (!prod) {
				return;
			}

			let len = prod.slabs.length;
			if (len > 3) {
				len = 3;
			}
			let prodSlabs = "";
			for (let i = 0; i < len; i++) {
				const slab = prod.slabs[i];
				prodSlabs +=
					(prodSlabs === "" ? "" : ", ") +
					`${slab.commission} for ${slab.transaction_value} ${
						slab.biller_name ? `(${slab.biller_name})` : ""
					}`;
			}
			prodSlabs = prodSlabs.substring(0, 50) + "...";

			actionList.push({
				id: `know-your-commission-${id}`,
				name: "View " + prod.label + " Commissions",
				subtitle: prodSlabs,
				keywords: `${prod.label} commission earning pricing`,
				icon: (
					<ActionIcon
						icon="high-commission"
						iconSize="28px"
						color="#d946ef"
					/>
				),
				parent: "know-your-commissions",
				perform: () => router.push("/commissions/" + id),
				priority: 1,
			});

			// const prodSlabs = prod.slabs.map(({ transaction_value }) => ({
			// 	id: `${id}-${transaction_value}`,
			// 	label: transaction_value,
			// }));
		});

		// const actionData = userCommission?.data?.map(({ product }) => ({
		// 	id: `know-your-commission-${product}`,
		// 	name: product,
		// 	subtitle: `${product} commissions`,
		// 	keywords: `business commission ${product}`,
		// 	icon: <ActionIcon iconSize="md" color={"success"} />,
		// }));
		// return userCommission?.userId && userCommission?.userId === userId
		// 	? actionData
		// 	: [];

		console.log("actionList:::: ", actionList);

		return actionList;
	}, [userCommission]);

	useBusinessSearchActions(CommissionAction, [CommissionAction]);

	return (
		<CommissionContext.Provider value={userCommission}>
			{children}
		</CommissionContext.Provider>
	);
};
