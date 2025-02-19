import { Divider, Flex, Text } from "@chakra-ui/react";
import { Endpoints, ProductRoleConfiguration } from "constants";
import { useApiFetch } from "hooks";
import { useEffect, useState } from "react";
import { useDashboard } from "..";

// Generate cache key using only date range
const getCacheKey = (dateFrom, dateTo) => {
	const fromKey = dateFrom.slice(0, 10); // Extract YYYY-MM-DD
	const toKey = dateTo.slice(0, 10);
	return `successRate-${fromKey}-${toKey}`;
};

/**
 * A SuccessRate page-component that displays the success rate of transactions with caching.
 * @component
 * @param {object} props - The component props
 * @param {string} props.dateFrom - The start date for fetching success rate data
 * @param {string} props.dateTo - The end date for fetching success rate data
 * @example
 * ```jsx
 * <SuccessRate dateFrom="2024-01-01" dateTo="2024-01-31" />
 * ```
 */
const SuccessRate = ({ dateFrom, dateTo }) => {
	const [successRateData, setSuccessRateData] = useState([]);
	const { businessDashboardData, setBusinessDashboardData } = useDashboard();

	// Fetching Success Rate Data
	const [fetchSuccessRateData] = useApiFetch(Endpoints.TRANSACTION_JSON, {
		onSuccess: (res) => {
			const _data = res?.data?.dashboard_object?.successRate || {};
			const _product = ProductRoleConfiguration?.products ?? [];

			const _successRate = _product
				.filter((p) => p.tx_typeid && _data[p.tx_typeid])
				.map((p) => {
					const productData = _data[p.tx_typeid];

					if (
						!productData ||
						productData.successCount === 0 ||
						productData.totalCount === 0
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

			// Cache data for future use
			const cacheKey = getCacheKey(dateFrom, dateTo);
			setBusinessDashboardData((prev) => ({
				...prev,
				successRateCache: {
					...(prev.successRateCache || {}),
					[cacheKey]: _successRate,
				},
			}));

			setSuccessRateData(_successRate);
		},
	});

	useEffect(() => {
		if (!dateFrom || !dateTo) return;

		const cacheKey = getCacheKey(dateFrom, dateTo);

		// Use cached data if available
		if (businessDashboardData?.successRateCache?.[cacheKey]) {
			setSuccessRateData(
				businessDashboardData.successRateCache[cacheKey]
			);
			return;
		}

		// Fetch data only if not cached
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
	}, [dateFrom, dateTo, businessDashboardData]);

	return (
		<Flex
			direction="column"
			bg="white"
			borderRadius="10px"
			p="5"
			w="100%"
			h={{ base: "auto", xl: "280px" }} // Set fixed height for scrolling
			overflowY="auto" // Enables scrolling
			className="customScrollbars" // Use custom styles if needed
			gap="4"
		>
			<Text fontSize="xl" fontWeight="semibold">
				Success Rate
			</Text>

			<Divider />

			<Flex
				direction="column"
				className="customScrollbars"
				overflowY={{ base: "none", lg: "auto" }} // Scroll only on larger screens
				flex="1" // Takes full height for centering
				justify={successRateData?.length ? "flex-start" : "center"}
				align="center"
			>
				{successRateData?.length ? (
					successRateData.map((item, index) => (
						<Flex
							key={item.key}
							direction="column"
							gap="2"
							w="100%"
						>
							{index > 0 ? <Divider /> : null}
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
					))
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
