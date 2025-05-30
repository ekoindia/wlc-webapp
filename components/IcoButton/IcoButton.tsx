import { Center } from "@chakra-ui/react";
import { IconNameType } from "constants/IconLibrary";
import { Icon } from "..";

type IcoButtonProps = {
	size?: "lg" | "md" | "sm" | "xs" | string;
	iconSize?: string;
	iconStyle?: Object;
	theme?: "dark" | "light" | "gray" | "primary" | "accent" | "ghost";
	rounded?: "full" | string | number;
	title?: string;
	onClick?: () => void;
	[key: string]: any;
} & (
	| { iconName: IconNameType; icon?: never }
	| { icon: React.FC<any>; iconName?: never }
	| { iconName?: IconNameType; icon?: React.FC<any> }
);

/**
 * A IcoButton component to show Icons
 * TODO: Shadow, default theme, active (pressed) state, hover state, disabled state
 * @param {IcoButtonProps} props - The props of the component
 * @param {IconNameType} props.iconName - The name of the icon to display.
 * @param {string} [props.size] - The size of the button. Can be "lg", "md", "sm", or a custom string.
 * @param {string|number} [props.iconSize] - An optional custom size for the icon.
 * @param {object} [props.iconStyle] - The styles to apply to the icon (should contain width, height).
 * @param {string} [props.theme] - The color theme of the button. Can be "light" or "dark" or any custom theme.
 * @param {string|number} [props.rounded] - The rounding of the button. Can be a number, or "full" (default).
 * @param {string} [props.title] - The title of the button.
 * @param {MouseEvent} [props.onClick] - The click event handler
 * @param {...object} rest - A catch-all prop that allows any other prop to be passed in.
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
	icon,
	size = "md",
	iconSize,
	iconStyle,
	theme = "light",
	rounded = "full",
	title,
	onClick,
	...rest
}: IcoButtonProps): JSX.Element => {
	const clickable: boolean = onClick && typeof onClick === "function";

	const IconElement = icon;

	const bgSize: string =
		size === "lg"
			? "64px"
			: size === "md"
				? "48px"
				: size === "sm"
					? "32px"
					: size === "xs"
						? "24px"
						: size === "xxs"
							? "18px"
							: size;

	const _iconSize: string = iconSize
		? iconSize
		: size === "lg"
			? "32px"
			: size === "md"
				? "24px"
				: size === "sm"
					? "14px"
					: size === "xs"
						? "11px"
						: size === "xxs"
							? "8px"
							: "80%";

	const btnTheme: Object =
		theme === "dark"
			? {
					bg: "inputLabel",
					color: "white",
					boxShadow: "0px 3px 10px #0000001A",
				}
			: theme === "light"
				? {
						bg: "divider",
						color: "primary.DEFAULT",
						border: "1px solid var(--chakra-colors-divider)",
					}
				: theme === "gray"
					? {
							bgGradient: "linear(to-b, divider, hint)",
							color: "white",
							border: "1px solid var(--chakra-colors-divider)",
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
							: theme === "ghost"
								? {
										bg: "transparent",
										color: "dark",
									}
								: null;

	return (
		<Center
			as="button"
			data-testid="ico-button"
			title={title}
			width={bgSize}
			height={bgSize}
			minW={bgSize}
			rounded={rounded}
			cursor={clickable ? "pointer" : "auto"}
			onClick={onClick}
			overflow="hidden"
			{...btnTheme}
			{...rest}
		>
			{icon ? (
				<IconElement size={_iconSize} {...iconStyle} />
			) : (
				<Icon name={iconName} size={_iconSize} {...iconStyle} />
			)}
		</Center>
	);
};

export default IcoButton;
