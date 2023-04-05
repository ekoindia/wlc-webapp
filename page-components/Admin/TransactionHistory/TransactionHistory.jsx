import { Box } from "@chakra-ui/react";
import { SearchBar } from "components";
import { useUser } from "contexts/UserContext";
import useRequest from "hooks/useRequest";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TransactionHistoryTable } from ".";
/**
 * A <TransactionHistory> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionHistory></TransactionHistory>`
 */

const TransactionHistory = ({ className = "", ...props }) => {
	const { userData } = useUser();
	const router = useRouter();
	const [search, setSearch] = useState("");

	// const router = useRouter();

	function onChangeHandler(e) {
		setSearchValue(e);
	}
	/* API CALLING */

	let headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": `/network/agents/transaction_history?initiator_id=9911572989&user_code=99029899&client_ref_id=202301031354123456&org_id=1&source=WLC&record_count=10&search_value=${search}`,
		"tf-req-method": "GET",
	};
	const { data, error, isLoading, mutate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: { ...headers },
		authorization: `Bearer ${userData.access_token}`,
	});

	useEffect(() => {
		mutate(
			process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
			headers
		);
	}, [headers["tf-req-uri"]]);
	const transactiondata = data?.data?.transaction_details ?? [];

	return (
		<Box w="100%" px={{ base: "16px", md: "initial" }} pb={"20px"}>
			<Box>
				<SearchBar value={search} setSearch={setSearch} minSearchLimit={10} maxSearchLimit={10}/>
			</Box>
			<Box>
				<TransactionHistoryTable transactiondata={transactiondata} />
			</Box>
		</Box>
	);
};

export default TransactionHistory;
