import { IconNameType } from "components/Icon/Icon";

type adminMenuType = {
	icon: IconNameType;
	name: string;
	link: string;
};
export const adminMenu: adminMenuType[] = [
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
	{
		icon: "invoice",
		name: "Invoicing",
		link: "/admin/invoicing",
	},
	{
		icon: "commission-percent",
		name: "Pricing & Comission",
		link: "/admin/pricing",
	},
	{
		icon: "person",
		name: "Company profile",
		link: "/admin/company",
	},
];
