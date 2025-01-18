import { IconNameType } from "constants/IconLibrary";
import { TransactionIds } from ".";

type sidebarMenuType = {
	id: number;
	icon?: IconNameType;
	name?: string;
	label?: string;
	link?: string;
	trxn_id?: number; // Transaction Id to link to. Converts to "/transaction/<trxn_id>" links after checking if it is allowed as per user's roles.
	dynamicAdminView?: boolean; // If true, then the menu item will be shown to Admins in the "Agent-View". The link should be prepended with "/admin" in this case.
	featureFlag?: string; // The feature flag to check if the menu item should be shown or not.
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
	TransactionIds.INITIATE_REFUND,
	TransactionIds.MANAGE_NETWORK_EVALUE,
	TransactionIds.MANAGE_SELF_EVALUE,
	TransactionIds.MANAGE_MY_ACCOUNT,
	// TransactionIds.LOAD_EVALUE,
	// TransactionIds.REQUEST_EVALUE,
	// TransactionIds.TRANSFER_EVALUE,
];

/**
 * List of transaction ids that (if available) are to be shown in the "Others" sub-menu for Admins.
 */
export const AdminOtherMenuItems: number[] = [
	TransactionIds.FUND_SETTLEMENT,
	TransactionIds.INITIATE_REFUND,
	TransactionIds.NEO_BANK,
	TransactionIds.MANAGE_NETWORK_EVALUE,
	TransactionIds.MANAGE_SELF_EVALUE,
	TransactionIds.MANAGE_MY_ACCOUNT,
	// TransactionIds.LOAD_EVALUE,
	// TransactionIds.REQUEST_EVALUE,
	// TransactionIds.TRANSFER_EVALUE,
	// TransactionIds.REVERSE_EVALUE,
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
		label: "Dashboard",
		icon: "dashboard",
		link: "/admin",
	},
	{
		id: 5,
		label: "My Network",
		icon: "refer",
		link: "/admin/my-network",
	},
	// {
	// 	// TODO: REMOVE THIS WITH RELATED COMPONENTS
	// 	id: 9,
	// 	label: "Network Transactions (Old)",
	// 	icon: "swap-horiz",
	// 	link: "/admin/transaction-history",
	// },
	{
		id: 10,
		label: "Network Transactions",
		icon: "swap-horiz",
		link: "/admin/network-statement",
	},
	// {
	// 	id: 15,
	// 	label: "Invoicing",
	// 	icon: "invoice",
	// 	link: "/admin/invoicing",
	// },
	{
		id: 20,
		label: "Business Settings",
		icon: "business-center",
		link: "/admin/business",
	},
	{
		id: 25,
		label: "Pricing & Commissions",
		icon: "commission-percent",
		link: "/admin/pricing",
	},
	// {
	// 	id: 30,
	// 	label: "Company Profile",
	// 	icon: "person",
	// 	link: "/admin/company",
	// },
	// {
	// 	id: 35,
	// 	label: "Send Notifications",
	// 	icon: "notifications-none",
	// 	link: "/admin/notifications",
	// },
	{
		id: 40,
		label: "Onboard Agents",
		icon: "person-add",
		link: "/admin/onboard-agents",
	},
	{
		id: 45,
		label: "Query Center",
		icon: "query",
		link: "/admin/query",
	},
	{
		id: 50,
		label: "Invoice",
		icon: "description",
		link: "/admin/transaction/" + TransactionIds.INVOICE_DOWNLOAD,
		trxn_id: TransactionIds.INVOICE_DOWNLOAD,
	},
	{
		id: 99,
		label: "Configurations",
		icon: "manage",
		link: "/admin/configurations",
	},

	// UAT Options
	{
		id: 901,
		label: "Expression Editor",
		icon: "calculator",
		link: "/admin/expression-editor",
		featureFlag: "EXPRESSION_EDITOR",
	},
	{
		id: 902,
		label: "Test Page",
		icon: "error",
		link: "/admin/test",
		featureFlag: "TEST_PAGE",
	},
];

/**
 * Fixed menu items for agents left-menu.
 */
export const sidebarMenu: sidebarMenuType[] = [
	{
		id: 210,
		label: "Home",
		icon: "menu-home",
		link: "/home",
		dynamicAdminView: true,
	},
	// {
	// 	id: 220,
	// 	label: "Select Plan",
	// 	icon: "select-plan",
	// 	link: "/select-plan",
	// },

	// {
	// 	id: 230,
	// 	label: "Start A Transaction",
	// 	icon: "transaction",
	// 	subLevel: true,
	// 	api: true,
	// },
	// {
	// 	id: 240,
	// 	label: "Others",
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
