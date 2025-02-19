import { Divider, Flex, Grid, Select, Text } from "@chakra-ui/react";
import { Currency, Icon } from "components";
import { Endpoints } from "constants";
import { useApiFetch } from "hooks";
import React, { useEffect, useState } from "react";
import { useDashboard } from "..";

// Helper function to generate cache key
const getCacheKey = (productFilter, dateFrom, dateTo) => {
	// Extract only the date portion (first 10 characters: "YYYY-MM-DD")
	const fromKey = dateFrom.slice(0, 10);
	const toKey = dateTo.slice(0, 10);

	return `${productFilter || "all"}-${fromKey}-${toKey}`;
};

const calculateVariation = (current, lastMonth) => {
	if (!current || !lastMonth || lastMonth == 0) return null; // Hide if new metric or missing data
	if (Number(current) === Number(lastMonth)) return null; // Hide 0% change

	const percentageChange = ((current - lastMonth) / lastMonth) * 100;

	if (percentageChange > 100) {
		return `${Math.floor(percentageChange / 100)}X`; // Return as X multiplier (string)
	}

	return Number(percentageChange.toFixed(2)); // Return as a number
};

/**
 * EarningOverview component displays an overview of earnings based on various metrics.
 * @param {object} props - Properties passed to the component.
 * @param {Array} props.productFilterList - List of product filters.
 * @param {string} props.dateFrom - Start date for filtering data.
 * @param {string} props.dateTo - End date for filtering data.
 * @example
 * <EarningOverview
 *   dateFrom="2023-01-01"
 *   dateTo="2023-01-31"
 *   productFilterList={[{ label: "Product 1", value: "81" }]}
 * />
 */
