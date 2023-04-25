import { Endpoints } from "constants";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useUser } from "./UserContext";

// Created a Wallet Context
const WalletContext = createContext();

/**
 * @name useFetchBalance
 * @description This custom hook is used for fetching wallet balance and it can only be used in WalletProvider function
 * - If you want to use this hook in any other component, custom hook, context etc then first take out the setBalance from useWallet and then pass it in the useFetchBalance hook.
 * @param {function} setBalance - This is a function used to set the balance value.
 * @returns {function} fetchBalance - This function is used to fetch wallet balance.
 * */
const useFetchBalance = (setBalance) => {
	const { userData } = useUser();
	// const [loading, setLoading] = useState(false);
	const { generateNewToken } = useRefreshToken();

	const fetchBalance = useCallback(() => {
		console.log("::::fetchBalance::::");
		// setLoading(true);
		fetcher(
			process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
			{
				token: userData?.access_token,
				body: {
					interaction_type_id: 9,
				},
				timeout: 30000,
			},
			generateNewToken
		)
			.then((data) => {
				console.log("useFetchBalance Balance: ", data);

				if (data && data.data && "balance" in data.data) {
					setBalance(+data?.data?.balance || 0);
				}
			})
			.catch((err) => {
				console.error("useFetchBalance error: ", err);
			});
		// .finally(() => setLoading(false));
	});
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
	const { fetchBalance } = useFetchBalance(setBalance);
	const { userData } = useUser();

	useEffect(() => {
		// console.log("userData::", userData);
		if (userData?.loggedIn && userData?.userId > 1) {
			if (userData?.is_org_admin !== 1) {
				fetchBalance();
			}
		}
	}, [userData?.loggedIn, userData?.userId, userData?.is_org_admin]);

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
