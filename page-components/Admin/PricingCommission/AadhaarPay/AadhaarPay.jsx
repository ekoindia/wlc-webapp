import { PricingForm } from "..";

/**
 * A <AadhaarPay> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<AadhaarPay></AadhaarPay>` TODO: Fix example
 */
const AadhaarPay = ({ prop1, ...rest }) => {
	const commissionForObj = {
		1: "Individuals",
		2: "Distributors",
		// 3: "Products",
	};

	const commissionTypeObj = {
		0: "Percentage (%)",
		1: "Fixed",
	};

	const charges = {
		"Fixed Charges": 1.8,
		Taxes: 0.8,
		"Network Earnings": 4.12,
		"Your Earnings": 3.28,
	};
	return (
		<div {...rest}>
			<PricingForm
				product="aadharpay"
				commissionForObj={commissionForObj}
				commissionTypeObj={commissionTypeObj}
			/>
		</div>
	);
};

export default AadhaarPay;
