import { Flex } from "@chakra-ui/react";
import { Headings, Tags } from "components";
import { Endpoints, tableRowLimit, TransactionTypes } from "constants";
import { useSession, useUser } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { useEffect, useState } from "react";
import { CommissionsTable } from ".";

const limit = tableRowLimit?.XLARGE; // Page size

const Commissions = () => {
	const [data, setData] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [tagValue, setTagValue] = useState("");
	const { userData } = useUser();
	const { accountDetails } = userData;
	const { account_list } = accountDetails;
	const { accessToken } = useSession();

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
			<Headings title="Know your commissions" />
			<Flex w="full" h="auto" direction="row" py="1px">
				<Tags
					w="fit-content"
					h="32px"
					margin="0 10px 12px 0"
					size="lg"
					px="10px"
					status="DMT (Send Cash)"
					borderRadius="16"
					bg="#11299E"
					fontSize="12"
					color="white"
					_hover={{ bg: "#11299E" }}
					onClick={() => handleTagClick("DMT (Send Cash)")}
				/>
				<Tags
					w="fit-content"
					h="32px"
					margin="0 10px 12px 0"
					size="lg"
					px="10px"
					status="AePS Cashout"
					borderRadius="16"
					bg="#11299E"
					fontSize="12"
					color="white"
					_hover={{ bg: "#11299E" }}
					onClick={() => handleTagClick("AePS Cashout")}
				/>
				<Tags
					w="fit-content"
					h="32px"
					margin="0 10px 12px 0"
					size="lg"
					px="10px"
					status="Bharat Bill Pay"
					borderRadius="16"
					bg="#11299E"
					fontSize="12"
					color="white"
					_hover={{ bg: "#11299E" }}
					onClick={() => handleTagClick("Bharat Bill Pay")}
				/>
				<Tags
					w="fit-content"
					h="32px"
					margin="0 10px 12px 0"
					size="lg"
					px="10px"
					status="Indo-Nepal"
					borderRadius="16"
					bg="#11299E"
					fontSize="12"
					color="white"
					_hover={{ bg: "#11299E" }}
					onClick={() => handleTagClick("Indo-Nepal")}
				/>
				<Tags
					w="fit-content"
					h="32px"
					margin="0 10px 12px 0"
					size="lg"
					px="10px"
					status="Edelweiss Insurance"
					borderRadius="16"
					bg="#11299E"
					fontSize="12"
					color="white"
					_hover={{ bg: "#11299E" }}
					onClick={() => handleTagClick("Edelweiss Insurance")}
				/>
				<Tags
					w="fit-content"
					h="32px"
					margin="0 10px 12px 0"
					px="10px"
					status="CMS"
					borderRadius="16"
					bg="#11299E"
					fontSize="12"
					color="white"
					_hover={{ bg: "#11299E" }}
					onClick={() => handleTagClick("CMS")}
				/>
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
