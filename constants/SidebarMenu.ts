import { IconNameType } from "constants/IconLibrary";
import { TransactionIds } from ".";

type sidebarMenuType = {
	id: number;
	icon?: IconNameType;
	name?: string;
	link?: string;
	trxn_id?: number; // Transaction Id to link to. Converts to "/transaction/<trxn_id>" links after checking if it is allowed as per user's roles.
	dynamicAdminView?: boolean; // If true, then the menu item will be shown to Admins in the "Agent-View". The link should be prepended with "/admin" in this case.
	// comp?: boolean;
	// api?: boolean;
	// subLevel?: boolean;
	// subLevelObject?: any;
};

/**
 * List of transaction ids that (if available) are to be shown in the "Others" sub-menu.
 */
export const OtherMenuItems: number[] = [
	TransactionIds.NEED_CASH,
	TransactionIds.QUERY_TRACKER,
	// TransactionIds.LOAD_EVALUE,
	// TransactionIds.REQUEST_EVALUE,
	// TransactionIds.TRANSFER_EVALUE,
	TransactionIds.INITIATE_REFUND,
	TransactionIds.MANAGE_NETWORK_EVALUE,
	TransactionIds.MANAGE_SELF_EVALUE,
	TransactionIds.MANAGE_MY_ACCOUNT,
];

/**
 * List of transaction ids that (if available) are to be shown in the "Others" sub-menu for Admins.
 */
export const AdminOtherMenuItems: number[] = [
	// TransactionIds.LOAD_EVALUE,
	// TransactionIds.REQUEST_EVALUE,
	// TransactionIds.TRANSFER_EVALUE,
	TransactionIds.FUND_SETTLEMENT,
	TransactionIds.INITIATE_REFUND,
	TransactionIds.NEO_BANK,
	// TransactionIds.REVERSE_EVALUE,
	TransactionIds.MANAGE_SELF_EVALUE,
	TransactionIds.MANAGE_NETWORK_EVALUE,
	// TransactionIds.INVOICE_DOWNLOAD,
];

/**
 * List of transaction ids that must not be shown to the user/Admin.
 * These are the info-card transactions which were meant only for API Partners.
 */
export const AdminBlacklistMenuItems: number[] = [
	147, // Indo Nepal
	157, // API Widget
	158, // Cash Collection
	159, // Bulk IMPS
	262, // Lending API Stack
	520, // AePS Cashout
];

/**
 * Fixed menu items for admin left-menu.
 */
export const adminSidebarMenu: sidebarMenuType[] = [
	{
		id: 1,
		name: "Dashboard",
		icon: "dashboard",
		link: "/admin",
	},
	{
		id: 2,
		name: "My Network",
		icon: "refer",
		link: "/admin/my-network",
	},
	{
		id: 3,
		name: "Network Transactions",
		icon: "swap-horiz",
		link: "/admin/transaction-history",
	},
	// {
	// 	name: "Invoicing",
	// 	icon: "invoice",
	// 	link: "/admin/invoicing",
	// },
	{
		id: 4,
		name: "Pricing & Commissions",
		icon: "commission-percent",
		link: "/admin/pricing",
	},
	// {
	// 	name: "Company Profile",
	// 	icon: "person",
	// 	link: "/admin/company",
	// },
	// {
	// 	name: "Send Notifications",
	// 	icon: "notifications-none",
	// 	link: "/admin/notifications",
	// },
	{
		id: 5,
		name: "Onboard Agents",
		icon: "person-add",
		link: "/admin/onboard-agents",
	},
	{
		id: 6,
		icon: "query",
		name: "Query Center",
		link: "/admin/query",
	},
	{
		id: 7,
		icon: "description",
		name: "Invoice",
		link: "/admin/transaction/" + TransactionIds.INVOICE_DOWNLOAD,
		trxn_id: TransactionIds.INVOICE_DOWNLOAD,
	},
	// {
	// 	icon: "manage",
	// 	name: "Configurations",
	// 	link: "/admin/configurations",
	// },
];

/**
 * Fixed menu items for agents left-menu.
 */
export const sidebarMenu: sidebarMenuType[] = [
	{
		id: 8,
		name: "Home",
		icon: "menu-home",
		link: "/home",
		dynamicAdminView: true,
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
