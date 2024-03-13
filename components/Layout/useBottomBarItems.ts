import { useKBarReady } from "components/CommandBar";
import { useUser } from "contexts";
import { useKBar } from "kbar";
import { TransactionsDrawer } from ".";

export type BottomBarItem = {
	name: string;
	label?: string;
	icon?: string;
	path?: string;
	action?: () => void;
	component?: () => JSX.Element;
	visible: boolean;
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
 * - `component`: A function that returns a JSX element."
 *
 * The function uses the `useUser`, `useKBar`, and `useKBarReady` hooks to get the necessary data and functions.
 *
 * @returns {Array<BottomBarItem>} The array of bottom bar items.
 */
export const useBottomBarItems = (): BottomBarItem[] => {
	const { isAdmin, isAdminAgentMode } = useUser();
	const { query } = useKBar();
	const { ready } = useKBarReady();

	return [
		{
			name: "dashboard",
			label: "Dasboard",
			icon: "dashboard",
			path: "/admin",
			visible: isAdmin ? !isAdminAgentMode : isAdminAgentMode,
		},
		{
			name: "home",
			label: "Home",
			icon: "home",
			path: isAdmin ? "/admin/home" : "/home",
			visible: !isAdmin || isAdminAgentMode,
		},
		{
			name: "search",
			label: "Search",
			icon: "search",
			action: () => {
				// open k-bar if it's ready
				ready && query.toggle();
			},
			visible: true,
		},
		{
			name: "transaction",
			component: TransactionsDrawer, // bottom bar transaction drawer
			visible: isAdmin ? isAdminAgentMode : !isAdminAgentMode,
		},
		{
			name: "history",
			label: "Trans. History",
			icon: "transaction-history",
			path: isAdmin ? "/admin/history" : "/history",
			visible: true,
		},
	];
};
