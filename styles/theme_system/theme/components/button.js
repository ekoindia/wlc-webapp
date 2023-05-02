import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
	bg: "primary.DEFAULT",
	boxShadow: "0px 3px 10px #FE9F0040",
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
	boxShadow: "0px 3px 10px #11299E1A",
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
	_hover: "none",
});
const link = defineStyle({
	color: "dark",
	_hover: {
		textDecoration: "underline",
	},
});
const primary_outline = defineStyle({
	border: "1px solid",
	borderColor: "primary.dark",
	color: "primary.dark",
});
const accent_outline = defineStyle({
	border: "1px solid",
	borderColor: "accent.dark",
	color: "accent.dark",
});

export const buttonTheme = defineStyleConfig({
	variants: {
		primary,
		accent,
		success,
		ghost,
		accent_outline,
		primary_outline,
		link,
	},
	baseStyle: { borderRadius: "10px" },
});
