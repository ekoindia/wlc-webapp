import { ActionIcon, useKBarReady } from "components/CommandBar";
import {
	AdminBlacklistMenuItems,
	AdminOtherMenuItems,
	OtherMenuItems,
	TransactionIds,
} from "constants";
import { adminSidebarMenu, sidebarMenu } from "constants/SidebarMenu";
import { processTransactionData } from "helpers";
import { fetcher } from "helpers/apiHelper";
import { Priority, useRegisterActions } from "kbar";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { limitText } from "utils/textFormat";
import { useOrgDetailContext } from "./OrgDetailContext";
import { useUser } from "./UserContext";

/**
 * A helper function to create the KBar actions array from all the visible transactions from transaction_list which are part of role_transaction_list.
 * @param {Array} interaction_list - List of all transactions
 * @param {Object} role_tx_list - All transaction_ids that are allowed to the user (mapped to the trxn details)
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
					subTx.behavior == 7 &&
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
 * @param {Object} router - Next.js router object
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

const MenuContext = createContext();

const MenuProvider = ({ children }) => {
	const router = useRouter();
	const { ready } = useKBarReady();
	const { isLoggedIn, isAdmin, isAdminAgentMode, accessToken } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail;
	const disabledFeatures = metadata?.disabled_features;

	const [loading, setLoading] = useState(false);

	const [interactions, setInteractions] = useState({
		interaction_list: [],
		role_tx_list: {},
	});

	const [appLists, setAppLists] = useState({
		menuList: [],
		trxnList: [],
		otherList: [],
	});

	const [trxnActions, setTrxnActions] = useState([]);
	const [otherActions, setOtherActions] = useState([]);

	const fetchData = async () => {
		setLoading(true);
		try {
			const data = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/wlc",
				{ token: accessToken }
			);
			if (data.length) {
				const processedData = processTransactionData(data);
				setInteractions(processedData);
				Object.keys(processedData).forEach((key) =>
					sessionStorage.setItem(
						key,
						JSON.stringify(processedData[key])
					)
				);
				sessionStorage.setItem("cache_access_token", accessToken);
			}
		} catch (err) {
			console.error("MenuProvider error: ", err);
		} finally {
			setLoading(false);
		}
	};

	const getCachedData = () => ({
		interaction_list: JSON.parse(
			sessionStorage.getItem("interaction_list") || "[]"
		),
		role_tx_list: JSON.parse(
			sessionStorage.getItem("role_tx_list") || "{}"
		),
		trxn_type_prod_map: JSON.parse(
			sessionStorage.getItem("trxn_type_prod_map") || "{}"
		),
	});

	const onUserLogin = () => {
		const cachedData = getCachedData();
		const cache_access_token =
			sessionStorage.getItem("cache_access_token") || "-";
		if (
			cache_access_token === accessToken &&
			cachedData.interaction_list.length &&
			Object.keys(cachedData.role_tx_list).length
		) {
			setInteractions(cachedData);
			setLoading(false);
		} else {
			fetchData();
		}
	};

	const processInteractions = () => {
		const { interaction_list, role_tx_list } = interactions ?? {};
		const _trxnList = [];
		const _otherList = [];
		let _filteredMenuList = [];

		const _menuList =
			isAdmin && isAdminAgentMode !== true
				? adminSidebarMenu
				: sidebarMenu;

		if (disabledFeatures) {
			_menuList.forEach((item) => {
				const _feat = JSON.parse(disabledFeatures)?.features;
				if (!_feat.includes(item.id)) {
					_filteredMenuList.push(item);
				}
			});
		} else {
			_filteredMenuList = _menuList;
		}

		if (interaction_list?.length > 0) {
			interaction_list.forEach((tx) => {
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

			let manageMyAccount = {
				id: TransactionIds.MANAGE_MY_ACCOUNT,
				...role_tx_list[TransactionIds.MANAGE_MY_ACCOUNT],
			};

			if (manageMyAccount?.is_visible === 1) {
				manageMyAccount = null;
			}

			setAppLists({
				menuList: _filteredMenuList,
				trxnList: _trxnList,
				otherList: [
					..._otherList,
					...(manageMyAccount ? [manageMyAccount] : []),
				],
			});

			if (ready) {
				let _otherActions = generateTransactionActions(
					[..._otherList, manageMyAccount],
					role_tx_list,
					router,
					true // is-other-list
				);

				let _menuLinkActions = generateMenuLinkActions(
					_menuList,
					router
				);

				setOtherActions([..._otherActions, ..._menuLinkActions]);

				setTrxnActions(
					isAdmin && isAdminAgentMode !== true
						? []
						: generateTransactionActions(
								_trxnList,
								role_tx_list,
								router
						  )
				);
			}
		}
	};

	useEffect(() => {
		if (isLoggedIn) {
			onUserLogin();
		}
	}, [isLoggedIn, accessToken]);

	useEffect(() => {
		processInteractions();
	}, [
		interactions?.interaction_list,
		interactions?.role_tx_list,
		isAdmin,
		isAdminAgentMode,
		ready,
	]);

	useRegisterActions(
		[...trxnActions, ...otherActions],
		[[...trxnActions, ...otherActions]]
	);

	const value = useMemo(() => {
		const { menuList, trxnList, otherList } = appLists;
		return {
			interactions,
			menuList,
			trxnList,
			otherList,
			loading,
		};
	}, [
		interactions,
		appLists?.menuList,
		appLists?.trxnList,
		appLists?.otherList,
		loading,
	]);

	return (
		<MenuContext.Provider value={value}>{children}</MenuContext.Provider>
	);
};

const useMenuContext = () => {
	const context = useContext(MenuContext);
	return context;
};

export { MenuProvider, useMenuContext };
