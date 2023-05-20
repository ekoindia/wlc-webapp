import { Flex, Text } from "@chakra-ui/react";
import { Button, Calenders, Headings, Icon, Input, Modal } from "components";
import { Endpoints, TransactionTypes } from "constants";
import { useUser } from "contexts";
import useRequest from "hooks/useRequest";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HistoryPagination, HistoryTable } from ".";

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
	const [activePillIndex, setActivePillIndex] = useState(0);
	const [searchValue, setSearchValue] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [formState, setFormState] = useState({ ...formElements });
	const [clear, setClear] = useState(false);
	const { userData } = useUser();
	const { accountDetails } = userData;
	const { account_list } = accountDetails;

	const router = useRouter();

	const { search } = router.query;

	function onChangeHandler(e) {
		setSearchValue(e);
	}
	const handlePillClick = (index) => {
		setActivePillIndex(index);
	};
	const limit = 25; // Page size

	const body = {
		interaction_type_id: TransactionTypes.GET_TRANSACTION_HISTORY,
		start_index: currentPage * limit,
		limit: limit,
		...formState,
	};

	if (account_list && account_list.length > 0 && account_list[0].id) {
		body.account_id = account_list[0].id;
	}

	const { data, mutate, controller } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION,
		body: { ...body },
	});

	// Search for a transaction based on the parameter query "search".
	// The query can be a transaction-id, account, amount,
	// or, a mobile number.
	useEffect(() => {
		if (search) {
			console.log(">>>> ABORTING CONTROLLER");
			quickSearch(search);
			onApply();
		}
	}, [search]);

	useEffect(() => {
		mutate();
	}, [currentPage]);

	useEffect(() => {
		if (!clear) {
			mutate();
		}
	}, [clear]);

	const onApply = () => {
		controller.abort();
		mutate();
		onClose();
		setClear(true);
	};

	const onClear = () => {
		setFormState({ ...formElements });
		setClear(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState((prevFormState) => ({
			...prevFormState,
			[name]: value,
		}));
	};

	/**
	 * Search for a transaction based on the query. The query can be a transaction-id, account, amount, or, a mobile number.
	 * @param {*} query
	 */
	const quickSearch = (query) => {
		if (!query) return;

		if (/^[0-9]+$/.test(query) !== true) {
			// Not a number
			return;
		}

		// Detect type of query
		let type = "account";
		if (/^[6-9][0-9]{9}$/.test(query)) {
			type = "customer_mobile";
		} else if (query.length >= 7 && query.length <= 10) {
			type = "tid";
		} else if (query.length < 7) {
			type = "amount";
		}

		setFormState((prevFormState) => ({
			...prevFormState,
			[type]: query,
		}));
	};

	const transactionList = data?.data?.transaction_list ?? [];
	const listLength = transactionList.length;
	const hasNext = listLength >= limit;
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
						onChangeHandler,
						handleChange,
						clear,
						formState,
						isOpen,
						onOpen,
						onClose,
						onApply,
						onClear,
					}}
				/>

				{/* <=============================Transaction Table & Card ===============================> */}
				{/* // TODO add condition: if pageLimit is a multiple of totalRecords then show "no items" or "no more items" accordingly */}
				<HistoryTable transactionList={transactionList} />
				<Flex justify="flex-end">
					<HistoryPagination
						hasNext={hasNext}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
					/>
				</Flex>
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
	// searchValue,
	// onChangeHandler,
	clear,
	handleChange,
	formState,
	isOpen,
	onOpen,
	onClose,
	onApply,
	onClear,
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
				{/* <==========Search =========> */}
				{/* <SearchBar
                                value={searchValue}
                                onChangeHandler={onChangeHandler}
                /> */}

				{/* <==========Filter Button =========> */}

				{clear && (
					<Button
						size="xs"
						variant="link"
						onClick={onClear}
						_hover={{ TextDecoration: "none" }}
					>
						Clear Filter
					</Button>
				)}
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
					onSubmit={onApply}
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
