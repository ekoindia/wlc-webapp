import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(tabsAnatomy.keys);

// Variants Base Style
const baseStyle = definePartsStyle({
	tab: {
		fontWeight: "semibold",
		boxSizing: "border-box",
		whiteSpace: "nowrap",
		_selected: {
			color: "primary.DEFAULT",
			bg: "shade",
		},
		_focusVisible: {
			boxShadow: "none",
		},
	},
	tabpanels: {
		p: "10px 20px",
	},
});

//Default Variant
const defaultVariant = definePartsStyle({
	tab: {
		pos: "relative",
		_selected: {
			color: "dark",
			bg: "transparent",
			_after: {
				display: "block",
			},
		},
		_after: {
			display: "none",
			content: '""',
			bg: "accent.DEFAULT",
			width: "100%",
			pos: "absolute",
			height: "4px",
			bottom: "0px",
			borderRadius: "20px 20px 0px 0px",
		},
	},
	tablist: {
		w: "100%",
		// overflowX: "auto",
		// overflowY: "hidden",
		borderBottom: "card",
	},
});

const variants = {
	default: defaultVariant,
};

export const tabsTheme = defineMultiStyleConfig({ baseStyle, variants });
