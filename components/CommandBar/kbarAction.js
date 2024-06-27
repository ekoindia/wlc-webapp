import { ActionIcon } from "components/CommandBar";
import { ActionImpl, Priority } from "kbar";

/**
 * Returns a KBar action object
 * @param {object} props
 * @param {string} props.id - The unique ID of the action
 * @param {string} props.name - The name of the action
 * @param {string} props.subtitle - The subtitle of the action
 * @param {string} props.icon - The name of the icon for the action
 * @param {string} props.iconSize - The size of the icon
 * @param {string} props.iconColor - The color of the icon
 * @param {string} props.keywords - The search keywords for the action (comma-separated)
 * @param {Priority} props.priority - The priority of the action
 * @param {Function} props.perform - The function to run when the action is selected
 * @param props.shortcut
 */
export const getKBarAction = ({
	id,
	name,
	subtitle,
	icon,
	iconSize = "md",
	iconColor = "#334155",
	keywords,
	shortcut,
	priority = Priority.HIGH,
	perform,
}) => {
	return ActionImpl.create(
		{
			id: id,
			name: name,
			subtitle: subtitle,
			keywords: keywords,
			icon: (
				<ActionIcon
					icon={icon || "transaction-history"}
					iconSize={iconSize}
					color={iconColor}
				/>
			),
			priority: priority,
			shortcut: shortcut ?? [],
			// section: "History",
			perform: perform,
		},
		{}
	);
};
