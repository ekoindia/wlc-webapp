import { useKBarReady } from "components/CommandBar";
import { InteractionBehavior } from "constants/trxnFramework";
import { useMenuContext, useUser } from "contexts";
import { useKBar } from "kbar";
import { More, Transactions } from ".";

export type BottomAppBarItem = {
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
 * @returns {Array<BottomAppBarItem>} The array of bottom bar items.
 */
export const useBottomAppBarItems = (): BottomAppBarItem[] => {
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
			component: Transactions, // bottom bar transaction drawer
			visible: isAdmin ? isAdminAgentMode : !isAdminAgentMode,
		},
		{
			name: "account",
			component: More,
			visible: true,
		},
	];
};

/**
 * Converts a list of items into a format suitable for use in an accordion menu.
 * It processes each item in the list to generate or modify its `link`, and if the item has group interactions, it generates `subItems` for it.
 * @param {Array} list - The list of items to be converted, where each item is expected to have properties like `id`, `group_interaction_ids`, and `link`.
 * @returns {Array} The transformed list, with each item potentially containing a `link` and `subItems`.
 * @example
 * const list = [
 *   { id: 1, label: 'Label 1', group_interaction_ids: "2,3", isVisible: true },
 *   { id: 4, label: 'Label 2', isVisible: false, link: '/custom-link' },
 * ];
 * const convertedList = useAccordionMenuConverter(list);
 * convertedList = [
 *   {
 *     id: 1,
 *     label: 'Label 1',
 *     link: '/transaction/1',
 *     isVisible: true,
 *     subItems: [
 *       { id: 2, link: '/transaction/2', ... },
 *       { id: 3, link: '/transaction/3', ... },
 *     ],
 *   },
 *   {
 *     id: 4,
 *     label: 'Label 2',
 *     link: '/custom-link',
 *     isVisible: false,
 *   },
 * ];
 */
export const useAccordionMenuConverter = (list: any[]) => {
	const { isAdmin } = useUser();
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions;
	const prefix = isAdmin ? "/admin" : "";

	const getLink = (id: number, link?: string) => {
		return link ? link : `${prefix}/transaction/${id}`;
	};

	return list.map((item) => {
		const {
			group_interaction_ids,
			behavior,
			link,
			id,
			isVisible,
			...rest
		} = item;

		const itemLink = getLink(id, link);

		if (
			group_interaction_ids != undefined &&
			behavior == InteractionBehavior.GRID
		) {
			const groupInteractions = group_interaction_ids
				.split(",")
				.map(Number)
				.filter((id) => id in role_tx_list)
				.map((id) => ({
					id,
					link: getLink(id),
					...role_tx_list[id],
				}));

			return {
				...rest,
				id,
				link: itemLink,
				isVisible,
				subItems: groupInteractions,
			};
		}
		return {
			...rest,
			id,
			link: itemLink,
			isVisible,
		};
	});
};
