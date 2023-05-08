import { Button as ChakraButton, position } from "@chakra-ui/react";
import { forwardRef } from "react";

/**
 * A <Button> component
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.variant]	Button variant:	"primary" | "secondary" | "outline" | "ghost" | "link" | "solid" | "unstyled"
 * @param	{boolean}	[prop.disabled]	Disable the button
 * @param	{boolean}	[prop.loading]	Show loading state
 * @param	{string}	[prop.size]	Size of the button: "lg" | "md" | "sm" | "xs"
 * @param	{string}	[prop.icon]	Icon to show in the button
 * @param	{string}	[prop.iconPosition]	Position of the icon
 * @param	{string}	[prop.iconSpacing]	Spacing between the icon and the text
 * @param	{function}	[prop.onClick]	Click handler
 * @param	{string}	[prop.children]	Children elements of the button
 * @example	`<Button>Click Me</Button>`
 */
function Button(props, ref) {
	const {
		variant = "primary",
		disabled = false,
		loading = false,
		size,
		icon,
		iconPosition = "left",
		iconSpacing = "5px",
		onClick,
		children,
		...rest
	} = props;

	return (
		<ChakraButton
			variant={variant}
			isDisabled={disabled || loading}
			isLoading={loading}
			size={size}
			onClick={onClick}
			iconSpacing={iconSpacing}
			leftIcon={iconPosition === "left" ? icon : null}
			rightIcon={position === "right" ? icon : null}
			ref={ref}
			{...rest}
		>
			{children}
		</ChakraButton>
	);
}

export default forwardRef(Button);
