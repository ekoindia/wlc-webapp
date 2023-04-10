import { Box } from "@chakra-ui/react";

/**
 * A <PaddingBox> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<PaddingBox></PaddingBox>`
 */
const PaddingBox = ({ children }) => {
	return <Box>{children}</Box>;
};

export default PaddingBox;
