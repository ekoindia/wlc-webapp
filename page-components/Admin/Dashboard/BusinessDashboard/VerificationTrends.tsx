import { Divider, Flex, Skeleton, Text } from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import { useApiFetch } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { LuTrendingUp } from "react-icons/lu";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

/** Chart color scheme matching project colors */
const CHART_COLORS = {
	primary: "#3c83f6",
	primaryLight: "#3c83f620",
	stroke: "#7eb0d5",
	grid: "#E9EDF1",
} as const;

/** Props for the VerificationTrends component */
interface VerificationTrendsProps {
	/** Start date for filtering data (YYYY-MM-DD HH:mm:ss format) */
	dateFrom: string;
	/** End date for filtering data (YYYY-MM-DD HH:mm:ss format) */
	dateTo: string;
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
	startDate: string;
	endDate: string;
}

/** Props for the CustomTooltip component */
interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		payload: ChartDataItem;
	}>;
	label?: string;
}

/**
 * Determines if the date range is 24 hours or less (hourly data).
 * @param dateFrom - Start date string
 * @param dateTo - End date string
 * @returns true if the range is 24 hours or less
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
 * @param startDate - The start date string from API
 * @param isHourly - Whether the data is hourly
 * @returns Formatted label for display
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
 * Displays the date/time and verification count on hover.
 * @param root0
 * @param root0.active
 * @param root0.payload
 * @param root0.label
 */
const CustomTooltip = ({
	active,
	payload,
	label: _label,
}: CustomTooltipProps): JSX.Element | null => {
	if (active && payload && payload.length) {
		const { totalCount, startDate, endDate } = payload[0].payload;

		// Determine if it's hourly based on the date format
		const isHourly = startDate.includes(" ");

		const formattedDate = isHourly
			? `${new Date(startDate).toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				})} - ${new Date(endDate).toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				})}`
			: new Date(startDate).toLocaleDateString("en-US", {
					weekday: "short",
					month: "short",
					day: "numeric",
				});

		return (
			<Flex
				direction="column"
				bg="white"
				p="10px 14px"
				borderRadius="8"
				boxShadow="md"
				border="1px solid #E2E8F0"
				gap="1"
			>
				<Text fontSize="xs" color="gray.600">
					{formattedDate}
				</Text>
				<Text fontSize="sm" fontWeight="600" color="primary.DEFAULT">
					{totalCount.toLocaleString()} Verifications
				</Text>
			</Flex>
		);
	}
	return null;
};

/**
 * VerificationTrends component displays verification trends over time.
 * Shows hourly data when the date range is 24 hours or less,
 * and daily data when the range is more than 24 hours.
 * @param {VerificationTrendsProps} props - Properties passed to the component
 * @returns {JSX.Element} The rendered component
 * @example
 * <VerificationTrends
 *   dateFrom="2025-12-24 00:00:00"
 *   dateTo="2025-12-24 23:59:59"
 * />
 */
const VerificationTrends = ({
	dateFrom,
	dateTo,
}: VerificationTrendsProps): JSX.Element => {
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

		return trendsData.map((item) => ({
			label: formatLabel(item.startDate, isHourly),
			totalCount: item.totalCount,
			startDate: item.startDate,
			endDate: item.endDate,
		}));
	}, [trendsData, isHourly]);

	// Calculate max value for chart domain
	const maxCount = useMemo((): number => {
		if (chartData.length === 0) return 0;
		return Math.max(...chartData.map((d) => d.totalCount));
	}, [chartData]);

	// MARK: jsx
	return (
		<Flex
			direction="column"
			bg="white"
			p="20px 20px 30px"
			borderRadius="10"
			border="basic"
			gap="4"
			w="100%"
		>
			<Flex
				fontSize="lg"
				fontWeight="semibold"
				align="center"
				gap="0.4em"
			>
				<LuTrendingUp color="#3c83f6" />
				Verification Trends
			</Flex>

			<Divider />

			{isLoading ? (
				<Flex direction="column" gap="4">
					<Skeleton height="200px" borderRadius="4" />
				</Flex>
			) : chartData.length === 0 ? (
				<Flex justify="center" align="center" py="8">
					<Text color="gray.500" fontSize="sm">
						No verification trends data available
					</Text>
				</Flex>
			) : (
				<ResponsiveContainer width="100%" height={250}>
					<AreaChart
						accessibilityLayer={false}
						data={chartData}
						margin={{
							top: 10,
							right: 30,
							left: 0,
							bottom: 0,
						}}
					>
						<defs>
							<linearGradient
								id="colorCount"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor={CHART_COLORS.primary}
									stopOpacity={0.3}
								/>
								<stop
									offset="95%"
									stopColor={CHART_COLORS.primary}
									stopOpacity={0}
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
							fontSize="0.7em"
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#666" }}
						/>
						<YAxis
							domain={[0, Math.ceil(maxCount * 1.1) || 10]}
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
						<Tooltip content={<CustomTooltip />} />
						<Area
							type="monotone"
							dataKey="totalCount"
							stroke={CHART_COLORS.primary}
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorCount)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			)}
		</Flex>
	);
};

export default VerificationTrends;
