import { Button } from "@chakra-ui/react";
import React from "react";

/**
 * A <Button> component
 * @param	{string}    title - Button Title
 * @param 	{string}	variant	- Variant of button
 */

function Buttons(props, ref) {
	const {
		title,
		children,
		onClick,
		variant = "primary",
		size,
		color,
		// colorType = 1,
		...rest
	} = props;

	// const fill = colorType === 1 ? "primary.DEFAULT" : "accent.DEFAULT";
	// const hoverFill = colorType === 1 ? "primary.dark" : "accent.dark";
	// const shade = color ? color : "white";
	return (
		<Button
			variant={variant}
			size={size}
			onClick={onClick}
			{...rest}
			// color={shade}
			// bg={fill}
			// _hover={{
			//     bg: hoverFill,
			// }}
			// _focus={{
			//     bg: hoverFill,
			// }}
			ref={ref}
		>
			{title}
			{children}
		</Button>
	);
}

Buttons = React.forwardRef(Buttons);

export default Buttons;
