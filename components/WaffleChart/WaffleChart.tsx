import { Box, Flex, Grid, Text, Tooltip } from "@chakra-ui/react";
import { useMemo } from "react";
import { str2Hue } from "utils";

interface WaffleChartData {
	value: number;
	label: string;
}

interface WaffleChartProps {
	data: WaffleChartData[];
	rows?: number;
	cols?: number;
	colors?: string[];
	size?: string;
	gap?: string;
	animationDuration?: string;
	animationDelay?: string;
}

/**
 * WaffleChart component renders a waffle-style visualization with colored squares. It is useful for displaying categorical data in a compact and visually appealing way.
 * Animation features diagonal staggered entrance from top-left to bottom-right.
 * Animation customization examples:
 * - Fast animations: animationDelay="0.01s"
 * - Slow, dramatic effect: animationDuration="1.2s", animationDelay="0.08s"
 * - No stagger: animationDelay="0s"
 * @param {WaffleChartData[]} data - Array of objects containing value (number) and label (string)
 * @param {number} [rows] - Number of rows for the chart
 * @param {number} [cols] - Number of columns for the chart
 * @param {string[]} [colors] - Optional array of color codes for each value. If not provided, uses useHslColor hook
 * @param {string} [size] - Size (length & width) of individual squares
 * @param {string} [gap] - Gap between squares (both horizontal and vertical)
 * @param {string} [animationDuration] - Duration of entrance animation for each square
 * @param {string} [animationDelay] - Base delay multiplied by diagonal position (row + col) for staggered effect
 * @returns {JSX.Element} WaffleChart component
 */
const WaffleChart = ({
	data,
	rows = 10,
	cols = 10,
	colors,
	size = "8px",
	gap = "4px",
	animationDuration = "0.6s",
	animationDelay = "0.02s",
}: WaffleChartProps): JSX.Element => {
	// Generate colors for each data item using useHslColor hook
	const dataColors = useMemo(() => {
		return data.map((item, index) => {
			if (colors && colors[index]) {
				return colors[index];
			}
			const hue = str2Hue(item.label);
			return `hsl(${hue}, 90%, 40%)`;
		});
	}, [data, colors]);

	// Calculate the distribution of squares for each data item
	const squareDistribution = useMemo(() => {
		const totalSquares = rows * cols;
		const totalValue = data.reduce((sum, item) => sum + item.value, 0);

		if (totalValue === 0) return [];

		const distribution: { color: string; count: number }[] = [];
		let allocatedSquares = 0;

		data.forEach((item, index) => {
			const percentage = item.value / totalValue;
			let squareCount = Math.round(percentage * totalSquares);

			// Ensure we don't exceed total squares
			if (allocatedSquares + squareCount > totalSquares) {
				squareCount = totalSquares - allocatedSquares;
			}

			if (squareCount > 0) {
				distribution.push({
					color: dataColors[index],
					count: squareCount,
				});
				allocatedSquares += squareCount;
			}
		});

		return distribution;
	}, [data, rows, cols, dataColors]);

	// Generate array of squares with their colors
	const squares = useMemo(() => {
		const result: string[] = [];
		const totalSquares = rows * cols;

		squareDistribution.forEach(({ color, count }) => {
			for (let i = 0; i < count; i++) {
				result.push(color);
			}
		});

		// Fill remaining squares with transparent
		while (result && result.length < totalSquares) {
			result.push("transparent");
		}

		return result;
	}, [squareDistribution, rows, cols]);

	// MARK: jsx
	return (
		<Tooltip
			label={<CustomTooltip data={data} colors={dataColors} />}
			placement="top"
			hasArrow
			whiteSpace="pre-line"
			fontSize="sm"
		>
			<Grid
				templateRows={`repeat(${rows}, ${size})`}
				templateColumns={`repeat(${cols}, ${size})`}
				gap={gap}
				width="fit-content"
				height="fit-content"
				sx={{
					"& > div": {
						animation: `waffleSquareEntrance ${animationDuration} ease-out both`,
					},
					"@keyframes waffleSquareEntrance": {
						"0%": {
							transform: "scale(0)",
							opacity: 0,
						},
						"60%": {
							transform: "scale(1.1)",
						},
						"100%": {
							transform: "scale(1)",
							opacity: 1,
						},
					},
				}}
			>
				{squares.map((color, index) => {
					// Calculate row and column for diagonal animation
					const row = Math.floor(index / cols);
					const col = index % cols;
					// Diagonal delay: sum of row and column indices
					const diagonalPosition = row + col;
					const diagonalDelay =
						diagonalPosition * parseFloat(animationDelay);

					return (
						<Box
							key={index}
							width={size}
							height={size}
							backgroundColor={color}
							borderRadius="50%"
							border={
								color === "transparent" ? "1px solid" : "none"
							}
							borderColor="hint"
							sx={{
								animationDelay: `${diagonalDelay}s !important`,
								// "&:hover": {
								// 	transition: "transform 0.2s ease-out",
								// 	transform: "scale(1.15)",
								// },
								transition: "background-color 0.3s ease-out",
							}}
						/>
					);
				})}
			</Grid>
		</Tooltip>
	);
};

/**
 * Tooltip custom body component to show waffle chart data with corresponding colored dots
 * MARK: Tooltip
 * @param {string} [label] - The label text (optional)
 * @param {Array} data - The data array containing values
 * @param {Array} colors - The array of colors corresponding to the data
 * @returns {JSX.Element} The custom tooltip content
 */
const CustomTooltip = ({ label = "", data, colors }) => {
	// Calculate tooltip content as array of { label, value, color, percentage }
	const tooltipContent = useMemo(() => {
		const totalValue = data.reduce(
			(sum, item) => sum + (item.value || 0),
			0
		);
		if (totalValue === 0) return [];

		return data.map((item, index) => {
			const percentage = Math.round((item.value / totalValue) * 100);
			return {
				label: item.label,
				value: item.value,
				color: colors[index],
				percentage,
			};
		});
	}, [data, colors]);

	return (
		<Box py="3px">
			{label ? <Text fontWeight="bold">{label}</Text> : null}
			<Flex direction="column" mt={label ? 1 : 0} gap="2px">
				{tooltipContent.map((item, index) => (
					<Flex key={index} align="center">
						<Box
							width="8px"
							height="8px"
							backgroundColor={item.color}
							borderRadius="50%"
							mr="0.4em"
						/>
						<Flex fontSize="0.7em" gap="0.4em">
							<Text>{item.label}:</Text>
							<Text>
								{item.value} ({item.percentage}%)
							</Text>
						</Flex>
					</Flex>
				))}
			</Flex>
		</Box>
	);
};

export default WaffleChart;
