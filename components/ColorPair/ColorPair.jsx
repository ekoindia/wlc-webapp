import { Box } from "@chakra-ui/react";

/**
 * Show a pair for colors (for showing primary/secondary theme colors)
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.primary	Primary color to show on the left.
 * @param	{string}	prop.accent	Accent color to show on the right.
 * @param	{string}	[prop.size]	Size of the component (diameter of the circle).
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<ColorPair primary="#00F", accent="#F0F" />`
 */
const ColorPair = ({ primary, accent, size = "45px", ...rest }) => {
	return (
		<Box w={size} h={size} borderRadius="50%" {...rest}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
				<defs>
					<clipPath id="a">
						<rect x="30" y="0" width="20" height="50" />
					</clipPath>
				</defs>
				<g transform="rotate(45 25 25)">
					<circle cx="25" cy="25" r="25" fill={primary} />
					<circle
						cx="25"
						cy="25"
						r="25"
						clipPath="url(#a)"
						fill={accent}
					/>
				</g>
			</svg>
		</Box>
	);
};

export default ColorPair;
