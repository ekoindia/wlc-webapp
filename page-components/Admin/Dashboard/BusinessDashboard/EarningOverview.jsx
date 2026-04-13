import {
	Divider,
	Flex,
	Grid,
	Select,
	Skeleton,
	Text,
	useBreakpointValue,
} from "@chakra-ui/react";
import { Currency, WaffleChart } from "components";
import { DragHandle } from "components/DraggableGrid";
import { Endpoints } from "constants";
import { isToday } from "date-fns";
import { useApiFetch, useDailyCacheState, useFeatureFlag } from "hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuActivity } from "react-icons/lu";
import { useDashboard } from "..";
// Product Chart Colors
const COLORS = [
	"#7eb0d5",
	"#bd7ebe",
	"#b2e061",
	"#ffb55a",
	"#ffee65",
	"#beb9db",
	"#fdcce5",
	"#8bd3c7",
	"#fd7f6f",
];

const earningOverviewLocalCacheKey = "inf-dashboard-business-overview";

// Helper function to generate cache key
const getCacheKey = (prefix, dateFrom, dateTo, productFilter) => {
	return `${prefix}-${dateFrom.substring(0, 10)}-${dateTo.substring(0, 10)}-${productFilter || "all"}`;
};

/**
 * Matches items from a Product master filter list against the keys present in an API productTypeBreakdown.
 * @param {Array} productMasterList - The complete list of all products available in the system, retrieved from the products API.
 * @param {object} productTypeBreakdown - The breakdown object from the GTV API where keys represent product IDs and values contain transaction details.
 * @returns {Array} - A filtered array of product definitions that exist in the GTV breakdown.
 */
export const filterAvailableProducts = (
	productMasterList,
	productTypeBreakdown
) => {
	if (!productTypeBreakdown || !productMasterList) return [];

	// Get the IDs (keys) available in the current API response
	const availableIds = Object.keys(productTypeBreakdown);

	// Filter the master list to only include what's in the breakdown
	return productMasterList.filter((item) =>
		availableIds.includes(String(item.value))
	);
};

