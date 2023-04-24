import { Center } from "@chakra-ui/react";
import { IconNameType } from "components/Icon/Icon";
import { Icon } from "..";

type Props = {
	iconName: IconNameType;
	size: "lg" | "md" | "sm" | string;
	iconStyle: Object;
	theme?: "dark" | "light" | Object;
	bg?: string;
	round?: "full" | string | number;
	boxShadow?: string;
	title?: string;
	onClick?: () => void;
};

/**
 * A IcoButton component to show Icons
 * @arg 	{Object}	prop	Properties passed to the component
 * @param {IconNameType} iconName - The name of the icon to display.
 * @param {string} size - The size of the button. Can be "lg", "md", "sm", or a custom string.
 * @param {Object} iconStyle - The styles to apply to the icon (should contain width, height).
 * @param {string} theme - The color theme of the button. Can be "light" or "dark" or any custom theme.
 * @param {string} bg - The background color of the button.
 * @param {string|number} round - The rounding of the button. Can be a string, a number, or "full".
 * @param {string} boxShadow - The box shadow of the button.
 * @param {string} title - The title of the button.
 * @param {MouseEvent} onClick - The click event handler
 * @example
 * //Example usage:
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
	onClick,
}: Props): JSX.Element => {
	const clickable: boolean = onClick === undefined;

	const roundness: string = round === "full" ? "full" : `${round || 10}`;

	const bgSize: string =
		size === "lg"
			? "64px"
			: size === "md"
			? "48px"
			: size === "sm"
			? "32px"
			: size;

	const iconSize: string =
		size === "lg"
			? "32px"
			: size === "md"
			? "24px"
			: size === "sm"
			? "16px"
			: null;

	const btnTheme: Object =
		theme === "dark"
			? {
					bg: "inputlabel",
					color: "white",
					boxShadow: "0px 3px 10px #0000001A",
			  }
			: theme === "light"
			? {
					bg: "divider",
					color: "accent.DEFAULT",
					border: "1px solid #E9EDF1",
			  }
			: theme;

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
			cursor={clickable ? "auto" : "pointer"}
			onClick={onClick}
		>
			<Icon name={iconName} w={iconSize} {...iconStyle} />
		</Center>
	);
};

export default IcoButton;
