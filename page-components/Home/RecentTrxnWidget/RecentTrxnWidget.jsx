import { Avatar, Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { TransactionTypes } from "constants";
import { useUser } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
	const { userData } = useUser();
	const [data, setData] = useState([]);
	const limit = useBreakpointValue({
		base: 5,
		md: 10,
	});

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do", {
			body: {
				interaction_type_id: TransactionTypes.GET_TRANSACTION_HISTORY,
				start_index: 0,
				limit: limit,
			},
			token: userData.access_token,
		}).then((data) => {
			const tx_list = (data?.data?.transaction_list ?? []).map((tx) => {
				const amt = tx.amount_dr || tx.amount_cr || 0;
				return {
					tid: tx.tid,
					name: tx.tx_name,
					desc:
						tx.tx_name +
						(amt ? ` of ₹${amt}` : "") +
						(tx.customer_mobile
							? ` for ${tx.customer_mobile}`
							: ""),
				};
			});
			setData(tx_list);
		});
	}, []);

	const handleShowHistory = (id) => {
		router.push("/history" + (id ? `?search=${id}` : ""));
	};

	if (!data.length) {
		return null;
	}

	return (
		<Flex
			direction="column"
			background="white"
			h={{ base: "auto", md: "350px" }}
			w={{ base: "90%", md: "100%" }}
			p="5"
			borderRadius="10px"
			m={{ base: "16px", md: "auto" }}
		>
			<Box mb="5">
				<Flex justifyContent="space-between">
					<Text as="b">Recent transactions</Text>
					<Text
						as="b"
						color="primary.DEFAULT"
						onClick={() => handleShowHistory()}
						cursor="pointer"
						display={{ base: "none", md: "block" }}
					>
						Show All
					</Text>
				</Flex>
			</Box>
			<Flex
				direction="column"
				css={{
					"&::-webkit-scrollbar": {
						width: "2px",
						height: "2px",
						display: "none",
					},
					"&::-webkit-scrollbar-thumb": {
						background: "#cbd5e0",
						borderRadius: "2px",
					},
					"&:hover::-webkit-scrollbar": {
						display: "block",
					},
				}}
				overflowY={{ base: "none", md: "scroll" }}
				rowGap={{ base: "19px", md: "10px" }}
			>
				{data.map((tx) => (
					<Flex key={tx.tid}>
						<Avatar
							h={{ base: "42px", md: "48px" }}
							w={{ base: "42px", md: "48px" }}
							border="2px solid #D2D2D2"
							name={tx.name}
						/>
						<Flex
							alignItems="center"
							justifyContent="space-between"
							w="100%"
							borderBottom="1px solid #F5F6F8"
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

								<Flex
									alignItems="baseline"
									fontSize={{ base: "xs" }}
								>
									<Text
										fontWeight="normal"
										color="light"
										noOfLines={1}
									>
										Transaction ID:
									</Text>
									<Text ml="1">{tx.tid}</Text>
								</Flex>
							</Flex>
							<Flex
								justifyContent="space-between"
								alignItems="center"
								ml={1}
								onClick={() => handleShowHistory(tx.tid)}
								cursor="pointer"
							>
								<Text
									color="primary.DEFAULT"
									paddingRight="6px"
									display={{ base: "none", md: "block" }}
									fontSize="sm"
								>
									Details
								</Text>
								<Icon
									w="12px"
									name="arrow-forward"
									color="primary.DEFAULT"
								/>
							</Flex>
						</Flex>
					</Flex>
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
		</Flex>
	);
};

export default RecentTrxnWidget;
