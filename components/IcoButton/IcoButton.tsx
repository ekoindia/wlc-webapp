import { Center } from "@chakra-ui/react";
import { IconNameType } from "components/Icon/Icon";
import { Icon } from "..";

type Props = {
	iconName: IconNameType;
	size: "lg" | "md" | "sm" | string;
	iconStyle: Object;
	theme?: string;
	bg?: string;
	round?: string | number;
	boxShadow?: string;
	title?: string;
};

/**
 * A IcoButton component to show Icons
 * @arg 	{Object}	prop	Properties passed to the component
 * @param {IconNameType} iconName - The name of the icon to display.
 * @param {string} size - The size of the button. Can be "lg", "md", "sm", or a custom string.
 * @param {Object} iconStyle - The styles to apply to the icon.
 * @param {string} theme - The color theme of the button. Can be "light" or "dark".
 * @param {string} bg - The background color of the button.
 * @param {string|number} round - The rounding of the button. Can be a string, a number, or "full".
 * @param {string} boxShadow - The box shadow of the button.
 * @param {string} title - The title of the button.
 * @example
 * // Example usage:
 * <IcoButton
 *    iconName="view-transaction-history"
 *    size="lg"
 *    iconStyle={{ w: "30px", h: "30px"}}
 *    theme="light"
 * />
 */
const IcoButton = ({
	iconName,
	size,
	iconStyle,
	theme,
	bg,
	round,
	boxShadow,
	title = "IcoButton",
}: Props): JSX.Element => {
	const roundness = round === "full" ? "full" : `${round || 10}`;
	const bgSize =
		size === "lg"
			? "64px"
			: size === "md"
			? "48px"
			: size === "sm"
			? "32px"
			: size;

	const btnTheme =
		theme === "dark"
			? {
					bg: "inputlabel",
					boxShadow: "0px 3px 10px #0000001A",
			  }
			: theme === "light"
			? {
					bg: "divider",
					border: "1px solid #E9EDF1",
			  }
			: {};

	const iconColor =
		theme === "dark"
			? {
					color: "white",
			  }
			: theme === "light"
			? { color: "accent.DEFAULT" }
			: {};

	return (
		<Center
			as="button"
			title={title}
			bg={bg}
			width={bgSize}
			height={bgSize}
			rounded={roundness}
			boxShadow={boxShadow}
			{...btnTheme}
		>
			<Icon name={iconName} {...iconStyle} {...iconColor} />
		</Center>
	);
};

export default IcoButton;
