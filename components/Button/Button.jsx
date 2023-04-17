import { Button as ChakraButton } from "@chakra-ui/react";
import { forwardRef } from "react";

/**
 * A <Button> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Button></Button>`
 */
function Button(props, ref) {
	const {
		children,
		onClick,
		variant = "primary",
		size,
		disabled = false,
		...rest
	} = props;

	return (
		<ChakraButton
			disabled={disabled}
			size={size}
			variant={variant}
			onClick={onClick}
			{...rest}
			ref={ref}
		>
			{children}
		</ChakraButton>
	);
}

export default forwardRef(Button);
