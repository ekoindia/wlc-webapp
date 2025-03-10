import { formatCurrency, getCurrencySymbol } from "utils/numberFormat";

/**
 * Displays a formatted currency value.
 * @param 	{object}	prop	Properties passed to the component
 * @param	{number}	prop.amount	The currency amount.
 * @param	{string}	[prop.currencyCode]	The currency code. Defaults to "INR".
 * @param	{boolean}	[prop.preserveFraction]	Preserve the fraction value, even if it is zero. Defaults to false.
 * @example	`<Currency value="12345" currencyCode="INR" />`	// Displays ₹ 12,345.00
 */
const Currency = ({
	amount,
	currencyCode = "INR",
	preserveFraction = false,
}) => {
	// Check if amount is valid
	const isValidAmount = !(
		typeof amount === "undefined" ||
		amount === null ||
		amount === ""
	);

	if (!isValidAmount) {
		// If amount is invalid, don't render anything
		return null;
	}

	// Check if amount is negative
	const isNegative = isValidAmount && amount < 0;

	// Get absolute value for formatting
	const absoluteAmount = isValidAmount ? Math.abs(Number(amount)) : 0;

	// Get currency symbol
	const symbol = getCurrencySymbol(currencyCode);

	// Format the currency amount
	const displayAmount =
		(isNegative ? "- " : "") +
		symbol +
		formatCurrency(
			absoluteAmount,
			currencyCode,
			true,
			preserveFraction ? false : true
		);

	return displayAmount;
};

export default Currency;
