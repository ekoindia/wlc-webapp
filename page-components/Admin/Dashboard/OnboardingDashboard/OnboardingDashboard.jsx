import { Flex } from "@chakra-ui/react";
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

	useEffect(() => {
		let currentDate = new Date();
		let previousDate = new Date(
			currentDate.getTime() - dateRange * 24 * 60 * 60 * 1000
		);
		setCurrDate(currentDate.toISOString());
		setPrevDate(previousDate.toISOString());
		setFilterStatus([]);
	}, [dateRange]);

	const [fetchOnboardingDashboardFilterData, filterLoading] = useApiFetch(
		Endpoints.TRANSACTION,
		{
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri":
					"/network/dashboard/onboarding/agent_funnel_summary",
				"tf-req-method": "GET",
			},
			body: {
				dateFrom: prevDate.slice(0, 10),
				dateTo: currDate.slice(0, 10),
			},
			token: accessToken,
			onSuccess: (res) => {
				const _onboardingFilterList = res?.data?.onboarding_funnel;
				const _onboardingFunnelTotal = res?.data?.totalrecord;
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
	}, [prevDate]);

	const [fetchOnboardingDashboardData, isLoading] = useApiFetch(
		Endpoints.TRANSACTION,
		{
			interaction_type_id: 682,
			body: {
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

	const topPanel = {};

	const topPanelList = [
		{
			key: "totalRetailers",
			label: " Retailers Onboarded",
			value: topPanel?.totalRetailers?.totalRetailers,
			type: "number",
			variation: topPanel?.totalRetailers?.increaseOrDecrease,
			icon: "people",
		},
		{
			key: "totalDistributors",
			label: "Distributors Onboarded",
			value: topPanel?.totalDistributors?.totalDistributors,
			type: "number",
			variation: topPanel?.totalDistributors?.increaseOrDecrease,
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
