import { IconNameType } from "components/Icon/Icon";
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

export const adminSidebarMenu: adminSidebarMenuType[] = [
	{
		icon: "dashboard",
		name: "Dashboard",
		link: "/admin",
	},
	{
		icon: "refer",
		name: "My Network",
		link: "/admin/my-network",
	},
	{
		icon: "swap-horiz",
		name: "Transaction History",
		link: "/admin/transaction-history",
	},
	// {
	// 	icon: "invoice",
	// 	name: "Invoicing",
	// 	link: "/admin/invoicing",
	// },
	{
		icon: "commission-percent",
		name: "Pricing & Comission",
		link: "/admin/pricing",
	},
	// {
	// 	icon: "person",
	// 	name: "Company profile",
	// 	link: "/admin/company",
	// },
];

export const sidebarMenu: sidebarMenuType[] = [
	{
		icon: "menu-home",
		name: "Home",
		link: "/home",
	},
	// {
	// 	icon: "select-plan",
	// 	name: "Select Plan",
	// 	link: "/select-plan",
	// },
	{
		icon: "transaction",
		name: "Start A Transaction",
		subLevel: true,
		api: true,
	},
	{
		icon: "others",
		name: "Others",
		subLevel: true,
		subLevelObject: [
			{
				icon: "view-transaction-history",
				label: "Transaction History",
				link: "/history",
			},
			{
				icon: "manage",
				label: "Manage My Account",
				link: "/transaction/" + TransactionIds.MANAGE_MY_ACCOUNT,
			},
		],
	},
];
