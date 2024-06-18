import { Currency, DateView } from "components";
import { ParamType } from "constants";

/**
 * Data Output component: Shows formatted values based on the type of value and other formatting options.
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.value]	The value to display.
 * @param	{string}	[prop.value_formatted]	The formatted value to display.
 * @param	{number}	[prop.parameter_type_id]	The data type of the value. Defaults to 12 (ParamType.TEXT).
 * @param	{string}	[prop.metadata]	Additional metadata for the value. Defaults to "". Eg: Date-format for date values or Currency-code for money values.
 * @param	{string}	[prop.format]	Number formatting pattern for the value. Defaults to "". Eg: "### ### ###" for displaying a number as "123 456 789".
 * @param	{boolean}	[prop.preserveFraction]	Preserve the fraction value, even if it is zero. Defaults to false.
 * @param	{number}	[prop.textCaseType]	Case type for text values. Defaults to 0 (TextCaseType.NONE).
 * @example	`<Value />`
 */
const Value = ({
	value,
	value_formatted,
	parameter_type_id = ParamType.TEXT,
	metadata = "",
	// format = "",
	preserveFraction = false,
	// textCaseType = 0,
	...rest
}) => {
	switch (parameter_type_id) {
		case ParamType.MONEY:
		case ParamType.MONEY_ABSOLUTE:
			return (
				<Currency
					amount={value}
					currencyCode={metadata || "INR"}
					preserveFraction={preserveFraction}
					{...rest}
				/>
			);
		case ParamType.DATE:
			return <DateView date={value} format={metadata} {...rest} />;
	}
};

export default Value;
