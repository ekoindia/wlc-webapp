import { Flex } from "@chakra-ui/react";
import { Endpoints, ProductRoleConfiguration } from "constants";
import { useUser } from "contexts";
import { useApiFetch } from "hooks";
import { useEffect, useMemo, useState } from "react";
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
	const { userData } = useUser();
	const { userDetails } = userData;
	const { role_list } = userDetails;

	const [businessDashboardData, setBusinessDashboardData] = useState();
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
		},
		success_rate: {
			datefrom: "",
			dateto: "",
		},
		gtv_top_merchants: {
			datefrom: "",
			dateto: "",
		},
	});

	const [filterState, setFilterState] = useState({
		earning_overview: "81", // Index of the current tab in EarningOverview
		gtv_top_merchants: "81", // Index of the current tab in TopMerchants
	});

	const productFilterList = useMemo(() => {
		const productListWithRoleList =
			ProductRoleConfiguration?.products ?? [];

		if (!role_list || productListWithRoleList.length === 0) {
			return [];
		}

		// Filter products whose roles intersect with role_list
		const filteredProducts = productListWithRoleList.filter((product) =>
			product.roles.some((role) => role_list.includes(role))
		);

		// Remove products where tx_typeid is missing or null
		return filteredProducts
			.filter((product) => product.tx_typeid !== undefined)
			.map((product) => ({
				label: product.label,
				value: product.tx_typeid,
			}));
	}, [role_list]);

	// console.log("[BusinessDashboard] role_list", role_list);
	// console.log("[BusinessDashboard] productFilterList", productFilterList);
	// console.log("[BusinessDashboard] filterState", filterState);
	// console.log("[BusinessDashboard] requestPayload", requestPayload);

	useEffect(() => {
		let currentDate = new Date();
		let previousDate = new Date(
			currentDate.getTime() - dateRange * 24 * 60 * 60 * 1000
		);
		setCurrDate(currentDate.toISOString());
		setPrevDate(previousDate.toISOString());

		const earningOverviewTypeid = filterState?.earning_overview;
		const topMerchantsTypeid = filterState?.gtv_top_merchants;

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

	// MARK: Fetching Business Dashboard Data
	const [fetchBusinessDashboardData] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			body: {
				interaction_type_id: 682,
				requestPayload: requestPayload,
			},
			onSuccess: (res) => {
				const _data = res?.data?.dashboard_details[0] || [];
				setBusinessDashboardData(_data);
			},
		}
	);

	useEffect(() => {
		if (prevDate && currDate) {
			fetchBusinessDashboardData();
		}
	}, [currDate, prevDate, requestPayload]);

	const { topPanel, earningOverview, topMerchants, successRate } =
		businessDashboardData || {};

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
	const handleFilterChange = (section, typeid) => {
		setFilterState((prev) => ({
			...prev,
			[section]: typeid,
		}));

		setRequestPayload((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				typeid: typeid, // Update the typeid dynamically
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
						currTab={filterState.earning_overview}
						productFilterList={productFilterList}
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
				currTab={filterState.gtv_top_merchants}
				productFilterList={productFilterList}
				onFilterChange={(index) =>
					handleFilterChange("gtv_top_merchants", index)
				}
			/>
		</Flex>
	);
};

export default BusinessDashboard;
