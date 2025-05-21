import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
	bg: "primary.DEFAULT",
	// boxShadow: "0px 3px 10px #FE9F0040",
	boxShadow: "sh-button",
	color: "white",
	_hover: {
		bg: "primary.dark",
		_disabled: {
			bg: "primary.DEFAULT",
		},
	},
});

const accent = defineStyle({
	bg: "accent.DEFAULT",
	// boxShadow: "0px 3px 10px #11299E1A",
	boxShadow: "sh-button",
	color: "white",
	_hover: {
		bg: "accent.dark",
		_disabled: {
			bg: "accent.DEFAULT",
		},
	},
});

const success = defineStyle({
	bg: "success",
	boxShadow: "0px 3px 10px #00c34150",
	color: "white",
	_hover: {
		bg: "#00a336",
		_disabled: {
			bg: "success",
		},
	},
});

const ghost = defineStyle({
	bg: "white",
	color: "dark",
	boxShadow: "sh-button",
	_hover: "none",
});

const link = defineStyle({
	color: "dark",
	textDecoration: "none",
	_hover: {
		textDecoration: "none",
	},
	_active: {
		textDecoration: "none",
	},
	_focusVisible: {
		boxShadow: "none",
		color: "dark",
	},
});

const primary_outline = defineStyle({
	// bg: "white",
	border: "2px solid",
	borderColor: "primary.DEFAULT",
	color: "primary.DEFAULT",
	_hover: {
		color: "white",
		bg: "primary.DEFAULT",
	},
});

const accent_outline = defineStyle({
	// bg: "white",
	border: "2px solid",
	borderColor: "accent.DEFAULT",
	color: "accent.DEFAULT",
	_hover: {
		color: "white",
		bg: "accent.DEFAULT",
	},
});

export const buttonTheme = defineStyleConfig({
	variants: {
		primary,
		accent,
		success,
		ghost,
		link,
		outline: accent_outline,
		accent_outline,
		primary_outline,
	},
	baseStyle: {
		borderRadius: "8px",
	},
});