const calculateVariation = (current, lastPeriod) => {
	if (!current || !lastPeriod || lastPeriod == 0) return null; // Hide if new metric or missing data
	if (Number(current) === Number(lastPeriod)) return null; // Hide 0% change

	const percentageChange = ((current - lastPeriod) / lastPeriod) * 100;

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
 * @param {Function} props.setTotalBusiness - Function to set total business data (total GTV & Transaction count) in parent component.
 * @param {boolean} [props.isDraggable] - Whether the component is draggable in the grid.
 * @returns {JSX.Element} The rendered earning overview component
 * @example
 * <EarningOverview
 *   dateFrom="2023-01-01"
 *   dateTo="2023-01-31"
 *   productFilterList={[{ label: "Product 1", value: "81" }]}
 * />
 */
const EarningOverview = ({
	dateFrom,
	dateTo,
	productFilterList: masterProductList,
	setTotalBusiness,
	isDraggable,
}) => {
	const [productFilter, setProductFilter] = useState("");
	const [earningOverviewData, setEarningOverviewData] = useState({});
	const { businessDashboardData, setBusinessDashboardData } = useDashboard();
	const [productWiseData, setProductWiseData] = useState([]);
	const [filteredProductList, setFilteredProductList] = useState([
		{ label: "All Products", value: "" },
	]);
	const [cachedFullProductList, setCachedFullProductList] = useState(null);
	const prevDateRef = useRef({ dateFrom, dateTo });

	const [isEkoShieldEnabled] = useFeatureFlag("EKO_SHIELD");

	const [earningOverviewCache, setEarningOverviewCache, isCacheValid] =
		useDailyCacheState(earningOverviewLocalCacheKey, {});

	const isTodayRange = isToday(dateFrom) && isToday(dateTo);

	const isSmallScreen = useBreakpointValue({ base: true, md: false });

	const cacheKey = useMemo(
		() =>
			getCacheKey(
				earningOverviewLocalCacheKey,
				dateFrom,
				dateTo,
				productFilter
			),
		[productFilter, dateFrom, dateTo]
	);

	const updateEarningOverviewCache = (_data) => {
		const updatedCache = {
			...(earningOverviewCache || {}),
			data: {
				...(earningOverviewCache?.data || {}),
				[cacheKey]: _data,
			},
		};

		setEarningOverviewCache(updatedCache);

		setBusinessDashboardData((prev) => ({
			...prev,
			earningOverviewCache: {
				...(prev?.earningOverviewCache || {}),
				[cacheKey]: _data,
			},
		}));
	};

	// MARK: API Handler
	const [fetchEarningOverviewData, isLoading] = useApiFetch(
		Endpoints.TRANSACTION_JSON,
		{
			onSuccess: (res) => {
				const _data =
					res?.data?.dashboard_object?.products_overview || [];

				updateEarningOverviewCache(_data);

				setEarningOverviewData(_data);

				// Inform parent component
				if (!productFilter) {
					setTotalBusiness(_data);
				}
			},
		}
	);

	// Calculate/parse Product-wise data and generate product filter list from typeBreakdown
	useEffect(() => {
		let typeBreakdown = earningOverviewData?.gtv?.typeBreakdown;

		try {
			if (typeof typeBreakdown === "string") {
				typeBreakdown = JSON.parse(typeBreakdown);
			}
		} catch (error) {
			console.error("Error parsing product-wise data:", error);
			setProductWiseData([]);
			// Keep the cached filter list if available, don't reset it
			if (!cachedFullProductList) {
				setFilteredProductList([{ label: "All Products", value: "" }]);
			}
			return;
		}

		if (typeBreakdown && Object.keys(typeBreakdown).length > 0) {
			// 1. Map data for the Waffle Chart
			const parsedData = Object.entries(typeBreakdown)
				.map(([key, value]) => ({
					id: key,
					...value,
					label: value.name,
					value: value.amount,
				}))
				.sort((a, b) => b.value - a.value);

			setProductWiseData(parsedData);

			// 2. USE UTIL: Match product master prop list against current breakdown
			const matchedOptions = filterAvailableProducts(
				masterProductList,
				typeBreakdown
			);

			// 3. Only update and cache filter list if no filter is selected AND we have matched options
			// This ensures we capture the full list when showing "All Products"
			if (!productFilter && matchedOptions.length > 0) {
				const fullList = [
					{ label: "All Products", value: "" },
					...matchedOptions,
				];
				setFilteredProductList(fullList);
				setCachedFullProductList(fullList);
			} else if (cachedFullProductList) {
				// Always use cached full list when available (regardless of current breakdown)
				setFilteredProductList(cachedFullProductList);
			} else if (matchedOptions.length > 0) {
				// Fallback: create filter list from current options if no cache exists
				const fullList = [
					{ label: "All Products", value: "" },
					...matchedOptions,
				];
				setFilteredProductList(fullList);
			}
		} else {
			setProductWiseData([]);
			// Only reset filter list if we don't have cached data
			if (cachedFullProductList) {
				// Keep using cached full list
				setFilteredProductList(cachedFullProductList);
			} else {
				// Only fall back to "All Products" if no cache exists
				setFilteredProductList([{ label: "All Products", value: "" }]);
			}
		}
	}, [earningOverviewData, masterProductList, productFilter]);

	// MARK: Fetch Data
	useEffect(() => {
		if (!dateFrom || !dateTo) return;

		// Check if date has changed
		const dateChanged =
			prevDateRef.current.dateFrom !== dateFrom ||
			prevDateRef.current.dateTo !== dateTo;

		// Reset product filter to "All Products" when date changes
		if (dateChanged && productFilter) {
			prevDateRef.current = { dateFrom, dateTo };
			setProductFilter("");
			return; // The effect will re-run with empty productFilter
		}

		// Update ref after handling date change
		if (dateChanged) {
			prevDateRef.current = { dateFrom, dateTo };
		}

		const _typeid = productFilter ? { typeid: productFilter } : {};

		if (isTodayRange) {
			// For today's data, always fetch fresh data and skip cache
			fetchEarningOverviewData({
				body: {
					interaction_type_id: 682,
					requestPayload: {
						products_overview: {
							datefrom: dateFrom,
							dateto: dateTo,
							..._typeid,
						},
					},
				},
			});

			return;
		}

		// Step 1: in-memory context cache (fastest)
		const cachedData =
			businessDashboardData?.earningOverviewCache?.[cacheKey];
		if (cachedData !== undefined) {
			// Cache exists, even if empty
			setEarningOverviewData(cachedData);
			if (!productFilter) {
				setTotalBusiness(cachedData);
			}
			return;
		}

		// Step 2: localStorage cache check
		if (isCacheValid && earningOverviewCache?.data?.[cacheKey]) {
			updateEarningOverviewCache(earningOverviewCache.data[cacheKey]);
			setEarningOverviewData(earningOverviewCache.data[cacheKey]);
			if (!productFilter) {
				setTotalBusiness(earningOverviewCache.data[cacheKey]);
			}
			return;
		}

		// Step 3: Fetch fresh data from API
		fetchEarningOverviewData({
			body: {
				interaction_type_id: 682,
				requestPayload: {
					products_overview: {
						datefrom: dateFrom,
						dateto: dateTo,
						..._typeid,
					},
				},
			},
		});
	}, [dateFrom, dateTo, cacheKey, isTodayRange]);

	const earningOverviewList = [
		{
			key: "gtv",
			label: "GTV",
			value: earningOverviewData?.gtv?.amount || 0,
			lastPeriod: earningOverviewData?.gtv?.lastPeriod || 0,
			type: "amount",
			variation: calculateVariation(
				earningOverviewData?.gtv?.amount,
				earningOverviewData?.gtv?.lastPeriod
			),
		},
		{
			key: "revenue",
			label: "Total Revenue/Charges",
			value: earningOverviewData?.gtv?.revenue || 0,
			lastPeriod: earningOverviewData?.gtv?.revenuelastPeriod || 0,
			type: "amount",
			variation: calculateVariation(
				earningOverviewData?.gtv?.revenue || 0,
				earningOverviewData?.gtv?.revenuelastPeriod || 0
			),
		},
		{
			key: "averageRevenue",
			label: "Average Revenue/Charges",
			value: earningOverviewData?.gtv?.averageRevenue || 0,
			lastPeriod: earningOverviewData?.gtv?.averageRevenueLastPeriod || 0,
			type: "amount",
			variation: calculateVariation(
				earningOverviewData?.gtv?.averageRevenue || 0,
				earningOverviewData?.gtv?.averageRevenueLastPeriod || 0
			),
		},
		// TODO: Display Transaction and API Calls according to feature flag
		{
			key: "transactions",
			label: "Total Transactions",
			value: earningOverviewData?.transactions?.transactions || 0,
			lastPeriod: earningOverviewData?.transactions?.lastPeriod || 0,
			type: "number",
			variation: calculateVariation(
				earningOverviewData?.transactions?.transactions,
				earningOverviewData?.transactions?.lastPeriod
			),
		},
		{
			key: "successCases",
			label: "Successful Transactions",
			value: earningOverviewData?.successCases?.successCases || 0,
			lastPeriod: earningOverviewData?.successCases?.lastPeriod || 0,
			type: "number",
			variation: calculateVariation(
				earningOverviewData?.successCases?.successCases || 0,
				earningOverviewData?.successCases?.lastPeriod || 0
			),
		},
		{
			key: "failedCases",
			label: "Failed Transactions",
			value: earningOverviewData?.failedCases?.failedCases || 0,
			lastPeriod: earningOverviewData?.failedCases?.lastPeriod || 0,
			type: "number",
			variation: calculateVariation(
				earningOverviewData?.failedCases?.failedCases || 0,
				earningOverviewData?.failedCases?.lastPeriod || 0
			),
		},
		{
			key: "activeAgents",
			label: "Transacting Agents",
			value: earningOverviewData?.activeAgents?.active || 0,
			lastPeriod: earningOverviewData?.activeAgents?.lastPeriod || 0,
			type: "number",
			variation: calculateVariation(
				earningOverviewData?.activeAgents?.active,
				earningOverviewData?.activeAgents?.lastPeriod
			),
		},
		{
			key: "onboardedAgents",
			label: "Onboarded Agents",
			hidden: isEkoShieldEnabled,
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
			lastPeriod: earningOverviewData?.raCases?.lastPeriod || 0,
			type: "number",
			variation: calculateVariation(
				earningOverviewData?.raCases?.raCases,
				earningOverviewData?.raCases?.lastPeriod
			),
		},
		{
			key: "commissionDue",
			label: "Commission Due",
			value: earningOverviewData?.commissionDue?.commissionDue || 0,
			lastPeriod: earningOverviewData?.commissionDue?.lastPeriod || 0,
			type: "amount",
			variation: calculateVariation(
				earningOverviewData?.commissionDue?.commissionDue,
				earningOverviewData?.commissionDue?.lastPeriod
			),
		},
	];

	// MARK: jsx
	return (
		<Flex
			direction="column"
			bg="white"
			p="20px 20px 30px"
			borderRadius="10"
			gap="4"
			w="100%"
			h="100%"
		>
			<Flex direction="column" gap={{ base: "2", md: "0" }} w="100%">
				{/* Desktop: All in one row */}
				<Flex
					display={{ base: "none", md: "flex" }}
					justify="space-between"
					align="center"
					gap="4"
				>
					<DragHandle isDraggable={isDraggable}>
						<Flex
							fontSize="lg"
							fontWeight="semibold"
							align="center"
							gap="0.4em"
							flex="1"
						>
							<LuActivity color="#3c83f6" />
							Business Overview
						</Flex>
						{/* Product Filter */}
						{filteredProductList.length > 1 && (
							<Select
								variant="filled"
								value={productFilter}
								onChange={(e) =>
									setProductFilter(e.target.value)
								}
								size="xs"
								w="auto"
							>
								{filteredProductList.map(({ label, value }) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</Select>
						)}
					</DragHandle>
				</Flex>

				{/* Mobile: Title + grip on first row, Select on second row */}
				<Flex
					display={{ base: "flex", md: "none" }}
					direction="column"
					gap="2"
				>
					<DragHandle isDraggable={isDraggable}>
						<Flex
							fontSize="lg"
							fontWeight="semibold"
							align="center"
							gap="0.4em"
						>
							<LuActivity color="#3c83f6" />
							Business Overview
						</Flex>
					</DragHandle>
					{filteredProductList.length > 1 && (
						<Select
							variant="filled"
							value={productFilter}
							onChange={(e) => setProductFilter(e.target.value)}
							size="xs"
							w="100%"
						>
							{filteredProductList.map(({ label, value }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</Select>
					)}
				</Flex>
			</Flex>

			<Divider />

			<Flex
				direction={isSmallScreen ? "column-reverse" : "row-reverse"}
				align={isSmallScreen ? "center" : "flex-start"}
				gap="8"
			>
				<WaffleChart
					data={productWiseData}
					colors={COLORS}
					rows={isSmallScreen ? 3 : 10}
					cols={isSmallScreen ? 15 : 3}
					size="10px"
					gap="4px"
					animationDuration="0.2s"
					animationDelay="0.02s"
				/>

				<Grid
					templateColumns="repeat(auto-fit, minmax(130px, 1fr))"
					gap={{ base: "4", md: "8" }}
					w="100%"
				>
					{earningOverviewList
						.filter((item) => !item.hidden)
						.map(
							(item) =>
								item.value != 0 && (
									<Flex
										key={item.key}
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
										paddingLeft="8px"
										borderLeft="4px solid"
										borderColor="divider"
									>
										<Flex
											direction="column"
											align="flex-start"
										>
											{/* Value */}
											<Flex
												fontWeight="500"
												fontSize="1.3em"
												color="primary.DEFAULT"
											>
												<Skeleton isLoaded={!isLoading}>
													{item.type === "amount" ? (
														<Currency
															amount={item.value}
														/>
													) : (
														<span>
															{item.value}
														</span>
													)}
												</Skeleton>
											</Flex>
											{/* Label */}
											<Text
												fontSize="0.75em"
												textAlign="center"
												whiteSpace="nowrap"
												opacity="0.7"
											>
												<Skeleton isLoaded={!isLoading}>
													{item.label}
												</Skeleton>
											</Text>
										</Flex>
										{/* last Period */}
										{/* {item.lastPeriod !== 0 && (
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
													<Skeleton
														isLoaded={!isLoading}
													>
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
													</Skeleton>
												</Flex>
											</Flex>
											{item.variation && (
												<Flex gap="1" align="center">
													<Skeleton
														isLoaded={!isLoading}
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
													</Skeleton>
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
															<Skeleton
																isLoaded={
																	!isLoading
																}
															>
																{isNaN(
																	item.variation
																)
																	? item.variation
																	: `${item.variation}%`}
															</Skeleton>
														</Text>
														<Text>
															<Skeleton
																isLoaded={
																	!isLoading
																}
															>
																{parseFloat(
																	item.variation
																) > 0
																	? "Increase"
																	: "Decrease"}
															</Skeleton>
														</Text>
													</Flex>
												</Flex>
											)}
										</Flex>
									)} */}
									</Flex>
								)
						)}
				</Grid>
			</Flex>

			{/* eslint-disable-next-line no-warning-comments */}
			{/* TODO: Need IcoButton -- Download Reports */}
		</Flex>
	);
};

export default EarningOverview;
