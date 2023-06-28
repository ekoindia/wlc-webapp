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
		{ value: "3", label: "Product" },
		{ value: "2", label: "Distributors" },
		{ value: "1", label: "Individuals" },
	];

	const pricingTypeList = [{ value: "1", label: "Fixed" }];

	const paymentModeList = [
		{ value: "1", label: "Cash to Cash" },
		{ value: "2", label: "Cash to Account" },
	];

	return (
		<div {...rest}>
			<PricingForm
				productDetails={products.INDONEPAL}
				productPricingType={productPricingType.INDONEPAL}
				operationTypeList={operationTypeList}
				pricingTypeList={pricingTypeList}
				paymentModeList={paymentModeList}
			/>
		</div>
	);
};

export default IndoNepal;
