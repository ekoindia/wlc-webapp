/**
 * @description SVG background patterns with customizable fill-color and opacity
 */

export const svgBgDotted = (options) => {
	let { fill, opacity } = { fill: "white", opacity: 0.05, ...options };
	fill = fill.replace("#", "%23");

	return `url(\n"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='${fill}' fill-opacity='${opacity}' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");`;
};

export const svgBgDiagonalLines = (options) => {
	let { fill, opacity } = { fill: "white", opacity: 0.05, ...options };
	fill = fill.replace("#", "%23");

	return `url(\n"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${fill}' fill-opacity='${opacity}' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");`;
};
