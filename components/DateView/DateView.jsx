import { Box } from "@chakra-ui/react";
import { formatDate } from "libs";

/**
 * Show a formatted date/time value inside a <span>.
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.date	The date value.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @param prop.format
 * @example	`<DateView></DateView>` TODO: Fix example
 */
const DateView = ({ date, format, ...rest }) => {
	return date ? (
		<Box as="span" {...rest}>
			{formatDate(date, format)}
		</Box>
	) : null;
};

export default DateView;
