import { Flex, Text } from "@chakra-ui/react";
import {
	Button,
	Calenders,
	Headings,
	Icon,
	Input,
	Modal,
	SearchBar,
} from "components";
import { Endpoints, tableRowLimit, TransactionTypes } from "constants";
import { useGlobalSearch, useSession, useUser } from "contexts";
import { fetcher } from "helpers/apiHelper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HistoryTable } from ".";

const limit = tableRowLimit?.XLARGE; // Page size

/**
 * A History component shows transaction history
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<History></History>` TODO: Fix example
 */
const History = () => {
	const formElements = {
		tid: "",
		account: "",
		customer_mobile: "",
		start_date: "",
		tx_date: "",
		amount: "",
		rr_no: "",
	};
	const [data, setData] = useState();
	const [activePillIndex, setActivePillIndex] = useState(0);
	const [searchValue, setSearchValue] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [formState, setFormState] = useState({ ...formElements });
	const [clear, setClear] = useState(false);
	const { userData } = useUser();
	const { accountDetails } = userData;
	const { account_list } = accountDetails;
	const { accessToken } = useSession();
	const router = useRouter();
	const [finalFormState, setFinalFormState] = useState({});
	const { setSearchTitle } = useGlobalSearch();

	// Set GlobalSearch title
	useEffect(() => {
		setSearchTitle("Search by Transaction ID, Mobile, Account, etc");
		return () => {
			setSearchTitle("");
		};
	}, []);

	// Search for a transaction based on the parameter query "search".
	// The query can be a transaction-id, account, amount,
	// or, a mobile number.
	useEffect(() => {
		const { search, ...others } = router.query;
		console.log("others", others);
		if (search || others) {
			quickSearch(search, others);
		}
	}, [router.query]);

	function onSearchSubmit(e) {
		setSearchValue(e);
		if (e) {
			quickSearch(e);
		}
		console.log("search value", e);
	}
	const handlePillClick = (index) => {
		setActivePillIndex(index);
	};

	const hitQuery = (abortController, key) => {
		console.log("[History] fetch started...", key);

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionTypes.GET_TRANSACTION_HISTORY,
				start_index: (currentPage - 1) * limit,
				limit: limit,
				account_id:
					account_list &&
					account_list.length > 0 &&
					account_list[0].id
						? account_list[0]?.id
						: null,
				...finalFormState,
			},
			controller: abortController,
			token: accessToken,
		})
			.then((data) => {
				const tx_list = data?.data?.transaction_list ?? [];
				setData(tx_list);
				console.log("[History] fetch result...", key, tx_list);
			})
			.catch((err) => {
				console.error("[History] error: ", err);
			});
	};

	// Fetch transaction history when the following change: currentPage, finalFormState
	useEffect(() => {
		console.log("[History] fetch init", currentPage, finalFormState);

		const controller = new AbortController();
		hitQuery(
			controller,
			`${currentPage}-${JSON.stringify(finalFormState)}`
		);

		return () => {
			console.log(
				"[History] fetch aborted... ",
				currentPage,
				JSON.stringify(finalFormState),
				controller
			);
			controller.abort();
		};
	}, [currentPage, finalFormState]);

	const onFilterSubmit = () => {
		console.log("hitQuery inside onFilterSubmit");
		// Get all non-empty values from formState and set in finalFormState
		const _finalFormState = {};
		Object.keys(formState).forEach((key) => {
			if (formState[key]) {
				_finalFormState[key] = formState[key];
			}
		});
		setFinalFormState(_finalFormState);

		onClose();
		setClear(true);
	};

	const onFilterClear = () => {
		setFormState({ ...formElements });
		setFinalFormState({});
		setSearchValue("");
		setClear(false);
	};

	/**
	 * Update formState with user inputs
	 * @param {*} event
	 */
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState((prevFormState) => ({
			...prevFormState,
			[name]: value,
		}));
	};

	/**
	 * Search for a transaction based on the query. The query can be a transaction-id, account, amount, or, a mobile number.
	 * @param {*} search
	 */
	const quickSearch = (search, otherQueries) => {
		console.log("Search inside quickSearch", search, otherQueries);
		if (!(search || otherQueries)) return;

		// Perform specific search, if available...
		if (otherQueries && Object.keys(otherQueries).length > 0) {
			const { tid, account, customer_mobile, amount } = otherQueries;
			// Set Filter form for searching...
			setFormState({
				...formElements,
				...{ tid, account, customer_mobile, amount },
			});
			setFinalFormState({
				...{ tid, account, customer_mobile, amount },
			});
			onClose();
			setClear(true);
			return;
		}

		// Perform generic search...
		// Check if search is a number
		if (/^[0-9]+$/.test(search) !== true) {
			// Not a number
			return;
		}
		// Detect type of search
		let type = "account";
		if (/^[6-9][0-9]{9}$/.test(search)) {
			type = "customer_mobile";
		} else if (search.length >= 7 && search.length <= 10) {
			type = "tid";
		} else if (search.length < 7) {
			type = "amount";
		}

		// Set Filter form for searching...
		setFormState({
			...formElements,
			[type]: search,
		});
		setFinalFormState({
			[type]: search,
		});
		onClose();
		setClear(true);
	};

	const transactionList = data;
	const [isOpen, setIsOpen] = useState(false);

	const onClose = () => setIsOpen(false);
	const onOpen = () => setIsOpen(true);

	return (
		<>
			<Headings title="Transaction History" />
			<Flex
				w="full"
				h="auto"
				p={{ base: "0px", md: "20px", "2xl": "14px 30px 30px 30px" }}
				direction={"column"}
				border={{ base: "", md: "card" }}
				borderRadius={{ base: "0", md: "10" }}
				boxShadow={{ base: "none", md: "0px 5px 15px #0000000D;" }}
				bg={{ base: "none", md: "white" }}
				px="16px"
			>
				<HistoryToolbar
					{...{
						activePillIndex,
						pillsData,
						handlePillClick,
						searchValue,
						onSearchSubmit,
						handleChange,
						clear,
						formState,
						isOpen,
						onOpen,
						onClose,
						onFilterSubmit,
						onFilterClear,
					}}
				/>
				<HistoryTable
					pageNumber={currentPage}
					setPageNumber={setCurrentPage}
					transactionList={transactionList}
					tableRowLimit={limit}
				/>
			</Flex>
		</>
	);
};

