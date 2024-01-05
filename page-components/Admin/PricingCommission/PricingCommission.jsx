import { Box, Text } from "@chakra-ui/react";
import { Headings, Tabs } from "components";
import {
	AadhaarPay,
	AccountVerification,
	Aeps,
	AirtelCms,
	CardPayment,
	CommissionFrequency,
	CreditCardBillPayment,
	Dmt,
	IndoNepal,
	UpiMoneyTransfer,
} from ".";
/**
 * A PricingCommission page-component
 * @example	`<PricingCommission></PricingCommission>`
 */
const PricingCommissions = () => {
	const tabList = [
		{
			label: "Commission Frequency",
			comp: <CommissionFrequency />,
			// disabled: true,
		},
		{ label: "Money Transfer", comp: <Dmt /> },
		{ label: "AePS", comp: <Aeps /> },
		{ label: "Payment Gateway", comp: <CardPayment /> },
		{ label: "Account Verification", comp: <AccountVerification /> },
		{ label: "Credit Card Bill Payment", comp: <CreditCardBillPayment /> },
		{ label: "Aadhaar Pay", comp: <AadhaarPay /> },
		{ label: "Indo-Nepal Fund Transfer", comp: <IndoNepal /> },
		{ label: "UPI Money Transfer", comp: <UpiMoneyTransfer /> },
		{ label: "Airtel CMS", comp: <AirtelCms /> },
	];

	return (
		<>
			<Headings title="Pricing & Commissions" hasIcon={false} />
			<Box
				px={{ base: "16px", md: "initial" }}
				mb={{ base: "16", md: "0" }}
			>
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
					bg="white"
					border="card"
					boxShadow="basic"
					borderRadius="10px"
				>
					<Tabs>
						{tabList.map(
							({ label, comp, disabled = false }, index) => (
								<div
									key={`${index}-${label}`}
									label={label}
									disabled={disabled}
								>
									{comp}
								</div>
							)
						)}
					</Tabs>
				</Box>
			</Box>
		</>
	);
};

export default PricingCommissions;
