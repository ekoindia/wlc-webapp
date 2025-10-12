import { ActionIcon } from "components/CommandBar";
import { Endpoints, TransactionIds, TransactionTypes } from "constants";
import { fetcher } from "helpers/apiHelper";
import useRefreshToken from "hooks/useRefreshToken";
import { useCopilotAction, useCopilotInfo } from "libs";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { formatCurrency } from "utils/numberFormat";
import { useMenuContext, useSession } from ".";
import { useBusinessSearchActions } from "./GlobalSearchContext";

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
 * Context Provider for fetching and managing wallet balance.
 * @param {object} props - The props.
 * @param {ReactNode} props.children - The children components that will have access to the wallet context.
 */
const WalletProvider = ({ children }) => {
	const { isLoggedIn, userId, accessToken } = useSession();
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions || {};

	const [balance, _setBalance] = useState(null);
	const [lastUpdatedDate, setLastUpdatedDate] = useState(null);
	const [isWalletVisible, setIsWalletVisible] = useState(true);
	const [addBalanceTrxnId, setAddBalanceTrxnId] = useState(null);

	// Function to set the balance and update the last updated date
	const setBalance = useCallback((value) => {
		_setBalance(value);
		setLastUpdatedDate(new Date());
	}, []);

	const { fetchBalance, loading } = useFetchBalance(setBalance, accessToken);
	// const router = useRouter();

	// const gsdata = useGlobalSearch();
	// console.log("gsdata", gsdata);

	// Fetch the transaction id for "Add Balance" screen from the allowed list of transactions
	useEffect(() => {
		let id = null;
		for (
			let i = 0;
			i < TransactionIds.LOAD_WALLET_TRXN_ID_LIST.length;
			i++
		) {
			let trxn_id = TransactionIds.LOAD_WALLET_TRXN_ID_LIST[i];
			if (role_tx_list && role_tx_list[trxn_id]) {
				id = trxn_id;
				break;
			}
		}
		setAddBalanceTrxnId(id);
	}, [role_tx_list]);

	// Fetch the balance when the user logs in or when the userId changes
	useEffect(() => {
		if (isLoggedIn) {
			fetchBalance();
		}
	}, [isLoggedIn, userId, fetchBalance]);

	// Hide the wallet:
	// - if the user is not logged in or if there is no userId
	// - if the user does not have permission to view the wallet (no transaction id found for loading wallet) and their balance is zero
	useEffect(() => {
		let _walletAllowed = true;
		if (!isLoggedIn || !userId) {
			_walletAllowed = false;
		}
		if (!(addBalanceTrxnId || balance > 0)) {
			_walletAllowed = false;
		}
		setIsWalletVisible(_walletAllowed);
	}, [isLoggedIn, userId, balance, addBalanceTrxnId]);

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

	// MARK: Copilot

	// Define AI Copilot readable state for the E-value balance
	useCopilotInfo({
		description:
			"The current digital wallet (E-value) balance of the user, and it's last updated date. This balance can be used for transactions, payments, and other financial activities within the platform. It is updated when the user performs transactions or when it is refreshed manually.",
		value: {
			balance: formatCurrency(balance),
			lastUpdatedDate: lastUpdatedDate?.toLocaleString(undefined, {
				hour: "2-digit",
				minute: "2-digit",
				day: "numeric",
				month: "short",
			}),
		},
	});

	// Add Copilot action to refresh the E-value balance
	useCopilotAction({
		name: "refresh-e-value-balance",
		description:
			"Refresh the current digital wallet (E-value) balance by fetching it again. Once refreshed, provide the updated balance to the user.",
		handler: async () => {
			fetchBalance();
		},
	});

	// useCopilotAction({
	// 	name: "showBalance",
	// 	description:
	// 		"Displays user's E-value wallet balance, and when was it last updated.",
	// 	parameters: [
	// 		{
	// 			name: "balance",
	// 			type: "string",
	// 			description: "E-value balance (eg: ₹25,000.00)",
	// 			required: true,
	// 		},
	// 		{
	// 			name: "lastUpdated",
	// 			type: "string",
	// 			description: "Last updated date-time",
	// 			required: false,
	// 		},
	// 	],
	// 	render: ({ status, args }) => {
	// 		const { balance, lastUpdated } = args;
	// 		if (status === "inProgress") {
	// 			return "Fetching..."; // loading state
	// 		}

	// 		return (
	// 			<Stat
	// 				border="1px solid"
	// 				borderColor="gray.200"
	// 				p={4}
	// 				borderRadius="md"
	// 			>
	// 				<StatLabel>E-value Balance</StatLabel>
	// 				<StatNumber>{balance}</StatNumber>
	// 				<StatHelpText>Updated: {lastUpdated}</StatHelpText>
	// 			</Stat>
	// 		);
	// 	},
	// });

	// Cache the context values
	const contextValues = useMemo(
		() => ({
			balance,
			refreshWallet: fetchBalance,
			setBalance,
			loading,
			lastUpdatedDate,
			isWalletVisible,
			addBalanceTrxnId,
		}),
		[
			balance,
			loading,
			fetchBalance,
			setBalance,
			lastUpdatedDate,
			isWalletVisible,
			addBalanceTrxnId,
		]
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

export { useWallet, WalletProvider };
