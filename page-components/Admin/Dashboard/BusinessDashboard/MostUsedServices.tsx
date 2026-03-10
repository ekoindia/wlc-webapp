import { Divider, Flex, Skeleton, Text } from "@chakra-ui/react";
import { DragHandle } from "components/DraggableGrid";
import { Endpoints } from "constants/EndPoints";
import { useApiFetch } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { LuTrendingUp } from "react-icons/lu";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

/** Chart colors - matching project color scheme */
const CHART_COLORS = [
	"#7eb0d5",
	"#bd7ebe",
	"#b2e061",
	"#ffb55a",
	"#ffee65",
	"#beb9db",
	"#fdcce5",
	"#8bd3c7",
	"#fd7f6f",
	"#e27c7c",
] as const;

/** Product filter item from the product filter list */
interface ProductFilterItem {
	label: string;
	value: string;
}

/** Props for the MostUsedServices component */
interface MostUsedServicesProps {
	/** Start date for filtering data (YYYY-MM-DD format) */
	dateFrom: string;
	/** End date for filtering data (YYYY-MM-DD format) */
	dateTo: string;
	/** List of product filters with label and value (tx_typeid) */
	productFilterList: ProductFilterItem[];
	/** Optional product filter (typeid) */
	productFilter?: string;
	/** Whether dragging is enabled (passed from DraggableGrid) */
	isDraggable?: boolean;
}

/** Service data item for chart display */
interface ServiceDisplayItem {
	typeId: string;
	name: string;
	totalCount: number;
	totalRevenue?: number; // Optional, in case revenue data is added later
}

/** API response data structure for most used services */
interface MostUsedServicesData {
	[typeId: string]: {
		totalCount: number;
		totalRevenue?: number;
	};
}

/** Props for the CustomTooltip component */
interface CustomTooltipProps {
	/** Whether the tooltip is active/visible */
	active?: boolean;
	/** Payload data from the chart */
	payload?: Array<{
		payload: ServiceDisplayItem;
	}>;
	/** Label for the tooltip (unused but required by recharts) */
	label?: string;
}

/**
 * Custom tooltip component for the chart.
 * Displays service name and transaction count on hover.
 * @param {CustomTooltipProps} props - The component props
 * @returns {JSX.Element | null} The tooltip element or null if inactive
 * @example
 * <Tooltip content={<CustomTooltip />} />
 */
const CustomTooltip = ({
	active,
	payload,
	label: _label,
}: CustomTooltipProps): JSX.Element | null => {
	if (active && payload && payload.length) {
		const { totalCount, name, totalRevenue } = payload[0].payload;

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
				<Text fontSize="sm" fontWeight="600" color="#333">
					{name}
				</Text>
				<Text fontSize="xs" color="gray.600">
					Transactions:{" "}
					<Text as="span" fontWeight="600" color="primary.DEFAULT">
						{totalCount?.toLocaleString()}
					</Text>
				</Text>
				<Text fontSize="xs" color="gray.600">
					Revenue/Charges (₹):{" "}
					<Text as="span" fontWeight="600" color="primary.DEFAULT">
						{totalRevenue?.toLocaleString()}
					</Text>
				</Text>
			</Flex>
		);
	}
	return null;
};

/**
 * MostUsedServices component displays the most used services based on transaction count.
 * Fetches data from the API and renders a horizontal bar chart.
 * @param {MostUsedServicesProps} props - Properties passed to the component
 * @returns {JSX.Element} The rendered component
 * @example
 * <MostUsedServices
 *   dateFrom="2023-01-01"
 *   dateTo="2023-01-31"
 *   productFilterList={[{ label: "Product 1", value: "81" }]}
 * />
 */
