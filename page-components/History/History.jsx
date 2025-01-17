import { Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { Button, Headings, Icon, PrintReceipt } from "components";
import {
	Endpoints,
	ParamType,
	tableRowLimit,
	TransactionTypes,
} from "constants";
import {
	useAppSource,
	useGlobalSearch,
	useMenuContext,
	useSession,
	useUser,
} from "contexts";
import { fetcher } from "helpers";
import { formatDate } from "libs/dateFormat";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ANDROID_ACTION, calculateDateBefore, doAndroidAction } from "utils";
import { saveDataToFile } from "utils/FileSave";
import { HistoryTable, HistoryToolbar } from ".";

const limit = tableRowLimit?.XLARGE; // Page size

const action = {
	FILTER: 0,
	EXPORT: 1,
};

const calendar_min_date = calculateDateBefore(new Date(), 90, "yyyy-MM-dd");

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
 * @param	{boolean}	[prop.forNetwork]	Whether to show the transaction history for the whole network
 */
const History = ({ forNetwork = false }) => {
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
	const { userData, isAdmin } = useUser();
	const { accountDetails } = userData;
	const { account_list } = accountDetails;
	const { accessToken } = useSession();
	const { setSearchTitle } = useGlobalSearch();
	const [data, setData] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [finalFormState, setFinalFormState] = useState({});
	const [isFiltered, setIsFiltered] = useState(false);
	const [loading, setLoading] = useState(false);
	const [prevSearch, setPrevSearch] = useState("");
	const [openModalId, setOpenModalId] = useState(null);
	const [minDateFilter, setMinDateFilter] = useState(calendar_min_date);
	const [minDateExport, setMinDateExport] = useState(calendar_min_date);
	const { isAndroid } = useAppSource();

	const { interactions } = useMenuContext();
	const { trxn_type_prod_map } = interactions;

	const renderer = {
		label: "hist_label",
		value: "tx_typeid",
	};

	const [history_interaction_list, setHistoryInteractionList] = useState([]);
	useEffect(() => {
		if (!trxn_type_prod_map) return;

		const _history_interaction_list = Object.keys(trxn_type_prod_map).map(
			(key) => {
				const tx_typeid = parseInt(key);
				return { ...trxn_type_prod_map[key], tx_typeid };
			}
		);

		if (_history_interaction_list.length > 0) {
			setHistoryInteractionList(_history_interaction_list);
		}
	}, [trxn_type_prod_map]);

	const [today] = useState(() => {
		const _today = new Date();
		return formatDate(_today, "yyyy-MM-dd");
	});
	const [firstDateOfMonth] = useState(() => {
		const _currentDate = new Date();
		const _firstDateOfMonth = new Date(
			_currentDate.getFullYear(),
			_currentDate.getMonth(),
			1
		);
		return formatDate(_firstDateOfMonth, "yyyy-MM-dd");
	});

	const filterItemLimit = useBreakpointValue({
		base: 2,
		md: 4,
	});

	const {
		handleSubmit: handleSubmitSearch,
		register: registerSearch,
		control: controlSearch,
		formState: { errors: errorsSearch },
		reset: resetSearch,
	} = useForm();

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
			start_date: firstDateOfMonth,
			tx_date: today,
		},
	});

	const watcherSearch = useWatch({
		control: controlSearch,
	});

	const watcherFilter = useWatch({
		control: controlFilter,
	});

	const watcherExport = useWatch({
		control: controlExport,
	});

	// MARK: Filter Form
	const history_filter_parameter_list = useMemo(
		() => [
			...(forNetwork
				? [
						{
							name: "csp_mobile",
							label: "Agent's Mobile No.",
							parameter_type_id: ParamType.NUMERIC,
							step: 1,
							required: false,
						},
						{
							name: "cspcode",
							label: "Agent's UserCode",
							parameter_type_id: ParamType.NUMERIC,
							step: 1,
							required: false,
						},
					]
				: []),
			...[
				{
					name: "product",
					label: "Product",
					parameter_type_id: ParamType.LIST,
					list_elements: history_interaction_list,
					renderer: renderer,
					required: false,
				},
				{
					name: "tid",
					label: "TID",
					parameter_type_id: ParamType.NUMERIC,
					step: "1",
					required: false,
				},
				{
					name: "account",
					label: "Account Number",
					parameter_type_id: ParamType.NUMERIC,
					step: "1",
					required: false,
				},
				{
					name: "customer_mobile",
					label: "Customer Mobile No.",
					step: "1",
					parameter_type_id: ParamType.NUMERIC,
					required: false,
				},
				{
					name: "start_date",
					label: "From",
					parameter_type_id: ParamType.FROM_DATE,
					minDate: calendar_min_date,
					maxDate: today,
					required:
						openModalId == action.EXPORT
							? watcherExport.tid
								? false
								: true
							: false,
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
					required:
						openModalId == action.EXPORT
							? watcherExport.tid
								? false
								: true
							: false,
				},
				{
					name: "amount",
					label: "Amount",
					parameter_type_id: ParamType.NUMERIC,
					inputLeftElement: (
						<Icon name="rupee" size="xs" color="light" />
					),
					required: false,
				},
				{
					name: "rr_no",
					label: "Tracking Number",
					step: "1",
					parameter_type_id: ParamType.NUMERIC,
					required: false,
				},
			],
		],
		[
			history_interaction_list,
			renderer,
			calendar_min_date,
			minDateFilter,
			minDateExport,
			today,
			openModalId,
			watcherExport,
			forNetwork,
		]
	);

	console.log(
		"[History] filter_parameter_list",
		history_filter_parameter_list
	);

	// MARK: Fetch Data
	const hitQuery = (abortController, key) => {
		console.log("[History] fetch started...", key);

		const data = {};
		Object.keys(finalFormState).forEach((key) => {
			if (
				key === "product" &&
				finalFormState[key] &&
				finalFormState[key].tx_typeid
			) {
				data["tx_typeid"] = finalFormState[key].tx_typeid;
			} else if (finalFormState[key]) {
				data[key] = finalFormState[key];
			}
		});

		setLoading(true);

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			body: {
				interaction_type_id: TransactionTypes.GET_TRANSACTION_HISTORY,
				isNetworkTransactionHistory: forNetwork ? 1 : 0,
				start_index: (currentPage - 1) * limit,
				limit: limit,
				account_id: forNetwork
					? null
					: account_list &&
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
	 * @param otherQueries
	 */
	const quickSearch = (search, otherQueries = {}) => {
		console.log("Search inside quickSearch", search, otherQueries);

		if (!(search || otherQueries)) return;

		if (otherQueries["page"] != undefined) return;

		// Perform specific search, if available...
		if (otherQueries && Object.keys(otherQueries).length > 0) {
			const _finalFormState = {};

			Object.keys(otherQueries).forEach((key) => {
				if (otherQueries[key]) {
					_finalFormState[key] = otherQueries[key];
				}
			});
			// Set Filter form for searching...
			setFinalFormState(_finalFormState);
			resetFilter({ ..._finalFormState });
			resetExport({
				..._finalFormState,
				start_date: otherQueries["tid"]
					? ""
					: (watcherFilter.start_date ??
						watcherExport.start_date ??
						firstDateOfMonth),
				tx_date: otherQueries["tid"]
					? ""
					: (watcherFilter.tx_date ?? watcherExport.tx_date ?? today),
				reporttype: "pdf",
			});
			setIsFiltered(true);

			setOpenModalId(null);
			return;
		}

		// Remove formatters (commas and spaces) from the number query
		const unformattedNumberQuery = search?.replace(/(?<=[0-9])[ ,]/g, "");
		const len = unformattedNumberQuery?.length ?? 0;
		const isDecimal = unformattedNumberQuery?.includes(".");
		const numQueryVal = Number(unformattedNumberQuery);

		// Check if the query is a valid number
		const isValidNumQuery =
			numQueryVal &&
			Number.isFinite(numQueryVal) &&
			len >= 1 &&
			len <= 18;

		if (!isValidNumQuery) return;

		// Detect type of search
		let type;

		if (len === 10 && /^[6-9]/.test(search) && !isDecimal)
			type = "customer_mobile";
		else if (len <= 7) type = "amount";
		else if (len === 10 && !isDecimal) type = "tid";
		else if (len >= 9 && len <= 18 && !isDecimal) type = "account";

		// Set Filter form for searching...
		setFinalFormState({
			[type]: search,
		});
		resetFilter({ [type]: search });
		resetExport({
			[type]: search,
			start_date:
				type == "tid"
					? ""
					: (watcherFilter.start_date ??
						watcherExport.start_date ??
						firstDateOfMonth),
			tx_date:
				type == "tid"
					? ""
					: (watcherFilter.tx_date ?? watcherExport.tx_date ?? today),
			reporttype: "pdf",
		});
		setIsFiltered(true);
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
			start_date: watcherFilter.start_date ?? watcherExport.start_date,
			tx_date: watcherFilter.tx_date ?? watcherExport.tx_date,
			reporttype: watcherExport.reporttype,
		});

		setOpenModalId(null);
		setIsFiltered(true);
	};

	const clearFilter = () => {
		onFilterSubmit({ ...formElements });
		setPrevSearch("");
		resetSearch({ search: "" });
		resetFilter({ ...formElements });
		resetExport({
			reporttype: "pdf",
			start_date: firstDateOfMonth,
			tx_date: today,
		});
		setIsFiltered(false);
		const prefix = isAdmin ? "/admin" : "";
		router.push(`${prefix}/history`, undefined, {
			shallow: true,
		});
	};

	const onSearchSubmit = ({ search }) => {
		const _validSearch = search && search != prevSearch;
		if (_validSearch) {
			quickSearch(search);
			setPrevSearch(search);
			const prefix = isAdmin ? "/admin" : "";
			router.push(`${prefix}/history?search=${search}`, undefined, {
				shallow: true,
			});
		}
	};

	const filteredItemLabels = useMemo(() => {
		const _labels = [];
		const labelsToReplace = {
			From: "Date",
			To: "Date",
		};

		Object.keys(finalFormState).forEach((key) => {
			const matchedItem = history_filter_parameter_list.find(
				(item) => item.name === key
			);

			if (matchedItem) {
				const labelToAdd =
					labelsToReplace[matchedItem.label] || matchedItem.label;
				_labels.push(labelToAdd);
			}
		});

		return [...new Set(_labels)];
	}, [finalFormState]);

	const onReportDownload = (data) => {
		setOpenModalId(null);

		const _finalFormState = {};
		Object.keys(data).forEach((key) => {
			if (key === "product" && data[key] && data[key].tx_typeid) {
				_finalFormState["tx_typeid"] = data[key].tx_typeid;
			} else if (data[key]) {
				_finalFormState[key] = data[key];
			}
		});

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-is-file-download": "1",
			},
			body: {
				interaction_type_id:
					TransactionTypes.DOWNLOAD_TRXN_HISTORY_REPORT,
				start_index: 0,
				limit: 50000,
				account_id:
					account_list &&
					account_list.length > 0 &&
					account_list[0].id
						? account_list[0]?.id
						: null,
				..._finalFormState,
			},
			token: accessToken,
		})
			.then((data) => {
				const _blob = data?.file?.blob;
				const _filename = data?.file?.name || "file";
				const _type = data?.file["content-type"];
				const _b64 = true;
				if (isAndroid) {
					doAndroidAction(ANDROID_ACTION.SAVE_FILE_BLOB, {
						blob: _blob,
						name: _filename,
					});
				} else {
					saveDataToFile(_blob, _filename, _type, _b64);
				}
			})
			.catch((err) => {
				console.error("[History] error: ", err);
			});
	};

	const transactionList = data;

	const searchBarConfig = {
		register: registerSearch,
		control: controlSearch,
		errors: errorsSearch,
		formValues: watcherSearch,
		parameter_list: [
			{
				name: "search",
				parameter_type_id: ParamType.NUMERIC,
				placeholder: "Search by TID, Mobile, Account, etc",
				required: false,
				inputLeftElement: (
					<Icon name="search" size="sm" color="light" />
				),
				onEnter: handleSubmitSearch(onSearchSubmit),
			},
		],
		hideOptionalMark: true,
	};

	// MARK: Toolbar Buttons
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
			submitButtonText: isFiltered ? "Update" : "Apply",
			secondaryButtonText: isFiltered ? "Clear All" : "Cancel",
			secondaryButtonAction: isFiltered
				? () => clearFilter()
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
		const _validSearch = search ? search != prevSearch : others;
		if (_validSearch) {
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

	// MARK: JSX
	return (
		<>
			<Headings
				title={
					forNetwork ? "Network Transactions" : "Transaction History"
				}
			/>
			<Flex
				w="full"
				h="auto"
				p={{ base: "0px", md: "20px", "2xl": "14px 30px 30px 30px" }}
				direction={"column"}
				border={{ base: "", md: "card" }}
				borderRadius={{ base: "0", md: "10" }}
				boxShadow={{ base: "none", md: "0px 5px 15px #0000000D;" }}
				align="center"
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
						isFiltered,
						clearFilter,
						openModalId,
						setOpenModalId,
						searchBarConfig,
						actionBtnConfig,
						forNetwork,
					}}
				/>

				<PrintReceipt heading="Transaction Receipt (Copy)">
					<HistoryTable
						{...{
							loading,
							transactionList,
							tableRowLimit: limit,
							pageNumber: currentPage,
							setPageNumber: setCurrentPage,
							forNetwork,
						}}
					/>
				</PrintReceipt>

				<Flex
					display={isFiltered ? "flex" : "none"}
					align="center"
					gap="2"
					mt="6"
					sx={{
						"@media print": {
							display: "none !important",
						},
					}}
				>
					<Flex color="light" fontSize="xs">
						Filtering by &thinsp;
						{filteredItemLabels
							?.slice(0, filterItemLimit)
							.map((val, index) => (
								<Text
									key={index}
									color="dark"
									fontWeight="semibold"
									whiteSpace="nowrap"
								>
									{`${val}${
										index !== filteredItemLabels.length - 1
											? ",\u{2009}"
											: ""
									}`}
								</Text>
							))}
						{(filteredItemLabels?.length || 0) - filterItemLimit >
							0 && (
							<Text color="dark" fontWeight="semibold">
								{`and ${
									(filteredItemLabels?.length || 0) -
									filterItemLimit
								} more`}
							</Text>
						)}
					</Flex>
					<Button size="xs" onClick={() => clearFilter()}>
						Show All
					</Button>
				</Flex>
			</Flex>
		</>
	);
};

export default History;
