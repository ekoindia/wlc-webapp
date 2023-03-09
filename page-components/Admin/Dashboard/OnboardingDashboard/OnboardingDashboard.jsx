import React, { useEffect, useState } from "react";
import { Flex, Center, Text, Box } from "@chakra-ui/react";
import { Icon } from "components";

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
		title: "Business details ",
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
		title: "Non transacting ",
		status: "live",
		count: "63",
	},
];

function Card({ title, status, count }) {
	return (
		<Flex
			minH="90px"
			minW="148px"
			border="1px solid #E9EDF1"
			bg="white"
			borderRadius={"10px"}
		>
			<Flex direction={"column"} p="10px">
				<Text>{title}</Text>
				<Text>{status}</Text>
				<Text>{count}</Text>
			</Flex>
		</Flex>
	);
}

const OnboardingDashboard = () => {
	return (
		<Flex>
			<Flex
				justifyContent={"space-evenly"}
				minH="175px"
				w="100%"
				bg="white"
				p="20px"
				border=" 1px solid #E9EDF1"
				borderRadius={"10px"}
				direction={"column"}
			>
				<Flex alignItems={"center"} pb="20px" gap="15px">
					<Center
						alignItems={"center"}
						width={{
							base: "10px",
							sm: "12px",

							lg: "14px",
							xl: "16px",
							"2xl": "25px",
						}}
						height={{
							base: "10px",
							sm: "12px",

							lg: "14px",
							xl: "16px",
							"2xl": "23px",
						}}
					>
						<Icon name="filter" style={{ w: "100%" }} />
					</Center>
					<Text fontSize="lg" fontWeight={"semibold"}>
						Filter using onboarding status
					</Text>
				</Flex>

				<Flex gap="10px">
					{cardData.map((card) => (
						<Box key={card}>
							<Card
								title={card.title}
								status={card.status}
								count={card.count}
							/>
						</Box>
					))}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default OnboardingDashboard;
