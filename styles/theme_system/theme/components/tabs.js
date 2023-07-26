import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define a custom variant
const colorfulVariant = definePartsStyle({
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
			color: "dark",
			opacity: "1",
			_after: {
				display: "block",
			},
		},
		_after: {
			display: "none",
			content: '""',
			bg: "accent.DEFAULT",
			width: "100%",
			position: "absolute",
			height: "5px",
			bottom: "-0.5px",
			borderRadius: "30px",
		},
	},
	tablist: {
		borderBottom: "card",
		overflow: "auto",
		overflowY: "hidden",
	},
	tabpanel: {
		px: "0",
	},
});

const variants = {
	colorful: colorfulVariant,
};

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ variants });
