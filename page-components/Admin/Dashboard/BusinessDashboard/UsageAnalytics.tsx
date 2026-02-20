import { Divider, Flex, Grid, Skeleton, Text } from "@chakra-ui/react";
import { DragHandle } from "components/DraggableGrid";
import { Endpoints } from "constants/EndPoints";
import { useApiFetch } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { LuChartColumn } from "react-icons/lu";
import {
	Area,
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

/**
 * Chart color scheme for Area + Histogram hybrid.
 */
const CHART_COLORS = {
	bar: "#7eb0d5", // Pastel Blue from MostUsedServices
	barHover: "#5a9bd4", // Slightly darker for hover
	trendStroke: "#bd7ebe", // Pastel Purple from MostUsedServices
	trendFillStart: "#bd7ebe",
	trendFillEnd: "#bd7ebe",
	grid: "#E2E8F0",
} as const;

/** Props for the UsageAnalytics component */
interface UsageAnalyticsProps {
	/** Start date for filtering data (YYYY-MM-DD HH:mm:ss format) */
	dateFrom: string;
	/** End date for filtering data (YYYY-MM-DD HH:mm:ss format) */
	dateTo: string;
	/** Whether dragging is enabled (passed from DraggableGrid) */
	isDraggable?: boolean;
}

/** API response structure for verification trends */
interface VerificationTrendItem {
	startDate: string;
	endDate: string;
	totalCount: number;
}

/** Transformed data for chart display */
interface ChartDataItem {
	label: string;
	totalCount: number;
	cumulativeCount: number;
	startDate: string;
	endDate: string;
}

/** Summary statistics for the trends data */
interface TrendsSummary {
	total: number;
	peak: number;
	peakLabel: string;
	average: number;
}

/** Props for the CustomTooltip component */
interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		name: string;
		value: number;
		color: string;
		dataKey: string;
		fill: string;
		stroke: string;
	}>;
	label?: string;
}

/**
 * Determines if the date range is 24 hours or less (hourly data).
 * @param {string} dateFrom - Start date string
 * @param {string} dateTo - End date string
 * @returns {boolean} true if the range is 24 hours or less
 */
const isHourlyRange = (dateFrom: string, dateTo: string): boolean => {
	const from = new Date(dateFrom);
	const to = new Date(dateTo);
	const diffMs = to.getTime() - from.getTime();
	const diffHours = diffMs / (1000 * 60 * 60);
	return diffHours <= 24;
};

/**
 * Formats the date for display based on whether it's hourly or daily data.
 * @param {string} startDate - The start date string from API
 * @param {boolean} isHourly - Whether the data is hourly
 * @returns {string} Formatted label for display
 */
const formatLabel = (startDate: string, isHourly: boolean): string => {
	const date = new Date(startDate);

	if (isHourly) {
		// Format as "12 PM", "1 AM", etc.
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			hour12: true,
		});
	}

	// Format as "Dec 24", "Jan 1", etc.
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
};

/**
 * Custom tooltip component for the chart.
 * Displays both the daily volume (Bar) and the cumulative trend (Area).
 * @param {CustomTooltipProps} root0 - The tooltip props
 * @param {boolean} root0.active - Whether the tooltip is active
 * @param {Array} root0.payload - The data payload for the tooltip
 * @param {string} root0.label - The label for the tooltip
 * @returns {JSX.Element | null} The rendered tooltip or null
 */
const CustomTooltip = ({
	active,
	payload,
	label,
}: CustomTooltipProps): JSX.Element | null => {
	if (active && payload && payload.length) {
		return (
			<Flex
				direction="column"
				bg="white"
				p="12px 16px"
				borderRadius="8"
				boxShadow="lg"
				border="1px solid #E2E8F0"
				gap="3"
				minW="180px"
			>
				<Text
					fontSize="xs"
					color="gray.500"
					fontWeight="600"
					textTransform="uppercase"
					letterSpacing="0.05em"
				>
					{label}
				</Text>
				<Divider />

				{payload.map((entry, index) => (
					<Flex key={index} justify="space-between" align="center">
						<Flex align="center" gap="2">
							<Flex
								w="8px"
								h="8px"
								borderRadius={
									entry.dataKey === "totalCount"
										? "2px"
										: "full"
								} // Square for bar, round for line
								bg={entry.color || entry.fill || entry.stroke}
							/>
							<Text fontSize="sm" color="gray.600">
								{entry.name}
							</Text>
						</Flex>
						<Text fontSize="sm" fontWeight="700" color="gray.800">
							{entry.value.toLocaleString()}
						</Text>
					</Flex>
				))}
			</Flex>
		);
	}
	return null;
};

