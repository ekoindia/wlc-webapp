import { ProductSlabs } from "constants";
import { PricingForm } from "..";
/**
 * A <Aeps> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Aeps></Aeps>` TODO: Fix example
 */
const Aeps = ({ prop1, ...rest }) => {
	const commissionForObj = {
		1: "Individuals",
		2: "Distributors",
		3: "Products",
	};

	const commissionTypeObj = {
		0: "Percentage (%)",
		1: "Fixed",
	};
	return (
		<div {...rest}>
			<PricingForm
				product="aeps"
				ProductSlabs={ProductSlabs.AEPS}
				commissionForObj={commissionForObj}
				commissionTypeObj={commissionTypeObj}
			/>
		</div>
	);
};
export default Aeps;
