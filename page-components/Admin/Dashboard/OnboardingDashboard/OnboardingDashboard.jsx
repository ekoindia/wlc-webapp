import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { Icon, IconButtons } from "components";
import { useState } from "react";
import { OnboardingDashboardTable } from ".";
import { OnboardingDashboardData } from "../dasboard.mocks";

/**
 * A <OnboardingDashboard> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<OnboardingDashboard></OnboardingDashboard>`
 */

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

const OnboardingDashboard = (/* props */) => {
	const [activeCardIndex, setActiveCardIndex] = useState(null);
	console.log("activeCardIndex", activeCardIndex);

	const data = OnboardingDashboardData;
	console.log("data", data);
	const topPanel =
		data[0]?.data?.onboarding_dashboard_details[0]?.topPanel ?? [];
	console.log("topPanel", topPanel);
	const topPanelData = Object.entries(topPanel).map(([key, value]) => {
		const words = key.split(/(?=[A-Z])/); // split title into words before uppercase letters
		return {
			title: `${words[0]} ${words.slice(1).join(" ")}`, // combine first word with remaining words separated by a space
			count: value,
		};
	});
	const tableData =
		data[0]?.data?.onboarding_dashboard_details[1]?.onboardedMerchants ??
		[];
	console.log("tableData", tableData);

	console.log("OnboardingDashboardData", OnboardingDashboardData);
	const handleCardClick = (index) => {
		setActiveCardIndex(index);
	};

	return (
		<Flex direction={"column"}>
			<Flex
				justifyContent={"space-evenly"}
				minH={{ base: "initial", md: "175px" }}
				py={{ base: "10px", md: "initial" }}
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

				<Flex
					gap="10px"
					overflowX="auto"
					p="5px"
					justifyContent={"space-between"}
				>
					{topPanelData.map((card, index) => (
						<Box key={index} onClick={() => handleCardClick(index)}>
							<Card
								title={card.title}
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
				<OnboardingDashboardTable tableData={tableData} />
				<Flex justifyContent={"center"} my="40px">
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
			</Box>
		</Flex>
	);
};

export default OnboardingDashboard;
