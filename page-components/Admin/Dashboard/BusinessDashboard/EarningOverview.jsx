import { Divider, Flex, Grid, Text } from "@chakra-ui/react";
import { Currency, Icon } from "components";

/**
 * A EarningOverview page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<EarningOverview></EarningOverview>`
 */
const EarningOverview = ({ data }) => {
	const earningOverviewList = [
		{
			key: "gtv",
			label: "GTV",
			lastPeriod: data?.gtv?.lastPeriod,
			value: data?.gtv?.amount,
			type: "amount",
			variation: data?.gtv?.increaseOrDecrease,
		},
		{
			key: "transactions",
			label: "Transactions",
			lastPeriod: data?.transactions?.lastPeriod,
			value: data?.transactions?.transactions,
			type: "number",
			variation: data?.transactions?.increaseOrDecrease,
		},
		{
			key: "activeAgents",
			label: "Active Agents",
			lastPeriod: data?.activeAgents?.lastPeriod,
			value: data?.activeAgents?.active,
			type: "number",
			variation: data?.activeAgents?.increaseOrDecrease,
		},
		{
			key: "onboardedAgents",
			label: "Onboarded Agents",
			lastPeriod: data?.onboardedAgents?.lastPeriod,
			value: data?.onboardedAgents?.onboarded,
			type: "number",
			variation: data?.onboardedAgents?.increaseOrDecrease,
		},
		// {
		// 	key: "pendingTransactions",
		// 	label: "Pending Transactions",
		// 	lastPeriod: data?.pendingTransactions?.lastPeriod,
		// 	value: data?.pendingTransactions?.pendingTransactions,
		// 	type: "number",
		// 	variation: data?.pendingTransactions?.increaseOrDecrease,
		// },
		{
			key: "raCases",
			label: "Pending Transactions",
			lastPeriod: data?.raCases?.lastPeriod,
			value: data?.raCases?.raCases,
			type: "number",
			variation: data?.raCases?.increaseOrDecrease,
		},
		{
			key: "commissionDue",
			label: "Commission Due (only DMT)",
			lastPeriod: data?.commissionDue?.lastPeriod,
			value: data?.commissionDue?.commissionDue,
			type: "amount",
			variation: data?.commissionDue?.increaseOrDecrease,
		},
	];
	return (
		<Flex
			direction="column"
			bg="white"
			p="30px 20px"
			borderRadius="10"
			border="basic"
			gap="3"
			w="100%"
		>
			<Flex
				direction={{ base: "column", md: "row" }}
				justify="space-between"
			>
				<Text fontSize="xl" fontWeight="semibold">
					Earning Overview
				</Text>
				{/* TODO: Need Pills */}
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
										<Text fontSize="sm" textAlign="center">
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
