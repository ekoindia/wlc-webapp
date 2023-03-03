import { Button } from "@chakra-ui/react";
import React from "react";

function Buttons(props, ref) {
	const {
		title,
		children,
		onClick,
		variant = "primary",
		size,
		...rest
	} = props;

	return (
		<Button
			variant={variant}
			size={size}
			onClick={onClick}
			{...rest}
			ref={ref}
		>
			{title}
			{children}
		</Button>
	);
}

Buttons = React.forwardRef(Buttons);

export default Buttons;
