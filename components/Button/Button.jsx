import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
/**
 * A <Button> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Button></Button>`
 */
const Button = ({ className = "", props }) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required

	const { title, children, onClick, variant, colorScheme, size } = props;

	return (
		<Button
			variant={variant}
			colorScheme={colorScheme}
			size={size}
			onClick={onClick}
		>
			{title}
			{children}
		</Button>
	);
};

Button.defaultProps = {
	variant: "solid",
	colorScheme: "#FE9F00",
};

export default Button;
