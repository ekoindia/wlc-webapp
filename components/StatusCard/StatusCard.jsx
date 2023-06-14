import { Circle, Flex, Text, Tooltip, useToast } from "@chakra-ui/react";
import { TransactionIds } from "constants";
import { useMenuContext, useSession } from "contexts";
import { useWallet } from "contexts/WalletContext";
import { useRouter } from "next/router";
import { useState } from "react";
import { formatCurrency } from "utils/numberFormat";
import { Icon } from "..";

/**
 * A <StatusCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<StatusCard></StatusCard>`
 */
const StatusCard = () => {
	const router = useRouter();
	const [disabled, setDisabled] = useState(false);
	const toast = useToast();
	const { refreshWallet, balance, loading } = useWallet();
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions;

	const { isLoggedIn, isOnboarding, isAdmin } = useSession();

	if (isOnboarding || isLoggedIn !== true) return null;

	const handleAddClick = () => {
		let id;
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

		if (!id) {
			toast({
				title: "Add Balance not allowed! Please contact support.",
				status: "error",
				duration: 2000,
			});
			console.error("Add Balance not found in roles");
			return;
		}

		router.push(`${isAdmin ? "/admin" : ""}/transaction/${id}`);
	};

	const onRefreshHandler = () => {
		if (!disabled) {
			setDisabled(true);
			// fetching updated account balance
			refreshWallet();
			// Added 30sec timer
			setTimeout(() => setDisabled(false), 30000); // enable button after 10 sec
		}
	};

	const disableRefreshBtn = {
		opacity: disabled || loading ? 0.3 : 1,
		cursor: disabled || loading ? "not-allowed" : "pointer",
	};

	return (
		<Flex
			w="100%"
			h={{ base: "54px", xl: "58px", "2xl": "78px" }}
			px="15px"
			align="center"
			justify="space-between"
			bg="sidebar.card-bg-dark"
			borderBottom="br-sidebar"
		>
			<Flex align="center" gap="2.5">
				<Icon
					name="wallet-outline"
					color={"sidebar.font"}
					size={{ base: "24px", "2xl": "32px" }}
				/>
				<Flex direction="column">
					<Text
						textColor="white"
						fontSize={{
							base: "10px",
							md: "8px",
							"2xl": "12px",
						}}
						pointerEvents="none"
					>
						Wallet Balance
					</Text>
					<Flex color="#FFD93B" align="center" gap="0.25">
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
						>
							{formatCurrency(balance, "INR", true, true)}
						</Text>
					</Flex>
				</Flex>
			</Flex>
			<Flex columnGap="12px" align="center">
				<Tooltip label="Refresh" /* hasArrow={true} */ placement="top">
					<Circle
						size={{ base: "6", "2xl": "8" }}
						bg="white"
						onClick={onRefreshHandler}
						{...disableRefreshBtn}
					>
						<Icon
							name="refresh"
							size={{ base: "12px", "2xl": "16px" }}
							color="sidebar.card-bg-dark"
						/>
					</Circle>
				</Tooltip>
				<Tooltip
					label="Load Balance"
					/* hasArrow={true} */ placement="top"
				>
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
		</Flex>
	);
};

export default StatusCard;
