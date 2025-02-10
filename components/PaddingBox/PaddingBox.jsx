import { Box } from "@chakra-ui/react";

/**
 * Utility wrapper component to add consistent padding to the page-components.
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @param	{boolean}	[prop.noSpacing]	Flag to remove padding from the component.
 * @param	{any}		[prop.children]		Children
 * @example	`<PaddingBox><PageComponent/></PaddingBox>`
 */
const PaddingBox = ({ children, noSpacing = false, ...rest }) => {
	return (
		<Box
			p={
				!noSpacing
					? {
							base: "0px", //TODO change to 10px, manage full width component separately on small screen
							md: "30px",
							"2xl": "40px",
						}
					: null
			}
			pb={!noSpacing ? { base: "20px", md: "30px" } : null}
			sx={{
				"@media print": {
					padding: "0 !important",
				},
			}}
			{...rest}
		>
			{children}
		</Box>
	);
};

export default PaddingBox;
