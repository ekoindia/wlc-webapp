import { Circle, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useSession } from "contexts/UserContext";
import { useWallet } from "contexts/WalletContext";
import { rotateAntiClockwise } from "libs/chakraKeyframes";
import { useRouter } from "next/router";
import { useState } from "react";
import { formatCurrency } from "utils/numberFormat";
import { Icon } from "..";

type StatusCardProps = {
	className?: string;
	onLoadBalanceClick?: () => void;
};

type StatusRowProps = {
	label: string;
	iconName: string;
	balance: number;
	loading: boolean;
	onRefresh?: () => void;
	onLoadBalance?: () => void;
};

/**
 * StatusRow component displays a single wallet balance row with refresh and load balance actions.
 * Each row maintains its own independent 30-second refresh cooldown timer.
 * MARK: StatusRow
 * @param {StatusRowProps} props - The properties passed to the component.
 * @param {string} props.label - Label for the wallet type (e.g., "E-value Balance").
 * @param {string} props.iconName - Icon name to display for the wallet.
 * @param {number} props.balance - Current balance amount.
 * @param {boolean} props.loading - Loading state for the wallet.
 * @param {() => void} [props.onRefresh] - Callback function when refresh button is clicked. If provided, enables the refresh button.
 * @param {() => void} [props.onLoadBalance] - Callback function when load balance button is clicked. If provided, enables the load balance button.
 */
const StatusRow = ({
	label,
	iconName,
	balance,
	loading,
	onRefresh,
	onLoadBalance,
}: StatusRowProps): JSX.Element => {
	const [disabled, setDisabled] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	// Click handler for "Refresh" button with independent 30-second cooldown
	const onRefreshHandler = () => {
		if (!disabled) {
			setDisabled(true);
			setIsRefreshing(true);
			// fetching updated account balance
			onRefresh();
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

	// MARK: Row JSX
	return (
		<Flex
			w="100%"
			h={{ base: "54px", xl: "58px", "2xl": "78px" }}
			px="15px"
			align="center"
			justify="space-between"
			borderBottom="1px solid" // ORIG_THEME: br-sidebar
			borderBottomColor="primary.light"
		>
			<Flex align="center" gap="2.5">
				<Icon
					name={iconName}
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
						{label}
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
			<Flex columnGap="12px" align="center">
				{onRefresh ? (
					<Tooltip
						label="Refresh"
						placement="top"
						isDisabled={disabled || isRefreshing}
					>
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
				) : null}
				{onLoadBalance ? (
					<Tooltip label="Load Balance" placement="top">
						<Circle
							size={{ base: "6", "2xl": "8" }}
							bg={"success"}
							color="white"
							boxShadow="0px 3px 6px #00000029"
							border="2px solid #FFFFFF"
							onClick={onLoadBalance}
							opacity={loading ? 0.3 : 1}
							cursor={loading ? "not-allowed" : "pointer"}
						>
							<Icon
								name="add"
								size={{ base: "12px", "2xl": "16px" }}
							/>
						</Circle>
					</Tooltip>
				) : null}
			</Flex>
		</Flex>
	);
};

/**
 * StatusCard component displays the user's balance and provides options to refresh
 * the balance and load more balance.
 * MARK: StatusCard
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
	const {
		refreshWallet,
		balance,
		loading,
		isWalletVisible,
		addBalanceTrxnId,
		accountList,
		bankBalances,
		refreshAccountBalance,
	} = useWallet();
	const { isLoggedIn, isOnboarding, isAdmin } = useSession();

	const bankAccounts = accountList.filter(
		(account: any) =>
			account.type_id === 3 && // TSP Bank Account
			account.account_number &&
			account.label
	);

	// Hide the status card if the user is not logged in or is in onboarding stage
	if (isOnboarding || isLoggedIn !== true) return null;

	// Hide the status card if:
	// E-value is hidden (balance is 0 and "Add Balance" transaction is also not allowed)
	// AND, no other TSP bank accounts are present
	if (!isWalletVisible && bankAccounts.length === 0) return null;

	// Click handler for "Load Balance" button
	const handleAddClick = () => {
		if (!addBalanceTrxnId) {
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

	// MARK: Main JSX
	return (
		<Flex
			w="100%"
			direction="column"
			bg="status.bg" // ORIG_THEME: bgColor || sidebar.card-bg-dark
			borderRight="1px solid"
			borderRightColor="status.borderRightColor"
			{...rest}
		>
			<StatusRow
				label="E-value Balance"
				iconName="wallet-outline"
				balance={balance}
				loading={loading}
				onRefresh={addBalanceTrxnId ? refreshWallet : undefined}
				onLoadBalance={handleAddClick}
			/>

			{bankAccounts.map((account: any) => (
				<StatusRow
					key={account.account_number}
					label={account.label || "Bank Account"}
					iconName="account-balance"
					balance={bankBalances[account.id]?.balance || 0}
					loading={loading}
					onRefresh={() => refreshAccountBalance(account.id)}
					// onLoadBalance={() => {
					// 	// No load balance action for bank accounts
					// }}
				/>
			))}
		</Flex>
	);
};

export default StatusCard;
