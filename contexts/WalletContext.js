import { ActionIcon } from "components/CommandBar";
import { Endpoints, TransactionTypes } from "constants";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { formatCurrency } from "utils/numberFormat";
import { useBusinessSearchActions } from "./GlobalSearchContext";
import { useSession } from "./UserContext";

// Created a Wallet Context
const WalletContext = createContext();

/**
 * @name useFetchBalance
 * @param accessToken
 * @description This custom hook is used for fetching wallet balance and it can only be used in WalletProvider function
 * - If you want to use this hook in any other component, custom hook, context etc then first take out the setBalance from useWallet and then pass it in the useFetchBalance hook.
 * @param {Function} setBalance - This is a function used to set the balance value.
 * @returns {Function} fetchBalance - This function is used to fetch wallet balance.
 */
const useFetchBalance = (setBalance, accessToken) => {
	const [loading, setLoading] = useState(false);

	// GenerateNewAccessToken function to be used in fetcher, if the current accessToken is expired
	const { generateNewToken } = useRefreshToken();

	const fetchBalance = useCallback(() => {
		// console.log("::::fetchBalance::::");
		setLoading(true);
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: accessToken,
				body: {
					interaction_type_id: TransactionTypes.GET_WALLET_BALANCE,
				},
				timeout: 30000,
			},
			generateNewToken
		)
			.then((data) => {
				console.log("[useFetchBalance] Balance: ", data);

				if (data && data.data && "balance" in data.data) {
					setBalance(+data?.data?.balance || 0);
				}
			})
			.catch((err) => {
				console.error("[useFetchBalance] error: ", err);
			})
			.finally(() => setLoading(false));
	}, [accessToken]);

	return { fetchBalance, loading };
};

/**
 * @param root0
 * @param root0.children
 * @name WalletProvider
 * @description It is used in _app.js file and is used to provide context value in whole app
 * @returns {object} An object with the following properties:
 * @property {Function} refreshWallet - used to refresh wallet balance
 * @property {Function} setBalance - used to set the balance from anywhere
 * @property {string} balance - used to get the wallet balance value
 */
const WalletProvider = ({ children }) => {
	const [balance, setBalance] = useState(null);
	const { isLoggedIn, userId, accessToken } = useSession();
	const { fetchBalance, loading } = useFetchBalance(setBalance, accessToken);
	// const router = useRouter();

	// const gsdata = useGlobalSearch();
	// console.log("gsdata", gsdata);

	useEffect(() => {
		if (isLoggedIn) {
			fetchBalance();
		}
	}, [isLoggedIn, userId, fetchBalance]);

	// Registering the wallet action in KBar
	const walletAction = useMemo(() => {
		return balance
			? [
					{
						id: "show-wallet-balance",
						name: `My E-value Balance: ${formatCurrency(balance)}`,
						// subtitle: "Select to load balance in your E-value",
						keywords: "e-value wallet fund",
						icon: (
							<ActionIcon
								icon="wallet-outline"
								iconSize="md"
								color="#334155"
							/>
						),
						// perform: () => router.push("/commissions/" + id),
						// priority: -1,
					},
				]
			: [];
	}, [balance]);
	useBusinessSearchActions(walletAction, [walletAction]);

	// Cache the context values
	const contextValues = useMemo(
		() => ({
			balance,
			refreshWallet: fetchBalance,
			setBalance,
			loading,
		}),
		[balance, loading, fetchBalance, setBalance]
	);

	return (
		<WalletContext.Provider value={contextValues}>
			{children}
		</WalletContext.Provider>
	);
};

/**
 * @name useWallet
 * @description This hook will directly provide the WalletContext values
 * @returns Object - The object will the data
 * @example import { useWallet } from 'contexts';
 * const { refreshWallet, setBalance, balance} = useWallet();
 */
const useWallet = () => {
	const context = useContext(WalletContext);
	if (!context) {
		throw new Error("useWallet must be used within a <WalletProvider>");
	}
	return context;
};

export { WalletProvider, useWallet };
