import { Box } from "@chakra-ui/react";
import { IconLibrary, IconNameType } from "constants/IconLibrary";

import React from "react";

export type IconProps = {
	name: IconNameType;
	color?: string;
	width?: any;
	height?: any;
	w?: any;
	h?: any;
	size?: string;
	style?: React.CSSProperties;
};
/**
 * A <Icon> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Icon></Icon>`
 */

const Icon = ({ name, style, w, h, width, height, ...rest }: IconProps) => {
	// const transform = IconLibrary[name]?.transform;
	const viewBox = IconLibrary[name]?.viewBox;
	const path = IconLibrary[name]?.path;

	let sizeX = "24px";
	let sizeY = "24px";
	if ((w && h) || (width && height)) {
		sizeX = width || w;
		sizeY = height || h;
	} else if (w || width) {
		sizeX = w || width;
		sizeY = sizeX;
	} else if (h || height) {
		sizeY = h || height;
		sizeX = sizeY;
	}

	return (
		// <Center style={style} maxH="24px" maxW="24px" {...rest}>
		<Box w={sizeX} h={sizeY} {...rest}>
			<svg
				style={{ width: sizeX, height: sizeY }}
				viewBox={viewBox}
				fill="currentColor"
				aria-label={name}
				dangerouslySetInnerHTML={{ __html: path }}
			></svg>
		</Box>
		// </Center>
		// <svg style={style}
		// viewBox={viewBox}
		//  {...rest} className="custom-icon">
		// 	<path d={path} fill="currentColor" transform={transform} />
		// </svg>
	);
};

export default Icon;
