import { extendTheme, theme } from "@chakra-ui/react";
import { Inter, Roboto } from "@next/font/google";
import { tabsTheme } from "./theme_system/theme/components/tab";

const inter = Inter({
	weight: ["400", "500", "600", "700", "800"],
	style: ["normal"],
	fallback: ["system-ui", "sans-serif"],
	subsets: ["latin"],
});
const roboto = Roboto({
	weight: ["400", "500", "700"],
	style: ["normal"],
	fallback: ["system-ui", "sans-serif"],
	subsets: ["latin"],
});

// console.log(theme.components.Tabs.baseStyle);
// console.log(tabsTheme);
// console.log(theme)

export const light = extendTheme({
	breakpoints: {
		base: "0",
		sm: "440px",
		md: "768px",
		lg: "1024px",
		xl: "1200px",
		"2xl": "1800px",
	},
	components: {
		Table: {
			variants: {
				evenStripedClickableRow: {
					tr: {
						_even: {
							background: "shade",
						},
						_hover: {
							// bg: "#fea1000d",
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
				},
				evenStriped: {
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
				},
			},
		},
		Button: {
			...theme.components.Button,
			baseStyle: {
				...theme.components.Button.baseStyle,
				_disabled: {
					bg: "gray.200",
					color: "gray.500",
				},
				_hover: {
					_disabled: {
						bg: "gray.200",
						color: "gray.500",
					},
				},
			},
			variants: {
				primary: {
					bg: "primary.DEFAULT",
					boxShadow: "0px 3px 10px #FE9F0040",
					borderRadius: 10,
					color: "white",
					_hover: {
						bg: "primary.dark",
					},
				},
				accent: {
					bg: "accent.DEFAULT",
					// boxShadow: "0px 3px 10px #11299e5f",
					boxShadow: "0px 3px 10px #11299E1A",
					borderRadius: 10,
					color: "white",
					_hover: {
						bg: "accent.dark",
					},
				},
				success: {
					bg: "success",
					boxShadow: "0px 3px 10px #00c34150",
					borderRadius: 10,
					color: "white",
					_hover: {
						bg: "#00a336",
					},
				},
				link: {
					_hover: {
						textDecoration: "none",
					},
				},
			},
		},
		Checkbox: {
			variants: {
				rounded: {
					control: {
						w: "15px",
						h: "15px",
						border: "1px solid #11299E",
						borderColor: "#11299E",
						borderRadius: "3px",
						_checked: {
							bg: "#11299E",
						},
						_focus: {
							boxShadow: "none",
						},
					},
				},
			},
		},
		Tabs: tabsTheme,
		Heading: {
			variants: {
				selectNone: {
					...theme.components.Heading,
					userSelect: "none",
				},
			},
		},
		Text: {
			variants: {
				selectNone: {
					userSelect: "none",
				},
			},
		},
	},
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
		shadow: {
			primary: "#FE9F008C",
			accent: "#11299e96",
			success: "#009B34",
			error: "#CA1B56",
		},
		success: "#00C341",
		error: "#FF4081",
		divider: "#E9EDF1",
		hint: "#D2D2D2",
		dark: "#0F0F0F",
		light: "#555555",
		focusbg: "#FFFBF3",
		white: "#FFFFFF",
		shade: "#F2F2F2",
		highlight: "#FFD93B",
		bg: "#F5F6F8",
		inputlabel: "#0C243B",
	},
	styles: {
		global: {},
	},
	borders: {
		none: 0,
		"1px": "1px solid",
		"2px": "0.125rem solid",
		"10px": "0.625rem solid",
		card: "1px solid #D2D2D2",
	},
	radii: {
		none: "0",
		base: "0.25rem",
		sm: "0.125rem",
		md: "0.375rem",
		lg: "0.5rem",
		xl: "0.75rem",
		"2xl": "1rem",
		"3xl": "1.5rem",
		full: "9999px",
		// According to ds
		5: "5px",
		10: "10px",
		15: "15px",
		20: "20px",
	},
	shadows: {},
	sizes: {
		max: "max-content",
		min: "min-content",
		full: "100%",
		"3xs": "14rem",
		"2xs": "16rem",
		xs: "20rem",
		sm: "24rem",
		md: "28rem",
		lg: "32rem",
		xl: "36rem",
		"2xl": "42rem",
		"3xl": "48rem",
		"4xl": "56rem",
		"5xl": "64rem",
		"6xl": "72rem",
		"7xl": "80rem",
		"8xl": "90rem",
		container: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
		},
	},
	space: {
		px: "1px",
		0.5: "0.125rem",
		1: "0.25rem",
		1.5: "0.375rem",
		2: "0.5rem",
		2.5: "0.625rem", // 10px
		3: "0.75rem",
		3.5: "0.875rem", // 14px
		4: "1rem", // 16px
		5: "1.25rem", //20px
		6: "1.5rem", //24px
		7: "1.75rem", // 28px
		7.5: "1.875rem", // 28px - added
		8: "2rem",
		8.5: "2.125rem", // 24px- added
		9: "2.25rem",
		10: "2.5rem",
		10.5: "2.625rem", // 42px - added
		12: "3rem",
		14: "3.5rem", //56px
		16: "4rem",
		17: "4.5rem",
		20: "5rem",
		24: "6rem",
		28: "7rem",
		32: "8rem",
		36: "9rem",
		40: "10rem",
		44: "11rem",
		48: "12rem",
		52: "13rem",
		56: "14rem",
		60: "15rem",
		64: "16rem",
		72: "18rem",
		80: "20rem",
		96: "24rem",
	},
	fonts: {
		// body: `${inter.style.fontFamily}`,
		heading: `${inter.style.fontFamily}`,
		roboto_font: `${roboto.style.fontFamily}`,
	},
	fontSizes: {
		vxs: "0.5rem",
		xs: "0.75rem", // 12px
		sm: "0.875rem", // 14px
		md: "1rem", // 16px
		lg: "1.125rem", // 18px
		xl: "1.25rem", // 20px
		"2xl": "1.5rem", // 24px
		"3xl": "1.875rem",
		"4xl": "2.25rem",
		"5xl": "3rem",
		"6xl": "3.75rem",
		"7xl": "4.5rem",
		"8xl": "6rem",
		"9xl": "8rem",
	},
	fontWeights: {
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
		extrabold: 800,
	},
	lineHeights: {
		normal: "normal",
		none: 1,
		shorter: 1.25,
		short: 1.375,
		base: 1.5,
		tall: 1.625,
		taller: "2",
		"3": ".75rem",
		"4": "1rem",
		"5": "1.25rem",
		"6": "1.5rem",
		"7": "1.75rem",
		"8": "2rem",
		"9": "2.25rem",
		"10": "2.5rem",
	},
	letterSpacings: {
		...theme.letterSpacings,
	},
});
