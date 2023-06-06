import { Circle, Image } from "@chakra-ui/react";
import { Icon } from "components";

interface ActionIconProps {
	icon?: string;
	ext_icon?: string;
	name?: string;
	size?: string;
	iconSize?: string;
	color?: string;
	style?: string;
	badgeColor?: string;
	fontSize?: string;
}

/**
 * Component to show an icon in the KBar Search Action.
 * It shows the icon, an external image or first letter of the name, whichever is available first in the following order:
 * 1. ext_icon (the external image)
 * 2. icon (the icon name)
 * 3. name (the first letter of the name)
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.name	Name of the action.
 * @param	{string}	prop.icon	Name of the icon to show.
 * @param	{string}	prop.ext_icon	URL of the external image to show.
 * @param	{string}	prop.size	Size of the icon (sm or lg).
 * @param	{string}	prop.color	Color of the icon.
 * @param	{string}	prop.style	Style of the icon (filled, outline, or default).
 * @param	{string}	prop.badgeColor	Color of the badge. Badge is hidden, if the color is not provided.
 */
const ActionIcon: React.FC<ActionIconProps> = ({
	icon = "",
	ext_icon = "",
	name = "",
	size = "sm",
	iconSize,
	color = "#64748b",
	style = "default", // filled, outline, or default
	badgeColor = "",
	fontSize,
}) => {
	let bgColor, borderColor, borderWidth, icoColor;

	if (ext_icon) {
		bgColor = "white";
		borderWidth = "0";
	} else if (style === "filled") {
		bgColor = color;
		borderWidth = "0";
		icoColor = "white";
	} else if (style === "outline") {
		bgColor = "transparent";
		borderColor = color;
		borderWidth = "1px";
		icoColor = color;
	} else {
		// default
		bgColor = "transparent";
		borderWidth = "0";
		icoColor = color;
	}

	return (
		<Circle
			position="relative"
			size={size === "sm" ? "10" : "12"}
			bg={bgColor}
			borderRadius={ext_icon ? 0 : "full"}
			borderWidth={borderWidth}
			borderColor={borderColor}
			color={icoColor}
			fontSize={fontSize ? fontSize : size === "sm" ? "md" : "lg"}
			fontWeight="500"
			overflow={ext_icon ? "hidden" : "visible"}
		>
			{ext_icon ? (
				<Image
					src={ext_icon}
					alt={name}
					w="full"
					h="full"
					borderRadius="6px"
					overflow="hidden"
					objectFit="contain"
				/>
			) : icon ? (
				<Icon name={icon} size={iconSize || size} />
			) : (
				name[0]
			)}

			{badgeColor ? (
				<Circle
					position="absolute"
					top="-2px"
					right="-2px"
					size={size === "sm" ? "4" : "5"}
					bg={badgeColor}
					borderWidth="2px"
					borderColor="white"
				/>
			) : null}
		</Circle>
	);
};

export default ActionIcon;
