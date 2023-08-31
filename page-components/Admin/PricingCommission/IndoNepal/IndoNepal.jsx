import { productPricingType, products } from "constants";
import { PricingForm } from "..";

/**
 * A <IndoNepal> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<IndoNepal></IndoNepal>` TODO: Fix example
 */
const IndoNepal = ({ prop1, ...rest }) => {
	const operationTypeList = [
		{ value: "3", label: "Whole Network" },
		{ value: "2", label: "Distributor's Network" },
		{ value: "1", label: "Individual Distributor/Retailer" },
	];

	const pricingTypeList = [{ value: "1", label: "Fixed (₹)" }];

	const paymentModeList = [
		{ value: "1", label: "Cash to Cash" },
		{ value: "2", label: "Cash to Account" },
	];

	return (
		<div {...rest}>
			<PricingForm
				productDetails={products.INDO_NEPAL_FUND_TRANSFER}
				productPricingType={productPricingType.INDO_NEPAL_FUND_TRANSFER}
				operationTypeList={operationTypeList}
				pricingTypeList={pricingTypeList}
				paymentModeList={paymentModeList}
			/>
		</div>
	);
};

export default IndoNepal;