const MostUsedServices = ({
	dateFrom,
	dateTo,
	productFilterList,
	productFilter,
	isDraggable,
}: MostUsedServicesProps): JSX.Element => {
	const [mostUsedServicesData, setMostUsedServicesData] =
		useState<MostUsedServicesData>({});

	// MARK: API Handler
	const [fetchMostUsedServices, isLoading] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			onSuccess: (res: {
				data?: {
					dashboard_object?: {
						mostUsedServices?: MostUsedServicesData;
					};
				};
			}) => {
				const _data =
					res?.data?.dashboard_object?.mostUsedServices ?? {};
				setMostUsedServicesData(_data);
			},
		}
	);

	// MARK: Fetch Data
	useEffect(() => {
		if (!dateFrom || !dateTo) return;

		const _typeid = productFilter ? { typeid: productFilter } : {};

		fetchMostUsedServices({
			body: {
				interaction_type_id: 682,
				requestPayload: {
					most_used_services: {
						datefrom: dateFrom,
						dateto: dateTo,
						..._typeid,
					},
				},
			},
		});
	}, [dateFrom, dateTo, productFilter]);

	// Transform API data to display format with labels from productFilterList
	const servicesDisplayData = useMemo((): ServiceDisplayItem[] => {
		if (
			!mostUsedServicesData ||
			Object.keys(mostUsedServicesData).length === 0
		) {
			return [];
		}

		// Create a lookup map for labels by tx_typeid
		const labelMap: Record<string, string> = {};
		productFilterList.forEach((product) => {
			if (product.value) {
				labelMap[product.value] = product.label;
			}
		});

		// Transform the data and sort by count descending
		return Object.entries(mostUsedServicesData)
			.map(([typeId, data]) => ({
				typeId,
				name: labelMap[typeId] ?? `Service ${typeId}`,
				totalCount: data.totalCount ?? 0,
				totalRevenue: data.totalRevenue ?? 0,
			}))
			.sort((a, b) => b.totalCount - a.totalCount);
	}, [mostUsedServicesData, productFilterList]);

	// Calculate max value for chart domain
	const maxCount = useMemo((): number => {
		if (servicesDisplayData.length === 0) return 0;
		return Math.max(...servicesDisplayData.map((s) => s.totalCount));
	}, [servicesDisplayData]);

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
			h="100%"
		>
			<DragHandle isDraggable={isDraggable}>
				<Flex
					fontSize="lg"
					fontWeight="semibold"
					align="center"
					gap="0.4em"
				>
					<LuTrendingUp color="#5dd859ff" />
					Most Used Services
				</Flex>
			</DragHandle>

			<Divider />

			{isLoading ? (
				<Flex direction="column" gap="4">
					{[1, 2, 3, 4, 5].map((i) => (
						<Skeleton key={i} height="40px" borderRadius="4" />
					))}
				</Flex>
			) : servicesDisplayData.length === 0 ? (
				<Flex justify="center" align="center" py="4">
					<Text color="gray.500" fontSize="sm">
						No service data available
					</Text>
				</Flex>
			) : (
				<ResponsiveContainer
					width="100%"
					height={Math.max(
						150,
						Math.min(400, servicesDisplayData.length * 50 + 20)
					)}
				>
					<BarChart
						accessibilityLayer={false}
						layout="vertical"
						data={servicesDisplayData}
						barCategoryGap="25%"
						margin={{
							top: 5,
							right: 60,
							left: 10,
							bottom: 5,
						}}
					>
						<CartesianGrid
							stroke="#E9EDF1"
							horizontal={true}
							vertical={false}
						/>
						<XAxis
							type="number"
							domain={[0, Math.ceil(maxCount * 1.1)]}
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
						<YAxis
							dataKey="name"
							type="category"
							width={70}
							fontSize="0.65em"
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#4A5568" }}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Bar
							dataKey="totalCount"
							name="Transactions"
							barSize={20}
							radius={[0, 4, 4, 0]}
							label={{
								position: "right",
								formatter: (v: number) => v.toLocaleString(),
								fill: "#222",
								fontWeight: 600,
								fontSize: 11,
							}}
						>
							{servicesDisplayData.map((entry, index) => (
								<Cell
									key={`cell-${entry.typeId}`}
									fill={
										CHART_COLORS[
											index % CHART_COLORS.length
										]
									}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			)}
		</Flex>
	);
};

export default MostUsedServices;
