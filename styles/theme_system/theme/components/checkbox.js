import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyle = definePartsStyle({
	control: {
		w: "5",
		h: "5",
		borderColor: "primary.DEFAULT",
		borderWidth: "2px",
		borderStyle: "solid",
		borderRadius: "4",

		_checked: {
			bg: "primary.DEFAULT",
			borderColor: "primary.DEFAULT",
			_hover: {
				bg: "primary.dark",
				borderColor: "primary.dark",
			},
		},

		_focus: {
			boxShadow: "none",
		},

		_invalid: {
			borderColor: "error",
		},
	},
});

export const checkboxTheme = defineMultiStyleConfig({ baseStyle });
