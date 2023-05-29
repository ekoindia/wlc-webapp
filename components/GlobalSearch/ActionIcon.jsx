import { Circle, Image } from "@chakra-ui/react";
import { Icon } from "components";

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
 */
const ActionIcon = ({
	name,
	icon,
	ext_icon,
	size = "sm",
	color = "#64748b",
}) => {
	return (
		<Circle
			size={size === "sm" ? "10" : "12"}
			bg={ext_icon ? "white" : color}
			borderRadius={ext_icon ? 0 : "full"}
			color="white"
			fontSize={size === "sm" ? "md" : "lg"}
			fontWeight="500"
			overflow="hidden"
		>
			{ext_icon ? (
				<Image
					src={ext_icon}
					alt={name}
					w="full"
					h="full"
					objectFit="contain"
				/>
			) : icon && !ext_icon ? (
				<Icon name={icon} size={size} />
			) : (
				name[0]
			)}
		</Circle>
	);
};

export default ActionIcon;
