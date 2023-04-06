// import { oldIcons as IconLibrary } from "constants/connectIcons";
import { Center } from "@chakra-ui/react";
import { IconLibrary } from "constants/IconLibrary";
/**
 * A <SvgIcon> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<SvgIcon></SvgIcon>`
 */
const SvgIcon = ({ name, style, ...rest }) => {
	const viewBox = IconLibrary[name]?.viewBox;
	const path = IconLibrary[name]?.path;

	return (
		<Center width="24px" height="24px" maxH="24px" maxW="24px">
			<svg
				style={style}
				viewBox={viewBox}
				fill="currentColor"
				{...rest}
				className="custom-icon"
				dangerouslySetInnerHTML={{ __html: path }}
			></svg>
		</Center>
	);
};

export default SvgIcon;
