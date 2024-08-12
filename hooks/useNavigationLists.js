import { ActionIcon, useKBarReady } from "components/CommandBar";
import {
	AdminBlacklistMenuItems,
	AdminOtherMenuItems,
	adminSidebarMenu,
	Endpoints,
	InteractionBehavior,
	OtherMenuItems,
	sidebarMenu,
	TransactionIds,
} from "constants";
import { useMenuContext, useOrgDetailContext, useUser } from "contexts";
import { useFeatureFlag } from "hooks";
import { Priority, useRegisterActions } from "kbar";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { limitText } from "utils/textFormat";

/**
 * A helper function to create the KBar actions array from all the visible transactions from transaction_list which are part of role_transaction_list.
 * @param {Array} interaction_list - List of all transactions
 * @param {object} role_tx_list - All transaction_ids that are allowed to the user (mapped to the trxn details)
 * @param router
 * @param is_other_list
 * @returns {Array} Array of KBar actions
 */
const generateTransactionActions = (
	interaction_list,
	role_tx_list,
	router,
	is_other_list = false
) => {
	const getTxAction = (tx, parent_id, is_group) => {
		const _id = "" + (parent_id ? `${parent_id}/` : "") + tx.id;
		const desc = tx.description || tx.desc || "";

		return {
			id: "tx/" + _id,
			name: tx.label,
			subtitle: limitText(desc, 60),
			// keywords: tx.label + " " + (tx.desc || "") + (tx.category || ""),
			icon: (
				<ActionIcon
					icon={tx.icon}
					ext_icon={tx.ext_icon}
					name={tx.label}
					style="filled"
				/>
			),
			priority: parent_id ? Priority.HIGH : Priority.NORMAL,
			// section: "Services",
			perform: is_group ? null : () => router.push("/transaction/" + _id),
			parent: parent_id
				? "tx/" + parent_id
				: is_other_list
					? "others"
					: "start-a-tx",
		};
	};

	const trxnList = is_other_list
		? [
				{
					id: "others",
					name: "Others...",
					// keywords: "dmt bbps recharge billpay product earn send cashin cashout transfer",
					icon: (
						<ActionIcon
							icon="others"
							// color="gray.500"
							style="filled"
						/>
					),
					// shortcut: ["$mod+/"],
					// section: "Services",
				},
			]
		: [
				{
					id: "start-a-tx",
					name: "Start a Transaction...",
					// keywords: "dmt bbps recharge billpay product earn send cashin cashout transfer",
					icon: (
						<ActionIcon
							icon="transaction"
							color="primary.light"
							style="filled"
						/>
					),
					shortcut: ["$mod+/"],
					// section: "Services",
				},
			];

	// Cache for transactions that contain sub-transactions
	const trxnGroups = [];

	// Cache of all trxn-ids already processed
	const processedTrxns = {};

	// Process main transactions
	interaction_list.forEach((tx) => {
		if (!tx) {
			return;
		}
		if (tx.id in role_tx_list && !(tx.id in processedTrxns)) {
			let is_group = false;
			processedTrxns[tx.id] = true;
			// Is this a transaction group (Grid) (i.e, contains sub-transactions)?
			if (tx.behavior == 7 && tx?.group_interaction_ids?.length) {
				is_group = true;
				trxnGroups.push({
					tx: tx,
					parent: "" + tx.id,
				});
			}
			trxnList.push(getTxAction(tx, null, is_group));
		}
	});

	// Recusrively process transaction groups...
	while (trxnGroups.length > 0) {
		const group = trxnGroups.shift();
		const { tx, parent } = group;
		const group_interaction_ids = tx.group_interaction_ids.split(",");
		group_interaction_ids.forEach((id) => {
			const subTx = role_tx_list[id];
			if (subTx && !(id in processedTrxns)) {
				const thisTx = {
					id: id,
					...subTx,
				};
				processedTrxns[id] = true;
				let is_group = false;
				// Is this a transaction group (i.e, contains sub-transactions)?
				if (
					subTx.behavior == InteractionBehavior.GRID &&
					subTx?.group_interaction_ids?.length > 0
				) {
					is_group = true;

					// Check if this group has all child transactions already processed
					const group_tx_ids =
						thisTx.group_interaction_ids.split(",");
					let all_processed = true;
					group_tx_ids.forEach((tx_id) => {
						if (!(tx_id in processedTrxns)) {
							all_processed = false;
						}
					});

					if (all_processed) {
						is_group = false;
					} else {
						trxnGroups.push({
							tx: thisTx,
							parent: "" + (parent ? `${parent}/` : "") + id,
						});
					}
				}
				trxnList.push(getTxAction(thisTx, parent, is_group));
			}
		});
	}

	return trxnList;
};

