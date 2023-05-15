import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Headings } from "components/Headings";
import { AadhaarPay, Aeps, Dmt } from ".";
/**
 * A <PricingCommission> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<PricingCommission></PricingCommission>`
 */
const PricingCommissions = () => {
	const tabs = {
		DMT: <Dmt />,
		AEPS: <Aeps />,
		"Aadhaar Pay": <AadhaarPay />,
		// "Indo-Nepal Fund Transfer": "",
		// BBPS: "",
	};

	return (
		<>
			<Headings title="Pricing & Commissions" hasIcon={false} />
			<Box px={{ base: "16px", md: "initial" }}>
				<Box
					w="100%"
					minH="80%"
					bg="white"
					borderRadius={{ base: "8px", md: "10px" }}
					border="card"
					boxShadow="0px 5px 15px #0000000D"
					mb={{ base: "26px", md: "10px" }}
				>
					<Tabs
						position="relative"
						defaultIndex={0}
						variant="colorful"
						bg={{ base: "#FFFFFF", md: "transparent" }}
						pt={{ base: "3", md: "4", "2xl": "7" }}
						w={{ base: "100%", md: "100%" }}
						borderRadius="10px"
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
							{Object.entries(tabs).map(([key]) => (
								<Tab
									key={key}
									fontSize={{
										base: "sm",
										"2xl": "md",
									}}
								>
									{key}
								</Tab>
							))}
						</TabList>

						<TabPanels
							px={{ base: "17px", md: "15px", lg: "20px" }}
							mt={{
								base: "23px",
								md: "25px",
								lg: "25px",
								"2xl": "38px",
							}}
							pb="20px"
						>
							{Object.entries(tabs).map(([key, value]) => (
								<TabPanel key={key}>{value}</TabPanel>
							))}
						</TabPanels>
					</Tabs>
				</Box>
			</Box>
		</>
	);
};

export default PricingCommissions;
