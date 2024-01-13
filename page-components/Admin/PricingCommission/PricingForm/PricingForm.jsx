import { Headings } from "components";
import dynamic from "next/dynamic";

/**
 * A <PricingForm> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<PricingForm></PricingForm>` TODO: Fix example
 */
const PricingForm = ({ label, comp }) => {
	const _pageComponent = comp;

	const DynamicPageComponent = dynamic(
		() =>
			import(`../${_pageComponent}`).then((mod) => {
				return mod[_pageComponent];
			}),
		{
			ssr: false,
		}
	);

	return (
		<div>
			<Headings title={label} />
			<DynamicPageComponent />
		</div>
	);
};

export default PricingForm;
