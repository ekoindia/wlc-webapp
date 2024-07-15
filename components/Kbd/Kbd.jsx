import { Kbd as ChakraKbd } from "@chakra-ui/react";

/**
 * A <Kbd> component
 * @param root0
 * @param root0.children
 * @example	`<Kbd>F5</Kbd>`
 */
const Kbd = ({ children, ...rest }) => {
	return (
		<ChakraKbd
			display="inline-flex"
			alignItems="center"
			justifyContent="center"
			borderColor="hint"
			lineHeight={1}
			{...rest}
		>
			{children}
		</ChakraKbd>
	);
};

export default Kbd;
