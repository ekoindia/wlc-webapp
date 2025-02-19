import { Divider, Flex, Text } from "@chakra-ui/react";
import { Endpoints, ProductRoleConfiguration } from "constants";
import { useApiFetch, useDailyCacheState } from "hooks";
import { useEffect, useMemo, useState } from "react";
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

	const cacheKey = useMemo(
		() => getCacheKey(dateFrom, dateTo),
		[dateFrom, dateTo]
	);
	const cachedSuccessRate =
		businessDashboardData?.successRateCache?.[cacheKey];

	const updateSuccessRateCache = (_successRate) => {
		const updatedCache = {
			...(successRateCache || {}),
			data: {
				...(successRateCache?.data || {}),
				[cacheKey]: _successRate,
			},
		};

		setSuccessRateCache(updatedCache);
		setBusinessDashboardData((prev) => ({
			...prev,
			successRateCache: updatedCache.data,
		}));
	};

	const [fetchSuccessRateData] = useApiFetch(Endpoints.TRANSACTION_JSON, {
		onSuccess: (res) => {
			const _data = res?.data?.dashboard_object?.successRate || {};
			const _product = ProductRoleConfiguration?.products ?? [];

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

					const successRate =
						(
							(productData.successCount /
								productData.totalCount) *
							100
						).toFixed(2) + "%";

					return {
						key: p.tx_typeid,
						label: p.label,
						value: successRate,
					};
				})
				.filter(Boolean);

			updateSuccessRateCache(_successRate);
			setSuccessRateData(_successRate);
		},
	});

	useEffect(() => {
		if (!dateFrom || !dateTo) return;

		if (cachedSuccessRate) {
			setSuccessRateData(cachedSuccessRate);
			return;
		}

		if (isCacheValid && successRateCache?.data?.[cacheKey]) {
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
			<Text
				as="h2"
				fontSize="xl"
				fontWeight="semibold"
				aria-label="Success Rate"
			>
				Success Rate
			</Text>

			<Divider />

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
						const showDivider = index > 0;
						return (
							<Flex
								key={item.key}
								direction="column"
								gap="2"
								w="100%"
							>
								{showDivider && <Divider />}
								<Flex
									justify="space-between"
									fontSize="sm"
									gap="2"
									pb="2"
								>
									<Text>{item.label}</Text>
									<Text
										fontWeight="semibold"
										color="primary.DEFAULT"
									>
										{item.value}
									</Text>
								</Flex>
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

export default SuccessRate;
