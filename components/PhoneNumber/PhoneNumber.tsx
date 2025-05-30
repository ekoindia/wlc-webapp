import { Link, Text } from "@chakra-ui/react";

// Declare the props interface
interface PhoneNumberProps {
	number: string;
	countryCode?: string;
	format?: string;
	hidePrefix?: boolean;
	viewOnly?: boolean;
	[key: string]: any;
}

/**
 * A <PhoneNumber> component to display a phone number in a formatted way.
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {string} [prop.countryCode] - The country code of the phone number. Default: "91"
 * @param {string} [prop.number] - The phone number to be displayed
 * @param {string} [prop.format] - The format in which the phone number should be displayed. Default: "XXX XXX XXXX"
 * @param {boolean} [prop.hidePrefix] - Whether to hide the country code prefix or not. Default: false
 * @param {boolean} [prop.viewOnly] - Whether the phone number should be clickable or not. Default: false
 * @param {...*} rest - Rest of the props
 * @example	`<PhoneNumber number="7827123456" />`
 */
const PhoneNumber = ({
	number = "",
	countryCode = "91",
	format = "XXX XXX XXXX",
	hidePrefix = false,
	viewOnly = false,
	...rest
}: PhoneNumberProps) => {
	// Helper function to format the phone number based on the provided format
	const formatPhoneNumber = (number, format, hidePrefix) => {
		if (!number) return "";

		let formattedValue = "";
		let formatIndex = 0;

		for (let i = 0; i < number.length; i++) {
			if (formatIndex < format.length && format[formatIndex] === " ") {
				formattedValue += " ";
				formatIndex++;
			}
			formattedValue += number[i];
			formatIndex++;
		}

		return (hidePrefix ? "" : `+${countryCode} `) + formattedValue.trim();
	};

	// Helper function to generate the clickable `tel:` link
	const generateTelLink = (number, countryCode) => {
		return `tel:+${countryCode}${number}`;
	};

	const formattedNumber = formatPhoneNumber(number, format, hidePrefix);
	const telLink = generateTelLink(number, countryCode);

	return viewOnly || !telLink ? (
		<Text display="inline" color="inherit" {...rest}>
			{formattedNumber}
		</Text>
	) : (
		<Link
			href={telLink}
			color="inherit"
			textDecoration="none"
			_hover={{
				color: "blue.500",
				borderBottom: "1px solid blue.500",
			}}
			{...rest}
		>
			{formattedNumber}
		</Link>
	);
};

export default PhoneNumber;
