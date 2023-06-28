import { productPricingType, products } from "constants";
import { PricingForm } from "..";

/**
 * A <Dmt> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Dmt></Dmt>` TODO: Fix example
 */
const Dmt = ({ prop1, ...rest }) => {
	const operationTypeList = [
		{ value: "3", label: "Product" },
		{ value: "2", label: "Distributors" },
		{ value: "1", label: "Individuals" },
	];

	const pricingTypeList = [
		{ value: "0", label: "Percentage (%)" },
		{ value: "1", label: "Fixed" },
	];
	return (
		<div {...rest}>
			<PricingForm
				productDetails={products.DMT}
				productPricingType={productPricingType.DMT}
				operationTypeList={operationTypeList}
				pricingTypeList={pricingTypeList}
			/>
		</div>
	);
};

export default Dmt;
