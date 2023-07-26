import { radioAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(radioAnatomy.keys);

const baseStyle = definePartsStyle({
	control: {
		borderColor: "primary.DEFAULT",
		borderWidth: "1px",
		borderStyle: "solid",

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
	},
});

export const radioTheme = defineMultiStyleConfig({ baseStyle });
