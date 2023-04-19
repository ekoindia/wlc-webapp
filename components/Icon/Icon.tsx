import { Box } from "@chakra-ui/react";
import { IconLibrary } from "constants/IconLibrary";

import React from "react";

export type IconNameType =
	| "file-download"
	| "file-upload"
	| "chevron-left"
	| "chevron-right"
	| "arrow-forward"
	| "arrow-back"
	| "add"
	| "mode-edit"
	| "account-balance-wallet"
	| "near-me"
	| "person"
	| "refer"
	| "invoice"
	| "swap-horiz"
	| "commission-percent"
	| "rupee"
	| "close-outline"
	| "filter"
	| "home"
	| "caret-up"
	| "caret-down"
	| "sort"
	| "search"
	| "menu"
	| "arrow-drop-down"
	| "logout"
	| "timer"
	| "camera"
	| "more-vert"
	| "sort-by"
	| "fast-forward"
	| "mail"
	| "phone"
	| "calender"
	| "rupee_bg"
	| "refresh"
	| "arrow-up"
	| "arrow-down"
	| "close"
	| "percent_bg"
	| "dashboard"
	| "decrease"
	| "increase"
	| "people"
	| "arrow-increase"
	| "arrow-decrease"
	| "remove"
	| "expand"
	| "cashout"
	| "transaction"
	| "others"
	| "menu-home"
	| "select-plan"
	| "manage"
	| "view-transaction-history"
	| "wallet-outline"
	| "phone-circle-outline";

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
		<Box
			w={sizeX}
			h={sizeY}
			{...rest}
			transform="translate3d(0.5px, 0.4px, 0px);"
		>
			<svg
				style={{ width: sizeX, height: sizeY }}
				viewBox={viewBox}
				fill="currentColor"
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
