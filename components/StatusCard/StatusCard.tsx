import { Circle, Flex, Text, Tooltip } from "@chakra-ui/react";
import { TransactionIds } from "constants/EpsTransactions";
import { useMenuContext, useSession } from "contexts";
import { useWallet } from "contexts/WalletContext";
import { rotateAntiClockwise } from "libs/chakraKeyframes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatCurrency } from "utils/numberFormat";
import { Icon } from "..";

type StatusCardProps = {
	className?: string;
	onLoadBalanceClick?: () => void;
};

/**
 * StatusCard component displays the user's balance and provides options to refresh
 * the balance and load more balance.
 * @param {StatusCardProps} props - The properties passed to the component.
 * @param {string} [props.className] - Optional classes to pass to this component.
 * @param {() => void} [props.onLoadBalanceClick] - Callback function to be called when the "Load Balance" button is clicked.
 * @example
 * ```tsx
 * <StatusCard onLoadBalanceClick={() => console.log("Load Balance clicked")} />
 * ```
 */
const StatusCard = ({
	onLoadBalanceClick,
	...rest
}: StatusCardProps): JSX.Element => {
	const router = useRouter();
	const [disabled, setDisabled] = useState(false);
	const [addBalanceTrxnId, setAddBalanceTrxnId] = useState<number | null>(
		null
	);
	const [isRefreshing, setIsRefreshing] = useState(false);
	// const toast = useToast();
	const { refreshWallet, balance, loading } = useWallet();
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions || {};
	const { isLoggedIn, isOnboarding, isAdmin } = useSession();

	// Fetch the transaction id for "Add Balance" from the allowed list of transactions
	useEffect(() => {
		let id = null;
		for (
			let i = 0;
			i < TransactionIds.LOAD_WALLET_TRXN_ID_LIST.length;
			i++
		) {
			let trxn_id = TransactionIds.LOAD_WALLET_TRXN_ID_LIST[i];
			if (role_tx_list[trxn_id]) {
				id = trxn_id;
				break;
			}
		}
		setAddBalanceTrxnId(id);
	}, [role_tx_list]);

	// Hide the status card if the user is not logged in or is in onboarding stage
	if (isOnboarding || isLoggedIn !== true) return null;

	// Hide the status card if the balance is 0 and "Add Balance" transaction is also not allowed
	if (!(addBalanceTrxnId || balance > 0)) return null;

	// Click handler for "Load Balance" button
	const handleAddClick = () => {
		if (!addBalanceTrxnId) {
			// toast({
			// 	title: "Add Balance not allowed! Please contact support.",
			// 	status: "error",
			// 	duration: 2000,
			// });
			console.error("Add Balance not found in roles");
			return;
		}

		router.push(
			`${isAdmin ? "/admin" : ""}/transaction/${addBalanceTrxnId}`
		);
		if (onLoadBalanceClick) {
			onLoadBalanceClick();
		}
	};

	// Click handler for "Refresh" button
	const onRefreshHandler = () => {
		if (!disabled) {
			setDisabled(true);
			setIsRefreshing(true);
			// fetching updated account balance
			refreshWallet();
			// Added 30sec timer
			setTimeout(() => {
				setDisabled(false);
				setIsRefreshing(false);
			}, 30000); // enable button after 30 sec
		}
	};

	const disableRefreshBtn = {
		opacity: disabled || loading ? 0.3 : 1,
		cursor: disabled || loading ? "not-allowed" : "pointer",
	};

	// MARK: JSX
	return (
		<Flex
			w="100%"
			h={{ base: "54px", xl: "58px", "2xl": "78px" }}
			px="15px"
			align="center"
			justify="space-between"
			bg="status.bg" // ORIG_THEME: bgColor || sidebar.card-bg-dark
			borderBottom="1px solid" // ORIG_THEME: br-sidebar
			borderBottomColor="primary.light"
			borderRight="1px solid"
			borderRightColor="status.borderRightColor"
			{...rest}
		>
			<Flex align="center" gap="2.5">
				<Icon
					name="wallet-outline"
					color="status.wm" // ORIG_THEME: sidebar.font
					size={{ base: "24px", "2xl": "32px" }}
				/>
				<Flex direction="column">
					<Text
						color="status.text"
						fontSize={{
							base: "10px",
							md: "8px",
							"2xl": "12px",
						}}
						pointerEvents="none"
						userSelect="none"
					>
						E-value Balance
					</Text>
					<Flex
						color="status.title" // ORIG_THEME: #FFD93B
						align="center"
						gap="0.25"
					>
						<Icon
							name="rupee"
							size={{ base: "12px", "2xl": "14px" }}
							mr="0.2em"
						/>
						<Text
							fontSize={{
								base: "14px",
								"2xl": "16px",
							}}
							fontWeight="medium"
							userSelect="none"
						>
							{formatCurrency(balance, "INR", true, true)}
						</Text>
					</Flex>
				</Flex>
			</Flex>
			{addBalanceTrxnId ? (
				<Flex columnGap="12px" align="center">
					<Tooltip label="Refresh" placement="top">
						<Circle
							size={{ base: "6", "2xl": "8" }}
							bg="white"
							onClick={onRefreshHandler}
							{...disableRefreshBtn}
						>
							<Icon
								name="refresh"
								size={{ base: "12px", "2xl": "16px" }}
								color="primary.dark" // ORIG_THEME: sidebar.card-bg-dark
								sx={
									isRefreshing
										? {
												animation: `${rotateAntiClockwise} 1s ease-in-out`,
											}
										: {}
								}
							/>
						</Circle>
					</Tooltip>
					<Tooltip label="Load Balance" placement="top">
						<Circle
							size={{ base: "6", "2xl": "8" }}
							bg={"success"}
							color="white"
							boxShadow="0px 3px 6px #00000029"
							border="2px solid #FFFFFF"
							onClick={handleAddClick}
							opacity={loading ? 0.3 : 1}
							cursor={loading ? "not-allowed" : "pointer"}
						>
							<Icon
								name="add"
								size={{ base: "12px", "2xl": "16px" }}
							/>
						</Circle>
					</Tooltip>
				</Flex>
			) : null}
		</Flex>
	);
};

export default StatusCard;
