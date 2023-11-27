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
	},
});

const primary_outline = defineStyle({
	bg: "white",
	border: "1px solid",
	borderColor: "primary.DEFAULT",
	color: "primary.DEFAULT",
	boxShadow: "buttonShadow",
	_hover: {
		color: "primary.dark",
		borderColor: "primary.dark",
		boxShadow: "none",
	},
	// _active: {
	// 	bg: "primary.DEFAULT",
	// 	color: "white",
	// 	borderColor: "white",
	// },
});

const accent_outline = defineStyle({
	bg: "white",
	border: "1px solid",
	borderColor: "accent.DEFAULT",
	color: "accent.DEFAULT",
	boxShadow: "buttonShadow",
	_hover: {
		color: "accent.dark",
		borderColor: "accent.dark",
		boxShadow: "none",
	},
	// _active: {
	// 	bg: "accent.DEFAULT",
	// 	color: "white",
	// 	borderColor: "white",
	// },
});

export const buttonTheme = defineStyleConfig({
	variants: {
		primary,
		accent,
		success,
		ghost,
		link,
		accent_outline,
		primary_outline,
	},
	baseStyle: { borderRadius: "10px" },
});
