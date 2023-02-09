import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import { Dmt } from "./Dmt";

const PricingCommissions = ({ className = "", ...props }) => {
	return (
		<Box
			w={"100%"}
			minH={"100%"}
			bg={"white"}
			mt={{ base: "15px", "2xl": "25px" }}
			borderRadius={"10px"}
			border={"card"}
			boxShadow={" 0px 5px 15px #0000000D"}
		>
			<Tabs
				position="relative"
				defaultIndex={0}
				variant="colorful"
				bg={{ base: "#FFFFFF", md: "transparent" }}
				px={{ base: "1", sm: "3", md: "7.5" }}
				pt={{ base: "3", md: "4", "2xl": "7" }}
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
					<Tab fontSize={{ base: "sm", md: "sm", "2xl": "md" }}>
						DMT
					</Tab>
					<Tab fontSize={{ base: "sm", md: "sm", "2xl": "md" }}>
						AEPS
					</Tab>
					<Tab fontSize={{ base: "sm", md: "sm", "2xl": "md" }}>
						Aadhaar Pay
					</Tab>
					<Tab fontSize={{ base: "sm", md: "sm", "2xl": "md" }}>
						Indo-Nepal Fund Transfer
					</Tab>
					<Tab fontSize={{ base: "sm", md: "sm", "2xl": "md" }}>
						BBPS
					</Tab>
				</TabList>

				<TabPanels
					px={{ base: "18px", md: "0" }}
					mt={{ base: "23px", md: "25px", lg: "25px", "2xl": "38px" }}
					pb={"30px"}
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
