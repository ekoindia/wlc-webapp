/**
 * Get the luminance of a color.
 * @param {number} r - The red value (0-255).
 * @param {number} g - The green value (0-255).
 * @param {number} b - The blue value (0-255).
 * @returns {number} The luminance value of the color.
 */
const luminance = (r, g, b) => {
	const a = [r, g, b].map(function (v) {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

/**
 * Returns contrast between two colors.
 * The minimum contrast for proper legibility should be 4.5 for small text and 3 for large text.
 * @param {object} rgb1 - The first color object { r, g, b }.
 * @param {object} rgb2 - The second color object { r, g, b }.
 * @returns {number} The contrast value between the two colors
 */
const contrast = (rgb1, rgb2) => {
	const lum1 = luminance(rgb1);
	const lum2 = luminance(rgb2);
	const brightest = Math.max(lum1, lum2);
	const darkest = Math.min(lum1, lum2);
	return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Returns true, if the contrast between two colors is greater than the minimum ratio.
 * @param {string} hex1 - The first hexadecimal color string (e.g., "#RGB", "#RRGGBB").
 * @param {string} hex2 - The second hexadecimal color string (e.g., "#RGB", "#RRGGBB").
 * @param {number} [minimumRatio] - The minimum contrast ratio required (default is 4.5). Should be 3 for large text.
 * @returns {boolean} True if the contrast between the two colors is greater than the minimum ratio.
 */
export function hasMinimumContrast(hex1, hex2, minimumRatio = 4.5) {
	const rgb1 = hexToRgba(hex1);
	const rgb2 = hexToRgba(hex2);
	const ratio = contrast(rgb1, rgb2);
	return ratio >= minimumRatio;
}

/**
 * Return the first contrasting color from the list of colors.
 * @param {string} color - The main hexadecimal color string (e.g., "#RGB", "#RRGGBB") with which to compare the rest.
 * @param {...string} colors - Rest of hexadecimal color strings to find the first contrasting color.
 * @returns {string} The first contrasting color out of the rest of the colors.
 */
export function getFirstContrastColor(color, ...colors) {
	const rgb1 = hexToRgba(color);
	for (let i = 0; i < colors.length; i++) {
		const rgb2 = hexToRgba(colors[i]);
		if (hasMinimumContrast(rgb1, rgb2)) {
			return colors[i];
		}
	}
	return null;
}

/**
 * Converts a hexadecimal color string to an RGBA object.
 * @param {string} hex - The hexadecimal color string (e.g., "#RGB", "#RRGGBB" or "#RRGGBBAA").
 * @returns {object | null} An object containing the RGBA values { r, g, b, a }, or null if the input is invalid.
 */
export const hexToRgba = (hex) => {
	if (!hex) return null;

	if (hex === "transparent") {
		return { r: 0, g: 0, b: 0, a: 0 };
	}

	if (hex.length === 4) {
		// Convert 3-digit hex to 6-digit hex
		hex = hex.replace(/^#(.)(.)(.)$/, "#$1$1$2$2$3$3");
	}

	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(
		hex
	);
	if (!result) return null;

	let r = parseInt(result[1], 16);
	let g = parseInt(result[2], 16);
	let b = parseInt(result[3], 16);
	let a = result[4] ? parseInt(result[4], 16) / 255 : 1; // Default alpha is 1 if not specified

	return { r, g, b, a };
};

/**
 * Converts an RGBA object to a hexadecimal color string.
 * @param {object} rgba - An object containing the RGBA values { r, g, b, a }.
 * @param {boolean} [ignoreAlpha] - If true, the alpha value will not be included in the output.
 * @returns {string} The hexadecimal color string (e.g., "#RRGGBB" or "#RRGGBBAA").
 */
export const rgbaToHex = (rgba, ignoreAlpha = false) => {
	if (!rgba) return null;
	let { r = 0, g = 0, b = 0, a = 1 } = rgba;
	let alphaHex =
		ignoreAlpha !== true && a
			? Math.round(a * 255)
					.toString(16)
					.padStart(2, "0")
			: "FF"; // Convert alpha to hexadecimal
	return `#${r.toString(16).padStart(2, "0")}${g
		.toString(16)
		.padStart(2, "0")}${b.toString(16).padStart(2, "0")}${
		ignoreAlpha ? "" : alphaHex
	}`;
};

/**
 * Darkens an RGB color by a specified percentage.
 * @param {object} rgb - An object containing the RGB values { r, g, b }.
 * @param {number} percentage - The percentage by which to darken the color (0-100).
 * @returns {object} An object containing the darkened RGB values { r, g, b }.
 */
export const darken = (rgb, percentage) => {
	return {
		r: Math.max(0, rgb.r - Math.round(2.55 * percentage)),
		g: Math.max(0, rgb.g - Math.round(2.55 * percentage)),
		b: Math.max(0, rgb.b - Math.round(2.55 * percentage)),
	};
};

/**
 * Lightens an RGB color by a specified percentage.
 * @param {object} rgb - An object containing the RGB values { r, g, b }.
 * @param {number} percentage - The percentage by which to lighten the color (0-100).
 * @returns {object} An object containing the lightened RGB values { r, g, b }.
 */
export const lighten = (rgb, percentage) => {
	return {
		r: Math.min(255, rgb.r + Math.round(2.55 * percentage)),
		g: Math.min(255, rgb.g + Math.round(2.55 * percentage)),
		b: Math.min(255, rgb.b + Math.round(2.55 * percentage)),
	};
};

/**
 * Generates a darker and lighter color shades based on the input color.
 * @param {string} color - The hexadecimal color string (e.g., "#RRGGBB" or "#RRGGBBAA").
 * @param {number} [degree] - The percentage by which to darken and lighten the color (0-100).
 * @returns {object} An object containing the darker and lighter color themes { dark, light }.
 */
export const generateShades = (color, degree = 10) => {
	// Convert the color from hex to RGBA.
	let rgba = hexToRgba(color);

	const hasAlpha = color.length > 7;

	if (!rgba) {
		throw new Error(
			'Invalid color format. Please use "#RRGGBB" or "#RRGGBBAA".'
		);
	}

	// Generate a darker version of the color.
	let dark = darken(rgba, degree);

	// Generate a lighter version of the color.
	let light = lighten(rgba, degree);

	// Convert the colors back to hex.
	let darkHex = rgbaToHex(dark, !hasAlpha);
	let lightHex = rgbaToHex(light, !hasAlpha);

	return { dark: darkHex, light: lightHex };
};

/**
 * Get a contrasting color (black or white) based on the input color.
 * @param {string} hex - The hexadecimal color string (e.g., "#RGB", "#RRGGBB" or "#RRGGBBAA").
 * @returns {string} The contrasting color (either "black" or "white").
 */
export const getContrastColor = (hex) => {
	if (hex === "transparent") {
		return "black";
	}
	if (
		hex.startsWith("primary") ||
		hex.startsWith("accent") ||
		hex.startsWith("linear-gradient")
	) {
		return "white";
	}

	let rgba = hexToRgba(hex);
	if (!rgba) {
		throw new Error(
			'Invalid color format. Expected "#RRGGBB" or "#RRGGBBAA" format. Found: ' +
				hex
		);
	}

	// Calculate the relative luminance of the color.
	let luminance = 0.2126 * rgba.r + 0.7152 * rgba.g + 0.0722 * rgba.b;

	// Return either black or white based on the luminance.
	return luminance > 128 ? "black" : "white";
};

/**
 * For the given color, return either color2 or color3 based on the contrast ratio.
 * @param {string} color - The hexadecimal color string (e.g., "#RGB", "#RRGGBB" or "#RRGGBBAA").
 * @param {string} color2 - The first hexadecimal color string (e.g., "#RGB", "#RRGGBB" or "#RRGGBBAA").
 * @param {string} color3 - The second hexadecimal color string (e.g., "#RGB", "#RRGGBB" or "#RRGGBBAA").
 * @returns {string} The color with the highest contrast ratio.
 */
export const getHighContrastColor = (color, color2, color3) => {
	return contrast(color, color2) > contrast(color, color3) ? color2 : color3;
};
