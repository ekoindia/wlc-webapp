import { Flex, Text } from "@chakra-ui/react";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { useApiFetch } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { OnboardedMerchants, OnboardingDashboardFilters } from ".";
import { DashboardDateFilter, getDateRange, TopPanel } from "..";

/**
 * A OnboardingDashboard page-component
 * @example	`<OnboardingDashboard></OnboardingDashboard>`
 */
const OnboardingDashboard = () => {
	const [onboardingMerchantData, setOnboardingMerchantsData] = useState([]);
	const [filterStatus, setFilterStatus] = useState([]);
	const [filterData, setFilterData] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const { accessToken } = useSession();
	const [topPanelData, setTopPanelData] = useState([]);
	const [dateRange, setDateRange] = useState("today");
	const { prevDate, currDate } = useMemo(
		() => getDateRange(dateRange),
		[dateRange]
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
				setTopPanelData(_data);
			},
		}
	);

	useEffect(() => {
		if (prevDate) {
			fetchOnboardingDashboardTopPanelData();
		}
	}, [currDate, prevDate]);

	const [fetchOnboardingDashboardFilterData, filterLoading] = useApiFetch(
		Endpoints.TRANSACTION,
		{
			body: {
				interaction_type_id: 683,
				dateFrom: prevDate,
				dateTo: currDate,
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

	useEffect(() => {
		if (prevDate) {
			fetchOnboardingDashboardFilterData();
		}
	}, [prevDate, currDate]);

	const [fetchOnboardingDashboardData, isLoading] = useApiFetch(
		Endpoints.TRANSACTION,
		{
			body: {
				interaction_type_id: 727,
				record_count: 10,
				account_status: `${filterStatus}`,
				page_number: pageNumber,
				dateFrom: prevDate,
				dateTo: currDate,
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
		if (prevDate) {
			fetchOnboardingDashboardData();
		}
	}, [filterStatus, pageNumber, prevDate]);

	const topPanelList = [
		{
			key: "totalRetailers",
			label: " Retailers Onboarded",
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
		<Flex
			direction="column"
			gap="4"
			p={{ base: "0px 20px", md: "20px 0px" }}
		>
			<DashboardDateFilter
				{...{ prevDate, currDate, dateRange, setDateRange }}
			/>

			<TopPanel {...{ topPanelList }} />

			<Text fontSize="xl" fontWeight="semibold">
				Onboarding Agents
			</Text>
			<OnboardingDashboardFilters
				{...{
					filterLoading,
					filterData,
					filterStatus,
					setFilterStatus,
				}}
			/>

			<OnboardedMerchants
				{...{
					onboardingMerchantData,
					pageNumber,
					setPageNumber,
					isLoading,
				}}
			/>
		</Flex>
	);
};

export default OnboardingDashboard;
