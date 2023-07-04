import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyle = definePartsStyle({
	control: {
		w: "5",
		h: "5",
		borderColor: "accent.DEFAULT",
		borderWidth: "1px",
		borderStyle: "solid",
		borderRadius: "4",

		_checked: {
			bg: "accent.DEFAULT",
			borderColor: "accent.DEFAULT",
			_hover: {
				bg: "accent.dark",
				borderColor: "accent.dark",
			},
		},

		_focus: {
			boxShadow: "none",
		},
	},
});

export const checkboxTheme = defineMultiStyleConfig({ baseStyle });
