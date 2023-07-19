/**
 * An array containing options for the ChangeRole menu, along with their respective paths.
 * Each option represents a specific role change action with a corresponding path.
 * @typedef {Object} ChangeRoleOption
 * @property {string} slug - A unique identifier for the role change option.
 * @property {string} label - The display label for the role change option.
 * @property {string} path - The URL path for navigating to the role change page with a specific tab.
 */

/**
 * List to show ChangeRole Menu options & tabs inside it.
 * @type {ChangeRoleOption[]}
 */
export const ChangeRoleMenuList = [
	{
		slug: "transfer-retailer",
		label: "Transfer Retailers",
		path: "/admin/my-network/profile/change-role",
	},
	{
		slug: "retailer-to-distributor",
		label: "Promote Retailer To Distributor",
		path: "/admin/my-network/profile/change-role",
	},
	// {
	// 	slug: "demote-distributor",
	// 	label: "Demote Distributor",
	// 	path: "/admin/my-network/profile/change-role",
	// },
	{
		slug: "retailer-to-imerchant",
		label: "Upgrade Retailer To iRetailer",
		path: "/admin/my-network/profile/change-role",
	},
];
