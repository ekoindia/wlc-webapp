import { Center } from "@chakra-ui/react";
import { IconNameType } from "constants/IconLibrary";
import { Icon } from "..";

type Props = {
	iconName: IconNameType;
	size: "lg" | "md" | "sm" | "xs" | string;
	iconStyle: Object;
	theme?: "dark" | "light";
	rounded?: "full" | string | number;
	title?: string;
	onClick?: () => void;
	[key: string]: any;
};

/**
 * A IcoButton component to show Icons
 * @param {IconNameType} iconName - The name of the icon to display.
 * @param {string} size - The size of the button. Can be "lg", "md", "sm", or a custom string.
 * @param {Object} iconStyle - The styles to apply to the icon (should contain width, height).
 * @param {string} theme - The color theme of the button. Can be "light" or "dark" or any custom theme.
 * @param {string|number} rounded - The rounding of the button. Can be a number, or "full" (default).
 * @param {string} title - The title of the button.
 * @param {MouseEvent} onClick - The click event handler
 * @param {...Object} rest - A catch-all prop that allows any other prop to be passed in.
 * @example
 * //Example usage:
 * <IcoButton
 *    iconName="transaction-history"
 *    size="lg"
 *    iconStyle={{ w: "30px", h: "30px"}}
 *    theme="light"
 * />
 */
const IcoButton = ({
	iconName,
	size,
	iconStyle,
	theme = "light",
	rounded = "full",
	title = "Icon Button",
	onClick,
	...rest
}: Props): JSX.Element => {
	const clickable: boolean = onClick === undefined;

	// const roundness: string = rounded === "full" ? "full" : `${rounded || 10}`;

	const bgSize: string =
		size === "lg"
			? "64px"
			: size === "md"
			? "48px"
			: size === "sm"
			? "32px"
			: size === "xs"
			? "24px"
			: size;

	const iconSize: string =
		size === "lg"
			? "32px"
			: size === "md"
			? "24px"
			: size === "sm"
			? "12px"
			: size === "xs"
			? "10px"
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
			: theme === "gray"
			? {
					bg: "linear-gradient( #D2D2D2, #E9EDF1)",
					color: "white",
					border: "1px solid #E9EDF1",
			  }
			: theme === "primary"
			? {
					bg: "primary.DEFAULT",
					color: "white",
			  }
			: theme === "accent"
			? {
					bg: "accent.DEFAULT",
					color: "white",
			  }
			: null;

	return (
		<Center
			as="button"
			title={title}
			width={bgSize}
			height={bgSize}
			minW={bgSize}
			rounded={rounded}
			cursor={clickable ? "auto" : "pointer"}
			onClick={onClick}
			overflow="hidden"
			{...btnTheme}
			{...rest}
		>
			<Icon name={iconName} size={iconSize} {...iconStyle} />
		</Center>
	);
};

export default IcoButton;
