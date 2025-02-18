import { Flex, Grid } from "@chakra-ui/react";
import { Endpoints, ProductRoleConfiguration, UserTypeLabel } from "constants";
import { useUser } from "contexts";
import { useApiFetch, useDailyCacheState } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { EarningOverview, SuccessRate, TopMerchants } from ".";
import { DashboardDateFilter, getDateRange, TopPanel } from "..";

const UserTypeIcon = {
	1: "refer", // Distributor
	2: "people", // Retailer
	3: "person", // I-Merchant
	4: "directions-walk", // FOS / CCE / Cash Executive / EkoStar?
};

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
	const [activeAgents, setActiveAgents, isValid] = useDailyCacheState(
		"active-agents",
		[]
	);
	const { prevDate, currDate } = useMemo(
		() => getDateRange(dateRange),
		[dateRange]
	);

	const productFilterList = useMemo(() => {
		const productListWithRoleList =
			ProductRoleConfiguration?.products ?? [];

		const allOption = { label: "All", value: "" };

		if (!role_list || productListWithRoleList.length === 0) {
			return [allOption];
		}

		// Filter products whose roles intersect with role_list
		const filteredProducts = productListWithRoleList
			.filter((product) =>
				product.roles.some((role) => role_list.includes(role))
			)
			.filter((product) => product.tx_typeid !== undefined) // Ensure tx_typeid is present
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

	return (
		<Flex direction="column" gap="4" p={{ base: "20px", md: "20px 0px" }}>
			<TopPanel panelDataList={[...activeAgents]} />

			<DashboardDateFilter
				{...{ prevDate, currDate, dateRange, setDateRange }}
			/>

			<Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap="4">
				<EarningOverview
					dateFrom={prevDate}
					dateTo={currDate}
					productFilterList={productFilterList}
				/>

				<SuccessRate dateFrom={prevDate} dateTo={currDate} />
			</Grid>
			<TopMerchants
				dateFrom={prevDate}
				dateTo={currDate}
				productFilterList={productFilterList}
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

	return Object.entries(apiData)
		.map(([key, data]) => {
			const userType = UserTypeLabel[key]; // Get label from mapping
			const userTypeIcon = UserTypeIcon[key];
			if (!userType) return null; // Ignore unknown user types

			return {
				key: `active${userType.replace(/\s+/g, "")}`, // Convert to camelCase
				label: `Active ${userType}(s)`,
				value: parseInt(data.activecount, 10), // Ensure numeric value
				type: "number",
				// variation: `${(data.activecount / data.totalcount) * 100}`,
				info: `of ${data.totalcount} Total`,
				icon: userTypeIcon ?? "person",
			};
		})
		.filter(Boolean); // Remove null values
};
