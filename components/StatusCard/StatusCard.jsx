import { Circle, Flex, Text, Tooltip } from "@chakra-ui/react";
import { TransactionIds } from "constants";
import { useMenuContext } from "contexts";
import { useWallet } from "contexts/WalletContext";
import { useRouter } from "next/router";
import { useState } from "react";
import { Icon } from "..";

/**
 * A <StatusCard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<StatusCard></StatusCard>`
 */
const StatusCard = ({ bgColor, iconColor }) => {
	const router = useRouter();
	const [disabled, setDisabled] = useState(false);
	const { refreshWallet, balance, loading } = useWallet();
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions;

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
		router.push(id ? `/transaction/${id}` : "");
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

	let isBalanceFetching = balance > 0 || balance === 0 ? false : true;
	const disableRefreshBtn = {
		opacity: disabled || isBalanceFetching ? 0.3 : 1,
		cursor: disabled || isBalanceFetching ? "not-allowed" : "pointer",
	};

	return (
		<Flex
			w="100%"
			h={{ base: "64px", md: "54px", xl: "58px", "2xl": "78px" }}
			px="15px"
			align="center"
			justify="space-between"
			bg={bgColor || "sidebar.card-bg-dark"}
			borderBottom="br-sidebar"
		>
			<Flex align="flex-start" gap="2.5">
				<Icon
					name="wallet-outline"
					color={iconColor || "sidebar.font"}
					cursor={"pointer"}
					w={{ base: "24px", md: "24px", "2xl": "32px" }}
					h={{ base: "22px", md: "22px", "2xl": "30px" }}
				/>
				<Flex direction="column">
					<Text
						textColor="white"
						fontSize={{
							base: "10px",
							md: "8px",
							"2xl": "12px",
						}}
					>
						Wallet Balance
					</Text>
					<Flex
						color={iconColor || "#FFD93B"}
						align="center"
						gap="0.25"
					>
						<Icon
							name="rupee"
							w={{ base: "9px", /*  md: "9px", */ "2xl": "10px" }}
							h={{
								base: "12px",
								/* md: "12px", */ "2xl": "13px",
							}}
						/>

						<Text
							fontSize={{
								base: "14px",
								md: "12px",
								"2xl": "16px",
							}}
							fontWeight="medium"
						>
							&#8201;{balance}
						</Text>
					</Flex>
				</Flex>
			</Flex>
			<Flex columnGap="12px" align="center">
				<Tooltip label="Refresh" /* hasArrow="true" */ placement="top">
					<Circle
						size={{ base: "6", "2xl": "8" }}
						bg="white"
						onClick={onRefreshHandler}
						{...disableRefreshBtn}
					>
						<Icon
							name="refresh"
							width={{ base: "12px", "2xl": "16px" }}
							color="sidebar.card-bg-dark"
						/>
					</Circle>
				</Tooltip>
				<Tooltip
					label="Load Balance"
					/* hasArrow="true" */ placement="top"
				>
					<Circle
						size={{ base: "6", "2xl": "8" }}
						bg={"success"}
						color="white"
						boxShadow="0px 3px 6px #00000029"
						border="2px solid #FFFFFF"
						onClick={handleAddClick}
						opacity={isBalanceFetching ? 0.3 : 1}
						cursor={isBalanceFetching ? "not-allowed" : "pointer"}
					>
						<Icon
							name="add"
							width={{ base: "12px", "2xl": "16px" }}
						/>
					</Circle>
				</Tooltip>
			</Flex>
		</Flex>
	);
};

export default StatusCard;
