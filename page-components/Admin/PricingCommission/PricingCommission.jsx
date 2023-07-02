import {
	Box,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import { Headings } from "components/Headings";
import {
	AadhaarPay,
	Aeps,
	AirtelCms,
	CreditCardBillPayment,
	Dmt,
	IndoNepal,
} from ".";
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
		"Indo-Nepal Fund Transfer": <IndoNepal />,
		// BBPS: <Bbps />,
		"Airtel CMS": <AirtelCms />,
		"Credit Card Bill Payment": <CreditCardBillPayment />,
	};

	return (
		<>
			<Headings title="Pricing & Commissions" hasIcon={false} />
			<Box px={{ base: "16px", md: "initial" }}>
				<Text mb="20px" fontSize={{ base: "xs", sm: "sm" }}>
					<span
						style={{
							backgroundColor: "#FFD93B",
							fontWeight: "700",
						}}
					>
						Note:
					</span>
					&nbsp; The revised cost structure will come into effect from
					tomorrow (12:00 AM midnight).
				</Text>
				<Box
					w="100%"
					// minH="80%"
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
			</Box>
		</>
	);
};

export default PricingCommissions;
