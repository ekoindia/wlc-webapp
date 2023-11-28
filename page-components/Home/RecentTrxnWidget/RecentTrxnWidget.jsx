import { Avatar, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { TransactionTypes } from "constants";
import { useMenuContext, useSession, useUser } from "contexts";
import { fetcher } from "helpers/apiHelper";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { WidgetBase } from "..";

/**
 * A <RecentTrxnWidget> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<RecentTrxnWidget></RecentTrxnWidget>` TODO: Fix example
 */
const RecentTrxnWidget = () => {
	const router = useRouter();
	const { accessToken } = useSession();
	const [data, setData] = useState([]);
	const { isLoggedIn, isAdminAgentMode, isAdmin } = useUser();
	const limit = useBreakpointValue({
		base: 5,
		md: 10,
	});
	const { interactions } = useMenuContext();
	const { trxn_type_prod_map } = interactions;

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do", {
			body: {
				interaction_type_id: TransactionTypes.GET_TRANSACTION_HISTORY,
				start_index: 0,
				limit: limit,
			},
			token: accessToken,
		})
			.then((data) => {
				const tx_list = (data?.data?.transaction_list ?? []).map(
					(tx) => {
						const amt = tx.amount_dr || tx.amount_cr || 0;
						return {
							tid: tx.tid,
							name: tx.tx_name,
							icon:
								trxn_type_prod_map?.[tx.tx_typeid]?.icon ||
								null,
							desc:
								tx.tx_name +
								(amt ? ` of ₹${amt}` : "") +
								(tx.customer_mobile
									? ` for ${tx.customer_mobile}`
									: ""),
						};
					}
				);

				setData(tx_list);
			})
			.catch((error) => {
				// Handle any errors that occurred during the fetch
				console.error("[Recent Transactions] Error:", error);
			});
	}, []);

	const handleShowHistory = (id) => {
		const prefix = isAdmin && isAdminAgentMode ? "/admin" : "";
		router.push(prefix + "/history" + (id ? `?search=${id}` : ""));
	};

	if (!isLoggedIn) return null;

	if (!data.length) {
		return null;
	}

	return (
		<WidgetBase
			title="Recent transactions"
			linkLabel="Show All"
			linkOnClick={handleShowHistory}
			linkProps={{ display: { base: "none", md: "block" } }}
			noPadding
		>
			<Flex
				direction="column"
				className="customScrollbars"
				overflowY={{ base: "none", md: "scroll" }}
			>
				{data.map((tx) => (
					<Tr
						key={tx.tid}
						tx={tx}
						handleShowHistory={handleShowHistory}
					/>
				))}
			</Flex>
			<Flex
				display={{ base: "block", md: "none" }}
				justifyContent="center"
				alignItems="center"
				textAlign="center"
				py="15px"
			>
				<Button
					onClick={() => handleShowHistory()}
					justifyContent="center"
					size="md"
				>
					+ Show All
				</Button>
			</Flex>
		</WidgetBase>
	);
};

/**
 * Internal table-row component
 */
const Tr = ({ tx, handleShowHistory }) => {
	const { h } = useHslColor(tx.name);

	return (
		<Flex
			p="8px 8px 8px 16px"
			pr={{ base: "8px", md: "4px" }}
			align="center"
			justify="center"
			borderBottom="1px solid #F5F6F8"
		>
			<Avatar
				size={{ base: "sm", md: "md" }}
				name={tx.icon ? null : tx.name}
				border={`2px solid hsl(${h},80%,90%)`}
				bg={`hsl(${h},80%,95%)`}
				color={`hsl(${h},80%,30%)`}
				icon={
					<Icon
						size={{ base: "sm", md: "md" }}
						name={tx.icon}
						color={`hsl(${h},80%,30%)`}
					/>
				}
			/>
			<Flex
				alignItems="center"
				justifyContent="space-between"
				w="100%"
				ml="10px"
			>
				<Flex direction="column">
					<Text
						fontSize={{ base: "xs", md: "sm" }}
						fontWeight="medium"
						noOfLines={1}
					>
						{tx.desc}
					</Text>

					<Flex alignItems="baseline" fontSize={{ base: "xs" }}>
						<Text fontWeight="normal" color="light" noOfLines={1}>
							TID:
						</Text>
						<Text ml="1">{tx.tid}</Text>
					</Flex>
				</Flex>
				<Flex
					justifyContent="space-between"
					alignItems="center"
					ml={2}
					onClick={() => handleShowHistory(tx.tid)}
					cursor="pointer"
				>
					<Text
						color="accent.DEFAULT"
						paddingRight="6px"
						display={{ base: "none", md: "block" }}
						fontSize="sm"
					>
						Details
					</Text>
					<Icon
						size="12px"
						name="arrow-forward"
						color="accent.DEFAULT"
					/>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default RecentTrxnWidget;
