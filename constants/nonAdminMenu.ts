import { IconNameType } from "components/Icon/Icon";

type nonAdminMenuType = {
	icon?: IconNameType;
	comp?: boolean;
	name?: string;
	link?: string;
	api?: boolean;
	subLevel?: boolean;
	subLevelObject?: any;
};
export const nonAdminMenu: nonAdminMenuType[] = [
	// {
	// 	name: "Profile",
	// 	comp: true,
	// },
	// {
	// 	name: "Wallet Balance",
	// 	comp: true,
	// },
	{
		icon: "menu-home",
		name: "Home",
		link: "/home",
	},
	{
		icon: "select-plan",
		name: "Select Plan",
		link: "/select-plan",
	},
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
				link: "/transaction-history",
			},
			{
				icon: "manage",
				label: "Manage My Account",
				link: "/transaction/536",
			},
		],
	},
];
