import { Flex } from "@chakra-ui/react";
import { formatCurrency, getCurrencySymbol } from "utils/numberFormat";

/**
 * Displays a formatted currency value.
 * @param 	{object}	prop	Properties passed to the component
 * @param	{number}	prop.amount	The currency amount.
 * @param	{string}	[prop.currencyCode]	The currency code. Defaults to "INR".
 * @param	{boolean}	[prop.preserveFraction]	Preserve the fraction value, even if it is zero. Defaults to false.
 * @param	{...*}		rest	Rest of the props passed to this component.
 * @example	`<Currency value="12345" currencyCode="INR" />`	// Displays ₹ 12,345.00
 */
const Currency = ({
	amount,
	currencyCode = "INR",
	preserveFraction = false,
	...rest
}) => {
	return (
		<Flex display="inline-flex" justify="center" {...rest}>
			{!(
				typeof amount === "undefined" ||
				amount === null ||
				amount === ""
			) && (
				<>
					<span hidden$="[[_isHidden(amount)]]" mr="0.2em">
						{getCurrencySymbol(currencyCode)}
					</span>
					<span>
						{formatCurrency(
							amount,
							currencyCode,
							true,
							preserveFraction ? false : true
						)}
					</span>
				</>
			)}
		</Flex>
	);
};

export default Currency;
