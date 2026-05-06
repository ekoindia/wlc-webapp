import { Flex, Text, useBreakpointValue, useToast } from "@chakra-ui/react";
import { Button, PageTitle } from "components";
import { Endpoints, ParamType } from "constants";
import {
	useAppSource,
	useNetworkUsers,
	useOrgDetailContext,
	useSession,
} from "contexts";
import { fetcher } from "helpers";
import { useFeatureFlag, useUserTypes } from "hooks";
import { useColumnVisibility } from "hooks/useColumnVisibility";
import { formatDate } from "libs/dateFormat";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ANDROID_ACTION, doAndroidAction, saveDataToFile } from "utils";
import { NetworkTable, NetworkToggleColumns, NetworkToolbar } from ".";
import { useNetworkTableParameterList } from "./NetworkTable/NetworkTable";

const NetworkTreeView = dynamic(
	() => import(".").then((pkg) => pkg.NetworkTreeView),
	{
		ssr: false,
	}
);

/** Earliest allowed calendar date for the onboarding range filters. */
const calendar_min_date = "2023-01-01";

/** Number of agent rows fetched per page. */
const PAGE_LIMIT = 10;

/**
 * Numeric identifiers for each action modal shown in the toolbar.
 * Used as a discriminated value for `openModalId`.
 */
const action = {
	FILTER: 0,
	EXPORT: 1,
	TOGGLE_COLUMNS: 2,
};

/** Options for the "Account Status" filter dropdown. */
const status_list = [
	{ label: "Active", value: "Active" },
	{ label: "In Progress", value: "InProgress" },
	{ label: "Inactive", value: "InActive" },
];

/**
 * Serialises a plain key/value object into a URL query-string.
 * @param {Record<string, string|number>} params - The parameters to encode.
 * @returns {string} A URL-encoded query string (without the leading `?`).
 */
const generateQueryParams = (params) => {
	return Object.keys(params)
		.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
		.join("&");
};

/**
 * **Network** — Admin / Agent "My Network" page component.
 *
 * Manages the full lifecycle of the network agent list:
 * - Fetches paginated agent data via the transaction proxy endpoint.
 * - Supports client-side **search** (type-ahead navigation to agent profiles)
 * and API-based **filter** (by user type, account status, onboarding date range).
 * - Supports **export** (XLSX download) of filtered/all network data.
 * - Provides an optional **Tree View** when the `NETWORK_TREE_VIEW` feature
 * flag is enabled.
 * - Manages **column visibility** persisted in `localStorage` via
 * `useColumnVisibility`.
 * - Performs **optimistic UI updates** for status changes and demo-user
 * deletion so the table reflects changes immediately without a re-fetch.
 *
 * All toolbar state (`openModalId`, filter/export form instances, etc.) is
 * owned here and passed down to `NetworkToolbar` and `NetworkTable`.
 * @returns {JSX.Element}
 * @example
 * // pages/admin/my-network.jsx
 * export default function MyNetworkPage() {
 *   return <Network />;
 * }
 */