export default History;

// TODO: Get from HistoryTrxnList
const pillsData = [
	{ id: "1", name: "All" },
	{ id: "2", name: "Send Cash" },
	{ id: "3", name: "AePS" },
	{ id: "4", name: "Indo-Nepal" },
	{ id: "5", name: "Card Payment" },
	{ id: "6", name: "UPI Payment" },
	{ id: "7", name: "Bill Payment" },
	{ id: "8", name: "Deposit" },
];

/*
function Pill({ name, activePillIndex, index }) {
	return (
		<Box
			h="23px"
			w="100%"
			whiteSpace="nowrap"
			cursor={"pointer"}
			px="10px"
			border="1px solid #D2D2D2"
			borderRadius="30px"
			bg={activePillIndex === index ? "accent.DEFAULT" : "white"}
			color={activePillIndex === index ? "white" : "light"}
			_hover={{ bg: "accent.DEFAULT", color: "white" }}
			display={"flex"}
			justifyContent={"center"}
			alignItems="center"
		>
			<Box display={"flex"} textAlign="justify">
				<Text fontSize={"12px"}>{name}</Text>
			</Box>
		</Box>
	);
}
*/

const HistoryToolbar = ({
	// activePillIndex,
	// pillsData,
	// handlePillClick,
	searchValue,
	onSearchSubmit,
	clear,
	handleChange,
	formState,
	isOpen,
	onOpen,
	onClose,
	onFilterSubmit,
	onFilterClear,
}) => {
	const labelStyle = {
		fontSize: { base: "sm" },
		color: "inputlabel",
	};
	return (
		<Flex
			justifyContent={"space-between"}
			direction={{ base: "column-reverse", lg: "row" }}
			alignItems={{ base: "none", lg: "center" }}
		>
			{/* <===========================Toggles Button ===============================> */}
			{/* <Flex gap="8px" overflowX="auto" mt={{ base: "40px", lg: "0px" }}>
                            {pillsData.map((pill, index) => (
                                <Box key={index} onClick={() => handlePillClick(index)}>
                                    <Pill
                                        name={pill.name}
                                        activePillIndex={activePillIndex}
                                        index={index}
                                    />
                                </Box>
                            ))}
                        </Flex> */}
			<Flex w="100%" gap="2" justify="flex-end" align="center">
				{/* <==========Clear Filter Button =========> */}
				{clear && (
					<Button
						size="xs"
						variant="link"
						onClick={onFilterClear}
						_hover={{ TextDecoration: "none" }}
					>
						Clear Filter
					</Button>
				)}

				{/* <==========Search =========> */}
				<SearchBar
					type="number"
					placeholder="Search by Transaction ID, Mobile, Account, etc"
					value={searchValue}
					setSearch={onSearchSubmit}
					minSearchLimit={2}
				/>

				{/* <==========Filter Button =========> */}
				<Button
					size="lg"
					_hover={{ bg: "accent.DEFAULT" }}
					onClick={onOpen}
				>
					<Icon name="filter" width="18px" />
					&nbsp;
					<Text display={{ base: "none", md: "flex" }}>Filter</Text>
				</Button>

				{/* <===================Filter Modal Code ==========================> */}
				<Modal
					isOpen={isOpen}
					onClose={onClose}
					title="Filter"
					submitText="Apply Now"
					isCentered={{ base: "none", lg: "true" }}
					onSubmit={onFilterSubmit}
					motionPreset="slideInBottom"
					scrollBehavior="inside"
				>
					<form>
						<Flex direction="column" gap="1">
							<Input
								label="Transaction ID"
								name="tid"
								type="number"
								labelStyle={labelStyle}
								value={formState.tid}
								onChange={handleChange}
							/>

							<Input
								label="Account Number"
								name="account"
								type="number"
								labelStyle={labelStyle}
								value={formState.account}
								onChange={handleChange}
							/>
							<Input
								label="Customer Mobile No."
								name="customer_mobile"
								type="number"
								labelStyle={labelStyle}
								value={formState.customer_mobile}
								onChange={handleChange}
							/>
							<Calenders
								label="From"
								name="start_date"
								labelStyle={labelStyle}
								value={formState.start_date}
								onChange={handleChange}
								mb={{ base: 2, "2xl": "1rem" }}
							/>
							<Calenders
								label="To"
								name="tx_date"
								labelStyle={labelStyle}
								value={formState.tx_date}
								onChange={handleChange}
								mb={{ base: 2, "2xl": "1rem" }}
							/>
							<Input
								label="Amount"
								name="amount"
								type="number"
								labelStyle={labelStyle}
								value={formState.amount}
								onChange={handleChange}
								inputLeftElement={
									<Icon
										name="rupee"
										height="14px"
										color="light"
									/>
								}
							/>
							<Input
								label="Tracking Number"
								name="rr_no"
								labelStyle={labelStyle}
								value={formState.rr_no}
								onChange={handleChange}
								type="number"
							/>
						</Flex>
					</form>
				</Modal>
			</Flex>
		</Flex>
	);
};
