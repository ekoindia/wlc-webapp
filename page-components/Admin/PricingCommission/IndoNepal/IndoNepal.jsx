import { ProductPricingType, ProductSlabs } from "constants";
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
	const commissionForObj = {
		1: "Individuals",
		2: "Distributors",
		3: "Products",
	};

	const commissionTypeObj = {
		// 0: "Percentage (%)", //TODO remove this (only require fixed value in IndoNepal)
		1: "Fixed",
	};

	const paymentModeObj = {
		1: "Cash to Cash",
		2: "Cash to Account",
	};

	return (
		<div {...rest}>
			<PricingForm
				product="indonepal"
				ProductPricingType={ProductPricingType.INDONEPAL}
				ProductSlabs={ProductSlabs.INDONEPAL}
				commissionForObj={commissionForObj}
				commissionTypeObj={commissionTypeObj}
				paymentModeObj={paymentModeObj}
			/>
		</div>
	);
};

export default IndoNepal;
