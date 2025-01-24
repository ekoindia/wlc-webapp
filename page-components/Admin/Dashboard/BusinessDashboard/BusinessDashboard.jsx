import { Flex } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useApiFetch } from "hooks";
import { useEffect, useState } from "react";
import { EarningOverview, SuccessRate, TopMerchants } from ".";
import { DashboardDateFilter, TopPanel } from "..";

/**
 * A <BusinessDashboard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BusinessDashboard></BusinessDashboard>`
 */
const BusinessDashboard = () => {
	const [data, setData] = useState();
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
	}, [dateRange]);

	// MARK: Fetching Data
	const [fetchBusinessDashboardData] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			body: {
				interaction_type_id: 682,
				requestPayload: {
					Top_panel: {
						datefrom: prevDate.slice(0, 10),
						dateto: currDate.slice(0, 10),
					},
					earning_overview: {
						datefrom: prevDate.slice(0, 10),
						dateto: currDate.slice(0, 10),
						typeid: "81",
					},
					success_rate: {
						datefrom: prevDate.slice(0, 10),
						dateto: currDate.slice(0, 10),
					},
					gtv_top_merchants: {
						datefrom: prevDate.slice(0, 10),
						dateto: currDate.slice(0, 10),
						typeid: "81",
					},
				},
			},
			onSuccess: (res) => {
				const _data = res?.data?.dashboard_details[0] || [];
				setData(_data);
			},
		}
	);

	useEffect(() => {
		if (prevDate && currDate) {
			fetchBusinessDashboardData();
		}
	}, [currDate, prevDate]);

	const { topPanel, earningOverview, topMerchants, successRate } = data || {};

	const topPanelList = [
		{
			key: "activeRetailers",
			label: "Active Retailers",
			value: topPanel?.activeRetailers?.activeRetailers,
			type: "number",
			variation: topPanel?.activeRetailers?.increaseOrDecrease,
			icon: "people",
		},
		{
			key: "activeDistributors",
			label: "Active Distributors",
			value: topPanel?.activeDistributors?.activeDistributors,
			type: "number",
			variation: topPanel?.activeDistributors?.increaseOrDecrease,
			icon: "refer",
		},
		{
			key: "grossTransactionValue",
			label: "GTV",
			value: topPanel?.grossTransactionValue?.grossTransactionValue,
			type: "amount",
			variation: topPanel?.grossTransactionValue?.increaseOrDecrease,
			icon: "rupee_bg",
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
			<Flex gap="4" wrap="wrap">
				<Flex flex="2">
					<EarningOverview data={earningOverview} />
				</Flex>
				<Flex flex="1">
					<SuccessRate data={successRate} />
				</Flex>
			</Flex>
			<TopMerchants data={topMerchants} />
		</Flex>
	);
};

export default BusinessDashboard;
