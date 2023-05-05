import { Box } from "@chakra-ui/react";
import { Headings, SearchBar } from "components";
import { useOrgDetailContext } from "contexts/OrgDetailContext";
import { useUser } from "contexts/UserContext";
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
	const { userData } = useUser();
	const { orgDetail } = useOrgDetailContext();
	const [search, setSearch] = useState("");

	function onChangeHandler(e) {
		setSearch(e);
		//TODO re-check
	}
	/* API CALLING */

	let headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": `/network/agents/transaction_history?record_count=10&search_value=${search}`,
		"tf-req-method": "GET",
	};
	const { data, error, isLoading, mutate } = useRequest({
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
			<Box w="100%" px={{ base: "16px", md: "initial" }} pb={"20px"}>
				<Box>
					<SearchBar
						value={search}
						setSearch={setSearch}
						minSearchLimit={10}
						maxSearchLimit={10}
					/>
				</Box>
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
