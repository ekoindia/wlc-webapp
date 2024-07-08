import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
	bg: "primary.DEFAULT",
	// boxShadow: "0px 3px 10px #FE9F0040",
	boxShadow: "buttonShadow",
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
	boxShadow: "buttonShadow",
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

const error = defineStyle({
	bg: "error",
	boxShadow: "0px 3px 10px #A52A2A40",
	color: "white",
	_hover: {
		bg: "#A52A2A",
		_disabled: {
			bg: "error",
		},
	},
});

const ghost = defineStyle({
	bg: "white",
	color: "dark",
	boxShadow: "buttonShadow",
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
		error,
		ghost,
		link,
		accent_outline,
		primary_outline,
	},
	baseStyle: {
		borderRadius: "8px",
	},
});
