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
	| "view-transaction-history";

export type IconProps = {
	name: IconNameType;
	color?: string;
	width?: string;
	height?: string;
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

const Icon = ({ name, style, size = "24px", ...rest }: IconProps) => {
	const transform = IconLibrary[name]?.transform;
	const viewBox = IconLibrary[name]?.viewBox;
	const path = IconLibrary[name]?.path;

	return (
		// <Center style={style} maxH="24px" maxW="24px" {...rest}>
		<Box maxH="24px" maxW="24px" w={size} h={size} {...rest}>
			<svg
				style={{ width: "inherit", height: "inherit" }}
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
