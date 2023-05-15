import { ProductSlabs } from "constants";
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
	const commissionForObj = {
		1: "Individuals",
		2: "Distributors",
		// 3: "Products",
	};

	const commissionTypeObj = {
		0: "Percentage (%)",
		1: "Fixed",
	};
	return (
		<div {...rest}>
			<PricingForm
				product="dmt"
				ProductSlabs={ProductSlabs.DMT}
				commissionForObj={commissionForObj}
				commissionTypeObj={commissionTypeObj}
			/>
		</div>
	);
};

export default Dmt;
