import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const striped = defineStyle({
	tr: {
		_even: {
			background: "shade",
		},
	},
	th: {
		textTransform: "Capitalize",
		bg: "hint",
		transition: "none",
	},
});

const stripedActionRedirect = defineStyle({
	tr: {
		_even: {
			background: "shade",
		},
		_hover: {
			bg: "#e6e6e6",
			transition: "background 200ms ease-in",
			cursor: "pointer",
		},
	},
	th: {
		textTransform: "Capitalize",
		bg: "hint",
		transition: "none",
	},
});

const stripedActionExpand = defineStyle({
	tr: {
		cursor: "pointer",
		_even: {
			background: "shade",
		},
	},
	th: {
		textTransform: "Capitalize",
		bg: "hint",
		transition: "none",
	},
});

export const tableTheme = defineStyleConfig({
	variants: {
		striped,
		stripedActionRedirect,
		stripedActionExpand,
	},
});
