import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(tabsAnatomy.keys);

// Variants Base Style
const baseStyle = definePartsStyle({
	tab: {
		opacity: ".7",
		fontWeight: "semibold",
		boxSizing: "border-box",
		position: "relative",
		whiteSpace: "nowrap",
		_selected: {
			color: "primary.DEFAULT",
			bg: "shade",
			opacity: "1",
			_after: {
				display: "block",
			},
		},
	},
	tabpanels: {
		p: "10px 20px",
	},
});

//Base Variant
const defaultVariant = definePartsStyle({
	tab: {
		_selected: {
			color: "dark",
			bg: "transparent",
		},
		_after: {
			display: "none",
			content: '""',
			bg: "accent.DEFAULT",
			width: "100%",
			position: "absolute",
			height: "4px",
			bottom: "0px",
			borderRadius: "20px 20px 0px 0px",
		},
	},
	tablist: {
		w: "100%",
		overflowX: "auto",
		overflowY: "hidden",
		borderBottom: "card",
	},
});

const variants = {
	default: defaultVariant,
};

export const tabsTheme = defineMultiStyleConfig({ baseStyle, variants });
