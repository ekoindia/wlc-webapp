import { UserType, UserTypeLabel } from "./UserTypes";

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

/**
 * An array containing options for the ChangeRole menu, along with their respective paths.
 * Each option represents a specific role change action with a corresponding path.
 * @typedef {object} ChangeRoleOption
 * @property {string} slug - A unique identifier for the role change option.
 * @property {string} label - The display label for the role change option.
 * @property {string} path - The URL path for navigating to the role change page with a specific tab.
 */

/**
 * List to show ChangeRole Menu options & tabs inside it for Organization View.
 * @type {ChangeRoleOption[]}
 */
export const ORG_VIEW_TABS = [
	{
		slug: "transfer-retailer",
		label: `Assign ${UserTypeLabel[UserType.DISTRIBUTOR]}`,
		path: "/admin/my-network/profile/change-role",
		transferConfig: { targetUserType: UserType.MERCHANT },
	},
	{
		slug: "transfer-fos",
		label: `Assign ${UserTypeLabel[UserType.FOS]}`,
		path: "/admin/my-network/profile/change-role",
		transferConfig: { targetUserType: UserType.FOS },
	},
	{
		slug: "retailer-to-iretailer",
		label: `Unassign ${UserTypeLabel[UserType.DISTRIBUTOR]}`,
		path: "/admin/my-network/profile/change-role",
	},
	{
		slug: "retailer-to-distributor",
		label: `Promote ${UserTypeLabel[UserType.MERCHANT]} To ${
			UserTypeLabel[UserType.DISTRIBUTOR]
		}`,
		path: "/admin/my-network/profile/change-role",
	},
];

/**
 * List to show ChangeRole Menu options & tabs inside it for Agent View.
 * Includes `allowedUserTypes` to filter availability.
 * @type {(ChangeRoleOption & { allowedUserTypes: number[] })[]}
 */
export const AGENT_VIEW_TABS = [
	{
		slug: "transfer-retailer",
		label: `Assign ${UserTypeLabel[UserType.DISTRIBUTOR]}`,
		path: "/admin/my-network/profile/change-role",
		allowedUserTypes: [UserType.I_MERCHANT],
	},
	{
		slug: "transfer-retailer",
		label: `Change ${UserTypeLabel[UserType.DISTRIBUTOR]}`,
		path: "/admin/my-network/profile/change-role",
		allowedUserTypes: [UserType.MERCHANT],
	},
	{
		slug: "retailer-to-iretailer",
		label: `Unassign ${UserTypeLabel[UserType.DISTRIBUTOR]}`,
		path: "/admin/my-network/profile/change-role",
		allowedUserTypes: [UserType.MERCHANT],
	},
	{
		slug: "retailer-to-distributor",
		label: `Promote To ${UserTypeLabel[UserType.DISTRIBUTOR]}`,
		path: "/admin/my-network/profile/change-role",
		allowedUserTypes: [UserType.MERCHANT, UserType.I_MERCHANT],
	},
];
