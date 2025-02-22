import { Flex, Text } from "@chakra-ui/react";
import { Endpoints, UserTypeIcon, UserTypeLabel } from "constants";
import { useSession } from "contexts";
import { useApiFetch } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { OnboardedMerchants, OnboardingDashboardFilters } from ".";
import { DashboardDateFilter, getDateRange, TopPanel, useDashboard } from "..";

const ONBOARDING_DASHBOARD_FILTERS_CACHE_KEY = "onboardingDashboardFilters";

/**
 * To modify filter list, will add id to each list item & Onboarding Funnel item
 * @param {object} data - Contains onboardingFunnelTotal and filterList
 * @returns {object} - Contains funnelKeyList, filterList, & filterListLength
 */
const getModifiedFilterList = (data) => {
	let filterList = [
		{
			id: 0,
			label: "All Onboarding Agents",
			value: data?.onboardingFunnelTotal ?? 0,
			status_ids: "*", // Using wildcard to represent all filters
		},
	];

	let funnelKeyList = [];

	const _filterList = data?.filterList;

	_filterList?.forEach((ele, index) => {
		let _filter = { id: index + 1, ...ele };
		filterList.push(_filter);
		funnelKeyList.push(ele?.status_ids);
	});

	return { funnelKeyList, filterList };
};

const getCacheKey = (prevDate, currDate) => {
	const fromKey = prevDate.slice(0, 10);
	const toKey = currDate.slice(0, 10);
	return `${fromKey}-${toKey}`;
};

/**
 * OnboardingDashboard component renders the dashboard for onboarding agents.
 * It includes filters, top panel data, and a list of onboarded merchants.
 * @component
 * @example
 * return (
 *   <OnboardingDashboard />
 * )
 */
