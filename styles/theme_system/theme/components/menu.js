import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
	list: {
		minW: "180px",
		border: "none",
		boxShadow: "sh-button",
		zIndex: 100,
	},
	item: {
		color: "dark",
		minHeight: "48px",
		fontSize: "sm",
		_hover: {
			bg: "divider",
		},
		_focus: {
			bg: "divider",
		},
	},
});

const primary = definePartsStyle({});

const accent = definePartsStyle({});

const primary_outline = definePartsStyle({});

const accent_outline = definePartsStyle({});

const ghost = definePartsStyle({});

export const menuTheme = defineMultiStyleConfig({
	baseStyle,
	variants: {
		primary,
		accent,
		primary_outline,
		accent_outline,
		ghost,
	},
});
