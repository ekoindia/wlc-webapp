import { Box } from "@chakra-ui/react";

/**
 * A <PaddingBox> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<PaddingBox></PaddingBox>`
 */
const PaddingBox = ({ children, noSpacing = false, ...rest }) => {
	return (
		<Box
			p={
				!noSpacing
					? {
							base: "0px",
							md: "2vw",
							"2xl": "1.5vw",
					  }
					: null
			}
			pb={!noSpacing ? { base: "20px", md: "30px", "2xl": "30px" } : null}
			{...rest}
		>
			{children}
		</Box>
	);
};

export default PaddingBox;
