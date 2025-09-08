import { Flex, Skeleton, Text } from "@chakra-ui/react";
import { Endpoints, ProductRoleConfiguration } from "constants";
import { useApiFetch, useDailyCacheState, useFeatureFlag } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { LuShieldCheck } from "react-icons/lu";
import { Cell, Label, Pie, PieChart } from "recharts";
import { useDashboard } from "..";

const successRateLocalCacheKey = "inf-dashboard-success-rate";

// Generate cache key using only date range
const getCacheKey = (dateFrom, dateTo) =>
	`successRate-${dateFrom.substring(0, 10)}-${dateTo.substring(0, 10)}`;

const SuccessRate = ({ dateFrom, dateTo }) => {
	const [successRateData, setSuccessRateData] = useState([]);
	const { businessDashboardData, setBusinessDashboardData } = useDashboard();
	const [successRateCache, setSuccessRateCache, isCacheValid] =
		useDailyCacheState(successRateLocalCacheKey, {});

	const [showNewDashboard] = useFeatureFlag("DASHBOARD_V2");

	const cacheKey = useMemo(
		() => getCacheKey(dateFrom, dateTo),
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
			successRateCache: updatedCache.data,
		}));
	};

	const [fetchSuccessRateData, isLoading] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			onSuccess: (res) => {
				const _data = res?.data?.dashboard_object?.successRate || {};
				const _product = ProductRoleConfiguration?.products ?? [];

				// Check if _data has any success rate data
				const _successRate = _product
					.filter((p) => p.tx_typeid && _data[p.tx_typeid])
					.map((p) => {
						const productData = _data[p.tx_typeid];

						if (
							!productData?.successCount ||
							!productData?.totalCount
						) {
							return null;
						}

						const successPercent =
							(productData.successCount /
								productData.totalCount) *
							100;

						const successRate = successPercent.toFixed(
							successPercent == 100 ? 0 : 1
						);

						return {
							key: p.tx_typeid,
							label: p.label,
							value: successRate,
							success: productData.successCount,
							total: productData.totalCount,
						};
					})
					.filter(Boolean); // Remove null values

				// If _successRate is empty, store [] instead of undefined
				updateSuccessRateCache(_successRate.length ? _successRate : []);

				setSuccessRateData(_successRate);
			},
		}
	);

	useEffect(() => {
		if (!dateFrom || !dateTo) return;

		if (cachedSuccessRate !== undefined) {
			// Cache exists, even if empty
			setSuccessRateData(cachedSuccessRate);
			return;
		}

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
	}, [
		dateFrom,
		dateTo,
		cacheKey,
		cachedSuccessRate,
		isCacheValid,
		successRateCache,
	]);

	return (
		<Flex
			direction="column"
			bg="white"
			borderRadius="10px"
			p="5"
			w="100%"
			h={{ base: "auto", xl: "280px" }}
			overflowY="auto"
			className="customScrollbars"
			gap="4"
		>
			<Flex
				fontSize="lg"
				fontWeight="semibold"
				align="center"
				gap="0.4em"
			>
				<LuShieldCheck color="#16a249" />
				Success Rates
			</Flex>

			{/* <Divider /> */}

			<Flex
				direction="column"
				className="customScrollbars"
				overflowY={{ base: "none", lg: "auto" }}
				flex="1"
				justify={successRateData?.length ? "flex-start" : "center"}
				align="center"
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
										{item.label}
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
