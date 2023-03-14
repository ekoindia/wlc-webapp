import React, { useEffect, useState } from "react";
import { Flex, Center, Text, Box } from "@chakra-ui/react";
import { Icon } from "components";
import { OnboardingDasboardTable } from "./OnboardingDasboardTable";

/**
 * A <OnboardingDashboard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardingDashboard></OnboardingDashboard>`
 */
// const OnboardingDashboard = ({ className = "", ...props }) => {
// const [count, setCount] = useState(0); // TODO: Edit state as required

// useEffect(() => {
// 	// TODO: Add your useEffect code here and update dependencies as required
// }, []);

const cardData = [
	{
		title: "Partial ",
		status: "account",
		count: "550",
	},
	{
		id: 2,
		title: "Onboarding ",
		status: "funnel",
		count: "12",
	},
	{
		id: 3,
		title: "Businessdetails ",
		status: "captured",
		count: "40",
	},
	{
		id: 4,
		title: "Aadhaar ",
		status: "captured",
		count: "20",
	},
	{
		id: 5,
		title: "PAN ",
		status: "captured",
		count: "67",
	},
	{
		id: 6,
		title: "eKYC ",
		status: "completed",
		count: "17",
	},
	{
		id: 7,
		title: "Agreement ",
		status: "signed",
		count: "121",
	},
	{
		id: 8,
		title: "Onboarded",
		status: "",
		count: "121",
	},
	{
		id: 9,
		title: "Subscription ",
		status: "pending",
		count: "63",
	},
	{
		id: 10,
		title: "Nontransacting ",
		status: "live",
		count: "63",
	},
];

function Card({ title, status, count, activeCardIndex, index }) {
	return (
		<Flex
			minH={{ base: "60px", lg: "90px" }}
			minW={{ base: "138", lg: "145px" }}
			border="1px solid #E9EDF1"
			borderColor={
				activeCardIndex === index ? "secondary.DEFAULT" : "grey.300"
			}
			boxShadow={
				activeCardIndex === index ? "0px 3px 10px #1F5AA733" : "none"
			}
			bg={"white"}
			borderRadius={"10px"}
		>
			<Flex direction={"column"} p="10px">
				<Flex direction={{ base: "row", md: "column" }}>
					<Text
						fontSize={{ base: "xs", md: "sm" }}
						fontWeight={"medium"}
					>
						{title}
					</Text>
					<Text
						fontSize={{ base: "xs", md: "sm" }}
						fontWeight={"medium"}
					>
						{status}
					</Text>
				</Flex>
				<Flex>
					<Text
						fontSize={{ base: "sm", md: "lg" }}
						fontWeight="bold"
						color="accent.DEFAULT"
					>
						{count}
					</Text>
				</Flex>
			</Flex>
		</Flex>
	);
}

const OnboardingDashboard = (props) => {
	const [activeCardIndex, setActiveCardIndex] = useState(null);
	console.log("activeCardIndex", activeCardIndex);

	const handleCardClick = (index) => {
		setActiveCardIndex(index);
	};

	return (
		<Flex direction={"column"}>
			<Flex
				justifyContent={"space-evenly"}
				minH="175px"
				w="100%"
				bg={{ base: "none", md: "white" }}
				px="20px"
				border={{ base: "none", md: " 1px solid #E9EDF1" }}
				borderRadius={"10px"}
				direction={"column"}
			>
				<Flex alignItems={"center"} gap="15px">
					<Center
						alignItems={"center"}
						width={{
							base: "18px",
							sm: "12px",

							lg: "14px",
							xl: "16px",
							"2xl": "22px",
						}}
						height={{
							base: "11.5px",
							sm: "12px",

							lg: "14px",
							xl: "16px",
							"2xl": "22px",
						}}
					>
						<Icon name="filter" style={{ width: "100%" }} />
					</Center>
					<Text
						fontSize={{ base: "sm", md: "lg" }}
						fontWeight={"semibold"}
					>
						Filter using onboarding status
					</Text>
				</Flex>

				<Flex gap="10px" overflowX="auto" p="5px">
					{cardData.map((card, index) => (
						<Box key={index} onClick={() => handleCardClick(index)}>
							<Card
								title={card.title}
								status={card.status}
								count={card.count}
								activeCardIndex={activeCardIndex}
								index={index}
							/>
						</Box>
					))}
				</Flex>
			</Flex>
			<Box
				direction={"column"}
				bg="white"
				// px="20px"
				mt={{ base: "0px", md: "20px" }}
				border=" 1px solid #E9EDF1"
				borderRadius={"10px"}
				px="20px"
				mx={{ base: "20px", md: "0px" }}
			>
				<Box py="30px">
					{" "}
					<Text
						fontSize={{ base: "md", lg: "xl" }}
						fontWeight="semibold"
					>
						Onboarded Merchants
					</Text>
				</Box>
				<OnboardingDasboardTable />
			</Box>
		</Flex>
	);
};

export default OnboardingDashboard;
