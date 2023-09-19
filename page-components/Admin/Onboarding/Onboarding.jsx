import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Headings } from "components";
import { BulkOnboarding } from ".";

/**
 * A Onboarding page-component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Onboarding></Onboarding>` TODO: Fix example
 */
const Onboarding = () => {
	const tabList = [
		// { label: "Onboard Agents", comp: <SingleOnboarding /> }, // form based onboarding
		{ label: "Bulk Onboarding (Using File)", comp: <BulkOnboarding /> }, // file based onboarding
	];

	return (
		<>
			<Headings title="Onboard Agents" hasIcon={false} />
			<Box
				bg="white"
				borderRadius="10px"
				border="card"
				boxShadow="basic"
				mx={{ base: "4", md: "0" }}
			>
				<Tabs
					isLazy
					position="relative"
					defaultIndex={0}
					py="3"
					w="100%"
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
						{tabList.map(({ label }) => (
							<Tab
								key={label}
								fontSize={{
									base: "sm",
									"2xl": "md",
								}}
							>
								{label}
							</Tab>
						))}
					</TabList>

					<TabPanels p="10px 20px">
						{tabList.map(({ label, comp }) => (
							<TabPanel key={label}>{comp}</TabPanel>
						))}
					</TabPanels>
				</Tabs>
			</Box>
		</>
	);
};

export default Onboarding;
