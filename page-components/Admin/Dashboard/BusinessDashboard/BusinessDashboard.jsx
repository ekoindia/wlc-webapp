import React from "react";

import {
	Grid,
	GridItem,
	Box,
	Text,
	Flex,
	Stack,
	StackDivider,
	Divider,
	VStack,
} from "@chakra-ui/react";
import { Icon, IconButtons } from "components";
import { BusinessDashboardTable } from "./BusinessDashboardTable";

const cardData = [
	{
		id: 1,
		icon: "refer",
		title: "Total Distributors",
		description: "317",
		percentage: "25%",
		statu: "Increase",
		// imageUrl: "https://via.placeholder.com/150",
	},
	{
		id: 2,
		icon: "people",
		title: "Active Distributors",
		description: "220",
		percentage: "-11%",
		statu: "Decrese",
		// imageUrl: "https://via.placeholder.com/150",
	},
	{
		id: 3,
		icon: "rupee_bg",
		title: "GTV",
		percentage: "2.2%",
		description: "1,48,000",
		statu: "Increase",
		// imageUrl: "https://via.placeholder.com/150",
	},
	{
		id: 4,
		icon: "commission-percent",
		title: "Total RA Cases",
		percentage: "-1.9%",
		description: "07",
		statu: "Decrese",
		// imageUrl: "https://via.placeholder.com/150",
	},
];

function Card({ title, description, icon, statu, percentage }) {
	return (
		<Flex
			borderRadius="10px"
			border="1px solid #E9EDF1"
			overflow="hidden"
			p={"20px 25px 20px 25px"}
			bg="white"
			justifyContent={"space-between"}
			alignItems="center"
			minH="95px"
			minW="247"
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
			lastPeriod: "110.8 cr",
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
		<>
			{console.log("cardData", cardData)}

			{/* CARD */}
			<Grid templateColumns="repeat(4, 1fr)" gap={5}>
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
			<Grid templateColumns="69% 30%" gap={"1%"} minH="390px" mt="30px">
				<GridItem
					bg="white"
					p="30px 20px 30px 20px"
					borderRadius={"10px"}
					border=" 1px solid #E9EDF1"
				>
					<Flex justifyContent="space-between">
						<Flex>
							<Text fontSize={"xl"} fontWeight="semibold">
								Earning Overview
							</Text>
						</Flex>
						<Flex gap="15px">
							<Flex
								w="100px"
								h="40px"
								borderRadius="20"
								alignItems="center"
								justifyContent="center"
								bg="divider"
								_active={{
									bg: "accent.DEFAULT",
								}}
							>
								<Text
									color="dark"
									_active={{
										color: "white",
									}}
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
								bg="divider"
								_active={{
									bg: "accent.DEFAULT",
								}}
							>
								<Text
									color="dark"
									_active={{
										color: "white",
									}}
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
								bg="divider"
								_active={{}}
							>
								<Text>BBPS</Text>
							</Flex>
						</Flex>
					</Flex>
					<Divider my="40px" />

					<Stack
						direction={{ base: "column", md: "row" }}
						divider={<StackDivider borderColor="divider" />}
						w="100%"
						gap={{ base: "10px", md: "30px" }}
					>
						{EarningData.map((item, index) => (
							<Flex
								key={index}
								direction={"column"}
								alignItems="center"
							>
								<Flex>
									<Text fontSize="sm">{item.title}</Text>
								</Flex>
								<Flex>
									<Text
										fontSize={"2xl"}
										fontWeight="bold"
										color="accent.DEFAULT"
									>
										{item.count}
									</Text>
								</Flex>
								<Flex>
									<Text fontSize={"xs"}>
										Last Period&nbsp;{item.lastPeriod}
									</Text>
								</Flex>
								<Flex alignItems={"center"} gap="7px" mt={2}>
									<Flex
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
									</Flex>
									<Flex>
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
									</Flex>

									<Flex>
										<Text color="light" fontSize="xs">
											{item.stat}
										</Text>
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
				>
					<Flex>
						<Text fontSize={"xl"} fontWeight="semibold">
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
				p="20px"
				border="border: 1px solid #E9EDF1"
				borderRadius={"10px"}
			>
				<Flex justifyContent="space-between" py="30px">
					<Flex>
						<Text fontSize={"xl"} fontWeight="semibold">
							GTV wise Top Merchants
						</Text>
					</Flex>
					<Flex gap="15px">
						<Flex
							w="100px"
							h="40px"
							borderRadius="20"
							alignItems="center"
							justifyContent="center"
							bg="divider"
							_active={{
								bg: "accent.DEFAULT",
							}}
						>
							<Text
								color="dark"
								_active={{
									color: "white",
								}}
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
							bg="divider"
							_active={{
								bg: "accent.DEFAULT",
							}}
						>
							<Text
								color="dark"
								_active={{
									color: "white",
								}}
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
							bg="divider"
							_active={{}}
						>
							<Text>BBPS</Text>
						</Flex>
					</Flex>
				</Flex>
				<BusinessDashboardTable />
			</Box>
		</>
	);
};

export default BusinessDashboard;
