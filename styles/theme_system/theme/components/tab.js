import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(tabsAnatomy.keys);
// define a custom variant
const colorfulVariant = definePartsStyle((props) => {
	return {
		root: {
			p: { base: "0", md: "none" },
		},
		tab: {
			px: "2",
			fontSize: { base: "sm", md: "lg" },
			mr: "1.25vw",
			pb: "4",
			opacity: ".5",
			fontWeight: "semibold",
			boxSizing: "border-box",
			position: "relative",
			whiteSpace: "nowrap",
			_selected: {
				color: "#0F0F0F",
				opacity: "1",
				_after: {
					display: "block",
				},
			},
			_after: {
				display: "none",
				content: '""',
				bg: "#FE9F00",
				width: "100%",
				position: "absolute",
				height: "5px",
				bottom: "-0.5px",
				borderRadius: "30px",
			},
		},
		tablist: {
			borderBottom: "1px solid #E9EDF1",
			overflow: "auto",
			overflowY: "hidden",
		},
		tabpanel: {
			px: "0",
		},
	};
});

const variants = {
	colorful: colorfulVariant,
};

// const baseStyle = definePartsStyle({
//     // define the part you're going to style
//     tab: {
//         fontWeight: 'semibold', // change the font weight
//         color: "red"
//     },
//     tabpanel: {
//         fontFamily: 'mono', // change the font family
//     },
// })
// export the component theme
export const tabsTheme = defineMultiStyleConfig({ variants });

// // now we can use the `colorful` variant with a different color Scheme
// < Tabs variant = "colorful" colorScheme = "purple" ... />
