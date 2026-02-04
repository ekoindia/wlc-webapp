import { Flex } from "@chakra-ui/react";
import {
	DraggableGrid,
	GridLayouts,
	useDraggableGrid,
} from "components/DraggableGrid";
// @ts-ignore - constants module is JS without type declarations
import { Endpoints, UserTypeIcon } from "constants";
import { useApiFetch, useDailyCacheState, useUserTypes } from "hooks";
import { useEffect, useMemo, useState } from "react";
import {
	EarningOverview,
	MostUsedServices,
	SuccessRate,
	TopMerchants,
	UsageAnalytics,
} from ".";
import { DashboardDateFilter, getDateRange, TopPanel, useDashboard } from "..";

const ACTIVE_AGENTS_CACHE_KEY = "inf-dashboard-active-agents";

/** Storage key for dashboard grid layout persistence */
const LAYOUT_STORAGE_KEY = "inf-dashboard-grid-layout";

/** Default layout configuration for Business Dashboard widgets */
const DEFAULT_LAYOUTS: GridLayouts = {
	lg: [
		{ i: "earning", x: 0, y: 0, w: 8, h: 4, minW: 4, minH: 3 },
		{ i: "success", x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
		{ i: "services", x: 0, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
		{ i: "analytics", x: 4, y: 4, w: 8, h: 4, minW: 4, minH: 3 },
		{ i: "merchants", x: 0, y: 8, w: 12, h: 5, minW: 6, minH: 4 },
	],
	md: [
		{ i: "earning", x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
		{ i: "success", x: 6, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
		{ i: "services", x: 0, y: 4, w: 6, h: 4, minW: 3, minH: 3 },
		{ i: "analytics", x: 6, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
		{ i: "merchants", x: 0, y: 8, w: 12, h: 5, minW: 6, minH: 4 },
	],
	sm: [
		{ i: "earning", x: 0, y: 0, w: 12, h: 4, minW: 12, minH: 3 },
		{ i: "success", x: 0, y: 4, w: 12, h: 4, minW: 12, minH: 3 },
		{ i: "services", x: 0, y: 8, w: 12, h: 4, minW: 12, minH: 3 },
		{ i: "analytics", x: 0, y: 12, w: 12, h: 4, minW: 12, minH: 3 },
		{ i: "merchants", x: 0, y: 16, w: 12, h: 5, minW: 12, minH: 4 },
	],
};

/** Active agent data from API */
interface ActiveAgentData {
	activecount: string;
	totalcount: string;
}

/** Transformed active agent for display */
interface ActiveAgent {
	key: string;
	label: string;
	value: number;
	type: string;
	total: number;
	info: string;
	icon: string;
}

/** Product filter option */
interface ProductFilterOption {
	label: string;
	value: string;
}

/**
 * Resets the dashboard layout to default configuration
 */
export const resetDashboardLayout = (): void => {
	localStorage.removeItem(LAYOUT_STORAGE_KEY);
	window.location.reload();
};

/**
 * Matches items from a master filter list against the keys present in an API breakdown.
 * @param {Array} masterList - The prop productFilterList [{label, value}]
 * @param {object} typeBreakdown - The parsed object from the API
 * @returns {Array} - Filtered and mapped options
 */

export const matchAndMapFilters = (masterList, typeBreakdown) => {
	if (!typeBreakdown || !masterList) return [];

	// Get the IDs (keys) available in the current API response
	const availableIds = Object.keys(typeBreakdown);

	// Filter the master list to only include what's in the breakdown
	return masterList.filter((item) =>
		availableIds.includes(String(item.value))
	);
};

/**
 * Business Dashboard component displaying analytics widgets in a draggable grid
 * @returns {JSX.Element} The rendered business dashboard
 */
const BusinessDashboard = (): JSX.Element => {
	const [dateRange, setDateRange] = useState("today");
	const [totalBusiness, setTotalBusiness] = useState({});

	const { cachedTodaysDateTo, setCachedTodaysDateTo } = useDashboard() as any;

	const [activeAgents, setActiveAgents, isValid] = (
		useDailyCacheState as any
	)(ACTIVE_AGENTS_CACHE_KEY, []) as [
		ActiveAgent[],
		(_agents: ActiveAgent[]) => void,
		boolean,
	];

	const { prevDate, currDate } = useMemo(
		() => getDateRange(dateRange) as { prevDate: string; currDate: string },
		[dateRange]
	);

	const { getUserTypeLabel } = useUserTypes() as {
		getUserTypeLabel: (_key: string) => string | null;
	};

	// State for product filter list from API
	const [productFilterList, setProductFilterList] = useState<
		ProductFilterOption[]
	>([{ label: "All Products", value: "" }]);

	// Use the shared draggable grid hook
	const {
		layouts,
		handleLayoutChange,
		handleDragStop,
		containerRef,
		width,
		mounted,
	} = useDraggableGrid({
		storageKey: LAYOUT_STORAGE_KEY,
		defaultLayouts: DEFAULT_LAYOUTS,
	});

	// MARK: Fetching Product Filter List from API
	const [fetchProductFilterList] = useApiFetch(Endpoints.TRANSACTION, {
		body: {
			interaction_type_id: 1044,
		},
		onSuccess: (res: any) => {
			const allOption = { label: "All Products", value: "" };
			const products = res?.param_attributes?.list_elements ?? [];
			const formattedProducts = products.map((product: any) => ({
				label: product.label,
				value: product.tx_typeid,
			}));

			setProductFilterList([allOption, ...formattedProducts]);
		},
	} as any);

	useEffect(() => {
		fetchProductFilterList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// MARK: Fetching Active Agents Data
	const [fetchActiveAgentsData] = useApiFetch(Endpoints.TRANSACTION_JSON, {
		body: {
			interaction_type_id: 818,
		},
		onSuccess: (res: any) => {
			const _data = res?.data?.dashboard_object?.totalActiveData || {};
			const activeAgentsList =
				transformActiveAgentsData(_data, getUserTypeLabel) ?? [];
			setActiveAgents(activeAgentsList);
		},
	} as any);

	useEffect(() => {
		if (isValid && activeAgents?.length) return;
		fetchActiveAgentsData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (dateRange === "today" && !cachedTodaysDateTo) {
			setCachedTodaysDateTo(currDate);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const _currDate = dateRange === "today" ? cachedTodaysDateTo : currDate;

	/** Widget props passed to each dashboard component */
	const widgetProps = useMemo(
		() => ({
			dateRange,
			dateFrom: prevDate,
			dateTo: _currDate,
			productFilterList,
		}),
		[dateRange, prevDate, _currDate, productFilterList]
	);

	return (
		<Flex direction="column" gap="4" p={{ base: "20px", md: "20px 0px" }}>
			<TopPanel panelDataList={[...activeAgents]} />

			{/* @ts-expect-error - DashboardDateFilter props are loosely typed */}
			<DashboardDateFilter
				dateRange={dateRange}
				prevDate={prevDate}
				currDate={_currDate}
				setDateRange={setDateRange}
			/>

			<DraggableGrid
				layouts={layouts}
				width={width}
				containerRef={containerRef}
				mounted={mounted}
				onLayoutChange={handleLayoutChange}
				onDragStop={handleDragStop}
			>
				{/* Widget components receive isDraggable via cloneElement from DraggableGrid */}
				{{
					earning: (
						// @ts-ignore - isDraggable injected by DraggableGrid via cloneElement
						<EarningOverview
							{...widgetProps}
							setTotalBusiness={setTotalBusiness}
						/>
					),
					success: (
						// @ts-ignore - isDraggable injected by DraggableGrid via cloneElement
						<SuccessRate dateFrom={prevDate} dateTo={currDate} />
					),
					// @ts-ignore - isDraggable injected by DraggableGrid via cloneElement
					services: <MostUsedServices {...widgetProps} />,
					analytics: (
						<UsageAnalytics
							dateFrom={prevDate}
							dateTo={_currDate}
						/>
					),
					merchants: (
						// @ts-ignore - isDraggable injected by DraggableGrid via cloneElement
						<TopMerchants
							{...widgetProps}
							totalBusiness={totalBusiness}
						/>
					),
				}}
			</DraggableGrid>
		</Flex>
	);
};

export default BusinessDashboard;

/**
 * Transforms API response into a format compatible with the component.
 * @param {Record<string, ActiveAgentData>} apiData - The raw data from the API response.
 * @param {Function} getUserTypeLabel - Function to get user type label by ID.
 * @returns {ActiveAgent[]} A formatted array of objects for rendering.
 */
const transformActiveAgentsData = (
	apiData: Record<string, ActiveAgentData>,
	getUserTypeLabel: (_key: string) => string | null
): ActiveAgent[] => {
	if (!apiData || typeof apiData !== "object") return [];

	const agentsData = Object.entries(apiData)
		.map(([key, data]) => {
			const userType = getUserTypeLabel(key);
			const userTypeIcon = (UserTypeIcon as Record<string, string>)[key];
			if (!userType) return null;
			if (!data) return null;

			const activeCount = parseInt(data.activecount, 10);
			const totalCount = parseInt(data.totalcount, 10);

			if (!activeCount) return null;

			return {
				key: `active${userType.replace(/\s+/g, "")}`,
				label: `Active ${userType}(s)`,
				value: activeCount,
				type: "number",
				total: totalCount,
				info: `of ${totalCount} Total`,
				icon: userTypeIcon ?? "person",
			};
		})
		.filter((agent): agent is ActiveAgent => agent !== null);

	if (agentsData.length <= 1) {
		return agentsData;
	}

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
			info: `of ${totalAgents.total} Total`,
			total: totalAgents.total,
			icon: "",
		},
		...agentsData,
	];
};
