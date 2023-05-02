const DEFAULT_CURRENCY = "INR";

/**
 * Format details for currencies.
 */
const CURRENCIES = {
	INR: {
		// Indian Rupee
		symbol: "₹",
		decimal: 2,
		locale: "en-IN",
	},
	USD: {
		// US Dollar
		symbol: "$",
		decimal: 2,
		locale: "en-US",
	},
	NPR: {
		// Nepalese Rupee
		symbol: "₨",
		decimal: 2,
		locale: "en-NP",
	},
	EUR: {
		// Euro
		symbol: "€",
		decimal: 2,
		locale: "de-DE",
	},
	GBP: {
		// British Pound
		symbol: "£",
		decimal: 2,
		locale: "en-GB",
	},
	JPY: {
		// Japanese Yen
		symbol: "¥",
		decimal: 0,
		locale: "ja-JP",
	},
	AUD: {
		// Australian Dollar
		symbol: "A$",
		decimal: 2,
		locale: "en-AU",
	},
};

/**
 * Get the currency symbol for the given currency code.
 * @param {string} currencyCode - Currency code (e.g. INR, USD, EUR, etc.). Defaults to INR.
 * @returns {string} - Currency symbol (e.g. ₹, $, €, etc.). Returns empty string if currency code is unknown.
 */
export const getCurrencySymbol = (currencyCode = DEFAULT_CURRENCY) => {
	if (!currencyCode) return "";
	return CURRENCIES[currencyCode.toUpperCase()]?.symbol || "";
};

/**
 * Cache for the Intl.NumberFormat objects for each currency code.
 */
const currencyFormatters = {};

/**
 * Format a number to a currency string using `Intl.NumberFormat`.
 * It caches the Intl.NumberFormat object for each currency code
 * and uses the cached object for subsequent calls.
 * @param {number} amount - Number to format
 * @param {string} currencyCode - Currency code (e.g. INR, USD, EUR, etc.). Defaults to INR.
 * @param {boolean} noSymbol - If true, the currency symbol is not included in the formatted string.
 * @param {boolean} noZeroFraction - If true, the decimal fraction is not included if it is zero.
 * @returns {string} - Formatted currency string
 * @example
 * formatCurrency(123456.789, "INR"); // "₹ 1,23,456.79"
 * formatCurrency(123456.789, "USD"); // "$ 123,456.79"
 * formatCurrency(123456.789, "EUR"); // "€ 123,456.79"
 * formatCurrency(123456.789, "XYZ"); // "₹ 1,23,456.79"
 * formatCurrency(123456.789, "XYZ", true); // "1,23,456.79"
 * formatCurrency(123456.789); // "₹ 1,23,456.79"
 */
export const formatCurrency = (
	amount,
	currencyCode = DEFAULT_CURRENCY,
	noSymbol,
	noZeroFraction
) => {
	// Convert currency code to uppercase.
	currencyCode = currencyCode ? currencyCode.toUpperCase() : DEFAULT_CURRENCY;

	if (!(currencyCode in CURRENCIES)) {
		// If currency code is unknown, use the default currency code.
		currencyCode = DEFAULT_CURRENCY;
	}

	const currency = CURRENCIES[currencyCode];

	// Use a unique key for each combination of currency code, noSymbol and noZeroFraction.
	// This is to uniquely identify the Intl.NumberFormat object for each combination.
	const optionKey = currencyCode + noSymbol + noZeroFraction;

	let formatter = currencyFormatters[optionKey];

	if (!formatter) {
		formatter = new Intl.NumberFormat(currency?.locale || "en-IN", {
			style: noSymbol ? "decimal" : "currency",
			currency: noSymbol ? undefined : currencyCode,
			minimumFractionDigits: noZeroFraction ? 0 : currency.decimal,
			maximumFractionDigits: currency.decimal,
		});
		currencyFormatters[optionKey] = formatter;
	}
	return formatter.format(amount);
};
