import React from "react";
import Head from "next/head";
import { Grid, GridItem, Box, Text, Flex } from "@chakra-ui/react";
import { Layout, Icon } from "components";

const cardData = [
	{
		id: 1,
		icon: "refer",
		title: "Total Distributors",
		description: "317",
		statu: "increment",
		// imageUrl: "https://via.placeholder.com/150",
	},
	{
		id: 2,
		icon: "people",
		title: "Active Distributors",
		description: "220",
		statu: "increment",
		// imageUrl: "https://via.placeholder.com/150",
	},
	{
		id: 3,
		icon: "rupee_bg",
		title: "GTV",
		description: "1,48,000",
		statu: "increment",
		// imageUrl: "https://via.placeholder.com/150",
	},
	{
		id: 4,
		icon: "commission-percent",
		title: "Total RA Cases",
		description: "07",
		statu: "increment",
		// imageUrl: "https://via.placeholder.com/150",
	},
];

function Card({ title, description, icon, statu }) {
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
						<Flex w="100%" h="100%">
							<Icon
								color="success"
								name={
									statu == "increment"
										? "increase"
										: "decrement"
								}
								// color="white"
								width="14px"
								h="8px"
							/>
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

const Dashboard = () => {
	return (
		<>
			{console.log("cardData", cardData)}
			<Head>
				<title>Dashboard | Eko API Marketplace</title>
			</Head>
			<Layout>
				{/* CARD */}
				<Grid templateColumns="repeat(4, 1fr)" gap={5}>
					{cardData.map((card) => (
						<GridItem key={card.id} colSpan={1}>
							<Card
								title={card.title}
								description={card.description}
								statu={card.statu}
								icon={card.icon}
								// imageUrl={card.imageUrl}
							/>
						</GridItem>
					))}
				</Grid>

				{/* CENTER ITEM */}
				<Grid
					templateColumns="69% 29%"
					gap={"2%"}
					minH="390px"
					mt="30px"
				>
					<GridItem bg="white">Column 1</GridItem>
					<GridItem bg="white">Column 2</GridItem>
				</Grid>
			</Layout>
		</>
	);
};

export default Dashboard;
