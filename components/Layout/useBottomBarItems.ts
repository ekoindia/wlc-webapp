import { useKBarReady } from "components/CommandBar";
import { useUser } from "contexts";
import { useKBar } from "kbar";

export type BottomBarItem = {
	name: string;
	label?: string;
	icon?: string;
	path?: string;
	action?: () => void;
	avatar?: string;
	src?: string;
};

/**
 * Returns an array of bottom bar items. Each item is an object with properties that define its behavior and appearance in the bottom bar.
 *
 * The properties of each item can include:
 * - `name`: A string that uniquely identifies the item.
 * - `label`: A string that serves as the item's visible text.
 * - `icon`: A string that specifies the name of the item's icon.
 * - `path`: A string that defines the navigation path of the item. If the user is an admin, the path is prefixed with "/admin".
 * - `action`: A function that is executed when the item is clicked. For the "search" item, this function toggles the command bar.
 * - `avatar`: A string that represents the first character of the user's name.
 * - `src`: A string that represents the URL of the user's profile picture.
 *
 * The function uses the `useUser`, `useKBar`, and `useKBarReady` hooks to get the necessary data and functions.
 *
 * @returns {Array<BottomBarItem>} The array of bottom bar items.
 */
export const useBottomBarItems = (): BottomBarItem[] => {
	const { isAdmin } = useUser();
	const { query } = useKBar();
	const { ready } = useKBarReady();

	const _pathPrefix = isAdmin ? "/admin" : "";

	return [
		{
			name: "dashboard",
			label: "Dasboard",
			icon: "dashboard",
			path: isAdmin ? `${_pathPrefix}` : null,
		},
		{
			name: "home",
			label: "Home",
			icon: "home",
			path: isAdmin ? null : "/home",
		},
		{
			name: "search",
			label: "Search",
			icon: "search",
			action: () => {
				ready && query.toggle(); // open command bar
			},
		},
		{
			name: "history",
			label: "History",
			icon: "transaction-history",
			path: `${_pathPrefix}/history`,
		},
	];
};
