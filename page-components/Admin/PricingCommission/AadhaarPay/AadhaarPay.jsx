import { productPricingType, products } from "constants";
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
	const operationTypeList = [
		{ value: "3", label: "Whole Network" },
		{ value: "2", label: "Distributor's Network" },
		{ value: "1", label: "Individual Distributor/Retailer" },
	];

	const pricingTypeList = [
		{ value: "0", label: "Percentage (%)" },
		{ value: "1", label: "Fixed (₹)" },
	];

	return (
		<div {...rest}>
			<PricingForm
				productDetails={products.AADHAAR_PAY}
				productPricingType={productPricingType.AADHAAR_PAY}
				operationTypeList={operationTypeList}
				pricingTypeList={pricingTypeList}
			/>
		</div>
	);
};

export default AadhaarPay;
