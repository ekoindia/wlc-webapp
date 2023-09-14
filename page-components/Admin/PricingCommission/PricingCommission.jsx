import {
	Box,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import { Headings } from "components";
import {
	AadhaarPay,
	//AccountVerification,
	Aeps,
	AirtelCms,
	CommissionFrequency,
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
	const tabList = [
		{ label: "DMT", comp: <Dmt /> },
		{ label: "AEPS", comp: <Aeps /> },
		{ label: "Aadhaar Pay", comp: <AadhaarPay /> },
		{ label: "Indo-Nepal Fund Transfer", comp: <IndoNepal /> },
		{ label: "Airtel CMS", comp: <AirtelCms /> },
		{ label: "Credit Card Bill Payment", comp: <CreditCardBillPayment /> },
		{
			label: "Commission Frequency",
			comp: <CommissionFrequency />,
		},
		//{ label: "Account Verification", comp: <AccountVerification /> },
	];

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
						bg={{ base: "white", md: "transparent" }}
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
			</Box>
		</>
	);
};

export default PricingCommissions;
