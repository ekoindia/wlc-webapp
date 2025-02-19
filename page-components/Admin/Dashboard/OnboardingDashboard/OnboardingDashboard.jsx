import { Flex, Text } from "@chakra-ui/react";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { useApiFetch } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { OnboardedMerchants, OnboardingDashboardFilters } from ".";
import { DashboardDateFilter, getDateRange, TopPanel } from "..";

/**
 * To modify filter list, will add id to each list item & Onboarding Funnel item
 * @param {object} data - Contains onboardingFunnelTotal and filterList
 * @returns {object} - Contains funnelKeyList, filterList, & filterListLength
 */
const getModifiedFilterList = (data) => {
	let filterList = [
		{
			id: 0,
			label: "All Onboarding Agent",
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
	const [topPanelData, setTopPanelData] = useState([]);
	const [dateRange, setDateRange] = useState("today");
	const [onboardingDashboardData, setOnboardingDashboardData] = useState({});

	const { prevDate, currDate } = useMemo(
		() => getDateRange(dateRange),
		[dateRange]
	);

	const { funnelKeyList, filterList } = useMemo(
		() => getModifiedFilterList(filterData),
		[filterData]
	);

	const [filterStatus, setFilterStatus] = useState([]);

	const cacheKey = useMemo(
		() => getCacheKey(prevDate, currDate),
		[prevDate, currDate]
	);

	const [fetchOnboardingDashboardTopPanelData] = useApiFetch(
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
				const _data = res?.data?.onboarding_funnel[0] || [];

				setOnboardingDashboardData((prev) => ({
					...prev,
					onboardedAgentsCache: {
						...(prev.onboardedAgentsCache || {}),
						[cacheKey]: _data,
					},
				}));

				setTopPanelData(_data);
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
				setOnboardingMerchantsData({
					tableData: _data,
					totalRecords: _totalRecords,
				});
			},
		}
	);

	useEffect(() => {
		fetchOnboardingDashboardFilterData();
	}, []);

	useEffect(() => {
		setFilterStatus(funnelKeyList);
	}, [funnelKeyList]);

	useEffect(() => {
		if (prevDate && currDate) {
			if (onboardingDashboardData?.onboardedAgentsCache?.[cacheKey]) {
				setTopPanelData(
					onboardingDashboardData.onboardedAgentsCache[cacheKey]
				);
			} else {
				fetchOnboardingDashboardTopPanelData();
			}
		}
	}, [currDate, prevDate, onboardingDashboardData]);

	useEffect(() => {
		if (filterStatus?.length) {
			fetchOnboardingAgentsData();
		}
	}, [filterStatus, pageNumber]);

	const onboardedAgents = [
		{
			key: "totalRetailers",
			label: "Retailers Onboarded",
			value: topPanelData?.totalRetailers?.totalRetailers,
			type: "number",
			variation: topPanelData?.totalRetailers?.increaseOrDecrease,
			icon: "people",
		},
		{
			key: "totalDistributors",
			label: "Distributors Onboarded",
			value: topPanelData?.totalDistributors?.totalDistributors,
			type: "number",
			variation: topPanelData?.totalDistributors?.increaseOrDecrease,
			icon: "refer",
		},
	];

	return (
		<Flex direction="column" gap="4" p={{ base: "20px", md: "20px 0px" }}>
			<DashboardDateFilter
				{...{ prevDate, currDate, dateRange, setDateRange }}
			/>

			<TopPanel panelDataList={onboardedAgents} />

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
