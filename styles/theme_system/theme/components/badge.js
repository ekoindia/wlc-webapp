import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

/**
 * Badge component theme with custom variants.
 * Provides primary, muted, success, and error variants
 * that use the app's theme colors.
 */

const baseStyle = defineStyle({
	px: "3",
	py: "1",
	borderRadius: "full",
	fontSize: "xs",
	fontWeight: "medium",
	textTransform: "none",
	userSelect: "none",
});

const variantPrimary = defineStyle({
	bg: "primary.DEFAULT",
	color: "white",
});

const variantMuted = defineStyle({
	bg: "shade",
	color: "light",
});

const variantSuccess = defineStyle({
	bg: "success",
	color: "white",
});

const variantError = defineStyle({
	bg: "error",
	color: "white",
});

export const badgeTheme = defineStyleConfig({
	baseStyle,
	variants: {
		primary: variantPrimary,
		muted: variantMuted,
		success: variantSuccess,
		error: variantError,
	},
});
