import { Flex, Skeleton, Text } from "@chakra-ui/react";
import { DragHandle } from "components/DraggableGrid";
import { Endpoints } from "constants";
import { useApiFetch, useFeatureFlag } from "hooks";
import { useEffect, useState } from "react";
import { LuShieldCheck } from "react-icons/lu";
import { Cell, Label, Pie, PieChart } from "recharts";

const SuccessRate = ({
	dateFrom,
	dateTo,
	isDraggable,
	productFilterList: masterProductList,
}) => {
	const [successRateData, setSuccessRateData] = useState([]);

	const [showNewDashboard] = useFeatureFlag("DASHBOARD_V2");

	const [fetchSuccessRateData, isLoading] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			onSuccess: (res) => {
				const _data = res?.data?.dashboard_object?.successRate || {};

				// 1. Get the keys (IDs) from the API response (e.g., "392", "814")
				const successRateKeys = Object.keys(_data);

				// 2. Map through the keys and find the label from masterProductList
				const formattedData = successRateKeys.map((id) => {
					// Find matching product in masterProductList
					// We use == instead of === because id is a string "392"
					// and value might be a number 392
					const product = masterProductList?.find(
						(p) => p.value == id
					);

					const successCount = _data[id]?.successCount;
					const totalCount = _data[id]?.totalCount;

					// Calculate percentage
					const percentage =
						totalCount > 0
							? Number(
									((successCount / totalCount) * 100).toFixed(
										2
									)
								)
							: 0;

					return {
						id: id,
						label: product?.label,
						successCount,
						totalCount,
						value: percentage,
					};
				});

				// 3. Update the state
				setSuccessRateData(formattedData);
			},
		}
	);

	useEffect(() => {
		if (!dateFrom || !dateTo) return;

		fetchSuccessRateData({
			body: {
				interaction_type_id: 682,
				requestPayload: {
					success_rate: {
						datefrom: dateFrom,
						dateto: dateTo,
					},
				},
			},
		});
	}, [dateFrom, dateTo]);

	// MARK: jsx
	return (
		<Flex
			direction="column"
			bg="white"
			borderRadius="10px"
			p="5"
			w="100%"
			h="100%"
			overflowY="auto"
			className="customScrollbars"
			gap="4"
		>
			<DragHandle isDraggable={isDraggable}>
				<Flex
					fontSize="lg"
					fontWeight="semibold"
					align="center"
					gap="0.4em"
				>
					<LuShieldCheck color="#16a249" />
					Success Rates
				</Flex>
			</DragHandle>

			{/* <Divider /> */}

			<Flex
				direction="column"
				className="customScrollbars"
				overflowY={{ base: "none", lg: "auto" }}
				flex="1"
				justify={successRateData?.length ? "flex-start" : "center"}
				align="center"
				maxH="180px"
				// gap="10px"
			>
				{successRateData?.length ? (
					successRateData.map((item, index) => {
						return (
							<Flex
								key={item.label}
								direction="row"
								align="center"
								fontSize="sm"
								gap="10px"
								py="6px"
								w="100%"
								borderTop={index > 0 ? "1px solid" : "none"}
								borderTopColor="divider"
							>
								<Text flex="1" fontSize="0.75rem">
									<Skeleton isLoaded={!isLoading}>
										{item?.label}
									</Skeleton>
								</Text>
								<Text
									fontWeight="semibold"
									color="primary.DEFAULT"
								>
									<Skeleton isLoaded={!isLoading}>
										{item.value}%
									</Skeleton>
								</Text>
								{showNewDashboard ? (
									<Chart
										successCount={item.success}
										totalCount={item.total}
										size={30}
										innerRadius="60%"
										hideLabel
									/>
								) : null}
							</Flex>
						);
					})
				) : (
					<Text color="gray.500" fontSize="md">
						Nothing Found
					</Text>
				)}
			</Flex>
		</Flex>
	);
};

const Chart = ({
	successCount,
	totalCount,
	size = 55,
	innerRadius = "70%",
	hideLabel = false,
}) => {
	if (!successCount || !totalCount) return null;

	const isFull = successCount === totalCount;

	return (
		<PieChart
			accessibilityLayer={false}
			width={size}
			height={size}
			margin={{
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			}}
			style={{ outline: "none" }}
		>
			<Pie
				data={[
					{ name: "Success", value: successCount },
					{ name: "Failure", value: totalCount - successCount },
				]}
				outerRadius="100%"
				innerRadius={innerRadius}
				cornerRadius={isFull ? 0 : 99}
				paddingAngle={isFull ? 0 : 6}
				minAngle={1}
				dataKey="value"
				nameKey="name"
				tabIndex={-1}
				style={{ outline: "none" }}
			>
				<Cell fill="#76c68f" />
				<Cell fill="#FF6B6B" />
			</Pie>
			{/* Show a label at the center of the piechart */}
			{hideLabel ? null : (
				<Label position="center" fontSize="0.7em" fontWeight="700">
					{`${((successCount / totalCount) * 100).toFixed(successCount === totalCount ? 0 : 1)}%`}
				</Label>
			)}
		</PieChart>
	);
};

export default SuccessRate;
