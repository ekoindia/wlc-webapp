import { extendTheme } from "@chakra-ui/react";

export const light = extendTheme({
	colors: {
		primary: {
			light: "#ffad23",
			DEFAULT: "#FE9F00",
			dark: "#f38300",
		},
		accent: {
			light: "#1d3ac9",
			DEFAULT: "#11299E",
			dark: "#0d2289",
		},
		secondary: {
			light: "#2d6cbf",
			DEFAULT: "#1F5AA7",
			dark: "#164d94",
		},
		success: "#00C341",
		error: "#FF4081",
		divider: "#E9EDF1",
		hint: "#D2D2D2",
		dark: "#0F0F0F",
		light: "#555555",
	},
  borders: {
    success: "#00C341",
  }
});