const EarningOverview = ({ dateFrom, dateTo, productFilterList }) => {
	const [productFilter, setProductFilter] = useState("");
	const [earningOverviewData, setEarningOverviewData] = useState({});
	const { businessDashboardData, setBusinessDashboardData } = useDashboard();

	// MARK: Fetching Product Overview Data
	const [fetchEarningOverviewData] = useApiFetch(Endpoints.TRANSACTION_JSON, {
		onSuccess: (res) => {
			const _data = res?.data?.dashboard_object?.products_overview || [];

			const cacheKey = getCacheKey(productFilter, dateFrom, dateTo);

			// Cache data for future use
			setBusinessDashboardData((prev) => ({
				...prev,
				earningOverviewCache: {
					...(prev.earningOverviewCache || {}),
					[cacheKey]: _data,
				},
			}));

			setEarningOverviewData(_data);
		},
	});

	useEffect(() => {
		if (!dateFrom || !dateTo) return;

		const cacheKey = getCacheKey(productFilter, dateFrom, dateTo);

		// Use cached data if available
		if (businessDashboardData?.earningOverviewCache?.[cacheKey]) {
			setEarningOverviewData(
				businessDashboardData.earningOverviewCache[cacheKey]
			);
			return;
		}

		// Fetch data only when not cached
		fetchEarningOverviewData({
			body: {
				interaction_type_id: 682,
				requestPayload: {
					products_overview: {
						datefrom: dateFrom,
						dateto: dateTo,
						typeid: productFilter,
					},
				},
			},
		});
	}, [dateFrom, dateTo, productFilter, businessDashboardData]);

	const earningOverviewList = [
		{
			key: "gtv",
			label: "GTV",
			value: earningOverviewData?.gtv?.amount || 0,
			lastPeriod: earningOverviewData?.gtv?.lastMonth || 0,
			type: "amount",
			variation: calculateVariation(
				earningOverviewData?.gtv?.amount,
				earningOverviewData?.gtv?.lastMonth
			),
		},
		{
			key: "transactions",
			label: "Transactions",
			value: earningOverviewData?.transactions?.transactions || 0,
			lastPeriod: earningOverviewData?.transactions?.lastMonth || 0,
			type: "number",
			variation: calculateVariation(
				earningOverviewData?.transactions?.transactions,
				earningOverviewData?.transactions?.lastMonth
			),
		},
		{
			key: "activeAgents",
			label: "Transacting Agents",
			value: earningOverviewData?.activeAgents?.active || 0,
			lastPeriod: earningOverviewData?.activeAgents?.lastMonth || 0,
			type: "number",
			variation: calculateVariation(
				earningOverviewData?.activeAgents?.active,
				earningOverviewData?.activeAgents?.lastMonth
			),
		},
		{
			key: "onboardedAgents",
			label: "Onboarded Agents",
			value: earningOverviewData?.onboardedAgents?.onboarded || 0,
			lastPeriod: earningOverviewData?.onboardedAgents?.lastMonth || 0,
			type: "number",
			variation: calculateVariation(
				earningOverviewData?.onboardedAgents?.onboarded,
				earningOverviewData?.onboardedAgents?.lastMonth
			),
		},
		{
			key: "raCases",
			label: "Pending Transactions",
			value: earningOverviewData?.raCases?.raCases || 0,
			lastPeriod: earningOverviewData?.raCases?.lastMonth || 0,
			type: "number",
			variation: calculateVariation(
				earningOverviewData?.raCases?.raCases,
				earningOverviewData?.raCases?.lastMonth
			),
		},
		{
			key: "commissionDue",
			label: "Commission Due",
			value: earningOverviewData?.commissionDue?.commissionDue || 0,
			lastPeriod: earningOverviewData?.commissionDue?.lastMonth || 0,
			type: "amount",
			variation: calculateVariation(
				earningOverviewData?.commissionDue?.commissionDue,
				earningOverviewData?.commissionDue?.lastMonth
			),
		},
	];

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
				direction={{ base: "column", md: "row" }}
				justify="space-between"
				gap={{ base: "2", md: "4" }}
				w="100%"
			>
				<Text fontSize="xl" fontWeight="semibold">
					Earning Overview
				</Text>
				<Flex w={{ base: "100%", md: "auto" }}>
					<Select
						variant="filled"
						value={productFilter}
						onChange={(e) => setProductFilter(e.target.value)}
						size="sm"
					>
						{productFilterList.map(({ label, value }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</Select>
				</Flex>
			</Flex>
			<Divider />
			<Flex h="100%" w="100%" align="center">
				<Grid
					templateColumns={{
						base: "1fr",
						md: "repeat(auto-fit, minmax(160px, 1fr))",
					}}
					gap={{ base: "2", md: "8" }}
					w="100%"
				>
					{earningOverviewList.map(
						(item, index) =>
							item.value !== 0 && (
								<React.Fragment key={item.key}>
									<Flex
										direction={{
											base: "row",
											md: "column",
										}}
										justify={{
											base: "space-between",
											md: "flex-start",
										}}
										w="100%"
										gap="1"
									>
										<Flex
											direction="column"
											align={{
												base: "flex-start",
												md: "center",
											}}
											gap="1"
										>
											<Text
												fontSize="sm"
												textAlign="center"
												whiteSpace="nowrap"
											>
												{item.label}
											</Text>
											<Flex
												fontWeight="semibold"
												color="primary.DEFAULT"
											>
												{item.type === "amount" ? (
													<Currency
														amount={item.value}
													/>
												) : (
													<span>{item.value}</span>
												)}
											</Flex>
										</Flex>
										{item.lastPeriod !== 0 && (
											<Flex
												direction="column"
												align={{
													base: "flex-end",
													md: "center",
												}}
												gap="1"
											>
												<Flex
													fontSize="xs"
													whiteSpace="nowrap"
													gap="1"
												>
													<span>Last Period:</span>
													<Flex fontWeight="semibold">
														{item.type ===
														"amount" ? (
															<Currency
																amount={
																	item.lastPeriod
																}
															/>
														) : (
															<span>
																{
																	item.lastPeriod
																}
															</span>
														)}
													</Flex>
												</Flex>
												{item.variation && (
													<Flex
														gap="1"
														align="center"
													>
														<Icon
															name={
																parseFloat(
																	item.variation
																) > 0
																	? "arrow-increase"
																	: "arrow-decrease"
															}
															color={
																parseFloat(
																	item.variation
																) > 0
																	? "success"
																	: "error"
															}
															size="xs"
														/>
														<Flex
															fontSize="10px"
															wrap="nowrap"
															gap="1"
														>
															<Text
																color={
																	parseFloat(
																		item.variation
																	) > 0
																		? "success"
																		: "error"
																}
															>
																{isNaN(
																	item.variation
																)
																	? item.variation
																	: `${item.variation}%`}
															</Text>
															<Text>
																{parseFloat(
																	item.variation
																) > 0
																	? "Increase"
																	: "Decrease"}
															</Text>
														</Flex>
													</Flex>
												)}
											</Flex>
										)}
									</Flex>
									{index < earningOverviewList.length - 1 && (
										<Divider
											display={{
												base: "block",
												md: "none",
											}}
										/>
									)}
								</React.Fragment>
							)
					)}
				</Grid>
			</Flex>

			{/*TODO: Need IcoButton -- Download Reports */}
		</Flex>
	);
};

export default EarningOverview;
