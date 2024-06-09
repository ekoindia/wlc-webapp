/**
 * Option list of size values in px: 0 to 160px.
 * Can be used for sizing or spacing.
 */
export const pixelSizeOptions = [
	{ label: "0px", value: "0px" },
	{ label: "4px", value: "4px" },
	{ label: "8px", value: "8px" },
	{ label: "16px", value: "16px" },
	{ label: "24px", value: "24px" },
	{ label: "32px", value: "32px" },
	{ label: "40px", value: "40px" },
	{ label: "48px", value: "48px" },
	{ label: "56px", value: "56px" },
	{ label: "64px", value: "64px" },
	{ label: "72px", value: "72px" },
	{ label: "80px", value: "80px" },
	{ label: "88px", value: "88px" },
	{ label: "96px", value: "96px" },
	{ label: "104px", value: "104px" },
	{ label: "112px", value: "112px" },
	{ label: "120px", value: "120px" },
	{ label: "128px", value: "128px" },
	{ label: "136px", value: "136px" },
	{ label: "144px", value: "144px" },
	{ label: "152px", value: "152px" },
	{ label: "160px", value: "160px" },
];

/**
 * Option list of quick padding values: xs, sm, md, lg.
 */

/**
 * Option list of quick size values: sm, md, lg.
 */
export const quickSizeOptions = [
	{ label: "Small", value: "sm" },
	{ label: "Medium", value: "md" },
	{ label: "Large", value: "lg" },
];

/**
 * Option list of extended size values: xs, sm, md, lg, xl, 2xl
 */
export const extendedSizeOptions = [
	{ label: "Zero", value: "0" },
	{ label: "Extra Small", value: "xs" },
	{ label: "Small", value: "sm" },
	{ label: "Medium", value: "md" },
	{ label: "Large", value: "lg" },
	{ label: "Extra Large", value: "xl" },
	{ label: "2X Large", value: "2xl" },
];

/**
 * Mapping of size values to responsive pixel values for padding & margin
 */
export const paddingSizeMap = {
	xs: { base: "4px", md: "8px" },
	sm: { base: "8px", md: "16px" },
	md: { base: "10px", md: "24px" },
	lg: { base: "16px", md: "32px" },
	xl: { base: "20px", md: "40px" },
	"2xl": { base: "24px", md: "48px" },
};

/**
 * Theme dark colors
 */
export const bgColors = [
	{ label: "Select...", value: "" },
	{ label: "Primary", value: "primary.DEFAULT" },
	{ label: "Primary (Dark)", value: "primary.dark" },
	{ label: "Primary (Light)", value: "primary.light" },
	{ label: "Accent", value: "accent.DEFAULT" },
	{ label: "Accent (Dark)", value: "accent.dark" },
	{ label: "Accent (Light)", value: "accent.light" },
	{ label: "White", value: "white" },
	{ label: "Transparent", value: "transparent" },
];
