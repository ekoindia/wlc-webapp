import { Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { Button, Icon, PageTitle } from "components";
import { Endpoints, ParamType } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useFeatureFlag } from "hooks";
import { formatDate } from "libs/dateFormat";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { NetworkTable, NetworkToolbar } from ".";

const NetworkTreeView = dynamic(
	() => import(".").then((pkg) => pkg.NetworkTreeView),
	{
		ssr: false,
	}
);

const calendar_min_date = "2023-01-01";

const PAGE_LIMIT = 10;

const action = {
	FILTER: 0,
	// EXPORT: 1,
};

const operation_type_list = [
	{ label: "Independent Retailer", value: "3" },
	{ label: "Retailer", value: "2" },
	{ label: "Distributor", value: "1" },
];

const status_list = [
	{ label: "Active", value: "Active" },
	{ label: "Inactive", value: "Inactive" },
	// { label: "Closed", value: "closed" },
];

const generateQueryParams = (params) => {
	return Object.keys(params)
		.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
		.join("&");
};

/**
 * A My Network page-component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Network></Network>`
 */
const Network = () => {
	const formElements = {
		agentType: "",
		agentAccountStatus: "",
		onBoardingDateFrom: "",
		onBoardingDateTo: "",
	};
	const router = useRouter();
	const { accessToken } = useSession();
	const [pageNumber, setPageNumber] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [networkData, setNetworkData] = useState([]);
	const [isFiltered, setIsFiltered] = useState(false);
	const [isSearched, setIsSearched] = useState(false);
	const [openModalId, setOpenModalId] = useState(null);
	const [prevSearch, setPrevSearch] = useState("");
	const [queryParam, setQueryParam] = useState(null);
	const [minDateFilter, setMinDateFilter] = useState(calendar_min_date);
	const [finalFormState, setFinalFormState] = useState({});
	const [today] = useState(() => {
		const _today = new Date();
		return formatDate(_today, "yyyy-MM-dd");
	});
	const [viewType, setViewType] = useState("list"); // List or Tree view

	const [isTreeViewEnabled] = useFeatureFlag("NETWORK_TREE_VIEW");

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
	} = useForm({ mode: "onChange" });

	const {
		handleSubmit: handleSubmitFilter,
		register: registerFilter,
		control: controlFilter,
		formState: { errors: errorsFilter, isSubmitting: isSubmittingFilter },
		reset: resetFilter,
	} = useForm({ mode: "onChange" });

	const watcherSearch = useWatch({
		control: controlSearch,
	});

	const watcherFilter = useWatch({
		control: controlFilter,
	});

	const hitQuery = () => {
		let tf_req_uri = queryParam
			? `/network/agents?record_count=${PAGE_LIMIT}&page_number=${pageNumber}&${queryParam}`
			: `/network/agents?record_count=${PAGE_LIMIT}&page_number=${pageNumber}`;

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `${tf_req_uri}`,
				"tf-req-method": "GET",
			},
			token: accessToken,
		})
			.then((res) => {
				let _networkData = res?.data;
				setNetworkData(_networkData);
				router.push(`/admin/my-network?page=${pageNumber}`, undefined, {
					shallow: true,
				});
			})
			.catch((err) => {
				console.log("[Network] error", err);
			})
			.finally(() => {
				setIsLoading(false);
			});

		return () => {
			// setNetworkData([]);
			setIsLoading(true);
		};
	};

	const onSearchSubmit = (data) => {
		const { search_value } = data ?? {};

		const _validSearch = search_value && search_value != prevSearch;
		if (_validSearch) {
			setPrevSearch(search_value);
			setIsSearched(true);
			setIsFiltered(false);
			resetFilter({ ...formElements });
			let search_params = generateQueryParams({
				search_value,
			});
			setPageNumber(1);
			setQueryParam(search_params);
			setFinalFormState({ search_value });
		}
	};

	const clearSearch = () => {
		setIsSearched(false);
		setPrevSearch("");
		resetSearch({ search_value: "" });
		setQueryParam(null);
		setFinalFormState({});
	};

	const onFilterSubmit = (data) => {
		const filteredData = Object.entries(data)?.reduce(
			(acc, [key, value]) => {
				if (value) {
					acc[key] = value;
				}
				return acc;
			},
			{}
		);

		const filter_params = generateQueryParams({
			filter: true,
			...filteredData,
		});

		setPageNumber(1);
		setQueryParam(filter_params);
		setOpenModalId(null);
		setIsFiltered(true);
		setIsSearched(false);
		setPrevSearch("");
		resetSearch({ search_value: "" });
		setFinalFormState(filteredData);
	};

	const clearFilter = () => {
		setIsFiltered(false);
		setQueryParam(null);
		resetFilter({ ...formElements });
		setFinalFormState({});
	};

	const network_filter_parameter_list = [
		{
			name: "agentType",
			label: "Agent Type",
			parameter_type_id: ParamType.LIST,
			list_elements: operation_type_list,
			required: false,
		},
		{
			name: "agentAccountStatus",
			label: "Account Status",
			parameter_type_id: ParamType.LIST,
			list_elements: status_list,
			required: false,
		},
		{
			name: "onBoardingDateFrom",
			label: "From",
			parameter_type_id: ParamType.FROM_DATE,
			required: false,
			minDate: calendar_min_date,
			maxDate: today,
			// validations: {
			// 	required:
			// 		openModalId == action.EXPORT
			// 			? watcherExport.tid
			// 				? false
			// 				: true
			// 			: false,
			// },
		},
		{
			name: "onBoardingDateTo",
			label: "To",
			parameter_type_id: ParamType.TO_DATE,
			required: false,

			minDate:
				openModalId == action.FILTER
					? minDateFilter
					: // : openModalId == action.EXPORT
						// ? minDateExport
						null,
			maxDate: today,
			// validations: {
			// 	required:
			// 		openModalId == action.EXPORT
			// 			? watcherExport.tid
			// 				? false
			// 				: true
			// 			: false,
			// },
		},
	];

	const network_search_parameter_list = [
		{
			name: "search_value",
			parameter_type_id: ParamType.NUMERIC,
			placeholder: "Search by Mobile Number",
			inputLeftElement: <Icon name="search" size="sm" color="light" />,
			onEnter: handleSubmitSearch(onSearchSubmit),
			required: false,
			w: { base: "auto", md: "400px" },
		},
	];

	const searchBarConfig = {
		register: registerSearch,
		control: controlSearch,
		errors: errorsSearch,
		formValues: watcherSearch,
		parameter_list: network_search_parameter_list,
	};

	const actionBtnConfig = [
		{
			id: action.FILTER,
			label: "Filter",
			icon: "filter",
			parameter_list: network_filter_parameter_list,
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
						boxShadow: "sh-button",
						_hover: {
							bg: "primary.dark",
							borderColor: "primary.dark",
							boxShadow: "none",
						},
					}
				: null,
		},
	];

	useEffect(() => {
		if (openModalId == action.FILTER) {
			const _fromDateFilter = watcherFilter.onBoardingDateFrom;
			const _txDateFilter = watcherFilter.onBoardingDateTo;
			const _valuesFilter = watcherFilter;

			if (_fromDateFilter) {
				setMinDateFilter(_fromDateFilter);
			}

			if (_fromDateFilter > _txDateFilter) {
				// reset filter form tx_date to from_date
				resetFilter({
					..._valuesFilter,
					onBoardingDateTo: _fromDateFilter,
				});
			}
		}
	}, [watcherFilter.onBoardingDateFrom, watcherFilter.onBoardingDateTo]);

	const filteredItemLabels = useMemo(() => {
		const _labels = [];
		const labelsToReplace = {
			From: "Date",
			To: "Date",
			search_value: "Mobile Number",
		};

		const _parameterList = isFiltered
			? network_filter_parameter_list
			: isSearched
				? network_search_parameter_list
				: [];

		Object.keys(finalFormState).forEach((key) => {
			const matchedItem = _parameterList.find(
				(item) => item.name === key
			);

			if (matchedItem && isFiltered) {
				const labelToAdd =
					labelsToReplace[matchedItem.label] || matchedItem.label;
				_labels.push(labelToAdd);
			}
			if (matchedItem && isSearched) {
				_labels.push(
					labelsToReplace[matchedItem.name] || matchedItem.name
				);
			}
		});
		return [...new Set(_labels)];
	}, [finalFormState]);

	useEffect(() => {
		hitQuery();
	}, [pageNumber, queryParam]);

	const totalRecords = networkData?.totalRecords;
	const agentDetails = networkData?.agent_details ?? [];

	return (
		<>
			<PageTitle
				title="My Network"
				hideBackIcon
				toolComponent={
					<Button
						size={{ base: "sm", md: "md" }}
						onClick={() =>
							router.push("/admin/my-network/profile/change-role")
						}
					>
						Change Roles
					</Button>
				}
			/>
			<Flex
				direction="column"
				gap="4"
				mx={{ base: "4", md: "0" }}
				// align="center"
			>
				<NetworkToolbar
					{...{
						isSearched,
						clearSearch,
						isFiltered,
						clearFilter,
						openModalId,
						setOpenModalId,
						searchBarConfig,
						actionBtnConfig,
						viewType,
						setViewType,
						hideFilter: viewType === "tree",
						hideSearch: viewType === "tree",
					}}
				/>

				{viewType === "list" ? (
					<NetworkTable
						{...{
							isLoading,
							totalRecords,
							agentDetails,
							pageNumber,
							setPageNumber,
						}}
					/>
				) : null}

				{isTreeViewEnabled && viewType === "tree" ? (
					<NetworkTreeView />
				) : null}

				<Flex
					display={isFiltered || isSearched ? "flex" : "none"}
					alignSelf="center"
					align="center"
					gap="2"
					sx={{
						"@media print": {
							display: "none !important",
						},
					}}
				>
					<Flex color="light" fontSize="xs">
						{isFiltered
							? "Filtering by"
							: isSearched
								? "Searching by"
								: null}
						&nbsp;
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
					<Button
						size="xs"
						onClick={() => {
							isFiltered
								? clearFilter()
								: isSearched
									? clearSearch()
									: null;
						}}
					>
						Show All
					</Button>
				</Flex>
			</Flex>
		</>
	);
};

export default Network;
