import { Button } from "@chakra-ui/react";
import { forwardRef } from "react";

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

export default forwardRef(Buttons);
