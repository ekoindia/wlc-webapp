import { Flex, Text } from "@chakra-ui/react";
import { PageTitle, SearchBar } from "components";
import useRequest from "hooks/useRequest";
import { useEffect, useState } from "react";
import { TransactionHistoryTable } from ".";

/**
 * A <TransactionHistory> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<TransactionHistory></TransactionHistory>`
 */
const TransactionHistory = () => {
	const [search, setSearch] = useState(null);
	const [isSearching, setIsSearching] = useState(false);

	/* API CALLING */

	const { data, mutate, isLoading } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: {
			"tf-req-uri-root-path": "/ekoicici/v1",
			"tf-req-uri": `/network/agents/transaction_history?record_count=10&search_value=${search}`,
			"tf-req-method": "GET",
		},
	});

	useEffect(() => {
		if (!(search && search.length >= 8)) return;
		// Search again
		mutate();
	}, [search]);

	const trxnData = data?.data?.transaction_details || [];

	return (
		<>
			<PageTitle title="Transaction History" hideBackIcon />
			<Flex
				direction="column"
				w="100%"
				px={{ base: "16px", md: "initial" }}
				pb="20px"
				gap="4"
			>
				<SearchBar
					placeholder="Search by mobile number or user code"
					type="number"
					value={search}
					showButton={true}
					minSearchLimit={8}
					maxSearchLimit={10}
					loading={isLoading}
					setSearch={setSearch}
					setIsSearching={setIsSearching}
				/>

				{isSearching ? (
					trxnData.length ? (
						<TransactionHistoryTable {...{ trxnData }} />
					) : (
						<Flex justify="center" align="center" h="100px">
							<Text textColor="light">Nothing Found</Text>
						</Flex>
					)
				) : null}
			</Flex>
		</>
	);
};

export default TransactionHistory;
