import { Icon } from "components";
import { Endpoints, TransactionTypes } from "constants";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { Priority, useRegisterActions } from "kbar";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { formatCurrency } from "utils/numberFormat";
import { useSession } from "./UserContext";

// Created a Wallet Context
const WalletContext = createContext();

/**
 * @name useFetchBalance
 * @description This custom hook is used for fetching wallet balance and it can only be used in WalletProvider function
 * - If you want to use this hook in any other component, custom hook, context etc then first take out the setBalance from useWallet and then pass it in the useFetchBalance hook.
 * @param {function} setBalance - This is a function used to set the balance value.
 * @returns {function} fetchBalance - This function is used to fetch wallet balance.
 * */
const useFetchBalance = (setBalance, accessToken) => {
	// const [loading, setLoading] = useState(false);

	// GenerateNewAccessToken function to be used in fetcher, if the current accessToken is expired
	const { generateNewToken } = useRefreshToken();

	const fetchBalance = useCallback(() => {
		// console.log("::::fetchBalance::::");
		// setLoading(true);
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
			});
		// .finally(() => setLoading(false));
	}, [accessToken]);

	return { fetchBalance /* loading */ };
};

/**
 * @name WalletProvider
 * @description It is used in _app.js file and is used to provide context value in whole app
 * @returns {Object} An object with the following properties:
 * @property {function} refreshWallet - used to refresh wallet balance
 * @property {function} setBalance - used to set the balance from anywhere
 * @property {string} balance - used to get the wallet balance value
 */
const WalletProvider = ({ children }) => {
	const [balance, setBalance] = useState(null);
	const { isLoggedIn, isAdmin, accessToken } = useSession();
	const { fetchBalance } = useFetchBalance(setBalance, accessToken);

	useEffect(() => {
		if (isLoggedIn && !isAdmin) {
			fetchBalance();
		}
	}, [isLoggedIn, isAdmin]);

	const walletAction = useMemo(() => {
		return balance
			? [
					{
						id: "show-wallet-balance",
						name: `My Wallet Balance: ${formatCurrency(balance)}`,
						keywords: "e-value fund",
						icon: (
							<Icon
								name="wallet-outline"
								size="sm"
								color="#334155"
							/>
						),
						priority: Priority.LOW,
						perform: () => {},
					},
			  ]
			: [];
	}, [balance]);

	useRegisterActions(walletAction, [walletAction]);

	return (
		<WalletContext.Provider
			value={{
				refreshWallet: fetchBalance,
				setBalance,
				balance,
			}}
		>
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
