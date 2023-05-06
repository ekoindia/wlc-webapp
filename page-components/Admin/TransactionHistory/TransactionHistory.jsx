import { Box, Flex } from "@chakra-ui/react";
import { Headings, SearchBar } from "components";
import useRequest from "hooks/useRequest";
import { useEffect, useState } from "react";
import { TransactionHistoryTable } from ".";
/**
 * A <TransactionHistory> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionHistory></TransactionHistory>`
 */

const TransactionHistory = () => {
	const [search, setSearch] = useState(null);

	/* API CALLING */

	let headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": `/network/agents/transaction_history?record_count=10&search_value=${search}`,
		"tf-req-method": "GET",
	};
	const { data, mutate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: { ...headers },
	});

	useEffect(() => {
		mutate(
			process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
			headers
		);
	}, [headers["tf-req-uri"]]);
	const transactiondata = data?.data?.transaction_details ?? [];

	return (
		<>
			<Headings title="Transaction History" hasIcon={false} />
			<Box w="40%" px={{ base: "16px", md: "initial" }} pb={"20px"}>
				<Flex gap="2">
					<SearchBar
						placeholder="Search by mobile number or user code"
						type="number"
						value={search}
						setSearch={setSearch}
						minSearchLimit={5}
						maxSearchLimit={10}
						showButton={true}
					/>
				</Flex>
				<Box>
					<TransactionHistoryTable
						transactiondata={transactiondata}
					/>
				</Box>
			</Box>
		</>
	);
};

export default TransactionHistory;
