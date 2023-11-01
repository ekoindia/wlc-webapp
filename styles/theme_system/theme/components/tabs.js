import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(tabsAnatomy.keys);

const baseStyle = definePartsStyle({
	root: {
		p: "0",
	},
	tab: {
		// px: "2",
		// fontSize: { base: "sm", md: "lg" },
		// mr: "1.25vw",
		// pb: "4",
		opacity: ".7",
		fontWeight: "semibold",
		boxSizing: "border-box",
		position: "relative",
		whiteSpace: "nowrap",
		_selected: {
			color: "dark",
			bg: "transparent",
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
			height: "4px",
			bottom: "0px",
			borderRadius: "20px 20px 0px 0px",
		},
	},
	tablist: {
		w: "100%",
		overflowX: "auto",
		overflowY: "hidden",
		// borderBottom: "card",
	},
	tabpanels: {
		p: "10px 20px",
	},
});

export const tabsTheme = defineMultiStyleConfig({ baseStyle });
