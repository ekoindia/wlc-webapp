import { Flex, Grid } from "@chakra-ui/react";
import { Endpoints, ProductRoleConfiguration, UserTypeLabel } from "constants";
import { useUser } from "contexts";
import { useApiFetch } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { EarningOverview, SuccessRate, TopMerchants } from ".";
import { DashboardDateFilter, getDateRange, TopPanel } from "..";

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
	const [activeAgents, setActiveAgents] = useState([]);
	const [dateRange, setDateRange] = useState("today");
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
			if (!userType) return null; // Ignore unknown user types

			return {
				key: `active${userType.replace(/\s+/g, "")}`, // Convert to camelCase
				label: `Active ${userType}`,
				value: parseInt(data.activecount, 10), // Ensure numeric value
				type: "number",
				// variation: `${(data.activecount / data.totalcount) * 100}`,
				info: `of ${data.totalcount} Total ${userType}`,
				icon: "people", // Default icon, can be customized per user type
			};
		})
		.filter(Boolean); // Remove null values
};
