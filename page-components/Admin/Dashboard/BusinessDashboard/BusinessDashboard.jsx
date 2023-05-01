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
import { BusinessDashboardData } from "../dasboard.mocks";
import { BusinessDashboardTable } from "./BusinessDashboardTable";

function Card({ title, totalDistributers, icon, increaseOrDecrease }) {
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
							{totalDistributers}
						</Text>
					</Flex>
					<Flex alignItems={"center"} gap="5px" mt={2}>
						<Icon
							color={increaseOrDecrease > 0 ? "success" : "error"}
							name={
								increaseOrDecrease > 0
									? "increase"
									: increaseOrDecrease < 0
									? "decrease"
									: ""
							}
							width="14px"
							h="8px"
						/>

						<Flex>
							<Text
								color={
									increaseOrDecrease > 0
										? "success"
										: increaseOrDecrease < 0
										? "error"
										: ""
								}
								fontSize="xs"
							>
								{increaseOrDecrease}%
							</Text>
						</Flex>

						<Flex>
							<Text color="light" fontSize="xs">
								{increaseOrDecrease > 0
									? "Increase"
									: increaseOrDecrease < 0
									? "Decrease"
									: ""}
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
	const [activeIndex, setActiveIndex] = useState(0);
	const [activeGtv, setActiveGtv] = useState(0);
	// const [topPanel, setTopPanel] = useState(0);
	// const [earningOverview, setEarningOverview] = useState(0);
	// const [successRate, setSuccessRate] = useState(0);
	// const { userData } = useUser();

	const data = BusinessDashboardData;

	// let headers = {
	// 	"tf-req-uri-root-path": "/ekoicici/v1",
	// 	"tf-req-uri": `/network/agents/C`,
	// 	"tf-req-method": "GET",
	// };

	// const { error, isLoading, mutate } = useRequest({
	// 	method: "POST",
	// 	baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
	// 	headers: { ...headers },
	// });

	// useEffect(() => {
	// 	mutate(
	// 		process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
	// 		headers
	// 	);
	// },
	// [headers["tf-req-uri"]]);

	const topPanel = data[0]?.data?.dashboard_details[0]?.topPanel ?? [];
	const topPanelData = Object.entries(topPanel).map(([key, value]) => ({
		id: key,
		title: key.toUpperCase(),
		value:
			value.totalDistributers ||
			value.grossTransactionValue ||
			value.raCases ||
			value.activeDistributers,
		increaseOrDecrease: value.increaseOrDecrease,
	}));
	const earningOverview =
		data[0]?.data?.dashboard_details[0]?.earningOverview ?? [];
	const successRate = data[0]?.data?.dashboard_details[0]?.successRate ?? [];
	const tableData = data[0]?.data?.dashboard_details[0]?.topMerchants ?? [];
	const earningOverviewData = Object.entries(earningOverview).map(
		([key, value]) => ({
			title: key,
			count:
				value.amount ||
				value.transactions ||
				value.active ||
				value.onboarded ||
				value.raCases,
			lastPeriod: `Last Period ${value.lastPeriod}`,
			percentage: `${value.increaseOrDecrease}%`,
			status:
				value.increaseOrDecrease > 0
					? "Increase"
					: value.increaseOrDecrease < 0
					? "Decrease"
					: null,
		})
	);

	const onClick = (index) => {
		setActiveGtv(index);
	};
	const handleClick = (index) => {
		setActiveIndex(index);
	};
	return (
		<Flex direction={"column"} px={{ base: "20px", md: "0px" }}>
			{/*<========================= Top Pannel ==============================>*/}
			<Grid templateColumns="repeat(4, 4fr)" gap={5} overflowX="auto">
				{topPanelData.map((card) => (
					<GridItem key={card.id} colSpan={1}>
						<Card
							title={card.title}
							totalDistributers={card.value}
							increaseOrDecrease={card.increaseOrDecrease}
							icon={card.icon}
						/>
					</GridItem>
				))}
			</Grid>

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

					{/* <===================Earning Overview==================> */}

					<Stack
						direction={{ base: "column", xl: "row" }}
						divider={<StackDivider borderColor="divider" />}
						w="100%"
						gap={{
							base: "10px",
							md: "5px",
							lg: "5px",
							xl: "10px",
							"2xl": "50px",
						}}
						wrap="wrap	"
					>
						{earningOverviewData.map((item, index) => (
							<Flex
								key={index}
								direction={{ base: "row", xl: "column" }}
								justifyContent={"space-between"}
								textAlign={{ base: "none", xl: "center" }}
							>
								<Flex
									flexDir={{ base: "column", xl: "none" }}
									rowGap="10px"
								>
									<Box>
										<Text fontSize="sm">
											{item.title
												.charAt(0)
												.toUpperCase() +
												item.title.slice(1)}
										</Text>
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
											{item.lastPeriod}
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
												item.status === "Increase"
													? "success"
													: "error"
											}
										>
											<Icon
												name={
													item.status === "Increase"
														? "arrow-increase"
														: item.status ===
														  "Decrease"
														? "arrow-decrease"
														: ""
												}
												width="14px"
												h="8px"
											/>
										</Box>
										<Box>
											<Text
												color={
													item.status === "Increase"
														? "success"
														: item.status ===
														  "Dncrease"
														? "error"
														: ""
												}
												fontSize="xs"
											>
												{item.percentage}
											</Text>
										</Box>
										<Box>
											<Text color="light" fontSize="xs">
												{item.status}
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
								fontSize: "md",
							}}
						/>
					</Flex>
				</GridItem>

				{/* <============= Success Rate Card======================> */}
				<GridItem
					bg="white"
					p="30px 20px 30px 20px"
					borderRadius={"10px"}
					border=" 1px solid #E9EDF1"
					w={"100%"}
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
							{Object.entries(successRate).map(([key, value]) => (
								<Flex key={key} justifyContent="space-between">
									<Flex>
										{key.charAt(0).toUpperCase() +
											key.slice(1)}
									</Flex>
									<Flex>
										<Text
											fontSize="16px"
											color="accent.DEFAULT"
											fontWeight="bold"
										>
											{value.Percentage}%
										</Text>
									</Flex>
								</Flex>
							))}{" "}
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
				{/* <=============================== Tags for Table  Cashout DMT BBPS=============================> */}
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
							bg={activeGtv === 0 ? "accent.DEFAULT" : "divider"}
							color={activeGtv === 0 ? "white" : "dark"}
							_hover={{
								bg: "accent.DEFAULT",
								color: "white",
							}}
							onClick={() => onClick(0)}
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
							bg={activeGtv === 1 ? "accent.DEFAULT" : "divider"}
							color={activeGtv === 1 ? "white" : "dark"}
							_hover={{
								bg: "accent.DEFAULT",
								color: "white",
							}}
							onClick={() => onClick(1)}
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
							bg={activeGtv === 2 ? "accent.DEFAULT" : "divider"}
							color={activeGtv === 2 ? "white" : "dark"}
							_hover={{
								bg: "accent.DEFAULT",
								color: "white",
							}}
							onClick={() => onClick(2)}
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

				{/* <======================= Table =============================> */}
				<BusinessDashboardTable tableData={tableData} />

				{/* <================Download Button===============> */}
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