const OnboardingDashboard = () => {
	const [filterData, setFilterData] = useState([]);
	const [onboardingMerchantData, setOnboardingMerchantsData] = useState([]);
	const { accessToken } = useSession();
	const [pageNumber, setPageNumber] = useState(1);
	const [onboardingAgentsTopPanelData, setOnboardingAgentsTopPanelData] =
		useState([]);
	const [dateRange, setDateRange] = useState("today");
	const { onboardingDashboardData, setOnboardingDashboardData } =
		useDashboard();

	const { prevDate, currDate } = useMemo(
		() => getDateRange(dateRange),
		[dateRange]
	);

	const [filterStatus, setFilterStatus] = useState([]);

	const { funnelKeyList, filterList } = useMemo(
		() => getModifiedFilterList(filterData),
		[filterData]
	);

	const isAllSelected = useMemo(
		() => funnelKeyList.flat().every((item) => filterStatus.includes(item)),
		[funnelKeyList, filterStatus]
	);

	const isInitialLoad = useMemo(
		() => isAllSelected && pageNumber === 1,
		[isAllSelected, pageNumber]
	);

	const cacheKey = useMemo(
		() => getCacheKey(prevDate, currDate),
		[prevDate, currDate]
	);

	const [fetchOnboardingAgentsTopPanelData] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			body: {
				interaction_type_id: 817,
				requestPayload: {
					Top_panel: {
						datefrom: prevDate,
						dateto: currDate,
					},
				},
			},
			onSuccess: (res) => {
				const defaultData = {
					1: { totalCount: 0, lastPeriod: 0 },
					2: { totalCount: 0, lastPeriod: 0 },
				};

				const _data = res?.data?.onboarding_funnel?.[0] || defaultData;
				const onboardedAgentsList =
					transformOnboardingAgentsData(_data);

				setOnboardingDashboardData((prev) => ({
					...prev,
					onboardedAgentsCache: {
						...(prev.onboardedAgentsCache || {}),
						[cacheKey]: onboardedAgentsList,
					},
				}));

				setOnboardingAgentsTopPanelData(onboardedAgentsList);
			},
		}
	);

	const [fetchOnboardingDashboardFilterData, filterLoading] = useApiFetch(
		Endpoints.TRANSACTION,
		{
			body: {
				interaction_type_id: 683,
			},
			token: accessToken,
			onSuccess: (res) => {
				const _onboardingFilterList = res?.data?.onboarding_funnel;
				const _onboardingFunnelTotal = res?.data?.totalRecords;

				setOnboardingDashboardData((prev) => ({
					...prev,
					filterCache: {
						...(prev.filterCache || {}),
						[ONBOARDING_DASHBOARD_FILTERS_CACHE_KEY]: {
							onboardingFunnelTotal: _onboardingFunnelTotal,
							filterList: _onboardingFilterList,
						},
					},
				}));

				setFilterData({
					onboardingFunnelTotal: _onboardingFunnelTotal,
					filterList: _onboardingFilterList,
				});
			},
		}
	);

	const [fetchOnboardingAgentsData, isLoading] = useApiFetch(
		Endpoints.TRANSACTION,
		{
			body: {
				interaction_type_id: 727,
				record_count: 10,
				account_status: `${filterStatus}`,
				page_number: pageNumber,
			},
			onSuccess: (res) => {
				const _data = res?.data?.onboarding_funnel || [];
				const _totalRecords = res?.data?.totalRecords;

				if (isInitialLoad) {
					setOnboardingDashboardData((prev) => ({
						...prev,
						agentsCache: {
							...(prev.agentsCache || {}),
							default: {
								tableData: _data,
								totalRecords: _totalRecords,
							},
						},
					}));
				}

				setOnboardingMerchantsData({
					tableData: _data,
					totalRecords: _totalRecords,
				});
			},
		}
	);

	useEffect(() => {
		if (
			onboardingDashboardData?.filterCache?.[
				ONBOARDING_DASHBOARD_FILTERS_CACHE_KEY
			]
		) {
			setFilterData(
				onboardingDashboardData.filterCache[
					ONBOARDING_DASHBOARD_FILTERS_CACHE_KEY
				]
			);
		} else {
			fetchOnboardingDashboardFilterData();
		}
	}, []);

	useEffect(() => {
		setFilterStatus(funnelKeyList);
	}, [funnelKeyList]);

	useEffect(() => {
		if (prevDate && currDate) {
			if (onboardingDashboardData?.onboardedAgentsCache?.[cacheKey]) {
				setOnboardingAgentsTopPanelData(
					onboardingDashboardData.onboardedAgentsCache[cacheKey]
				);
			} else {
				fetchOnboardingAgentsTopPanelData();
			}
		}
	}, [currDate, prevDate, onboardingDashboardData]);

	useEffect(() => {
		if (!filterStatus?.length) return;
		if (isInitialLoad && onboardingDashboardData?.agentsCache?.default) {
			setOnboardingMerchantsData(
				onboardingDashboardData.agentsCache.default
			);
		} else {
			fetchOnboardingAgentsData();
		}
	}, [filterStatus, pageNumber]);

	return (
		<Flex direction="column" gap="4" p={{ base: "20px", md: "20px 0px" }}>
			<DashboardDateFilter
				{...{ prevDate, currDate, dateRange, setDateRange }}
			/>

			<TopPanel panelDataList={onboardingAgentsTopPanelData} />

			<Flex direction="column" gap="2">
				<Text fontSize="xl" fontWeight="semibold">
					Onboarding Agents
				</Text>

				<Flex
					direction="column"
					bg="white"
					borderRadius="10"
					p={{ base: "20px", md: "0px" }}
				>
					<OnboardingDashboardFilters
						{...{
							filterLoading,
							filterList,
							funnelKeyList,
							filterStatus,
							setFilterStatus,
						}}
					/>

					{/* show "Nothing Found", if onboardingMerchantData is empty */}
					{!isLoading &&
					!onboardingMerchantData?.tableData?.length ? (
						<Flex
							direction="column"
							align="center"
							mt={{ base: "2", md: "0" }}
							mb={{ base: "2", md: "8" }}
						>
							<Text color="light">Nothing Found</Text>
						</Flex>
					) : (
						<OnboardedMerchants
							{...{
								onboardingMerchantData,
								pageNumber,
								setPageNumber,
								isLoading,
							}}
						/>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default OnboardingDashboard;

/**
 * Transforms API response into a format compatible with the component.
 * @param {object} apiData - The raw data from the API response.
 * @returns {Array} A formatted array of objects for rendering.
 */
const transformOnboardingAgentsData = (apiData) => {
	if (!apiData || typeof apiData !== "object") return [];

	return Object.entries(apiData)
		.map(([key, data]) => {
			const userType = UserTypeLabel[key]; // Get label from mapping
			const userTypeIcon = UserTypeIcon[key];
			if (!userType) return null; // Ignore unknown user types

			return {
				key: `onboarded${userType.replace(/\s+/g, "")}`, // Convert to camelCase
				label: `${userType}(s) Onboarded`,
				value: parseInt(data.totalCount, 10), // Ensure numeric value
				type: "number",
				// variation: `${(data.activecount / data.totalcount) * 100}`,
				// info: `of ${data.totalcount} Total`,
				icon: userTypeIcon ?? "person",
			};
		})
		.filter(Boolean); // Remove null values
};
