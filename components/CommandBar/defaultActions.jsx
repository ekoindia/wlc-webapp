import { clearCacheAndReload } from "utils";
import { ActionIcon } from ".";

/**
 * Default actions for the CommandBar...
 */
export const defaultActions = [
	{
		id: "systemsettings",
		name: "System",
		subtitle: "Clear cache or logout",
		icon: <ActionIcon icon="logout" size="sm" color="error" />,
		// shortcut: ["c"],
		// keywords: "signout quit close",
		// section: "System",
		priority: -999,
	},
	{
		id: "reloadapp",
		name: "Reload App",
		subtitle: "Reset cache and reload the app if you are facing any issues",
		icon: <ActionIcon icon="reload" size="sm" color="error" />,
		shortcut: ["$mod+F5"],
		keywords: "reset cache reload",
		section: "System",
		priority: 0,
		parent: "systemsettings",
		perform: () => clearCacheAndReload(true),
	},
	// {
	// 	id: "logout",
	// 	name: "Logout",
	// 	icon: <ActionIcon icon="logout" size="sm" color="error" />,
	// 	// shortcut: ["c"],
	// 	keywords: "signout quit close",
	// 	section: "System",
	// 	priority: 0,
	// 	parent: "systemsettings",
	// 	perform: () => (window.location.pathname = "contact"),
	// },
];
