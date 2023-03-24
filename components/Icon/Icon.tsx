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
	| "nav-menu"
	| "drop-down"
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
	| "	percent_bg"
	| "dashboard"
	| "decrease"
	| "increase"
	| "people"
	| "arrow-increase"
	| "arrow-decrease"
	| "remove"
	| "expand";

export type IconProps = {
	name: IconNameType;
	color?: string;
	width?: string;
	height?: string;
	style?: React.CSSProperties;
};
/**
 * A <Icon> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Icon></Icon>`
 */

const Icon = ({ name, style, ...rest }: IconProps) => {
	const transform = IconLibrary[name]?.transform;
	const viewBox = IconLibrary[name]?.viewBox;
	const path = IconLibrary[name]?.path;

	return (
		<svg style={style} viewBox={viewBox} {...rest} className="custom-icon">
			<path d={path} fill="currentColor" transform={transform} />
		</svg>
	);
};

export default Icon;
