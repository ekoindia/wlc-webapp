import { IconLibrary } from "constants/IconLibrary";
import React from "react";

export type IconNameType =
	| "file-download"
	| "file-upload"
	| "chevron-left"
	| "arrow-forward"
	| "add"
	| "chevron-right";

type Props = {
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

export const Icon = ({ name, style, ...rest }: Props) => {
	const transform = IconLibrary[name]?.transform;
	const viewBox = IconLibrary[name]?.viewBox;
	const paths = IconLibrary[name]?.paths[0];

	return (
		<svg style={style} viewBox={viewBox} {...rest} className="custom-icon">
			<path d={paths} fill="currentColor" transform={transform} />
		</svg>
	);
};
