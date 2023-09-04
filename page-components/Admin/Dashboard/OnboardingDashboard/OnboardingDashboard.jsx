import { Flex } from "@chakra-ui/react";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useEffect, useState } from "react";
import { OnboardedMerchants, OnboardingDashboardFilters } from ".";
import { DashboardDateFilter } from "..";
/**
 * A OnboardingDashboard page-component
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardingDashboard></OnboardingDashboard>`
 */
const OnboardingDashboard = () => {
	const [onboardingMerchantData, setOnboardingMerchantsData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filterLoading, setFilterLoading] = useState(true); //to handle filter skeleton
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

	useEffect(() => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
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
		}).then((res) => {
			const _onboardingFilterList = res?.data?.onboarding_funnel;
			const _onboardingFunnelTotal = res?.data?.totalrecord;
			setFilterData({
				onboardingFunnelTotal: _onboardingFunnelTotal,
				filterList: _onboardingFilterList,
			});
		});
	}, [prevDate]);

	useEffect(() => {
		const controller = new AbortController();

		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri":
					"/network/dashboard/onboarding/agent_funnel_details",
				"tf-req-method": "GET",
			},
			body: {
				record_count: 10,
				account_status: `${filterStatus}`,
				page_number: pageNumber,
				dateFrom: prevDate.slice(0, 10),
				dateTo: currDate.slice(0, 10),
			},
			controller: controller,
			token: accessToken,
		})
			.then((res) => {
				const _data = res?.data?.onboarding_funnel || [];
				const _totalRecords = res?.data?.totalRecords;
				setOnboardingMerchantsData({
					tableData: _data,
					totalRecords: _totalRecords,
				});

				if (filterLoading) setFilterLoading(false);
			})
			.catch((err) => {
				console.error(`[OnboardingDashboard] error: `, err);
			})
			.finally(() => {
				setIsLoading(false);
			});

		return () => {
			setIsLoading(true);
			controller.abort();
		};
	}, [filterStatus, pageNumber, prevDate]);

	return (
		<Flex direction="column">
			<Flex p={{ base: "20px 20px 0", md: "0 20px 20px" }}>
				<DashboardDateFilter
					{...{ prevDate, currDate, dateRange, setDateRange }}
				/>
			</Flex>

			<Flex px={{ base: "0px", md: "20px" }}>
				<OnboardingDashboardFilters
					{...{
						filterLoading,
						filterData,
						filterStatus,
						setFilterStatus,
					}}
				/>
			</Flex>
			<Flex p="20px">
				<OnboardedMerchants
					{...{
						onboardingMerchantData,
						pageNumber,
						setPageNumber,
						isLoading,
					}}
				/>
			</Flex>
		</Flex>
	);
};

export default OnboardingDashboard;
