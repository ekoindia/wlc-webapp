import { Kbd as ChakraKbd } from "@chakra-ui/react";

/**
 * A <Kbd> component
 * @example	`<Kbd>F5</Kbd>`
 */
const Kbd = ({ children, ...rest }) => {
	return (
		<ChakraKbd
			display="inline-flex"
			alignItems="center"
			justifyContent="center"
			borderColor="hint"
			{...rest}
		>
			{children}
		</ChakraKbd>
	);
};

export default Kbd;
