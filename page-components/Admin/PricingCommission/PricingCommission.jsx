import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import { Dmt } from "./Dmt";
/**
 * A <PricingCommission> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<PricingCommission></PricingCommission>`
 */
const PricingCommissions = ({ className = "", ...props }) => {
	return (
		<Box px={{ base: "16px", md: "initial" }} pl="20px">
			<Box
				w={"100%"}
				minH={"80%"}
				bg={"white"}
				mt={{ base: "15px", "2xl": "25px" }}
				borderRadius={{ base: "8px", md: "10px" }}
				border={"card"}
				boxShadow={" 0px 5px 15px #0000000D"}
				mb={{ base: "26px", md: "10px" }}
				// mx={{ base: "16px", md: "none" }}
			>
				<Tabs
					position="relative"
					defaultIndex={0}
					variant="colorful"
					bg={{ base: "#FFFFFF", md: "transparent" }}
					// px={{ base: "0", sm: "3", md: "7.5" }}
					pt={{ base: "3", md: "4", "2xl": "7" }}
					w={{ base: "100%", md: "100%" }}
					borderRadius={"10px"}
				>
					<TabList
						color="light"
						pl={{ base: "10px", md: "20px" }}
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
						px={{ base: "17px", md: "15px", lg: "20px" }}
						mt={{
							base: "23px",
							md: "25px",
							lg: "25px",
							"2xl": "38px",
						}}
						pb={"20px"}
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
		</Box>
	);
};

export default PricingCommissions;
