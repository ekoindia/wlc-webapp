/**
 * An array containing options for the ChangeRole menu, along with their respective paths.
 * Each option represents a specific role change action with a corresponding path.
 * @typedef {object} ChangeRoleOption
 * @property {string} slug - A unique identifier for the role change option.
 * @property {string} label - The display label for the role change option.
 * @property {string} path - The URL path for navigating to the role change page with a specific tab.
 * @property {Array} visible - List of user types to show this tab for
 */

/**
 * List to show ChangeRole Menu options & tabs inside it.
 * @type {ChangeRoleOption[]}
 */
export const ChangeRoleMenuList = [
	{
		slug: "transfer-retailer",
		label: "Assign Distributor",
		path: "/admin/my-network/profile/change-role",
		visible: [3],
		global: true,
	},
	{
		slug: "transfer-retailer",
		label: "Change Distributor",
		path: "/admin/my-network/profile/change-role",
		visible: [2],
		global: false,
	},
	{
		slug: "retailer-to-iretailer",
		label: "Unassign Distributor",
		path: "/admin/my-network/profile/change-role",
		visible: [2],
		global: true,
	},
	{
		slug: "retailer-to-distributor",
		label: "Promote Retailer To Distributor",
		path: "/admin/my-network/profile/change-role",
		visible: [],
		global: true,
	},
	{
		slug: "retailer-to-distributor",
		label: "Promote To Distributor",
		path: "/admin/my-network/profile/change-role",
		visible: [2, 3],
		global: false,
	},
	// {
	// 	slug: "demote-distributor",
	// 	label: "Demote Distributor to Retailer",
	// 	path: "/admin/my-network/profile/change-role",
	// 	visible: [1],
	//	global: true,
	// },
];
