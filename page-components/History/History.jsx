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

const action = {
	FILTER: 0,
	EXPORT: 1,
};

const DEFAULT_DAY_LIMIT = 7;

const export_type_options = [
	{
		value: "pdf",
		label: "PDF",
	},
	{
		value: "xlsx",
		label: "Excel",
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
	const [finalFormState, setFinalFormState] = useState({});
	const [isFiltered, setIsFiltered] = useState(false);
	const [loading, setLoading] = useState(false);
	const [openModalId, setOpenModalId] = useState(null);
	const [minDateFilter, setMinDateFilter] = useState(null);
	const [minDateExport, setMinDateExport] = useState(() => {
		const _previousDate = new Date();
		_previousDate.setDate(_previousDate.getDate() - DEFAULT_DAY_LIMIT);
		return formatDate(_previousDate, "yyyy-MM-dd");
	});
	const [today] = useState(() => {
		const _today = new Date();
		return formatDate(_today, "yyyy-MM-dd");
	});
	const [previousDate] = useState(() => {
		const _previousDate = new Date();
		_previousDate.setDate(_previousDate.getDate() - DEFAULT_DAY_LIMIT);
		return formatDate(_previousDate, "yyyy-MM-dd");
	});

	const {
		handleSubmit: handleSubmitFilter,
		register: registerFilter,
		control: controlFilter,
		formState: { errors: errorsFilter, isSubmitting: isSubmittingFilter },
		reset: resetFilter,
	} = useForm();

	const {
		handleSubmit: handleSubmitExport,
		register: registerExport,
		control: controlExport,
		formState: { errors: errorsExport, isSubmitting: isSubmittingExport },
		reset: resetExport,
	} = useForm({
		defaultValues: {
			reporttype: "pdf",
			start_date: previousDate,
			tx_date: today,
		},
	});

	const watcherFilter = useWatch({
		control: controlFilter,
	});

	const watcherExport = useWatch({
		control: controlExport,
	});

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
			parameter_type_id: ParamType.FROM_DATE,
			maxDate: today,
			validations: {
				required: false,
			},
		},
		{
			name: "tx_date",
			label: "To",
			parameter_type_id: ParamType.TO_DATE,
			minDate:
				openModalId == action.FILTER
					? minDateFilter
					: openModalId == action.EXPORT
					? minDateExport
					: null,
			maxDate: today,
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

	function onSearchSubmit(e) {
		setSearchValue(e);
		if (e) {
			quickSearch(e);
		}
		// console.log("search value", e);
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
			setFinalFormState({
				...{ tid, account, customer_mobile, amount },
			});

			setOpenModalId(null);
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
		setFinalFormState({
			[type]: search,
		});

		setOpenModalId(null);
	};

	const onFilterSubmit = (data) => {
		// Get all non-empty values from formState and set in finalFormState
		const _finalFormState = {};
		Object.keys(data).forEach((key) => {
			if (data[key]) {
				_finalFormState[key] = data[key];
			}
		});
		setFinalFormState(_finalFormState);

		resetExport({
			..._finalFormState,
			reporttype: watcherExport.reporttype,
		});

		setOpenModalId(null);
		setIsFiltered(true);
	};

	const onFilterClear = () => {
		setFinalFormState({});
		setSearchValue("");
		setIsFiltered(false);
	};

	const onReportDownload = (data) => {
		setOpenModalId(null);

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
			secondaryButtonText: isFiltered ? "Clear All" : "Cancel",
			secondaryButtonAction: isFiltered
				? () => {
						onFilterSubmit({ ...formElements });
						setIsFiltered(false);
						resetFilter({ ...formElements });
						resetExport({
							reporttype: "pdf",
							start_date: previousDate,
							tx_date: today,
						});
				  }
				: () => setOpenModalId(null),
			styles: isFiltered
				? {
						bg: "primary.DEFAULT",
						color: "white",
						borderColor: "primary.DEFAULT",
						boxShadow: "buttonShadow",
						_hover: {
							bg: "primary.dark",
							borderColor: "primary.dark",
							boxShadow: "none",
						},
				  }
				: null,
		},
		{
			id: action.EXPORT,
			label: "Export",
			icon: "file-download",
			parameter_list: [
				...history_filter_parameter_list,
				{
					name: "reporttype",
					label: "Download Report as",
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
			submitButtonText: "Download",
			secondaryButtonText: "Cancel",
			secondaryButtonAction: () => setOpenModalId(null),
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

	useEffect(() => {
		if (openModalId == action.FILTER) {
			const _fromDateFilter = watcherFilter.start_date;
			const _txDateFilter = watcherFilter.tx_date;
			const _valuesFilter = watcherFilter;

			if (_fromDateFilter) {
				setMinDateFilter(_fromDateFilter);
			}

			if (_fromDateFilter > _txDateFilter) {
				// reset filter form tx_date to from_date
				resetFilter({ ..._valuesFilter, tx_date: _fromDateFilter });
			}
		}

		if (openModalId == action.EXPORT) {
			const _fromDateExport = watcherExport.start_date;
			const _txDateExport = watcherExport.tx_date;
			const _valuesExport = watcherExport;

			if (_fromDateExport) {
				setMinDateExport(_fromDateExport);
			}

			if (_fromDateExport > _txDateExport) {
				// reset export form tx_date to from_date
				resetExport({ ..._valuesExport, tx_date: _fromDateExport });
			}
		}
	}, [
		watcherFilter.start_date,
		watcherFilter.tx_date,
		watcherExport.start_date,
		watcherExport.tx_date,
	]);

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
						isFiltered,
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
