import { IconNameType } from "constants/IconLibrary";
import { TransactionIds } from ".";

type sidebarMenuType = {
	id: number;
	icon?: IconNameType;
	name?: string;
	label?: string;
	summary?: string; // For UI: Short caption for the menu item, used to show on the UI to inform what it is about.
	fullDescription?: string; // For AI: Additional detailed description of the menu item, especially to train AI about that feature.
	link?: string;
	trxn_id?: number; // Transaction Id to link to. Converts to "/transaction/<trxn_id>" links after checking if it is allowed as per user's roles.
	dynamicAdminView?: boolean; // If true, then the menu item will be shown to Admins in the "Agent-View". The link should be prepended with "/admin" in this case.
	featureFlag?: string; // The feature flag to check if the menu item should be shown or not.
	beta?: boolean; // If true, then show a "beta" tag with the menu item.
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
		summary:
			"View your dashboard with key metrics and insights about your business.",
		fullDescription:
			"The dashboard provides an overview of your business performance, including key metrics such as total transactions, revenue, and user engagement. It helps you monitor your product health at a glance. You also get insights about the onboarding status of your agents.",
	},
	{
		id: 5,
		label: "My Network",
		icon: "refer",
		link: "/admin/my-network",
		summary: "View and manage your network of users.",
		fullDescription:
			"View your network of users as a list or in a tree hierarchy. Search or filter users based on various criteria such as role or status, and view their detailed profile. Manage users by marking them as active or inactive, or update their role.",
	},
	{
		id: 10,
		label: "Network Transactions",
		icon: "swap-horiz",
		link: "/admin/network-statement",
		summary: "View transactions across your network.",
		featureFlag: "NETWORK_STATEMENT",
		beta: true,
	},
	{
		// TODO: REMOVE THIS WITH RELATED COMPONENTS
		id: 9,
		label: "Network Statement",
		icon: "swap-horiz",
		link: "/admin/transaction-history",
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
		summary: "Configure your business settings and services.",
		fullDescription:
			"Manage your business settings, including enabling or disabling services, make account verification mandatory or optional, setup agreement signing with your users, setup frequency of commission payment, manage cash-eposit charges for your agents, setup how refunds to the end-customers work, etc.",
	},
	{
		id: 25,
		label: "Pricing & Commissions",
		icon: "commission-percent",
		link: "/admin/pricing",
	},
	{
		id: 30,
		label: "Pricing Configuration",
		icon: "commission-percent",
		link: "/admin/pricing-config",
		summary: "Configure dynamic pricing and commissions for your products.",
		fullDescription:
			"Set up and manage dynamic pricing rules and commission structures for your products. This includes defining pricing tiers, setting commission rates for different user roles, etc.",
		featureFlag: "DYNAMIC_PRICING_COMMISSION",
		beta: true,
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
		summary:
			"Onboard new users to your network, one at a time, or in bulk by uploading a list.",
		fullDescription:
			"Onboard new users/agents with different roles to your network by filling out their basic details (name & mobile number) one at a time, or in bulk by uploading a CSV file. They will still need to complete their KYC verification the first time they log in, before they can start using the services. After onboarding users, you can also share the app link with them via WhatsApp, or SMS",
	},
	{
		id: 45,
		label: "Query Center",
		icon: "query",
		link: "/admin/query",
		summary:
			"View and manage queries/issues raised by you or your users/agents.",
		fullDescription:
			"You can view the tickets, add comments, escalate issues, or close them.",
	},
	{
		id: 50,
		label: "Invoice",
		icon: "description",
		link: "/admin/transaction/" + TransactionIds.INVOICE_DOWNLOAD,
		trxn_id: TransactionIds.INVOICE_DOWNLOAD,
		summary: "Download your invoices for transactions.",
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
		summary:
			"View your homepage and dashboard with key metrics and insights about your business.",
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
