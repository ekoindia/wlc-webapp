import { Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { Currency } from "components";
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

const chartColors = {
	gtv: "#e27c7c",
	count: "#beb9db",
	gtvCumulative: "#00bfa090", // "#6d4b4b80",
	gtvCumulativeArea: "#00bfa030",
};

/**
 * Top Merchants Chart
 * @param {object} props - Component props
 * @param {Array} props.agentList - Processed merchant data where each element contains the following:
 * - name
 * - gtvPercent
 * - countPercent
 * - gtvCumulative
 * - gtvCumulativePercent
 * @returns
 */
const TopMerchantsChart = ({ agentList }) => {
	const isSmallScreen = useBreakpointValue({ base: true, md: false });

	const hasNonZero = agentList.some((d) => d.gtvPercent > 0);

	if (agentList?.length > 0 && hasNonZero) {
		return (
			<ResponsiveContainer
				width="100%"
				height={Math.max(60, Math.min(800, agentList.length * 60 + 20))}
			>
				<ComposedChart
					accessibilityLayer={false}
					// syncMethod="index"
					layout="vertical"
					data={agentList}
					barGap={0}
					barCategoryGap="10px"
					margin={{
						top: 10,
						right: 10,
						bottom: 10,
						left: 10,
					}}
				>
					<CartesianGrid stroke="#E9EDF1" />
					<XAxis
						type="number"
						domain={[0, 100]}
						unit="%"
						fontSize="0.65em"
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						name="Top Agents"
						dataKey="name"
						type="category"
						scale="auto"
						// width="auto"
						fontSize="0.65em"
						axisLine={true}
						tickLine={false}
					/>

					<Area
						name="Cumulative GTV"
						unit="%"
						type="monotone"
						dataKey="gtvCumulativePercent"
						stroke={chartColors.gtvCumulative}
						fill={chartColors.gtvCumulativeArea}
						legendType="plainline"
						// dot={true}
					/>
					<Bar
						name="GTV"
						dataKey="gtvPercent"
						barSize={16}
						fill={chartColors.gtv}
						unit="%"
						label={{
							position: "right",
							formatter: (v) => `${v}%`,
							fill: "#222",
							fontWeight: 600,
							fontSize: 10,
						}}
					/>
					<Bar
						name="Transactions"
						dataKey="countPercent"
						barSize={16}
						fill={chartColors.count}
						unit="%"
						label={{
							position: "right",
							formatter: (v) => `${v}%`,
							fill: "#222",
							fontWeight: 600,
							fontSize: 10,
						}}
					/>
					<Legend
						layout={isSmallScreen ? "horizontal" : "vertical"}
						align={isSmallScreen ? "center" : "right"}
						verticalAlign={isSmallScreen ? undefined : "middle"}
						wrapperStyle={{
							paddingLeft: isSmallScreen ? 0 : 20,
							paddingBottom: isSmallScreen ? 10 : 0,
							fontSize: "0.7em",
							fontWight: 600,
							filter: "brightness(85%)",
						}}
						iconSize={10}
					/>
					<Tooltip
						content={<CustomTooltip />}
						wrapperStyle={{
							fontSize: "0.6em",
						}}
					/>
				</ComposedChart>
			</ResponsiveContainer>
		);
	}
	if (agentList?.length > 0 && !hasNonZero) {
		return (
			<Text color="gray.400" fontSize="sm" align="center" py={8}>
				No data available for this period.
			</Text>
		);
	}
	return null;
};

/**
 * Custom tooltip component for the chart. Shows the total GTV and transaction count in numbers instead of the percentage.
 */

const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		const {
			gtv,
			totalTransactions: count,
			gtvCumulativePercent,
			// status,
		} = payload[0].payload;

		return (
			<Flex
				direction="column"
				bg="white"
				p="5px"
				border="1px solid #ccc"
				fontWeight="600"
			>
				<Text
					fontSize="1.2em"
					fontWeight="600"
					color="#333"
					borderBottom="1px solid #999"
					marginBottom="5px"
				>
					{label}
				</Text>
				<Text color={chartColors.gtv}>
					Total GTV: <Currency amount={gtv} showSymbol={true} />
				</Text>
				<Text
					color={chartColors.count}
					filter="brightness(85%)"
				>{`Total Transactions: ${count}`}</Text>
				<Text
					color={chartColors.gtvCumulative}
					filter="brightness(75%)"
				>{`Cumulative GTV: ${gtvCumulativePercent}%`}</Text>
				<Text opacity="0.6">
					Average Ticket:{" "}
					<Currency
						amount={gtv && count ? (gtv / count).toFixed(0) : 0}
						showSymbol={true}
					/>
				</Text>
			</Flex>
		);
	}
	return null;
};

export default TopMerchantsChart;
