/**
 * Shows formatted values based on the type of value and other formatting options.
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Value />`
 */
const Value = ({
	value,
	value_formatted,
	parameter_type_id = 12,
	metadata = "",
	format = "",
	preserveFraction = false,
	textCaseType = 0,
	...rest
}) => {
	return <div {...rest}>Value</div>;
};

export default Value;
