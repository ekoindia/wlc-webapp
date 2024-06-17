/**
 * Converts a hexadecimal color string to an RGBA object.
 * @param {string} hex - The hexadecimal color string (e.g., "#RRGGBB" or "#RRGGBBAA").
 * @returns {Object|null} An object containing the RGBA values { r, g, b, a }, or null if the input is invalid.
 */
export const hexToRgba = (hex) => {
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
 * @param {Object} rgba - An object containing the RGBA values { r, g, b, a }.
 * @param {boolean} [ignoreAlpha] - If true, the alpha value will not be included in the output.
 * @returns {string} The hexadecimal color string (e.g., "#RRGGBB" or "#RRGGBBAA").
 */
export const rgbaToHex = (rgba, ignoreAlpha = false) => {
	let { r, g, b, a } = rgba;
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
 * @param {Object} rgb - An object containing the RGB values { r, g, b }.
 * @param {number} percentage - The percentage by which to darken the color (0-100).
 * @returns {Object} An object containing the darkened RGB values { r, g, b }.
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
 * @param {Object} rgb - An object containing the RGB values { r, g, b }.
 * @param {number} percentage - The percentage by which to lighten the color (0-100).
 * @returns {Object} An object containing the lightened RGB values { r, g, b }.
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
 * @returns {Object} An object containing the darker and lighter color themes { dark, light }.
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
