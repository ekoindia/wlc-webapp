import { Flex } from "@chakra-ui/react";
import { Headings, Tags } from "components";
import { Endpoints, tableRowLimit, TransactionTypes } from "constants";
import { useCommisionSummary, useSession, useUser } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useState } from "react";
import { CommissionsTable } from ".";

const limit = tableRowLimit?.XLARGE; // Page size

const Commissions = (id) => {
	const [data, setData] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [tagValue, setTagValue] = useState("");
	const { userData } = useUser();
	const { accountDetails } = userData;
	const { account_list } = accountDetails;
	const { accessToken } = useSession();

	const commisionData = useCommisionSummary();
	console.log("IDVALUE:", id);
	const hitQuery = (abortController, key) => {
		console.log("[Commissions] fetch started...", key);

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionTypes.GET_TRANSACTION_HISTORY,
				start_index: (currentPage - 1) * limit,
				limit: limit,
				account_id: account_list?.[0]?.id || null,
				...tagValue,
			},
			controller: abortController,
			token: accessToken,
		})
			.then((data) => {
				const tx_list = data?.data?.transaction_list ?? [];
				setData(tx_list);
				console.log("[Commissions] fetch result...", key, tx_list);
			})
			.catch((err) => {
				console.error("[Commissions] error: ", err);
			});
	};

	useEffect(() => {
		console.log("[Commissions] fetch init", currentPage, tagValue);

		const controller = new AbortController();
		hitQuery(controller, `${currentPage}-${JSON.stringify(tagValue)}`);

		return () => {
			console.log(
				"[Commissions] fetch aborted... ",
				currentPage,
				JSON.stringify(tagValue),
				controller
			);
			controller.abort();
		};
	}, [currentPage, tagValue]);

	const transactionList = data;

	const handleTagClick = (status) => {
		setTagValue(status);
		console.log("THISISID", id, tagValue, status);
	};

	return (
		<Flex
			w="full"
			h="auto"
			p={{ base: "0px", md: "20px", "2xl": "14px 30px 30px 30px" }}
			direction="column"
			border="card"
			borderRadius="10"
			boxShadow="0px 5px 15px #0000000D"
			bg="white"
			px="16px"
		>
			<Headings title="Know your commissions121" />
			<Flex w="full" h="auto" direction="row" py="1px">
				{commisionData?.data?.pricing_commission_data.map((tx) => (
					<Tags
						w="fit-content"
						h="32px"
						margin="0 10px 12px 0"
						size="lg"
						px="10px"
						status={tx.product}
						borderRadius="16"
						fontSize="12"
						bg={tx.product === id.id ? "#11299E" : "#E9EDF1"}
						color={tx.product === id.id ? "white" : "#555"}
						// _hover={{
						// 	bg: "#E9EDF1" ? "#616161" : "#11299E",
						// 	color: "#555" ? "white" : "#555",
						// }}
						_hover={{ bg: "#11299E", color: "white" }}
						onClick={() => handleTagClick(tx.product)}
					/>
				))}
			</Flex>
			<CommissionsTable
				pageNumber={currentPage}
				setPageNumber={setCurrentPage}
				transactionList={transactionList}
				tableRowLimit={limit}
				tagClicked={tagValue}
			/>
		</Flex>
	);
};

export default Commissions;
