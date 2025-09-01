import { Flex, Grid } from "@chakra-ui/react";
import {
	Endpoints,
	ProductRoleConfiguration,
	UserTypeIcon,
	UserTypeLabel,
} from "constants";
import { useUser } from "contexts";
import { useApiFetch, useDailyCacheState } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { EarningOverview, SuccessRate, TopMerchants } from ".";
import { DashboardDateFilter, getDateRange, TopPanel, useDashboard } from "..";

const ACTIVE_AGENTS_CACHE_KEY = "inf-dashboard-active-agents";

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

	const [dateRange, setDateRange] = useState("today");
	const [totalBusiness, setTotalBusiness] = useState({});

	const { cachedTodaysDateTo, setCachedTodaysDateTo } = useDashboard();

	const [activeAgents, setActiveAgents, isValid] = useDailyCacheState(
		ACTIVE_AGENTS_CACHE_KEY,
		[]
	);
	const { prevDate, currDate } = useMemo(
		() => getDateRange(dateRange),
		[dateRange]
	);

	const productFilterList = useMemo(() => {
		const productListWithRoleList =
			ProductRoleConfiguration?.products ?? [];

		const allOption = { label: "All Products", value: "" };

		if (!role_list || productListWithRoleList.length === 0) {
			return [allOption];
		}

		// Filter products whose roles intersect with role_list
		const filteredProducts = productListWithRoleList
			.filter((product) =>
				product.roles.some((role) => role_list.includes(role))
			) // Filter products based on role_list
			.filter((product) => product.tx_typeid !== undefined) // Ensure tx_typeid is present
			.filter((product) => product.isFinancial !== false) // Exclude non-financial products
			.map((product) => ({
				label: product.label,
				value: product.tx_typeid,
			}));

		// Prepend "All" option
		return [allOption, ...filteredProducts];
	}, [role_list, ProductRoleConfiguration]);

	// MARK: Fetching Active Agents Data
	const [fetchActiveAgentsData] = useApiFetch(Endpoints.TRANSACTION_JSON, {
		body: {
			interaction_type_id: 818,
		},
		onSuccess: (res) => {
			const _data = res?.data?.dashboard_object?.totalActiveData || [];
			const activeAgentsList = transformActiveAgentsData(_data) ?? [];
			setActiveAgents(activeAgentsList);
		},
	});

	useEffect(() => {
		if (isValid && activeAgents?.length) return;
		fetchActiveAgentsData();
	}, []);

	useEffect(() => {
		if (dateRange === "today" && !cachedTodaysDateTo) {
			setCachedTodaysDateTo(currDate);
		}
	}, []);

	const _currDate = dateRange === "today" ? cachedTodaysDateTo : currDate;

	return (
		<Flex direction="column" gap="4" p={{ base: "20px", md: "20px 0px" }}>
			<TopPanel panelDataList={[...activeAgents]} />

			<DashboardDateFilter
				dateRange={dateRange}
				prevDate={prevDate}
				currDate={_currDate}
				setDateRange={setDateRange}
			/>

			<Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap="4">
				<EarningOverview
					dateRange={dateRange}
					dateFrom={prevDate}
					dateTo={_currDate}
					productFilterList={productFilterList}
					setTotalBusiness={setTotalBusiness}
				/>

				<SuccessRate dateFrom={prevDate} dateTo={currDate} />
			</Grid>
			<TopMerchants
				dateRange={dateRange}
				dateFrom={prevDate}
				dateTo={_currDate}
				productFilterList={productFilterList}
				totalBusiness={totalBusiness}
			/>
		</Flex>
	);
};

export default BusinessDashboard;

/**
 * Transforms API response into a format compatible with the component.
 * @param {object} apiData - The raw data from the API response.
 * @returns {Array} A formatted array of objects for rendering.
 */
const transformActiveAgentsData = (apiData) => {
	if (!apiData || typeof apiData !== "object") return [];

	const agentsData = Object.entries(apiData)
		.map(([key, data]) => {
			const userType = UserTypeLabel[key]; // Get label from mapping
			const userTypeIcon = UserTypeIcon[key];
			if (!userType) return null; // Ignore unknown user types
			if (!data) return null; // Ignore if no data is present

			const activeCount = parseInt(data.activecount, 10);
			const totalCount = parseInt(data.totalcount, 10);

			if (!activeCount) return null;

			return {
				key: `active${userType.replace(/\s+/g, "")}`, // Convert to camelCase
				label: `Active ${userType}(s)`,
				value: activeCount, // Ensure numeric value
				type: "number",
				// variation: `${(data.activecount / data.totalcount) * 100}`,
				total: totalCount,
				info: `of ${totalCount} Total`,
				icon: userTypeIcon ?? "person",
			};
		})
		.filter(Boolean); // Remove null values

	// If only one data point, don't calculate total...
	if (agentsData?.length <= 1) {
		return agentsData;
	}

	// Calculate total active & total overall agents...
	const totalAgents = agentsData.reduce(
		(sum, agent) => {
			sum.active += agent.value;
			sum.total += agent.total;
			return sum;
		},
		{ active: 0, total: 0 }
	);

	return [
		{
			key: `activeOverall`,
			label: `Total Active Users`,
			value: totalAgents.active,
			type: "number",
			// variation: `${(data.activecount / data.totalcount) * 100}`,
			info: `of ${totalAgents.total} Total`,
			total: totalAgents.total,
			icon: "",
		},
		...agentsData,
	];
};