/**
 * Summary stat card component.
 * @param {object} root0 - Component props
 * @param {string} root0.label - The label for the stat
 * @param {string | number} root0.value - The value to display
 * @param {string} [root0.color] - The color for the value text
 * @returns {JSX.Element} The rendered stat card
 */
const StatCard = ({
	label,
	value,
	color = "gray.800",
}: {
	label: string;
	value: string | number;
	color?: string;
}): JSX.Element => (
	<Flex
		direction="column"
		pl="3"
		borderLeft="4px solid"
		borderColor={color}
		gap="1"
	>
		<Text
			fontSize="xs"
			color="gray.500"
			fontWeight="600"
			textTransform="uppercase"
			letterSpacing="0.05em"
		>
			{label}
		</Text>
		<Text fontSize="2xl" fontWeight="700" color="gray.700" lineHeight="1">
			{typeof value === "number" ? value.toLocaleString() : value}
		</Text>
	</Flex>
);

/**
 * UsageAnalytics component displays verification trends over time.
 * Uses a "Premium Hybrid" style:
 * - Bars for Volume (Deep Blue)
 * - Area with Gradient for Cumulative Trend (Purple)
 * @param {UsageAnalyticsProps} root0 - Component props
 * @param {string} root0.dateFrom - Start date for the data range
 * @param {string} root0.dateTo - End date for the data range
 * @param {boolean} [root0.isDraggable] - Whether the component is draggable in the grid
 * @returns {JSX.Element} The rendered usage analytics component
 */
