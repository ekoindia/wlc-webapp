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
import { Icon, IconButtons } from "components";
import { useState } from "react";
import { BusinessDashboardTable } from "./BusinessDashboardTable";

const cardData = [
	{
		id: 1,
		icon: "refer",
		title: "Total Distributors",
		description: "317",
		percentage: "25%",
		statu: "Increase",
	},
	{
		id: 2,
		icon: "people",
		title: "Active Distributors",
		description: "220",
		percentage: "-11%",
		statu: "Decrese",
	},
	{
		id: 3,
		icon: "rupee_bg",
		title: "GTV",
		percentage: "2.2%",
		description: "148",
		statu: "Increase",
	},
	{
		id: 4,
		icon: "commission-percent",
		title: "Total RA Cases",
		percentage: "-1.9%",
		description: "07",
		statu: "Decrese",
	},
];

function Card({ title, description, icon, statu, percentage }) {
	return (
		<Flex
			borderRadius="10px"
			border="1px solid #E9EDF1"
			overflow="hidden"
			p={{ base: "10px", md: "20px 25px 20px 25px" }}
			bg="white"
			justifyContent={"space-between"}
			alignItems="center"
			minH="95px"
			minW="260"
		>
			{/* <Image src={""} alt={title} /> */}
			<Flex direction={"column"}>
				<Text fontWeight="medium" fontSize={"14px"} mt={2}>
					{title}
				</Text>

				<Flex alignItems={"center"} gap="15px">
					<Flex>
						<Text
							color="secondary.DEFAULT"
							fontSize="lg"
							fontWeight={"bold"}
							mt={2}
						>
							{description}
						</Text>
					</Flex>
					<Flex alignItems={"center"} gap="5px" mt={2}>
						<Flex
							w="100%"
							h="100%"
							color={statu === "Increase" ? "success" : "error"}
						>
							<Icon
								name={
									statu == "Increase"
										? "increase"
										: "decrease"
								}
								width="14px"
								h="8px"
							/>
						</Flex>
						<Flex>
							<Text
								color={
									statu === "Increase" ? "success" : "error"
								}
								fontSize="xs"
							>
								{percentage}
							</Text>
						</Flex>

						<Flex>
							<Text color="light" fontSize="xs">
								{statu}
							</Text>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
			<Flex>
				<Box
					bg="transparent linear-gradient(180deg, #1F5AA7 0%, #11299E 100%) 0% 0% no-repeat padding-box"
					h="50px"
					w="50px"
					borderRadius={"10px"}
					alignItems="center"
					justifyContent="center"
				>
					{" "}
					<Flex
						w="100%"
						h="100%"
						alignItems="center"
						justifyContent="center"
					>
						<Icon name={icon} color="white" width="27px" h="26px" />{" "}
					</Flex>
				</Box>
			</Flex>
		</Flex>
	);
}

const BusinessDashboard = () => {
	const successRateData = [
		{ name: "DMT", value: "24%" },
		{ name: "BBPS", value: "18%" },
		{ name: "AePS cashout", value: "38%" },
		{ name: "AePS mini statement", value: "11%" },
		{ name: "Account Verification", value: "9%" },
	];

	const [activeIndex, setActiveIndex] = useState(0);
	const [activeGtv, setActiveGtv] = useState(3);
	console.log("activeGtv", activeGtv);

	const onClick = (gtv) => {
		setActiveGtv(gtv);
	};

	const handleClick = (index) => {
		setActiveIndex(index);
	};

	// TODO: INTEGARTE APIs....
	const [temp] = useState(true);
	if (temp) return <Text fontSize="lg">Coming soon...</Text>;

	const EarningData = [
		{
			title: "GTV",
			count: "12 Cr",
			lastPeriod: "9 cr.",
			icon: "increase",
			percentage: "25%",
			stat: "Increase",
		},
		{
			title: "Transaction",
			count: "117 cr.",
			lastPeriod: "11.8",
			icon: "increase",
			percentage: "8%",
			stat: "Increase",
		},
		{
			title: "Active Agents",
			count: "1317",
			lastPeriod: "1319",
			icon: "decrease",
			percentage: "-1.8%",
			stat: "Decrease",
		},
		{
			title: "Inactive Agents",
			count: "18",
			lastPeriod: "17",
			icon: "increase",
			percentage: "2.2%",
			stat: "Increase",
		},
		{
			title: "Onboarded Agents",
			count: "6",
			lastPeriod: "5",
			icon: "increase",
			percentage: "0.2%",
			stat: "Increase",
		},
		{
			title: "RA Cases",
			count: "3",
			lastPeriod: "4",
			icon: "decrease",
			percentage: "-1.8%",
			stat: "Decrease	",
		},
	];

	return (
		<Flex direction={"column"} px={{ base: "20px", md: "0px" }}>
			{/* {console.log("cardData", cardData)} */}

			{/* CARD */}
			<Grid
				templateColumns="repeat(4, 4fr)"
				gap={5}
				overflowX="auto"
				css={{
					"&::-webkit-scrollbar": {
						width: "2px",
						height: "2px",
						// display: "none",
					},
					"&::-webkit-scrollbar-thumb": {
						background: "#cbd5e0",
						borderRadius: "2px",
					},
					// "&:hover::-webkit-scrollbar": {
					// 	display: "block",
					// },
				}}
			>
				{cardData.map((card) => (
					<GridItem key={card.id} colSpan={1}>
						<Card
							title={card.title}
							description={card.description}
							percentage={card.percentage}
							statu={card.statu}
							icon={card.icon}
							// imageUrl={card.imageUrl}
						/>
					</GridItem>
				))}
			</Grid>

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
						{EarningData.map((item, index) => (
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
										<Box
											w="100%"
											h="100%"
											color={
												item.stat === "Increase"
													? "success"
													: "error"
											}
										>
											<Icon
												name={
													item.stat == "Increase"
														? "arrow-increase"
														: "arrow-decrease"
												}
												width="14px"
												h="8px"
											/>
										</Box>
										<Box>
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
										</Box>

										<Box>
											<Text color="light" fontSize="xs">
												{item.stat}
											</Text>
										</Box>
									</Flex>
								</Flex>
							</Flex>
						))}
					</Stack>

					<Flex justifyContent={"center"} mt="40px">
						<IconButtons
							iconName="file-download"
							iconPos="left"
							title="Download Reports"
							iconStyle={{
								width: "14px",
								height: "14px",
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
							{successRateData.map((item, index) => (
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
							))}
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
							width: "14px",
							height: "14px",
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
