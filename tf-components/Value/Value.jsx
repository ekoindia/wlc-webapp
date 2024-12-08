import { Flex, Text } from "@chakra-ui/react";
import { Currency, DateView, PhoneNumber, InputLabel } from "components";
import { ParamType } from "constants";

/**
 * Data Output component: Shows formatted values based on the type of value and other formatting options.
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.value]	The value to display.
 * @param	{string}	[prop.valueFormatted]	The formatted value to display.
 * @param	{number}	[prop.typeId]	The data type of the value. Defaults to 12 (ParamType.TEXT).
 * @param	{string}	[prop.label]	Show a label for the value. Defaults to "".
 * @param	{string}	[prop.metadata]	Additional metadata for the value. Defaults to "". Eg: Date-format for date values or Currency-code for money values.
 * @param	{string}	[prop.format]	Number formatting pattern for the value. Defaults to "". Eg: "### ### ###" for displaying a number as "123 456 789".
 * @param	{boolean}	[prop.preserveFraction]	Preserve the fraction value, even if it is zero. Defaults to false.
 * @param	{number}	[prop.textCaseType]	Case type for text values. Defaults to 0 (TextCaseType.NONE).
 * @example	`<Value value="1234" />`
 */
const Value = ({
	value,
	valueFormatted,
	typeId = ParamType.TEXT,
	label = "",
	metadata = "",
	format = "",
	preserveFraction = false,
	// textCaseType = 0,
	...rest
}) => {
	if (!value) return null;

	let Component = <Text>{valueFormatted || value}</Text>;

	// Load proper component to render the value based on the parameter-type
	switch (typeId) {
		// Mobile number
		case ParamType.MOBILE:
			Component = (
				<PhoneNumber
					number={value}
					countryCode={metadata}
					format={format}
				/>
			);
			break;
		// Money
		case ParamType.MONEY:
		case ParamType.MONEY_ABSOLUTE:
			Component = (
				<Currency
					amount={value}
					currencyCode={metadata || "INR"}
					preserveFraction={preserveFraction}
				/>
			);
			break;
		// Date-time
		case ParamType.DATETIME:
			Component = <DateView date={value} format={metadata} />;
			break;
	}

	return (
		<Flex direction="column" {...rest}>
			{label && (
				<InputLabel hideOptionalMark fontSize="xs" mb={0}>
					{label}
				</InputLabel>
			)}
			{Component}
		</Flex>
	);
};

export default Value;
