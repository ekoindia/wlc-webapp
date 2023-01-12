import { Button } from "@chakra-ui/react";
import { useState } from "react";
/**
 * A <Button> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Button></Button>`
 */
const Buttons = (props) => {
	const [count, setCount] = useState(0); // TODO: Edit state as required
	const {
		title,
		children,
		onClick,
		variant,
		fill,
		size,
		rightIcon,
		leftIcon,
	} = props;

	return (
		<Button
			variant={variant}
			colorScheme={fill}
			size={size}
			onClick={onClick}
			rightIcon={rightIcon}
			leftIcon={leftIcon}
			style={{ textDecoration: "none" }}
		>
			{title}
			{children}
		</Button>
	);
};

Buttons.defaultProps = {
	variant: "solid",
	colorScheme: "primary.DEFAULT",
	size: "lg",
	rightIcon: "",
	leftIcon: "",
};

export default Buttons;