const UsageAnalytics = ({
	dateFrom,
	dateTo,
	isDraggable,
}: UsageAnalyticsProps): JSX.Element => {
	const [trendsData, setTrendsData] = useState<VerificationTrendItem[]>([]);

	// Determine if we should show hourly or daily data
	const isHourly = useMemo(
		() => isHourlyRange(dateFrom, dateTo),
		[dateFrom, dateTo]
	);

	// MARK: API Handler
	const [fetchTrendsData, isLoading] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			onSuccess: (res: {
				data?: {
					dashboard_object?: {
						verificationTrends?: VerificationTrendItem[];
					};
				};
			}) => {
				const _data =
					res?.data?.dashboard_object?.verificationTrends ?? [];
				setTrendsData(_data);
			},
		}
	);

	// MARK: Fetch Data
	useEffect(() => {
		if (!dateFrom || !dateTo) return;

		fetchTrendsData({
			body: {
				interaction_type_id: 682,
				requestPayload: {
					verification_trends: {
						datefrom: dateFrom,
						dateto: dateTo,
					},
				},
			},
		});
	}, [dateFrom, dateTo]);

	// Transform API data for chart display
	const chartData = useMemo((): ChartDataItem[] => {
		if (!trendsData || trendsData.length === 0) {
			return [];
		}

		let cumulative = 0;
		return trendsData.map((item) => {
			cumulative += item.totalCount;
			return {
				label: formatLabel(item.startDate, isHourly),
				totalCount: item.totalCount,
				cumulativeCount: cumulative,
				startDate: item.startDate,
				endDate: item.endDate,
			};
		});
	}, [trendsData, isHourly]);

	// Calculate summary statistics
	const summary = useMemo((): TrendsSummary | null => {
		if (chartData.length === 0) return null;

		const total = chartData.reduce((sum, d) => sum + d.totalCount, 0);
		const peakItem = chartData.reduce((max, d) =>
			d.totalCount > max.totalCount ? d : max
		);
		const average = Math.round(total / chartData.length);

		return {
			total,
			peak: peakItem.totalCount,
			peakLabel: peakItem.label,
			average,
		};
	}, [chartData]);

	// Calculate max value for chart domain
	const { maxCount, maxCumulative } = useMemo(() => {
		if (chartData.length === 0) return { maxCount: 0, maxCumulative: 0 };
		return {
			maxCount: Math.max(...chartData.map((d) => d.totalCount)),
			maxCumulative:
				chartData[chartData.length - 1]?.cumulativeCount || 0,
		};
	}, [chartData]);

	// MARK: jsx
	return (
		<Flex
			direction="column"
			bg="white"
			p="20px 20px 30px"
			borderRadius="10"
			border="basic"
			gap="5"
			w="100%"
			h="100%"
		>
			<Flex justify="space-between" align="center" wrap="wrap" gap="4">
				<DragHandle isDraggable={isDraggable}>
					<Flex
						fontSize="lg"
						fontWeight="semibold"
						align="center"
						gap="0.4em"
					>
						<LuChartColumn color="#5ba1d6ff" />
						Usage Analytics
					</Flex>
				</DragHandle>

				{/* Future: Add Product Filter Dropdown here */}
			</Flex>

			<Divider />

			{isLoading ? (
				<Flex direction="column" gap="4">
					<Grid templateColumns="repeat(4, 1fr)" gap="4">
						{[1, 2, 3, 4].map((i) => (
							<Skeleton key={i} height="60px" borderRadius="8" />
						))}
					</Grid>
					<Skeleton height="250px" borderRadius="4" />
				</Flex>
			) : chartData.length === 0 ? (
				<Flex justify="center" align="center" py="8">
					<Text color="gray.500" fontSize="sm">
						No verification trends data available
					</Text>
				</Flex>
			) : (
				<>
					{/* Summary Statistics */}
					{summary && (
						<Grid
							templateColumns={{
								base: "repeat(2, 1fr)",
								lg: "repeat(4, 1fr)",
							}}
							gap="4"
							mb="2"
							justifyItems="center"
						>
							<StatCard
								label="Total Volume"
								value={summary.total}
								color={CHART_COLORS.trendStroke}
							/>
							<StatCard
								label={`Avg / ${isHourly ? "Hour" : "Day"}`}
								value={summary.average}
								color="gray.600"
							/>
							<StatCard
								label="Peak Volume"
								value={summary.peak}
								color="gray.800"
							/>
							<StatCard
								label="Peak Time"
								value={summary.peakLabel}
								color="gray.500"
							/>
						</Grid>
					)}

					{/* Hybrid: Bars + Area with Gradient */}
					<ResponsiveContainer width="100%" height={280}>
						<ComposedChart
							accessibilityLayer={false}
							data={chartData}
							margin={{
								top: 20,
								right: 15, // Increased margin
								left: 0,
								bottom: 5,
							}}
						>
							<defs>
								<linearGradient
									id="colorTrend"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor={CHART_COLORS.trendFillStart}
										stopOpacity={0.3}
									/>
									<stop
										offset="95%"
										stopColor={CHART_COLORS.trendFillEnd}
										stopOpacity={0.05}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid
								stroke={CHART_COLORS.grid}
								strokeDasharray="3 3"
								vertical={false}
							/>
							<XAxis
								dataKey="label"
								padding={{ left: 20, right: 20 }} // Prevent first/last clipping
								fontSize="0.7em"
								axisLine={false}
								tickLine={false}
								tick={{ fill: "#666" }}
								dy={10}
							/>
							<YAxis
								yAxisId="left"
								orientation="left"
								domain={[0, Math.ceil(maxCount * 1.2) || 10]}
								allowDecimals={false}
								fontSize="0.65em"
								axisLine={false}
								tickLine={false}
								tickFormatter={(value: number) =>
									value >= 1000
										? `${(value / 1000).toFixed(1)}k`
										: String(value)
								}
							/>
							{/* Right Axis for Cumulative Trend Line */}
							<YAxis
								yAxisId="right"
								orientation="right"
								domain={[
									0,
									Math.ceil(maxCumulative * 1.1) || 10,
								]}
								allowDecimals={false}
								fontSize="0.65em"
								axisLine={false}
								tickLine={false}
								tick={{ fill: CHART_COLORS.trendStroke }}
								tickFormatter={(value: number) =>
									value >= 1000
										? `${(value / 1000).toFixed(1)}k`
										: String(value)
								}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend
								verticalAlign="top"
								align="right"
								wrapperStyle={{
									paddingBottom: "20px",
									fontSize: "12px",
								}}
								iconType="circle"
							/>

							{/* Gradient Area for Cumulative Trend */}
							<Area
								yAxisId="right"
								type="monotone"
								dataKey="cumulativeCount"
								name="Cumulative Trend"
								stroke={CHART_COLORS.trendStroke}
								fillOpacity={1}
								fill="url(#colorTrend)"
								strokeWidth={3}
								dot={{
									r: 4,
									strokeWidth: 2,
									fill: "#fff",
									stroke: CHART_COLORS.trendStroke,
								}}
								activeDot={{
									r: 6,
									strokeWidth: 0,
									fill: CHART_COLORS.trendStroke,
								}}
							/>

							{/* Histogram Bars (Volume) on top? No, usually bars should be distinct. 
                                Let's put Bars AFTER Area if we want them on top, 
                                but here they have different axes. Order in JSX determines z-index.
                                Bars usually look better in front or strictly separate.
                                Since Area is background-ish, let's put it first (which I did).
                            */}
							<Bar
								yAxisId="left"
								dataKey="totalCount"
								name="Verifications"
								fill={CHART_COLORS.bar}
								barSize={20}
								radius={[4, 4, 0, 0]}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</>
			)}
		</Flex>
	);
};

export default UsageAnalytics;
