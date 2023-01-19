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
		variant = "solid",
		size,
		color,
		colorType = 1,
		...rest
	} = props;

	const fill = colorType === 1 ? "primary.DEFAULT" : "accent.DEFAULT";
	const hoverFill = colorType === 1 ? "primary.dark" : "accent.dark";
	const shade = color ? color : "white";
	return (
		<Button
			size={size}
			onClick={onClick}
			color={shade}
			{...rest}
			bg={fill}
			_hover={{
				bg: hoverFill,
			}}
			_focus={{
				bg: hoverFill,
			}}
		>
			{title}
			{children}
		</Button>
	);
};

export default Buttons;
