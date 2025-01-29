import { Flex, Text } from "@chakra-ui/react";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { useApiFetch } from "hooks";
import { useEffect, useState } from "react";
import { OnboardedMerchants, OnboardingDashboardFilters } from ".";
import { DashboardDateFilter, TopPanel } from "..";

/**
 * A OnboardingDashboard page-component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardingDashboard></OnboardingDashboard>`
 */
const OnboardingDashboard = () => {
	const [onboardingMerchantData, setOnboardingMerchantsData] = useState([]);
	const [filterStatus, setFilterStatus] = useState([]);
	const [filterData, setFilterData] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const { accessToken } = useSession();
	const [dateRange, setDateRange] = useState(7);
	const [prevDate, setPrevDate] = useState("");
	const [currDate, setCurrDate] = useState("");
	const [topPanelData, setTopPanelData] = useState([]);

	useEffect(() => {
		let currentDate = new Date();
		let previousDate = new Date(
			currentDate.getTime() - dateRange * 24 * 60 * 60 * 1000
		);
		setCurrDate(currentDate.toISOString());
		setPrevDate(previousDate.toISOString());
		setFilterStatus([]);
	}, [dateRange]);

	const [fetchOnboardingDashboardTopPanelData] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			body: {
				interaction_type_id: 817,
				requestPayload: {
					Top_panel: {
						datefrom: prevDate.slice(0, 10),
						dateto: currDate.slice(0, 10),
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
				dateFrom: prevDate.slice(0, 10),
				dateTo: currDate.slice(0, 10),
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
				dateFrom: prevDate.slice(0, 10),
				dateTo: currDate.slice(0, 10),
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
