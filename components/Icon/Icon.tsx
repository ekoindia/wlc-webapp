import { Box, chakra, useBreakpointValue } from "@chakra-ui/react";
import { getIconSvg, IconNameType } from "constants/IconLibrary";

export type IconProps = {
	name: string; //IconNameType
	color?: string;
	size?: string;
	width?: any;
	height?: any;
	w?: any;
	h?: any;
	[rest: string]: any;
	// style?: React.CSSProperties;
};

/**
 * A <Icon> component
 * TODO: Write more description here
 * @arg 	{Object}	props	Properties passed to the component
 * @arg 	{string}	props.name	Name of the icon to display
 * @arg 	{string}	[props.size="md"]	Size of the icon
 * @arg 	{string}	[w]	Width of the icon
 * @arg 	{string}	[h]	Height of the icon
 * @arg 	{string}	[width]	Width of the icon
 * @arg 	{string}	[height]	Height of the icon
 * @example	`<Icon name="home" size="lg" />`
 */
const Icon = ({
	name,
	size = "md",
	w,
	h,
	width,
	height,
	...rest
}: IconProps) => {
	const icon = getIconSvg(name as IconNameType);
	const viewBox = icon?.viewBox;
	const path = icon?.path;

	const responsiveSize = useBreakpointValue(
		typeof size === "string" ? { base: size } : size,
		{ fallback: "md" }
	);

	if (!path) return null;

	let _size;
	switch (responsiveSize) {
		case "xxs":
			_size = "8px";
			break;
		case "xs":
			_size = "12px";
			break;
		case "sm":
			_size = "18px";
			break;
		case "md":
			_size = "24px";
			break;
		case "lg":
			_size = "32px";
			break;
		case "xl":
			_size = "48px";
			break;
		case "2xl":
			_size = "64px";
			break;
		case "3xl":
			_size = "96px";
			break;
		default:
			_size = responsiveSize || w || width || h || height || "24px";
	}

	// let sizeX = "24px";
	// let sizeY = "24px";
	// if ((w && h) || (width && height)) {
	// 	sizeX = width || w;
	// 	sizeY = height || h;
	// } else if (w || width) {
	// 	sizeX = w || width;
	// 	sizeY = sizeX;
	// } else if (h || height) {
	// 	sizeY = h || height;
	// 	sizeX = sizeY;
	// }

	return (
		// <Center style={style} maxH="24px" maxW="24px" {...rest}>
		<Box
			w={_size}
			h={_size}
			minW={_size}
			{...rest}
			transition="color 0.3s ease-out, background 0.3s ease-out"
		>
			<chakra.svg
				style={{ width: "100%", height: "100%" }}
				viewBox={viewBox}
				fill="currentColor"
				aria-label={name}
				dangerouslySetInnerHTML={{ __html: path }}
			></chakra.svg>
		</Box>
	);
};

export default Icon;
