/**
 * An array containing options for the ChangeRole menu, along with their respective paths.
 * Each option represents a specific role change action with a corresponding path.
 * @typedef {Object} ChangeRoleOption
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
		label: "Transfer Retailers",
		path: "/admin/my-network/profile/change-role",
		visible: [2, 3],
		visibleString: ["Retailer", "I-CSP"],
	},
	{
		slug: "retailer-to-distributor",
		label: "Promote Retailer To Distributor",
		path: "/admin/my-network/profile/change-role",
		visible: [2, 3],
		visibleString: ["Retailer", "I-CSP"],
	},
	{
		slug: "demote-distributor",
		label: "Demote Distributor",
		path: "/admin/my-network/profile/change-role",
		visible: [1],
		visibleString: ["Distributor"],
	},
	{
		slug: "retailer-to-iretailer",
		label: "Upgrade Retailer To iRetailer",
		path: "/admin/my-network/profile/change-role",
		visible: [2],
		visibleString: ["Retailer", "I-CSP"],
	},
];
