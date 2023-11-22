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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { saveDataToFile } from "utils/FileSave";
import { HistoryTable, HistoryToolbar } from ".";

const limit = tableRowLimit?.XLARGE; // Page size

const action = {
	FILTER: 0,
	EXPORT: 1,
};

const export_type_options = [
	{
		value: "xlsx",
		label: "Download Report(Excel)",
	},
	{
		value: "pdf",
		label: "Download Report(Pdf)",
	},
];

/**
 * A History component shows transaction history
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<History></History>` TODO: Fix example
 */
const History = () => {
	const {
		handleSubmit: handleSubmitFilter,
		register: registerFilter,
		control: controlFilter,
		formState: { errors: errorsFilter, isSubmitting: isSubmittingFilter },
	} = useForm();

	const {
		handleSubmit: handleSubmitExport,
		register: registerExport,
		control: controlExport,
		formState: { errors: errorsExport, isSubmitting: isSubmittingExport },
	} = useForm();

	const watcherFilter = useWatch({
		control: controlFilter,
	});

	const watcherExport = useWatch({
		control: controlExport,
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
	const router = useRouter();
	const { userData } = useUser();
	const { accountDetails } = userData;
	const { account_list } = accountDetails;
	const { accessToken } = useSession();
	const { setSearchTitle } = useGlobalSearch();
	const [data, setData] = useState();
	const [searchValue, setSearchValue] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [, setFormState] = useState({ ...formElements });
	const [finalFormState, setFinalFormState] = useState({});
	const [clear, setClear] = useState(false);
	const [loading, setLoading] = useState(false);
	const [openModalId, setOpenModalId] = useState(null);

	const history_filter_parameter_list = [
		{
			name: "tid",
			label: "TID",
			parameter_type_id: ParamType.NUMERIC,
			validations: {
				required: false,
			},
		},
		{
			name: "account",
			label: "Account Number",
			parameter_type_id: ParamType.NUMERIC,
			validations: {
				required: false,
			},
		},
		{
			name: "customer_mobile",
			label: "Customer Mobile No.",
			parameter_type_id: ParamType.NUMERIC,
			validations: {
				required: false,
			},
		},
		{
			name: "start_date",
			label: "From",
			parameter_type_id: ParamType.NUMERIC,
			validations: {
				required: false,
			},
		},
		{
			name: "tx_date",
			label: "To",
			parameter_type_id: ParamType.NUMERIC,
			validations: {
				required: false,
			},
		},
		{
			name: "amount",
			label: "Amount",
			parameter_type_id: ParamType.NUMERIC,
			inputLeftElement: <Icon name="rupee" size="sm" color="light" />,
			validations: {
				required: false,
			},
		},
		{
			name: "rr_no",
			label: "Tracking Number",
			parameter_type_id: ParamType.NUMERIC,
			validations: {
				required: false,
			},
		},
	];

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

			// onClose();
			setOpenModalId(null);
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

		// onClose();
		setOpenModalId(null);
		setClear(true);
	};

	const onFilterSubmit = (data) => {
		console.log("hitQuery inside onFilterSubmit", data);

		// Get all non-empty values from formState and set in finalFormState
		const _finalFormState = {};
		Object.keys(data).forEach((key) => {
			if (data[key]) {
				_finalFormState[key] = data[key];
			}
		});
		setFinalFormState(_finalFormState);

		// onClose();
		setOpenModalId(null);
		setClear(true);
	};

	const onFilterClear = () => {
		setFormState({ ...formElements });
		setFinalFormState({});
		setSearchValue("");
		setClear(false);
	};

	const onReportDownload = (data) => {
		console.log("inside onReportDownload data", data);

		// onClose();
		setOpenModalId(null);

		// const currentDate = new Date();
		// const formattedDate = formatDate(currentDate, "yyyy-MM-dd");

		const isNonEmpty = (data) => data !== "";

		// Filter the keys in finalFormState based on non-empty values
		const nonEmptyValues = Object.keys(data).filter((key) =>
			isNonEmpty(data[key])
		);

		// Create a new object with the non-empty values
		const filterParameter = {};
		nonEmptyValues.forEach((key) => {
			filterParameter[key] = finalFormState[key];
		});

		// Add current date if tx_date is not selected in filter by default
		// ? default one day if nothing
		// if (!filterParameter["tx_date"] !== undefined) {
		// 	filterParameter.tx_date = formattedDate;
		// }

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
				...data,
			},
			token: accessToken,
		})
			.then((data) => {
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

	const actionBtnConfig = [
		{
			id: action.FILTER,
			label: "Filter",
			icon: "filter",
			parameter_list: history_filter_parameter_list,
			handleSubmit: handleSubmitFilter,
			register: registerFilter,
			control: controlFilter,
			errors: errorsFilter,
			isSubmitting: isSubmittingFilter,
			formValues: watcherFilter,
			handleFormSubmit: onFilterSubmit,
			submitButtonText: "Apply",
		},
		{
			id: action.EXPORT,
			label: "Export",
			icon: "file-download",
			parameter_list: [
				...history_filter_parameter_list,
				{
					name: "reporttype",
					label: "Export Type",
					parameter_type_id: ParamType.LIST,
					list_elements: export_type_options,
				},
			],

			handleSubmit: handleSubmitExport,
			register: registerExport,
			control: controlExport,
			errors: errorsExport,
			isSubmitting: isSubmittingExport,
			formValues: watcherExport,
			handleFormSubmit: onReportDownload,
			submitButtonText: "Export",
		},
	];

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
						searchValue,
						onSearchSubmit,
						clear,
						onFilterClear,
						openModalId,
						setOpenModalId,
						actionBtnConfig,
					}}
				/>
				<PrintReceipt heading="Transaction Receipt (copy)">
					<HistoryTable
						{...{
							loading,
							transactionList,
							tableRowLimit: limit,
							pageNumber: currentPage,
							setPageNumber: setCurrentPage,
						}}
					/>
				</PrintReceipt>
			</Flex>
		</>
	);
};

export default History;