const Network = () => {
	const formElements = {
		agentType: "",
		agentAccountStatus: "",
		onBoardingDateFrom: "",
		onBoardingDateTo: "",
	};
	const router = useRouter();
	const { accessToken, isAdmin, userType, userId } = useSession();
	const { isAndroid } = useAppSource();
	const { orgDetail } = useOrgDetailContext();
	const { getUserTypeLabel } = useUserTypes();
	const toast = useToast();

	const { networkUsersList, refreshUserList, userTypeIdList, loading } =
		useNetworkUsers();

	const operation_type_list = useMemo(() => {
		return userTypeIdList.map((typeId) => ({
			label: getUserTypeLabel(typeId),
			value: String(typeId),
		}));
	}, [userTypeIdList, getUserTypeLabel, loading]);

	const [pageNumber, setPageNumber] = useState(() => {
		if (router.isReady && router.query.page) {
			const page = parseInt(router.query.page, 10);
			return !isNaN(page) && page > 0 ? page : 1;
		}
		return 1;
	});
	const [isLoading, setIsLoading] = useState(true);
	const [networkData, setNetworkData] = useState([]);
	const [isFiltered, setIsFiltered] = useState(false);
	const [openModalId, setOpenModalId] = useState(null);
	const [queryParam, setQueryParam] = useState(null);
	const [minDateFilter, setMinDateFilter] = useState(calendar_min_date);
	const [minDateExport, setMinDateExport] = useState(calendar_min_date);
	const [finalFormState, setFinalFormState] = useState({});
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
	const [viewType, setViewType] = useState("list"); // List or Tree view

	const [isTreeViewEnabled] = useFeatureFlag("NETWORK_TREE_VIEW");

	const filterItemLimit = useBreakpointValue({
		base: 2,
		md: 4,
	});

	const {
		handleSubmit: handleSubmitFilter,
		register: registerFilter,
		control: controlFilter,
		formState: { errors: errorsFilter, isSubmitting: isSubmittingFilter },
		reset: resetFilter,
	} = useForm({ mode: "onChange" });

	const {
		handleSubmit: handleSubmitExport,
		register: registerExport,
		control: controlExport,
		formState: { errors: errorsExport, isSubmitting: isSubmittingExport },
		reset: resetExport,
	} = useForm({
		defaultValues: {
			reporttype: "pdf",
			onBoardingDateFrom: firstDateOfMonth,
			onBoardingDateTo: today,
		},
	});

	const watcherFilter = useWatch({
		control: controlFilter,
	});

	const watcherExport = useWatch({
		control: controlExport,
	});

	/**
	 * Callback to update agent status in the local state (for optimistic UI updates)
	 * @param {string} ekoCode - The eko_code of the agent to update
	 * @param {number} newStatusId - The new status ID
	 */
	const handleStatusUpdate = (ekoCode, newStatusId) => {
		const statusLabels = {
			13: "Pending Approval",
			16: "Active",
			18: "Inactive",
		};

		setNetworkData((prevData) => {
			if (!prevData?.agent_details) return prevData;

			return {
				...prevData,
				agent_details: prevData.agent_details.map((agent) => {
					if (agent.eko_code === ekoCode) {
						return {
							...agent,
							account_status_id: newStatusId,
							account_status:
								statusLabels[newStatusId] ||
								agent.account_status,
						};
					}
					return agent;
				}),
			};
		});
	};

	/**
	 * Callback to handle demo user deletion (for optimistic UI updates)
	 * @param {string} ekoCode - The eko_code of the demo user to delete
	 */
	const handleDeleteDemoUser = (ekoCode) => {
		setNetworkData((prevData) => {
			if (!prevData?.agent_details) return prevData;

			return {
				...prevData,
				agent_details: prevData.agent_details.filter(
					(agent) => agent.eko_code !== ekoCode
				),
			};
		});
	};

	// Column visibility management
	// NOTE: handlers are passed here so that getVisibleColumns() returns action-column
	// render functions that already carry the correct callbacks. Without them the
	// actions column rendered with onStatusUpdate=undefined because visibleColumns
	// closed over a stale column list built before the handlers existed.
	const networkTableParameterList = useNetworkTableParameterList({
		onStatusUpdate: handleStatusUpdate,
		onDeleteDemoUser: handleDeleteDemoUser,
	});
	const {
		hiddenColumns,
		toggleColumnVisibility,
		resetColumnVisibility,
		getVisibleColumns,
	} = useColumnVisibility({
		storageKey: "networkHidnCols",
		columns: networkTableParameterList,
	});

	// Recalculate visible columns when hiddenColumns OR the column list itself changes
	const visibleColumns = useMemo(
		() => getVisibleColumns(),
		[getVisibleColumns]
	);

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
				router.push(
					`${isAdmin ? "/admin" : ""}/my-network?page=${pageNumber}`,
					undefined,
					{
						shallow: true,
					}
				);
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

	const onFilterSubmit = (data) => {
		const filteredData = Object.entries(data)?.reduce(
			(acc, [key, value]) => {
				if (value) {
					// Extract value property from object values (for select/list fields)
					acc[key] =
						typeof value === "object" && value?.value !== undefined
							? value.value
							: value;
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
		setFinalFormState(filteredData);

		resetExport({
			...data,
			onBoardingDateFrom:
				watcherFilter.onBoardingDateFrom ??
				watcherExport.onBoardingDateFrom,
			onBoardingDateTo:
				watcherFilter.onBoardingDateTo ??
				watcherExport.onBoardingDateTo,
			reporttype: watcherExport.reporttype,
		});
	};

	const clearFilter = () => {
		setIsFiltered(false);
		setQueryParam(null);
		resetFilter({ ...formElements });
		resetExport({
			reporttype: "pdf",
			onBoardingDateFrom: firstDateOfMonth,
			onBoardingDateTo: today,
		});
		setFinalFormState({});
	};

	const onReportDownload = (data) => {
		setOpenModalId(null);

		const filteredData = Object.entries(data)?.reduce(
			(acc, [key, value]) => {
				if (value) {
					acc[key] =
						typeof value === "object" && value?.value !== undefined
							? value.value
							: value;
				}
				return acc;
			},
			{}
		);

		const download_params = generateQueryParams({
			initiator_id: userId,
			org_id: orgDetail?.org_id,
			...filteredData,
		});

		const reportUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/agent-subnetwork?${download_params}`;

		fetch(reportUrl, {
			method: "POST",
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(
						`Download failed with status ${res.status}`
					);
				}
				return res.blob();
			})
			.then((blob) => {
				const prefix = (
					orgDetail?.org_name ||
					orgDetail?.app_name ||
					"agent"
				)
					.replace(/\s+/g, "_")
					.toLowerCase();
				const _filename = `${prefix}_network.xlsx`;
				const _type =
					blob.type ||
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
				if (isAndroid) {
					doAndroidAction(ANDROID_ACTION.SAVE_FILE_BLOB, {
						blob,
						name: _filename,
					});
				} else {
					saveDataToFile(blob, _filename, _type);
				}
				toast({
					title: "Report downloaded successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			})
			.catch((err) => {
				console.error("[Network] export error: ", err);
				toast({
					title: "Failed to download report",
					description: "Please try again",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			});
	};

	const network_filter_parameter_list = [
		{
			name: "agentType",
			label: "User Type",
			parameter_type_id: ParamType.LIST,
			list_elements: operation_type_list
				.filter((item) => {
					// Show all user-types for admins
					if (isAdmin) return true;

					// Based on current user-type, show selected network-user-types
					if (userType === 1) {
						// For distributors, show only the following user types: FOS (4) and Retailer (2)
						if (item.value !== "2" && item.value !== "4") {
							return false;
						}
					} else if (userType === 7) {
						// For Super-Distributor, show only the following agent-types: Distributor, FOS, Retailer & Indipendent Retailer
						if (
							item.value !== "1" &&
							item.value !== "4" &&
							item.value !== "2" &&
							item.value !== "3"
						) {
							return false;
						}
					} else if (userType === 4) {
						// For Field Agent, show only the following agent-types: Retailer
						if (item.value !== "2") {
							return false;
						}
					}
					return true;
				})
				.map((type) => {
					// Convert default user-type labels to the custom labels, where applicable
					return { ...type, label: getUserTypeLabel(type.value) };
				}),
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
			name: "parent_user_code",
			label: "Show Sub-Network of a User",
			parameter_type_id: ParamType.TEXT,
			placeholder: "Enter Code",
			required: false,
		},
		{
			name: "onBoardingDateFrom",
			label: "From",
			parameter_type_id: ParamType.FROM_DATE,
			required: openModalId == action.EXPORT ? true : false,
			minDate: calendar_min_date,
			maxDate: today,
		},
		{
			name: "onBoardingDateTo",
			label: "To",
			parameter_type_id: ParamType.TO_DATE,
			required: openModalId == action.EXPORT ? true : false,
			minDate:
				openModalId == action.FILTER
					? minDateFilter
					: openModalId == action.EXPORT
						? minDateExport
						: null,
			maxDate: today,
		},
	];

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
		{
			id: action.EXPORT,
			label: "Export",
			icon: "file-download",
			parameter_list: network_filter_parameter_list,
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
		{
			id: action.TOGGLE_COLUMNS,
			label: "Columns",
			icon: "visibility",
			Component: NetworkToggleColumns,
			columns: networkTableParameterList,
			hiddenColumns,
			onToggle: toggleColumnVisibility,
			onReset: resetColumnVisibility,
			desktopOnly: true,
		},
	];

	// Fetch Network User List for the UserTypeList when the component mounts for the UserType Filter
	useEffect(() => {
		refreshUserList();
	}, []);

	useEffect(() => {
		if (openModalId == action.FILTER) {
			const _fromDateFilter = watcherFilter.onBoardingDateFrom;
			const _txDateFilter = watcherFilter.onBoardingDateTo;
			const _valuesFilter = watcherFilter;

			if (_fromDateFilter) {
				setMinDateFilter(_fromDateFilter);
			}

			if (_fromDateFilter > _txDateFilter) {
				resetFilter({
					..._valuesFilter,
					onBoardingDateTo: _fromDateFilter,
				});
			}
		}

		if (openModalId == action.EXPORT) {
			const _fromDateExport = watcherExport.onBoardingDateFrom;
			const _txDateExport = watcherExport.onBoardingDateTo;
			const _valuesExport = watcherExport;

			if (_fromDateExport) {
				setMinDateExport(_fromDateExport);
			}

			if (_fromDateExport > _txDateExport) {
				resetExport({
					..._valuesExport,
					onBoardingDateTo: _fromDateExport,
				});
			}
		}
	}, [
		watcherFilter.onBoardingDateFrom,
		watcherFilter.onBoardingDateTo,
		watcherExport.onBoardingDateFrom,
		watcherExport.onBoardingDateTo,
	]);

	const filteredItemLabels = useMemo(() => {
		const _labels = [];
		const labelsToReplace = {
			From: "Date",
			To: "Date",
		};

		if (!isFiltered) return _labels;

		Object.keys(finalFormState).forEach((key) => {
			const matchedItem = network_filter_parameter_list.find(
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

	useEffect(() => {
		if (router.isReady) {
			hitQuery();
		}
	}, [router.isReady, pageNumber, queryParam]);

	const totalRecords = networkData?.totalRecords;
	const agentDetails = networkData?.agent_details ?? [];

	// handleStatusUpdate and handleDeleteDemoUser have been moved above the
	// column visibility block so they can be passed into useNetworkTableParameterList.

	// MARK: JSX
	return (
		<>
			<PageTitle
				title="My Network"
				hideBackIcon
				toolComponent={
					isAdmin ? (
						<Button
							size="sm"
							icon="person"
							iconStyle={{ size: "xs" }}
							onClick={() =>
								router.push(
									"/admin/my-network/profile/change-role"
								)
							}
						>
							Change Roles
						</Button>
					) : null
				}
			/>
			<Flex
				direction="column"
				gap="4"
				p={{ base: "4", md: "0" }}
				// align="center"
			>
				<NetworkToolbar
					{...{
						isFiltered,
						clearFilter,
						openModalId,
						setOpenModalId,
						actionBtnConfig,
						viewType,
						setViewType,
						hideFilter: viewType === "tree",
						hideSearch: viewType === "tree",
						networkUsersList,
						onItemSelect: (item) => {
							router.push({
								pathname: isAdmin
									? "/admin/my-network/profile"
									: "/my-network/profile",
								query: { mobile: item.mobile },
							});
						},
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
							visibleColumns,
							onStatusUpdate: handleStatusUpdate,
							onDeleteDemoUser: handleDeleteDemoUser,
						}}
					/>
				) : null}

				{isTreeViewEnabled && viewType === "tree" ? (
					<NetworkTreeView />
				) : null}

				{viewType === "list" ? (
					<Flex
						display={isFiltered ? "flex" : "none"}
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
							Filtering by &nbsp;
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
											index !==
											filteredItemLabels.length - 1
												? ",\u{2009}"
												: ""
										}`}
									</Text>
								))}
							{(filteredItemLabels?.length || 0) -
								filterItemLimit >
								0 && (
								<Text color="dark" fontWeight="semibold">
									{`and ${
										(filteredItemLabels?.length || 0) -
										filterItemLimit
									} more`}
								</Text>
							)}
						</Flex>
						<Button size="xs" onClick={clearFilter}>
							Show All
						</Button>
					</Flex>
				) : null}
			</Flex>
		</>
	);
};

export default Network;
