import { radioAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(radioAnatomy.keys);

const baseStyle = definePartsStyle({
	control: {
		borderColor: "accent.DEFAULT",
		borderWidth: "1px",
		borderStyle: "solid",

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

export const radioTheme = defineMultiStyleConfig({ baseStyle });
