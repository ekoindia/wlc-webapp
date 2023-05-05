import { Avatar, Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { TransactionTypes } from "constants";
import { transaction_history_mock } from "constants/transaction_history_mock";
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
	const limit = 10;
	const body = {
		interaction_type_id: TransactionTypes.GET_TRANSACTION_HISTORY,
		start_index: 0,
		limit: limit,
	};
	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do", {
			headers: {
				"Content-Type": "application/json",
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-method": "POST",
			},
			body: body,
			token: userData.access_token,
		})
			.then((data) => {
				setData(data);
			})
			.catch((error) => {
				console.error("📡 Fetch Error:", error);
			});
	});
	const transactionList = data?.data?.transaction_list ?? [];
	console.log("transactionList", transactionList);
	const mockdata = transaction_history_mock?.data?.transaction_list ?? [];

	const handleshowall = (id) => {
		router.push(`transaction-history?search=${id}`);
	};
	const transactionsToDisplay = useBreakpointValue({
		base: mockdata.slice(0, 5),
		md: mockdata,
	});

	return (
		<Flex
			direction="column"
			background="white"
			h={{ base: "auto", md: "387px" }}
			p="5"
			borderRadius="10px"
			m={{ base: "16px", md: "auto" }}
		>
			<Box top="0" zIndex="1">
				<Flex justifyContent="space-between">
					<Text as="b">Recent transactions</Text>
					<Text
						as="b"
						color="primary.DEFAULT"
						onClick={handleshowall}
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
				mt="20px"
			>
				{transactionsToDisplay.map((item) => (
					<Flex key={item.id}>
						<Flex>
							<Avatar
								h={{ base: "42px", md: "56px" }}
								w={{ base: "42px", md: "56px" }}
								border="2px solid #D2D2D2"
								name={item.tx_name}
							/>
						</Flex>
						<Flex
							alignItems="center"
							justifyContent="space-between"
							w="100%"
							borderBottom="1px solid #F5F6F8"
							ml={{ base: "20px", md: "15px" }}
						>
							<Flex direction="column">
								<Text
									fontSize={{ base: "xs", md: "sm" }}
									fontWeight="medium"
								>
									{item.recipient_mobile
										? `AePS Cashout to xxxxxx${item.recipient_mobile.slice(
												-4
										  )}`
										: "No recipient mobile available"}
								</Text>

								<Flex
									alignItems="baseline"
									fontSize={{ base: "xs", xl: "xs" }}
								>
									<Text fontWeight="normal" color="light">
										Transaction ID:
									</Text>
									<Text ml="1">{item.tid}</Text>
								</Flex>
							</Flex>
							<Flex
								justifyContent="space-between"
								alignItems="center"
								onClick={() => handleshowall(item.tid)}
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
					onClick={handleshowall}
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
