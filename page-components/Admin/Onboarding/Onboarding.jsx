import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Headings } from "components/Headings";
import { BulkOnboarding, SingleOnboarding } from ".";

/**
 * A <Onboarding> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Onboarding></Onboarding>` TODO: Fix example
 */
const Onboarding = () => {
	const tabs = {
		"Single Onboarding": <SingleOnboarding />,
		"Multiple Onboarding": <BulkOnboarding />,
	};

	return (
		<>
			<Headings title="Onboard Sellers & Distributors" hasIcon={false} />
			<Box
				w="100%"
				bg="white"
				borderRadius="10px"
				border="card"
				boxShadow="basic"
			>
				<Tabs
					isLazy
					position="relative"
					defaultIndex={0}
					variant="colorful"
					bg={{ base: "#FFFFFF", md: "transparent" }}
					py="3"
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
						{Object.keys(tabs).map((key) => (
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

					<TabPanels p="10px 20px">
						{Object.entries(tabs).map(([key, value]) => (
							<TabPanel key={key}>{value}</TabPanel>
						))}
					</TabPanels>
				</Tabs>
			</Box>
		</>
	);
};

export default Onboarding;
