import { Button as ChakraButton, position } from "@chakra-ui/react";
import { forwardRef } from "react";

/**
 * A <Button> component
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Button></Button>`
 */
function Button(props, ref) {
	const {
		variant = "primary",
		disabled = false,
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
			disabled={disabled}
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
