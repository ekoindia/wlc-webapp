import { TransactionIds } from "./EpsTransactions";

/**
 * Configure the profile menu items for the admin.
 * It will be shown in the top-right profile dropdown menu (before the "Logout" menu-item).
 */
export const adminProfileMenu = [
	// {
	// 	title: "Business Contact",
	// 	link: "",
	// },
	// {
	// 	title: "Need Help",
	// 	link: "",
	// },
	// {
	// 	title: "Help Center",
	// 	link: "",
	// },
	// {
	// 	title: "Settings",
	// 	link: "",
	// },
];

/**
 * Configure the profile menu items for the user (retailer, distributor, etc.)
 * It will be shown in the top-right profile dropdown menu (before the "Logout" menu-item).
 */
export const profileMenu = [
	{
		title: "Settings",
		link: "/transaction/" + TransactionIds.MANAGE_MY_ACCOUNT,
		trxn_id: TransactionIds.MANAGE_MY_ACCOUNT, // Used to check for allowed role
	},
];
