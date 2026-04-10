import { Flex, Skeleton, Text } from "@chakra-ui/react";
import { DragHandle } from "components/DraggableGrid";
import { Endpoints } from "constants";
import { isToday } from "date-fns";
import { useApiFetch, useDailyCacheState } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { LuShieldCheck } from "react-icons/lu";
import { Cell, Label, Pie, PieChart } from "recharts";
import { useDashboard } from "../DashboardContext";
import { getCacheKey } from "./utils";

const successRateLocalCacheKey = "inf-dashboard-success-rate";

const SuccessRate = ({
	dateFrom,
	dateTo,
	isDraggable,
	productFilterList: masterProductList,
}) => {
	const [successRateData, setSuccessRateData] = useState([]);
	const isProductListReady = masterProductList?.length > 1;
	const { businessDashboardData, setBusinessDashboardData } = useDashboard();
	const isTodayRange = isToday(dateFrom) && isToday(dateTo);

	const [successRateCache, setSuccessRateCache, isCacheValid] =
		useDailyCacheState(successRateLocalCacheKey, {});

	const cacheKey = useMemo(
		() => getCacheKey(successRateLocalCacheKey, dateFrom, dateTo),
		[dateFrom, dateTo]
	);

	const cachedSuccessRate =
		businessDashboardData?.successRateCache?.[cacheKey];

	const updateSuccessRateCache = (_successRate) => {
		// Always store something in the cache (even if empty)
		const updatedCache = {
			...(successRateCache || {}),
			data: {
				...(successRateCache?.data || {}),
				[cacheKey]: _successRate.length ? _successRate : [], // Store empty array if no data
			},
		};

		setSuccessRateCache(updatedCache);

		setBusinessDashboardData((prev) => ({
			...prev,
			successRateCache: {
				...(prev?.successRateCache || {}),
				[cacheKey]: _successRate,
			},
		}));
	};

	const [fetchSuccessRateData, isLoading] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			onSuccess: (res) => {
				const _data = res?.data?.dashboard_object?.successRate || {};

				const successRateKeys = Object.keys(_data);
				const formattedData = successRateKeys.map((id) => {
					const product = masterProductList?.find(
						(p) => p.value == id
					);
					const successCount = _data[id]?.successCount;
					const totalCount = _data[id]?.totalCount;
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

				updateSuccessRateCache(
					formattedData.length ? formattedData : []
				);

				setSuccessRateData(formattedData);
			},
		}
	);

	useEffect(() => {
		if (!dateFrom || !dateTo) return;

		// wait for real product list
		if (!isProductListReady) return;

		if (isTodayRange) {
			// For today's data, always fetch fresh data and skip cache
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

			return;
		}

		// Step 1: in-memory context cache (fastest)
		if (cachedSuccessRate !== undefined) {
			// Cache exists, even if empty
			setSuccessRateData(cachedSuccessRate);
			return;
		}

		// Step 2: localStorage cache check
		if (isCacheValid && successRateCache?.data?.[cacheKey]?.length) {
			updateSuccessRateCache(successRateCache.data[cacheKey]);
			setSuccessRateData(successRateCache.data[cacheKey]);
			return;
		}

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
	}, [dateFrom, dateTo, cacheKey, isProductListReady, isTodayRange]);

	// MARK: jsx
	return (
		<Flex
			direction="column"
			bg="white"
			borderRadius="10px"
			p="6"
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

			<Flex
				direction="column"
				className="customScrollbars"
				overflowY={{ base: "none", lg: "auto" }}
				flex="1"
				justify={successRateData?.length ? "flex-start" : "center"}
				align="center"
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

								<Chart
									successCount={item.successCount}
									totalCount={item.totalCount}
									size={30}
									innerRadius="60%"
									hideLabel
								/>
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
