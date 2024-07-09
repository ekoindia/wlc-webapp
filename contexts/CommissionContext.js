import { ActionIcon } from "components/CommandBar";
import { Endpoints } from "constants/EndPoints";
import { useMenuContext, useSession } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { useDailyCacheState } from "hooks";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
 * @param {object} data - Commission data
 * @param {object} trxn_type_prod_map - Transaction type product map (to get product icon, etc)
 */
const formatCommissionData = (data, trxn_type_prod_map) => {
	const newData = {};
	if (!data) {
		return newData;
	}

	data.forEach((item) => {
		if (!item.product_id) {
			return;
		}

		if (!(item.tx_type_id in trxn_type_prod_map)) {
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
				tx_type_id: item.tx_type_id,
				label: item.product || `Prod-${item.product_id}`,
				icon: trxn_type_prod_map?.[item.tx_type_id]?.icon || "",
				slabs: [],
			};
		}

		const slab_from = formatCurrency(
			(parseFloat(item.slab_from || 1) || 0).toFixed(2),
			"INR",
			false,
			true
		);
		const slab_to = formatCurrency(
			(parseFloat(item.slab_to) || 0).toFixed(2),
			"INR",
			false,
			true
		);

		const tx_value = !(item.slab_from || item.slab_to)
			? "Any Value"
			: `${slab_from} - ${slab_to}`;

		let commission;
		const comm_val = (parseFloat(item.value) || 0).toFixed(2);
		if (item.calc_type === 1) {
			commission = `${comm_val || 0}%`;
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
			commission = formatCurrency(
				parseFloat(comm_val),
				"INR",
				false,
				true
			);
		}

		newData[slug].slabs.push({
			transaction_value: tx_value,
			commission,
			biller_name: item.biller_name || "",
		});
	});

	return newData;
};

/**
 * Commission Provider to get the commission details for the user
 * @param {*} param0
 * @returns
 */
export const CommissionSummaryProvider = ({ children }) => {
	const router = useRouter();
	const { interactions } = useMenuContext();
	const { trxn_type_prod_map } = interactions;

	// console.log("trxn_type_prod_map:", /* interactions, */ trxn_type_prod_map);

	const [fetchAttempted, setFetchAttempted] = useState(false);

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
		if (
			!isLoggedIn ||
			!accessToken ||
			isOnboarding ||
			isAdmin ||
			fetchAttempted
		) {
			return;
		}

		// If the transaction type product map is not available (from role-list),
		// then skip fetching the commissions
		if (!(trxn_type_prod_map && Object.keys(trxn_type_prod_map).length)) {
			return;
		}

		if (
			isValid &&
			userCommission?.userId &&
			userCommission?.userId === userId
		) {
			return;
		}

		setFetchAttempted(true);

		// Fetch the commissions data from the API after a delay of 2 seconds
		setTimeout(
			() =>
				fetcher(
					process.env.NEXT_PUBLIC_API_BASE_URL +
						Endpoints.TRANSACTION +
						"?type=pricing_commission",
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
									response.data?.pricing_commission_data,
									trxn_type_prod_map
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
		fetchAttempted,
	]);

	// Generate search actions for CommandBar
	const CommissionAction = useMemo(() => {
		const actionList = [
			{
				id: "know-your-commissions",
				name: "Know Your Commissions",
				subtitle: "Get commission details for every product",
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
			const prod = userCommission?.data?.[id];
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
				subtitle: "Earn " + prodSlabs,
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

		return actionList;
	}, [userCommission]);

	useBusinessSearchActions(CommissionAction, [CommissionAction]);

	return (
		<CommissionContext.Provider value={userCommission}>
			{children}
		</CommissionContext.Provider>
	);
};
