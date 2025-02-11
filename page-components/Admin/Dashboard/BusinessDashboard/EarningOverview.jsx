import { Divider, Flex, Grid, Select, Text } from "@chakra-ui/react";
import { Currency, Icon } from "components";
import { Endpoints } from "constants";
import { useApiFetch } from "hooks";
import { useEffect, useState } from "react";

/**
 * A EarningOverview page-component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @param prop.data
 * @param prop.filters
 * @param prop.onFilterChange
 * @param prop.currTab
 * @param prop.productFilterList
 * @param prop.dateFrom
 * @param prop.dateTo
 * @example	`<EarningOverview></EarningOverview>`
 */
const EarningOverview = ({ dateFrom, dateTo, productFilterList }) => {
	const [requestPayload, setRequestPayload] = useState({});
	const [productFilter, setProductFilter] = useState("81");
	const [earningOverviewData, setEarningOverviewData] = useState({});

	// MARK: Fetching Product Overview Data
	const [fetchProductOverviewData] = useApiFetch(Endpoints.TRANSACTION_JSON, {
		body: {
			interaction_type_id: 682,
			requestPayload: requestPayload,
		},
		onSuccess: (res) => {
			const _data = res?.data?.dashboard_object?.products_overview || [];
			setEarningOverviewData(_data);
		},
	});

	useEffect(() => {
		if (dateFrom && dateTo) {
			setRequestPayload(() => ({
				products_overview: {
					datefrom: dateFrom,
					dateto: dateTo,
					typeid: productFilter,
				},
			}));
		}
	}, [dateFrom, dateTo, productFilter]);

	useEffect(() => {
		if (dateFrom && dateTo) {
			fetchProductOverviewData();
		}
	}, [requestPayload]);

	const onFilterChange = (typeid) => {
		setProductFilter(typeid);
	};

	const earningOverviewList = [
		{
			key: "gtv",
			label: "GTV",
			lastPeriod: earningOverviewData?.gtv?.lastPeriod,
			value: earningOverviewData?.gtv?.amount,
			type: "amount",
			variation: earningOverviewData?.gtv?.increaseOrDecrease,
		},
		{
			key: "transactions",
			label: "Transactions",
			lastPeriod: earningOverviewData?.transactions?.lastPeriod,
			value: earningOverviewData?.transactions?.transactions,
			type: "number",
			variation: earningOverviewData?.transactions?.increaseOrDecrease,
		},
		{
			key: "activeAgents",
			label: "Active Agents",
			lastPeriod: earningOverviewData?.activeAgents?.lastPeriod,
			value: earningOverviewData?.activeAgents?.active,
			type: "number",
			variation: earningOverviewData?.activeAgents?.increaseOrDecrease,
		},
		{
			key: "onboardedAgents",
			label: "Onboarded Agents",
			lastPeriod: earningOverviewData?.onboardedAgents?.lastPeriod,
			value: earningOverviewData?.onboardedAgents?.onboarded,
			type: "number",
			variation: earningOverviewData?.onboardedAgents?.increaseOrDecrease,
		},
		{
			key: "raCases",
			label: "Pending Transactions",
			lastPeriod: earningOverviewData?.raCases?.lastPeriod,
			value: earningOverviewData?.raCases?.raCases,
			type: "number",
			variation: earningOverviewData?.raCases?.increaseOrDecrease,
		},
		{
			key: "commissionDue",
			label: "Commission Due",
			lastPeriod: earningOverviewData?.commissionDue?.lastPeriod,
			value: earningOverviewData?.commissionDue?.commissionDue,
			type: "amount",
			variation: earningOverviewData?.commissionDue?.increaseOrDecrease,
		},
	];

	return (
		<Flex
			direction="column"
			bg="white"
			p="20px 20px 30px"
			borderRadius="10"
			border="basic"
			gap="3"
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
						onChange={(e) => onFilterChange(e.target.value)}
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
			<Divider display={{ base: "none", md: "block" }} />
			<Flex h="100%" w="100%" align="center">
				<Grid
					templateColumns={{
						base: "1fr",
						md: "repeat(auto-fit,minmax(160px,1fr))",
					}}
					gap={{ base: "2", md: "8" }}
					w="100%"
				>
					{earningOverviewList?.map(
						(item) =>
							item.value && (
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
												<Currency amount={item.value} />
											) : (
												<span>{item.value}</span>
											)}
										</Flex>
									</Flex>
									{item.lastPeriod && (
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
													{item.type === "amount" ? (
														<Currency
															amount={
																item.lastPeriod
															}
														/>
													) : (
														<span>
															{item.lastPeriod}
														</span>
													)}
												</Flex>
											</Flex>
											<Flex gap="1" align="center">
												{item.variation ? (
													<>
														<Icon
															name={
																item.variation >
																0
																	? "arrow-increase"
																	: "arrow-decrease"
															}
															color={
																item.variation >
																0
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
																	item.variation >
																	0
																		? "success"
																		: "error"
																}
															>
																{item.variation}
																%
															</Text>
															<Text>
																{item.variation >
																0
																	? "Increase"
																	: "Decrease"}
															</Text>
														</Flex>
													</>
												) : null}
											</Flex>
										</Flex>
									)}
								</Flex>
							)
					)}
				</Grid>
			</Flex>
			{/*TODO: Need IcoButton -- Download Reports */}
		</Flex>
	);
};

export default EarningOverview;
