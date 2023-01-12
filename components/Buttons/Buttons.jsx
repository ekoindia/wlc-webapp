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
		size,
		rightIcon,
		leftIcon,
		colorType = 1,
		...rest
	} = props;

	const fill = colorType === 1 ? "primary.DEFAULT" : "accent.DEFAULT";
	const hoverFill = colorType === 1 ? "primary.dark" : "accent.dark";

	return (
		<Button
			variant={variant}
			size={size}
			onClick={onClick}
			color="white"
			{...rest}
			bg={fill}
			_hover={{
				bg: hoverFill,
			}}
		>
			{title}
			{children}
		</Button>
	);
};

export default Buttons;
