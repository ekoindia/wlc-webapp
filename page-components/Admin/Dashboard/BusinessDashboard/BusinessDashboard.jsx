import { Flex } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useApiFetch } from "hooks";
import { useEffect, useState } from "react";
import { EarningOverview, SuccessRate, TopMerchants } from ".";
import { DashboardDateFilter, TopPanel } from "..";

const productList = [
	{ label: "Money Transfer", typeid: "81" },
	{ label: "AePS", typeid: "345" },
	{ label: "Bill Payments", typeid: "63" },
];

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

	// Centralized state for the requestPayload
	const [requestPayload, setRequestPayload] = useState({
		Top_panel: {
			datefrom: "",
			dateto: "",
		},
		earning_overview: {
			datefrom: "",
			dateto: "",
			typeid: "81", // Default typeid
		},
		success_rate: {
			datefrom: "",
			dateto: "",
		},
		gtv_top_merchants: {
			datefrom: "",
			dateto: "",
			typeid: "81", // Default typeid
		},
	});

	const [filterState, setFilterState] = useState({
		earning_overview: 0, // Index of the current tab in EarningOverview
		gtv_top_merchants: 0, // Index of the current tab in TopMerchants
	});

	useEffect(() => {
		let currentDate = new Date();
		let previousDate = new Date(
			currentDate.getTime() - dateRange * 24 * 60 * 60 * 1000
		);
		setCurrDate(currentDate.toISOString());
		setPrevDate(previousDate.toISOString());

		const earningOverviewTypeid =
			productList[filterState.earning_overview]?.typeid;
		const topMerchantsTypeid =
			productList[filterState.gtv_top_merchants]?.typeid;

		setRequestPayload({
			Top_panel: {
				datefrom: previousDate.toISOString().slice(0, 10),
				dateto: currentDate.toISOString().slice(0, 10),
			},
			earning_overview: {
				datefrom: previousDate.toISOString().slice(0, 10),
				dateto: currentDate.toISOString().slice(0, 10),
				typeid: earningOverviewTypeid,
			},
			success_rate: {
				datefrom: previousDate.toISOString().slice(0, 10),
				dateto: currentDate.toISOString().slice(0, 10),
			},
			gtv_top_merchants: {
				datefrom: previousDate.toISOString().slice(0, 10),
				dateto: currentDate.toISOString().slice(0, 10),
				typeid: topMerchantsTypeid,
			},
		});
	}, [dateRange, filterState]);

	// MARK: Fetching Data
	const [fetchBusinessDashboardData] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			body: {
				interaction_type_id: 682,
				requestPayload: requestPayload,
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
	}, [currDate, prevDate, requestPayload]);

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

	// Function to handle filter changes dynamically
	const handleFilterChange = (section, index) => {
		setFilterState((prev) => ({
			...prev,
			[section]: index,
		}));

		setRequestPayload((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				typeid: productList[index]?.typeid, // Update the typeid dynamically
			},
		}));
	};

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
					<EarningOverview
						data={earningOverview}
						filters={productList}
						currTab={filterState.earning_overview}
						onFilterChange={(index) =>
							handleFilterChange("earning_overview", index)
						}
					/>
				</Flex>
				<Flex flex="1">
					<SuccessRate data={successRate} />
				</Flex>
			</Flex>
			<TopMerchants
				data={topMerchants}
				filters={productList}
				currTab={filterState.gtv_top_merchants}
				onFilterChange={(index) =>
					handleFilterChange("gtv_top_merchants", index)
				}
			/>
		</Flex>
	);
};

export default BusinessDashboard;
