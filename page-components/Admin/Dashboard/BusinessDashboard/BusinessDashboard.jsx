import {
	Box,
	Divider,
	Flex,
	Grid,
	GridItem,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { BusinessDashboardTable, BusinessDashboardTopPanel } from ".";

import { IconButtons } from "components";
import { useState } from "react";

/**
 * A <BusinessDashboard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<BusinessDashboard></BusinessDashboard>`
 */
const BusinessDashboard = ({ data }) => {
	console.log("[BusinessDashboard] data", data);
	const { topPanel, earningOverview, topMerchants, successRate } = data;
	console.log("successRate", successRate);
	console.log("topMerchants", topMerchants);
	console.log("earningOverview", earningOverview);
	console.log("topPanel", topPanel);

	const [activeIndex, setActiveIndex] = useState(0);
	const [activeGtv, setActiveGtv] = useState(3);
	console.log("activeGtv", activeGtv);

	const onClick = (gtv) => {
		setActiveGtv(gtv);
	};

	const handleClick = (index) => {
		setActiveIndex(index);
	};

	// // TODO: INTEGARTE APIs....
	// const [temp] = useState(true);
	// if (temp) return <Text fontSize="lg">Coming soon...</Text>;

	return (
		<Flex direction="column">
			<BusinessDashboardTopPanel data={topPanel} />

			{/* CENTER ITEM */}
			<Grid
				templateColumns={{
					base: "repeat(auto-fit,minmax(280px,1fr))",
					md: "1.8fr 1fr",
					xl: "2.5fr 1fr",
				}}
				gap={"1%"}
				minH="390px"
				mt="30px"
				flexDir={{ base: "column", md: "row" }}
			>
				<GridItem
					bg="white"
					p={{ base: "15px", md: "30px 20px 30px 20px" }}
					borderRadius={"10px"}
					border=" 1px solid #E9EDF1"
					w="100%"
				>
					<Flex
						justifyContent="space-between"
						flexDirection={{ base: "column", lg: "row" }}
					>
						<Flex>
							<Text fontSize={"xl"} fontWeight="semibold">
								Earning Overview
							</Text>
						</Flex>
						<Flex gap="15px" mt={{ base: "25px", lg: "0px" }}>
							<Flex
								w="100px"
								h="40px"
								borderRadius="20"
								alignItems="center"
								justifyContent="center"
								// bg="divider"
								bg={
									activeIndex === 0
										? "accent.DEFAULT"
										: "divider"
								}
								color={activeIndex === 0 ? "white" : "dark"}
								_hover={{
									bg: "accent.DEFAULT",
									color: "white",
								}}
								onClick={() => handleClick(0)}
							>
								<Text
									color={"inherit"}
									fontSize={{ base: "sm", md: "md" }}
								>
									Cashout
								</Text>
							</Flex>
							<Flex
								w="100px"
								h="40px"
								borderRadius="20"
								alignItems="center"
								justifyContent="center"
								// bg="divider"
								bg={
									activeIndex === 1
										? "accent.DEFAULT"
										: "divider"
								}
								color={activeIndex === 1 ? "white" : "dark"}
								_hover={{
									bg: "accent.DEFAULT",
									color: "white",
								}}
								onClick={() => handleClick(1)}
							>
								<Text
									color={"inherit"}
									fontSize={{ base: "sm", md: "md" }}
								>
									DMT
								</Text>
							</Flex>
							<Flex
								w="100px"
								h="40px"
								borderRadius="20"
								alignItems="center"
								justifyContent="center"
								bg={
									activeIndex === 2
										? "accent.DEFAULT"
										: "divider"
								}
								color={activeIndex === 2 ? "white" : "dark"}
								_hover={{
									bg: "accent.DEFAULT",
									color: "white",
								}}
								onClick={() => handleClick(2)}
							>
								<Text
									color={"inherit"}
									fontSize={{ base: "sm", md: "md" }}
								>
									BBPS
								</Text>
							</Flex>
						</Flex>
					</Flex>
					<Divider my={{ base: "20px", md: "20px", xl: "40px" }} />

					<Stack
						direction={{ base: "column", xl: "row" }}
						divider={<StackDivider borderColor="divider" />}
						w="100%"
						gap={{
							base: "10px",
							md: "5px",
							lg: "5px",
							xl: "5px",
							"2xl": "30px",
						}}
						wrap="wrap	"
					>
						{/* {EarningData.map((item, index) => (
							<Flex
								key={index}
								direction={{ base: "row", xl: "column" }}
								// alignItems="center"
								justifyContent={"space-between"}
								textAlign={{ base: "none", xl: "center" }}

								// alignContent="center"
							>
								<Flex
									flexDir={{ base: "column", xl: "none" }}
									rowGap="10px"
								>
									<Box>
										<Text fontSize="sm">{item.title}</Text>
									</Box>
									<Box>
										<Text
											fontSize={{
												base: "",
												xl: "lg",
												"2xl": "2xl",
											}}
											fontWeight="bold"
											color="accent.DEFAULT"
										>
											{item.count}
										</Text>
									</Box>
								</Flex>

								<Flex
									flexDir={{ base: "column", xl: "none" }}
									rowGap="10px"
								>
									<Box>
										<Text fontSize={"xs"}>
											Last Period&nbsp;{item.lastPeriod}
										</Text>
									</Box>
									<Flex
										alignItems={"center"}
										gap="7px"
										mt={2}
									>
										<Icon
											color={
												item.stat === "Increase"
													? "success"
													: "error"
											}
											name={
												item.stat == "Increase"
													? "arrow-increase"
													: "arrow-decrease"
											}
											size="12px"
											// h="8px"
										/>
										<Text
											color={
												item.stat === "Increase"
													? "success"
													: "error"
											}
											fontSize="xs"
										>
											{item.percentage}
										</Text>

										<Text color="light" fontSize="xs">
											{item.stat}
										</Text>
									</Flex>
								</Flex>
							</Flex>
						))} */}
					</Stack>

					<Flex justifyContent={"center"} mt="40px">
						<IconButtons
							iconName="file-download"
							iconPos="left"
							title="Download Reports"
							iconStyle={{
								size: "14px",
							}}
							textStyle={{
								fontSize: "16px",
							}}
						/>
					</Flex>
				</GridItem>

				<GridItem
					bg="white"
					p="30px 20px 30px 20px"
					borderRadius={"10px"}
					border=" 1px solid #E9EDF1"
					w={{ base: "100%", md: "100%" }}
				>
					<Flex>
						<Text fontSize={"xl"} fontWeight="semibold" mb="16px">
							Success Rate
						</Text>
					</Flex>
					<Divider borderColor="divider" />

					<Flex>
						<Stack
							direction={"column"}
							divider={<StackDivider borderColor="divider" />}
							mt={"5"}
							fontSize={{ base: 14, md: 12, lg: 14 }}
							w="100%"
							gap="8px"
						>
							{/* {successRateData.map((item, index) => (
								<Flex
									key={index}
									justifyContent="space-between"
								>
									<Flex>
										<Text fontSize={"16px"} color="dark">
											{item.name}
										</Text>
									</Flex>
									<Flex>
										<Text
											fontSize={"16px"}
											color="accent.DEFAULT"
											fontWeight={"bold"}
										>
											{item.value}
										</Text>
									</Flex>
								</Flex>
							))} */}
						</Stack>
					</Flex>
				</GridItem>
			</Grid>

			<Box
				bg="white"
				mt="30px"
				p="10px"
				border=" 1px solid #E9EDF1"
				borderRadius={"10px"}
			>
				<Flex
					justifyContent="space-between"
					py={{ base: "0px", md: "30px" }}
					flexDirection={{ base: "column", md: "row" }}
				>
					<Flex>
						<Text fontSize={"xl"} fontWeight="semibold">
							GTV wise Top Merchants
						</Text>
					</Flex>
					<Flex gap="15px" mt={{ base: "25px", md: "0px" }}>
						<Flex
							w="100px"
							h="40px"
							borderRadius="20"
							alignItems="center"
							justifyContent="center"
							// bg="divider"
							bg={
								activeIndex === 3 ? "accent.DEFAULT" : "divider"
							}
							color={activeIndex === 3 ? "white" : "dark"}
							_hover={{
								bg: "accent.DEFAULT",
								color: "white",
							}}
							onClick={() => onClick(3)}
						>
							<Text
								color={"inherit"}
								fontSize={{ base: "sm", md: "md" }}
							>
								Cashout
							</Text>
						</Flex>
						<Flex
							w="100px"
							h="40px"
							borderRadius="20"
							alignItems="center"
							justifyContent="center"
							// bg="divider"
							// bg="divider"
							bg={
								activeIndex === 4 ? "accent.DEFAULT" : "divider"
							}
							color={activeIndex === 4 ? "white" : "dark"}
							_hover={{
								bg: "accent.DEFAULT",
								color: "white",
							}}
							onClick={() => onClick(4)}
						>
							<Text
								color={"inherit"}
								fontSize={{ base: "sm", md: "md" }}
							>
								DMT
							</Text>
						</Flex>
						<Flex
							w="100px"
							h="40px"
							borderRadius="20"
							alignItems="center"
							justifyContent="center"
							// bg="divider"
							bg={
								activeIndex === 5 ? "accent.DEFAULT" : "divider"
							}
							color={activeIndex === 5 ? "white" : "dark"}
							_hover={{
								bg: "accent.DEFAULT",
								color: "white",
							}}
							onClick={() => onClick(5)}
						>
							<Text
								color={"inherit"}
								fontSize={{ base: "sm", md: "md" }}
							>
								BBPS
							</Text>
						</Flex>
					</Flex>
				</Flex>
				<BusinessDashboardTable />
				<Flex justifyContent={"center"} mt="40px">
					<IconButtons
						iconName="file-download"
						iconPos="left"
						title="Download Reports"
						iconStyle={{
							size: "14px",
						}}
						textStyle={{
							fontSize: "16px",
						}}
					/>
				</Flex>
			</Box>
		</Flex>
	);
};

export default BusinessDashboard;
