import {
	Button as ChakraButton,
	ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";
import { Icon } from "components";
import { forwardRef, ReactNode } from "react";

interface IconStyleProps {
	color?: string;
	[key: string]: any;
}

interface ButtonProps extends ChakraButtonProps {
	/**
	 * Button variant
	 * @default "accent"
	 */
	variant?:
		| "primary"
		| "accent"
		| "outline"
		| "primary_outline"
		| "accent_outline"
		| "success"
		| "ghost"
		| "link"
		| "unstyled";
	/**
	 * Disable the button
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Show loading state
	 * @default false
	 */
	loading?: boolean;
	/**
	 * Size of the button
	 * @default "md"
	 */
	size?: "lg" | "md" | "sm" | "xs";
	/**
	 * Border radius of the button
	 * @default "8px"
	 */
	borderRadius?: string;
	/**
	 * The left icon component (if icon name is not provided)
	 * @default null
	 */
	leftIcon?: React.ReactElement;
	/**
	 * The right icon component (if icon name is not provided)
	 * @default null
	 */
	rightIcon?: React.ReactElement;
	/**
	 * Name of the icon to show in the button (e.g., "arrow-back"). This is alternatively used to show an icon in the button.
	 */
	icon?: string;
	/**
	 * Position of the icon: "left" or "right"
	 * @default "left"
	 */
	iconPosition?: "left" | "right";
	/**
	 * Spacing between the icon and the text
	 * @default "0.6em"
	 */
	iconSpacing?: string;
	/**
	 * Additional style properties for the icon
	 */
	iconStyle?: IconStyleProps;
	/**
	 * Click handler
	 */
	onClick?: () => void;
	/**
	 * Children elements of the button. For example, the button text.
	 */
	children?: ReactNode;
}

/**
 * A <Button> component
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.variant="accent"]	Button variant:	"primary" | "accent" | "primary_outline" | "accent_outline" | "outline" (same as "accent_outline") | "success" | "ghost" | "link" | "unstyled"
 * @param	{boolean}	[prop.disabled]	Disable the button (default: false)
 * @param	{boolean}	[prop.loading=false]	Show loading state
 * @param	{string}	[prop.size]	Size of the button: "lg" | "md" | "sm" | "xs"
 * @param	{string}	[prop.borderRadius]	Border radius of the button
 * @param	{ReactElement}	[prop.leftIcon]	The left icon component
 * @param	{ReactElement}	[prop.rightIcon]	The right icon component
 * @param	{string}	[prop.icon]	Icon name to show in the button (e.g., "arrow-back")
 * @param	{string}	[prop.iconPosition="left"]	Position of the icon: "left" or "right"
 * @param	{string}	[prop.iconSpacing]	Spacing between the icon and the text
 * @param	{Function}	[prop.onClick]	Click handler
 * @param	{ReactNode}	[prop.children]	Children elements of the button
 * @param	{...*}		rest	Rest of the props
 * @param	{React.Ref}	ref	Reference to the button element
 * @example	`<Button onClick={()=>{...}} icon="arrow-back">Back</Button>`
 * @example	`<Button icon="arrow-forward" iconPosition="right">Next</Button>`
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = "accent",
			disabled = false,
			loading = false,
			size,
			borderRadius,
			leftIcon,
			rightIcon,
			icon,
			iconPosition = "left",
			iconSpacing = "0.6em",
			iconStyle,
			onClick,
			children,
			...rest
		},
		ref
	): JSX.Element => {
		const IconComp = icon ? (
			<Icon name={icon} size={size} {...iconStyle} />
		) : null;

		const default_radius: string =
			size === "lg"
				? "10px"
				: size === "sm"
					? "6px"
					: size === "xs"
						? "4px"
						: "8px";

		return (
			<ChakraButton
				variant={variant}
				isDisabled={disabled || loading}
				isLoading={loading}
				size={size}
				onClick={onClick}
				iconSpacing={children ? iconSpacing : null}
				leftIcon={
					leftIcon
						? leftIcon
						: icon && iconPosition === "left"
							? IconComp
							: null
				}
				rightIcon={
					rightIcon
						? rightIcon
						: icon && iconPosition === "right"
							? IconComp
							: null
				}
				borderRadius={borderRadius || default_radius}
				ref={ref}
				{...rest}
			>
				{children}
			</ChakraButton>
		);
	}
);

Button.displayName = "Button";

export default Button;

// function Button(
// 	{
// 		variant = "solid", // solid, ghost, outline, or link
// 		shape = "default", // default, or rounded
// 		theme = "primary", // "primary" | "accent" | "danger" | "success"
// 		raised = false,
// 		size,
// 		disabled = false,
// 		loading = false,
// 		icon,
// 		iconPosition = "left",
// 		href,
// 		onClick,
// 		children,
// 		...rest
// 	},
// 	ref
// ) {
// 	const IconComp = icon ? <Icon name={icon} size={size} /> : null;
// 	return (
// 		<ChakraButton
// 			variant={variant}
// 			borderRadius={shape === "rounded" ? "full" : "md"}
// 			boxShadow={raised ? "md" : "none"}
// 			_hover={{ boxShadow: raised ? "lg" : "none" }}
// 			isDisabled={disabled || loading}
// 			isLoading={loading}
// 			size={size}
// 			colorScheme={theme}
// 			onClick={onClick}
// 			leftIcon={icon && iconPosition === "left" ? icon : null}
// 			rightIcon={icon && position === "right" ? icon : null}
// 			ref={ref}
// 			{...rest}
// 		>
// 			{children}
// 		</ChakraButton>
// 	);
// }
