import { switchAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(switchAnatomy.keys);

/**
 * Custom color scheme styles for primary and accent colors.
 * Since our theme uses DEFAULT/light/dark instead of numeric scales,
 * we need to manually define the track colors.
 */
const variantPrimary = definePartsStyle({
	track: {
		bg: "gray.300",
		_checked: {
			bg: "primary.DEFAULT",
		},
		_focus: {
			boxShadow: "none",
		},
	},
});

const variantAccent = definePartsStyle({
	track: {
		bg: "gray.300",
		_checked: {
			bg: "accent.DEFAULT",
		},
		_focus: {
			boxShadow: "none",
		},
	},
});

const baseStyle = definePartsStyle({
	track: {
		_focus: {
			boxShadow: "none",
		},
	},
});

export const switchTheme = defineMultiStyleConfig({
	baseStyle,
	variants: {
		primary: variantPrimary,
		accent: variantAccent,
	},
});
