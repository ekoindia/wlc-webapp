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

	const [dateRange, setDateRange] = useState(7);
	const [prevDate, setPrevDate] = useState("");
	const [currDate, setCurrDate] = useState("");
	const [requestPayload, setRequestPayload] = useState({});
	const [businessOverviewData, setBusinessOverviewData] = useState();
	const [activeAgentsData, setActiveAgentsData] = useState();

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

	// MARK: Fetching Business Overview Data
	const [fetchBusinessDashboardData] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			body: {
				interaction_type_id: 682,
				requestPayload: requestPayload,
			},
			onSuccess: (res) => {
				const _data =
					res?.data?.dashboard_object?.business_overview || [];
				setBusinessOverviewData(_data);
			},
		}
	);

	// MARK: Fetching Active Agents Data
	const [fetchActiveAgentsData] = useApiFetch(Endpoints.TRANSACTION_JSON, {
		body: {
			interaction_type_id: 818,
		},
		onSuccess: (res) => {
			const _data = res?.data?.dashboard_object?.totalActiveData || [];
			setActiveAgentsData(_data);
		},
	});

	useEffect(() => {
		fetchActiveAgentsData();
	}, []);

	useEffect(() => {
		let currentDate = new Date();
		let previousDate = new Date(
			currentDate.getTime() - dateRange * 24 * 60 * 60 * 1000
		);
		setCurrDate(currentDate.toISOString().slice(0, 10));
		setPrevDate(previousDate.toISOString().slice(0, 10));

		setRequestPayload({
			business_overview: {
				// datefrom: previousDate.toISOString().slice(0, 10),
				// dateto: currentDate.toISOString().slice(0, 10),
			},
		});
	}, [dateRange]);

	useEffect(() => {
		if (prevDate && currDate) {
			fetchBusinessDashboardData();
		}
	}, [currDate, prevDate, requestPayload]);

	const topPanelList = [
		{
			key: "activeRetailers",
			label: "Active Retailers",
			value: activeAgentsData?.activeRetailers?.activeRetailers,
			type: "number",
			variation: activeAgentsData?.activeRetailers?.increaseOrDecrease,
			icon: "people",
		},
		{
			key: "activeDistributors",
			label: "Active Distributors",
			value: activeAgentsData?.activeDistributors?.activeDistributors,
			type: "number",
			variation: activeAgentsData?.activeDistributors?.increaseOrDecrease,
			icon: "refer",
		},
		{
			key: "grossTransactionValue",
			label: "GTV",
			value: businessOverviewData?.grossTransactionValue
				?.grossTransactionValue,
			type: "amount",
			variation:
				businessOverviewData?.grossTransactionValue?.increaseOrDecrease,
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
					<EarningOverview
						dateFrom={prevDate}
						dateTo={currDate}
						productFilterList={productFilterList}
					/>
				</Flex>
				<Flex flex="1">
					<SuccessRate dateFrom={prevDate} dateTo={currDate} />
				</Flex>
			</Flex>
			<TopMerchants
				dateFrom={prevDate}
				dateTo={currDate}
				productFilterList={productFilterList}
			/>
		</Flex>
	);
};

export default BusinessDashboard;
