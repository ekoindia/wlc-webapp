import { productPricingType, products } from "constants";
import { PricingForm } from ".";

/**
 * A CreditCardBillPayment page-component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<CreditCardBillPayment></CreditCardBillPayment>` TODO: Fix example
 */
const CreditCardBillPayment = () => {
	const operationTypeList = [
		{ value: "3", label: "Product" },
		{ value: "2", label: "Distributors" },
		{ value: "1", label: "Individuals" },
	];

	const pricingTypeList = [
		{ value: "0", label: "Percentage (%)" },
		{ value: "1", label: "Fixed (₹)" },
	];
	return (
		<div>
			<PricingForm
				productDetails={products.CREDIT_CARD_BILL_PAYMENT}
				productPricingType={productPricingType.CREDIT_CARD_BILL_PAYMENT}
				operationTypeList={operationTypeList}
				pricingTypeList={pricingTypeList}
			/>
		</div>
	);
};

export default CreditCardBillPayment;
