import { fetcher, processTransactionData } from "helpers";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
 * Context provider for fetching and providing the left-menu items (interactions).
 * @param root0
 * @param root0.children
 */
const MenuProvider = ({ children }) => {
	const { isLoggedIn, isAdmin, accessToken } = useSession();
	const [interactions, setInteractions] = useState({
		interaction_list: [],
		role_tx_list: {},
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const loadMenuData = async () => {
			try {
				setLoading(true);

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

	const value = useMemo(() => {
		return {
			interactions,
			loading,
		};
	}, [interactions, loading]);

	return (
		<MenuContext.Provider value={value}>{children}</MenuContext.Provider>
	);
};

/**
 * Custom hook to use the MenuContext.
 * @returns {object} The context value.
 */
const useMenuContext = () => {
	const context = useContext(MenuContext);
	if (!context) {
		throw new Error("useMenuContext must be used within a MenuProvider");
	}
	return context;
};

export { MenuProvider, useMenuContext };
