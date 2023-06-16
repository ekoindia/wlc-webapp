import { IconNameType } from "constants/IconLibrary";
import { TransactionIds } from ".";

type sidebarMenuType = {
	icon?: IconNameType;
	comp?: boolean;
	name?: string;
	link?: string;
	api?: boolean;
	subLevel?: boolean;
	subLevelObject?: any;
};

type adminSidebarMenuType = {
	icon: IconNameType;
	name: string;
	link: string;
};

/**
 * List of transaction ids that (if available) are to be shown in the "Others" sub-menu.
 */
export const OtherMenuItems: number[] = [
	TransactionIds.NEED_CASH,
	TransactionIds.QUERY_TRACKER,
	TransactionIds.LOAD_EVALUE,
	TransactionIds.REQUEST_EVALUE,
	TransactionIds.TRANSFER_EVALUE,
	TransactionIds.MANAGE_MY_ACCOUNT,
];

/**
 * List of transaction ids that (if available) are to be shown in the "Others" sub-menu for Admins.
 */
export const AdminMenuItems: number[] = [
	TransactionIds.LOAD_EVALUE,
	TransactionIds.REQUEST_EVALUE,
	TransactionIds.TRANSFER_EVALUE,
];

/**
 * Fixed menu items for admin left-menu.
 */
export const adminSidebarMenu: adminSidebarMenuType[] = [
	{
		name: "Dashboard",
		icon: "dashboard",
		link: "/admin",
	},
	{
		name: "My Network",
		icon: "refer",
		link: "/admin/my-network",
	},
	{
		name: "Transaction History",
		icon: "swap-horiz",
		link: "/admin/transaction-history",
	},
	// {
	// 	name: "Invoicing",
	// 	icon: "invoice",
	// 	link: "/admin/invoicing",
	// },
	{
		name: "Pricing & Comission",
		icon: "commission-percent",
		link: "/admin/pricing",
	},
	// {
	// 	name: "Company Profile",
	// 	icon: "person",
	// 	link: "/admin/company",
	// },
	{
		icon: "query",
		name: "Query Center",
		link: "/admin/query",
	},
	// {
	// 	name: "Send Notifications",
	// 	icon: "notifications-none",
	// 	link: "/admin/notifications",
	// },
	{
		name: "Bulk Onboarding",
		icon: "person-add",
		link: "/admin/bulk-onboarding",
	},
];

/**
 * Fixed menu items for agents left-menu.
 */
export const sidebarMenu: sidebarMenuType[] = [
	{
		name: "Home",
		icon: "menu-home",
		link: "/home",
	},
	// {
	// 	name: "Select Plan",
	// 	icon: "select-plan",
	// 	link: "/select-plan",
	// },

	// {
	// 	name: "Start A Transaction",
	// 	icon: "transaction",
	// 	subLevel: true,
	// 	api: true,
	// },
	// {
	// 	name: "Others",
	// 	icon: "others",
	// 	subLevel: true,
	// 	subLevelObject: [
	// 		{
	// 			label: "Transaction History",
	// 			icon: "transaction-history",
	// 			link: "/history",
	// 		},
	// 		{
	// 			label: "Manage My Account",
	// 			icon: "manage",
	// 			link: "/transaction/" + TransactionIds.MANAGE_MY_ACCOUNT,
	// 		},
	// 	],
	// },
];