/**
 * A helper function to create the KBar actions array from all the visible left-menu links.
 * @param {Array} menu_list - List of all Menu items with a label and a link.
 * @param {object} router - Next.js router object
 * @returns {Array} Array of KBar actions
 */
const generateMenuLinkActions = (menu_list, router) => {
	const menuLinkActions = [];

	// get current route path from Nextjs router
	const currentRoute = router.pathname;

	menu_list.forEach((menu) => {
		if (menu.link != currentRoute) {
			menuLinkActions.push({
				id: "menulnk/" + menu.name,
				name: menu.name,
				icon: (
					<ActionIcon
						icon={menu.icon}
						name={menu.name}
						style="filled"
					/>
				),
				// section: "Services",
				perform: () => router.push(menu.link),
			});
		}
	});
	// console.log("menuLinkActions", menuLinkActions, menu_list);
	return menuLinkActions;
};

/**
 * Hook for generating navigation lists.
 * @param ignoreList
 * @returns {object} Navigation lists.
 */
const useNavigationLists = (ignoreList = []) => {
	const router = useRouter();
	const { interactions } = useMenuContext();
	const { interaction_list: interactionList, role_tx_list: roleTxList } =
		interactions ?? {};
	const { ready } = useKBarReady();
	const { isAdmin, isAdminAgentMode } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail;
	const disabledFeatures = metadata?.disabled_features;

	const [appLists, setAppLists] = useState({
		menuList: [],
		trxnList: [],
		otherList: [],
	});
	const [trxnActions, setTrxnActions] = useState([]);
	const [otherActions, setOtherActions] = useState([]);

	const [_isFeatureEnabled, checkFeatureFlag] = useFeatureFlag();

	const processInteractions = () => {
		const _trxnList = [];
		const _otherList = [];
		let _filteredMenuList = [];

		const _menuList =
			isAdmin && isAdminAgentMode !== true
				? adminSidebarMenu
				: sidebarMenu;

		// Filter out Disabled features (from org-metadata) & Feature Flags !!!
		const _feat = disabledFeatures
			? JSON.parse(disabledFeatures)?.features
			: [];

		_filteredMenuList = _menuList.filter((item) => {
			// Skip if the feature is disabled (from org-metadata)
			if (_feat.includes(item.id)) return false;

			// Skip if the feature is disabled (from feature-flags)
			if (item.featureFlag && !checkFeatureFlag(item.featureFlag))
				return false;

			// Ignore certain items
			if (ignoreList.includes(item.id)) return false;

			return true;
		});

		if (interactionList?.length > 0) {
			interactionList.forEach((tx) => {
				if (isAdmin) {
					if (AdminOtherMenuItems.includes(tx.id)) {
						_otherList.push(tx);
					} else if (isAdminAgentMode) {
						if (OtherMenuItems.includes(tx.id)) {
							_otherList.push(tx);
						} else if (!AdminBlacklistMenuItems.includes(tx.id)) {
							_trxnList.push(tx);
						}
					}
				} else {
					if (OtherMenuItems.includes(tx.id)) {
						_otherList.push(tx);
					} else {
						_trxnList.push(tx);
					}
				}
			});

			let manageMyAccount = roleTxList[TransactionIds.MANAGE_MY_ACCOUNT];
			if (manageMyAccount?.is_visible !== 1) {
				manageMyAccount = null;
			}

			setAppLists({
				menuList: _filteredMenuList,
				trxnList: _trxnList,
				otherList: [
					{
						icon: "transaction-history",
						label: "Transaction History",
						description: "Statement of your previous transactions",
						link: `${isAdmin ? "/admin" : ""}${Endpoints.HISTORY}`,
					},
					..._otherList,
					...(manageMyAccount ? [manageMyAccount] : []),
				],
			});

			if (ready) {
				const _otherActions = generateTransactionActions(
					[..._otherList, manageMyAccount].filter(Boolean),
					roleTxList,
					router,
					true
				);

				const _menuLinkActions = generateMenuLinkActions(
					_filteredMenuList,
					router
				);

				setOtherActions([..._otherActions, ..._menuLinkActions]);

				setTrxnActions(
					isAdmin && isAdminAgentMode !== true
						? []
						: generateTransactionActions(
								_trxnList,
								roleTxList,
								router
							)
				);
			}
		}
	};

	useEffect(() => {
		processInteractions();
	}, [interactionList, roleTxList, isAdmin, isAdminAgentMode, ready]);

	useRegisterActions(
		[...trxnActions, ...otherActions],
		[[...trxnActions, ...otherActions]]
	);

	return useMemo(() => appLists, [appLists]);
};

export default useNavigationLists;
