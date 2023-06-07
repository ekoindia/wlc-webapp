import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const stripedActionNone = defineStyle({
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
		_even: {
			background: "shade",
		},
		_hover: {
			cursor: "pointer",
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
		stripedActionNone,
		stripedActionRedirect,
		stripedActionExpand,
	},
});
