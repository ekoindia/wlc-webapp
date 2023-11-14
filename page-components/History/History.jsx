import { Flex } from "@chakra-ui/react";
import { Headings, Icon, PrintReceipt } from "components";
import {
	Endpoints,
	ParamType,
	tableRowLimit,
	TransactionTypes,
} from "constants";
import { useGlobalSearch, useSession, useUser } from "contexts";
import { fetcher } from "helpers";
import { formatDate } from "libs/dateFormat";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { saveDataToFile } from "utils/FileSave";
import { HistoryTable, HistoryToolbar } from ".";

const limit = tableRowLimit?.XLARGE; // Page size

/**
 * A History component shows transaction history
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<History></History>` TODO: Fix example
 */
const History = () => {
	const {
		// handleSubmit,
		register,
		control,
		formState: { errors, isSubmitting },
	} = useForm();

	const watcher = useWatch({
		control,
	});

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
	const [loading, setLoading] = useState(false);

	// Set GlobalSearch title
	useEffect(() => {
		setSearchTitle("Search by TID, Mobile, Account, etc");
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

		setLoading(true);

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
			})
			.finally(() => {
				setLoading(false);
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

	const history_filter_parameter_list = [
		{
			name: "tid",
			label: "TID",
			parameter_type_id: ParamType.NUMERIC,
		},
		{
			name: "account",
			label: "Account Number",
			parameter_type_id: ParamType.NUMERIC,
		},
		{
			name: "customer_mobile",
			label: "Customer Mobile No.",
			parameter_type_id: ParamType.NUMERIC,
		},
		{
			name: "start_date",
			label: "From",
			parameter_type_id: ParamType.NUMERIC,
		},
		{
			name: "tx_date",
			label: "To",
			parameter_type_id: ParamType.NUMERIC,
		},
		{
			name: "amount",
			label: "Amount",
			parameter_type_id: ParamType.NUMERIC,
			inputLeftElement: <Icon name="rupee" size="sm" color="light" />,
		},
		{
			name: "rr_no",
			label: "Tracking Number",
			parameter_type_id: ParamType.NUMERIC,
		},
	];

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

	const onReportDownload = (value) => {
		const currentDate = new Date();
		const formattedDate = formatDate(currentDate, "yyyy-MM-dd");

		const isNonEmpty = (value) => value !== "";

		// Filter the keys in finalFormState based on non-empty values
		const nonEmptyValues = Object.keys(finalFormState).filter((key) =>
			isNonEmpty(finalFormState[key])
		);

		// Create a new object with the non-empty values
		const filterParameter = {};
		nonEmptyValues.forEach((key) => {
			filterParameter[key] = finalFormState[key];
		});

		// Add current date if tx_date is not selected in filter by default
		if (!filterParameter["tx_date"] !== undefined) {
			filterParameter.tx_date = formattedDate;
		}

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-is-file-download": "1",
			},
			body: {
				interaction_type_id:
					TransactionTypes.DOWNLOAD_TRXN_HISTORY_REPORT,
				start_index: 1,
				limit: 50000,
				account_id:
					account_list &&
					account_list.length > 0 &&
					account_list[0].id
						? account_list[0]?.id
						: null,
				reporttype: value,
				...filterParameter,
			},
			token: accessToken,
		})
			.then((data) => {
				console.log(data);
				const _blob = data?.file?.blob;
				const _filename = data?.file?.name || "file";
				const _type = data?.file["content-type"];
				const _b64 = true;
				saveDataToFile(_blob, _filename, _type, _b64);
			})
			.catch((err) => {
				console.error("[History] error: ", err);
			});
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
				sx={{
					"@media print": {
						padding: "0 !important",
						bg: "none !important",
					},
				}}
			>
				<HistoryToolbar
					{...{
						form_parameter_list: history_filter_parameter_list,
						formValues: watcher,
						register,
						control,
						errors,
						isSubmitting,
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
						onReportDownload,
					}}
				/>
				<PrintReceipt heading="Transaction Receipt (copy)">
					<HistoryTable
						pageNumber={currentPage}
						setPageNumber={setCurrentPage}
						transactionList={transactionList}
						tableRowLimit={limit}
						loading={loading}
					/>
				</PrintReceipt>
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
			bg={activePillIndex === index ? "primary.DEFAULT" : "white"}
			color={activePillIndex === index ? "white" : "light"}
			_hover={{ bg: "primary.DEFAULT", color: "white" }}
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
