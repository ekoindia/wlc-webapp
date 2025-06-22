import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { ActionIcon, useKBarReady } from "components/CommandBar";
import {
	adminSidebarMenu,
	Endpoints,
	InteractionBehavior,
	sidebarMenu,
} from "constants";
import { useOrgDetailContext } from "contexts";
import {
	fetcher,
	filterTransactionLists,
	processTransactionData,
} from "helpers";
import { useAppLink, useFeatureFlag } from "hooks";
import { Priority, useRegisterActions } from "kbar";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { limitText } from "utils/textFormat";
import { useSession } from ".";

const SESSION_STORAGE_KEYS = {
	INTERACTION_LIST: "interaction_list",
	ROLE_TX_LIST: "role_tx_list",
	CACHE_ACCESS_TOKEN: "cache_access_token",
	TRXN_TYPE_PROD_MAP: "trxn_type_prod_map",
};

const MenuContext = createContext();

/**
 * Fetches and processes transaction data.
 * MARK: Fetcher
 * @param {string} accessToken - The access token for the API request.
 * @returns {Promise<object>} The processed data.
 */
const fetchData = async (accessToken) => {
	try {
		const response = await fetcher(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/wlc`,
			{
				token: accessToken,
			}
		);

		if (!response.length) {
			throw new Error("Error fetching transaction list");
		}

		return processTransactionData(response);
	} catch (error) {
		console.error("Error fetching transaction list:", error);
	}
};

/**
 * Context provider for fetching and providing the interactions which are available to the user as per their role. These are shown to the user in the left menu under "Start a Transaction" and "Other" sections.
 * It also provides the KBar actions for the transactions and menu links.
 * MARK: Context
 * @param {object} props - The props for the provider.
 * @param {ReactNode} props.children - The child components to be rendered within the provider
 * @returns {JSX.Element} The provider component.
 */
const MenuProvider = ({ children }) => {
	const { isLoggedIn, isAdmin, accessToken, isAdminAgentMode } = useSession();
	const [interactions, setInteractions] = useState({
		interaction_list: [],
		role_tx_list: {},
	});
	const [loading, setLoading] = useState(false);

	const { openUrl, router } = useAppLink();
	const { ready } = useKBarReady();
	const { orgDetail } = useOrgDetailContext();
	const { metadata } = orgDetail || {};
	const disabledFeatures = metadata?.disabled_features; // Used to disable any menu-item at the org-level
	const [_isFeatureEnabled, checkFeatureFlag] = useFeatureFlag();

	const [appLists, setAppLists] = useState({
		menuList: [],
		trxnList: [],
		otherList: [],
	});
	const [trxnActions, setTrxnActions] = useState([]);
	const [otherActions, setOtherActions] = useState([]);

	// Load menu data from API or cache
	// MARK: Load Menu
	useEffect(() => {
		const loadMenuData = async () => {
			try {
				setLoading(true);

				// Try to load menu data from session storage
				const localInteractionList =
					sessionStorage.getItem(
						SESSION_STORAGE_KEYS.INTERACTION_LIST
					) || "[]";
				const localRoleTxList =
					sessionStorage.getItem(SESSION_STORAGE_KEYS.ROLE_TX_LIST) ||
					"{}";
				const cachedAccessToken =
					sessionStorage.getItem(
						SESSION_STORAGE_KEYS.CACHE_ACCESS_TOKEN
					) || "-";
				const trxnTypeProdMap =
					sessionStorage.getItem(
						SESSION_STORAGE_KEYS.TRXN_TYPE_PROD_MAP
					) || "{}";

				if (
					localInteractionList !== "[]" &&
					localRoleTxList !== "{}" &&
					cachedAccessToken === accessToken
				) {
					const contextData = {
						interaction_list: JSON.parse(localInteractionList),
						role_tx_list: JSON.parse(localRoleTxList),
						trxn_type_prod_map: JSON.parse(trxnTypeProdMap),
					};
					setInteractions(contextData);
					console.log(
						"[MenuContext]: Data loaded from cache",
						contextData
					);
				} else {
					const processedData = await fetchData(accessToken);
					setInteractions(processedData);

					sessionStorage.setItem(
						SESSION_STORAGE_KEYS.INTERACTION_LIST,
						JSON.stringify(processedData.interaction_list)
					);
					sessionStorage.setItem(
						SESSION_STORAGE_KEYS.ROLE_TX_LIST,
						JSON.stringify(processedData.role_tx_list)
					);
					sessionStorage.setItem(
						SESSION_STORAGE_KEYS.TRXN_TYPE_PROD_MAP,
						JSON.stringify(processedData.trxn_type_prod_map)
					);
					sessionStorage.setItem(
						SESSION_STORAGE_KEYS.CACHE_ACCESS_TOKEN,
						accessToken
					);

					console.log(
						"[MenuContext]: Data loaded from API",
						processedData
					);
				}
			} catch (error) {
				console.error("MenuProvider error:", error);
			} finally {
				setLoading(false);
			}
		};

		if (isLoggedIn) {
			loadMenuData();
		}
	}, [isLoggedIn, isAdmin, accessToken]);

	// Process interactions into the main menu items, transaction lists, and other lists.
	// Also generate KBar actions for transactions and menu links.
	// MARK: Process Interactions
	useEffect(() => {
		const interactionList = interactions?.interaction_list;
		const roleTxList = interactions?.role_tx_list;

		if (!interactionList || !roleTxList) {
			setAppLists({
				menuList: [],
				trxnList: [],
				otherList: [],
			});
			return;
		}

		let _filteredMenuList = [];
		const _menuList =
			isAdmin && isAdminAgentMode !== true
				? adminSidebarMenu
				: sidebarMenu;

		// Filter out Disabled features (from org-metadata) & Feature Flags
		let _feat = [];
		if (disabledFeatures) {
			let disabledFeaturesObj = {};

			try {
				if (typeof disabledFeatures === "object") {
					disabledFeaturesObj = disabledFeatures;
				} else if (typeof disabledFeatures === "string") {
					disabledFeaturesObj = JSON.parse(disabledFeatures);
				}
				_feat = disabledFeaturesObj?.features;

				if (_feat && typeof _feat === "string") {
					_feat = JSON.parse(_feat);
				}
			} catch (e) {
				console.error("Error parsing disabled features", e);
			}
		}

		_filteredMenuList = _menuList.filter((item) => {
			// Skip if the feature is disabled in org metadata
			if (_feat.includes(item.id)) return false;

			// Skip if the feature is disabled in the feature flags
			if (item.featureFlag && !checkFeatureFlag(item.featureFlag))
				return false;
			return true;
		});

		const { trxnList: _trxnList, otherList: _otherList } =
			filterTransactionLists(interactionList, isAdmin, isAdminAgentMode);

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
			],
		});
		// setIsLoading(false);

		// MARK: KBar Actions
		if (ready) {
			// Only set KBar actions when KBar is ready

			const _otherActions = generateTransactionActions(
				_otherList.filter(Boolean),
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
					: generateTransactionActions(_trxnList, roleTxList, router)
			);
		}
	}, [
		interactions?.interaction_list,
		interactions?.role_tx_list,
		isAdmin,
		isAdminAgentMode,
		disabledFeatures,
		checkFeatureFlag,
	]);

	// Register actions for KBar
	// MARK: Register KBar
	useRegisterActions(
		[...trxnActions, ...otherActions],
		[[...trxnActions, ...otherActions]]
	);

	// MARK: Copilot
	// Define AI Copilot readable state for the main left menu items
	useCopilotReadable({
		description:
			"Main features (menu items) available to the user for managing their business, account, network, etc. The `link` field contains the relative URL for this feature.",
		value: appLists.menuList.map((item) => ({
			label: item.label || item.name,
			link: item.link,
			summary: item.summary,
			description: item.fullDescription || item.description || item.desc,
		})),
	});

	// Define AI Copilot readable state for the transaction list
	useCopilotReadable({
		description:
			"Financial transactions (products and services) available for the user. These are the main transactions that the user can perform. The `link` field contains the relative URL for this feature." +
			(isAdmin && isAdminAgentMode !== true
				? " (To view these transactions, the Admin must switch to agent-view first, by selecting it in the top-right profile menu popup)"
				: ""),
		value: appLists.trxnList.map((item) => ({
			label: item.label,
			link: item.link,
			summary: item.summary,
			description: item.fullDescription || item.description || item.desc,
		})),
	});

	console.log("[COPILOT] Adding data...");

	// Define AI Copilot readable state for the other items list
	useCopilotReadable({
		description:
			"Other options available to the user. These are not the main transactions, but still important to view their transaction history, manage their account, etc. The `link` field contains the relative URL for this feature.",
		value: appLists.otherList.map((item) => ({
			label: item.label,
			link: item.link,
			summary: item.summary,
			description: item.fullDescription || item.description || item.desc,
		})),
	});

	// Add Copilot action to open any link in the app
	useCopilotAction({
		name: "open-link",
		description:
			"Open any internal (relative) or external link in the app.",
		parameters: [
			{
				name: "link",
				type: "string",
				description:
					"The link to open. It can be an internal or external link, relative or absolute.",
				required: true,
			},
		],
		handler: async ({ link }) => {
			if (link) {
				openUrl(link);
			}
		},
	});

	// MARK: Values
	const value = useMemo(() => {
		return {
			interactions,
			loading,
			menuList: appLists?.menuList,
			trxnList: appLists?.trxnList,
			otherList: appLists?.otherList,
		};
	}, [
		interactions,
		loading,
		appLists?.menuList,
		appLists?.trxnList,
		appLists?.otherList,
	]);

	return (
		<MenuContext.Provider value={value}>{children}</MenuContext.Provider>
	);
};

/**
 * Custom hook to use the MenuContext. It provides all the transactions available to the user as per their role.
 * @returns {object} The context value.
 */
const useMenuContext = () => {
	const context = useContext(MenuContext);
	if (!context) {
		throw new Error("useMenuContext must be used within a MenuProvider");
	}
	return context;
};

/**
 * A helper function to create the KBar actions array from all the visible transactions from transaction_list which are part of role_transaction_list.
 * MARK: KBar: Tx
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
	// Helper inner function to get the transaction action object
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
	let trxn_found = false;
	interaction_list.forEach((tx) => {
		if (!tx) {
			return;
		}
		if (tx.id in role_tx_list && !(tx.id in processedTrxns)) {
			let is_group = false;
			processedTrxns[tx.id] = true;
			trxn_found = true;
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

	// If transaction list is empty or no transaction is allowed, return empty array
	if (!trxn_found) {
		return [];
	}

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
 * MARK: KBar: Menu
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
				id: "menulnk/" + (menu.name || menu.label),
				name: menu.name || menu.label,
				icon: (
					<ActionIcon
						icon={menu.icon}
						name={menu.name || menu.label}
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

export { MenuProvider, useMenuContext };
