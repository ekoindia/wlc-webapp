import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import { Dmt } from "./Dmt";

const PricingCommissions = ({ className = "", ...props }) => {
	return (
		<Box
			w={"100%"}
			minH={"100%"}
			bg={"white"}
			mt={"25px"}
			borderRadius={"10px"}
			border={"card"}
			boxShadow={" 0px 5px 15px #0000000D"}
		>
			<Tabs
				position="relative"
				defaultIndex={0}
				variant="colorful"
				//Responsive style
				bg={{ base: "#FFFFFF", md: "transparent" }}
				px={{ base: "2", md: "7.5" }}
				pt={{ base: "3", md: "10.5" }}
				w={{ base: "100%", md: "100%" }}
				borderRadius={"10px"}
			>
				<TabList
					color="light"
					css={{
						"&::-webkit-scrollbar": {
							display: "none",
						},
						"&::-moz-scrollbar": {
							display: "none",
						},
						"&::scrollbar": {
							display: "none",
						},
					}}
				>
					<Tab>DMT</Tab>
					<Tab>AEPS</Tab>
					<Tab>Aadhaar Pay</Tab>
					<Tab>Indo-Nepal Fund Transfer</Tab>
					<Tab>BBPS</Tab>
				</TabList>

				<TabPanels
					px={{ base: "18px", md: "0" }}
					mt={{ base: "23px", md: "46px" }}
				>
					<TabPanel>
						<Dmt />
					</TabPanel>
					<TabPanel>
						<p>two!</p>
					</TabPanel>
					<TabPanel>
						<p>three!</p>
					</TabPanel>
					<TabPanel>
						<p>three!</p>
					</TabPanel>
					<TabPanel>
						<p>four!</p>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
};

export default PricingCommissions;
