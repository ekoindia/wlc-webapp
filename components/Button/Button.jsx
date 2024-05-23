import { Button as ChakraButton } from "@chakra-ui/react";
import { Icon } from "components";
import { forwardRef } from "react";

/**
 * A <Button> component
 * @param 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.variant="accent"]	Button variant:	"primary" | "accent" | "outline" | "ghost" | "link" | "solid" | "unstyled"
 * @param	{boolean}	[prop.disabled=false]	Disable the button
 * @param	{boolean}	[prop.loading=false]	Show loading state
 * @param	{string}	[prop.size]	Size of the button: "lg" | "md" | "sm" | "xs"
 * @param	{string}	[prop.icon]	Icon to show in the button
 * @param	{string}	[prop.iconPosition="left"]	Position of the icon
 * @param	{string}	[prop.iconSpacing]	Spacing between the icon and the text
 * @param	{function}	[prop.onClick]	Click handler
 * @param	{string}	[prop.children]	Children elements of the button
 * @param	{...*}		rest	Rest of the props
 * @param	{React.Ref}	ref	Reference to the button element
 * @example	`<Button onClick={()=>{...}}>Click Me</Button>`
 */
const Button = forwardRef(
	(
		{
			variant = "accent",
			disabled = false,
			loading = false,
			size,
			borderRadius,
			icon,
			iconPosition = "left",
			iconSpacing = "5px",
			iconStyle,
			onClick,
			children,
			...rest
		},
		ref
	) => {
		const IconComp = icon ? (
			<Icon name={icon} size={size} {...iconStyle} />
		) : null;

		const default_radius =
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
				leftIcon={icon && iconPosition === "left" ? IconComp : null}
				rightIcon={icon && iconPosition === "right" ? IconComp : null}
				borderRadius={borderRadius || default_radius}
				ref={ref}
				{...rest}
			>
				{children}
			</ChakraButton>
		);
	}
);

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

Button.displayName = "Button";

export default Button;
