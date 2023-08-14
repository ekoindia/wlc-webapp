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
		{ value: "3", label: "Whole Network" },
		{ value: "2", label: "Distributors Network" },
		{ value: "1", label: "Individual Distributor/Retailer" },
	];

	const pricingTypeList = [
		{ value: "0", label: "Percentage (%)" },
		{ value: "1", label: "Fixed (₹)" },
	];

	//request structure
	// const dmtFields = [
	// 	{
	// 		id: "operation_type",
	// 		label: `Select ${productPricingType.DMT} For`,
	// 		required: true,
	// 		parameter_type_id: ParamType.LIST,
	// 		is_radio: true,
	// 		list_parameters: operationTypeList,
	// 	},
	// 	{
	// 		id: "CspList",
	// 		label: "dependent",
	// 		required: true,
	// 		parameter_type_id: ParamType.LIST,
	// 		is_multi_select: true,
	// 		list_parameters: "dependent",
	// 		dependent: [
	// 			{
	// 				name: "operation_type",
	// 				on_value: [1, 2, 3],
	// 				value: "",
	// 				hidden: true,
	// 				required: true,
	// 				ACTION: "HIDE",
	// 			},
	// 		],
	// 	},
	// 	{
	// 		id: "select",
	// 		label: "Select Slab",
	// 		required: true,
	// 		parameter_type_id: ParamType.LIST,
	// 		list_parameters: "dependent",
	// 	},
	// 	{
	// 		id: "pricing_type",
	// 		label: `Select ${productPricingType.DMT} Type`,
	// 		required: true,
	// 		defaultValue: products.DMT.DEFAULT.pricing_type,
	// 		parameter_type_id: ParamType.LIST,
	// 		list_parameters: pricingTypeList,
	// 		is_radio: true,
	// 	},
	// 	{
	// 		id: "actual_pricing",
	// 		label: `Define ${productPricingType.DMT}`,
	// 		required: true,
	// 		parameter_type_id: ParamType.NUMERIC,
	// 		min: "0",
	// 		step: "0.01",
	// 		placeholder: "2.5",
	// 	},
	// ];

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
