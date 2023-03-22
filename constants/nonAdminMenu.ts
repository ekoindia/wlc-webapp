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
		icon: "dashboard",
		name: "Home",
		link: "/home",
	},
	{
		icon: "refer",
		name: "Select Plan",
		link: "",
	},
	{
		icon: "refer",
		name: "Start A Transaction",
		subLevel: true,
		api: true,
	},
	{
		icon: "invoice",
		name: "Others",
		subLevel: true,
		subLevelObject: [
			{
				icon: "commission-percent",
				label: "Transaction History",
				link: "",
			},
			{
				icon: "commission-percent",
				label: "Settings",
				link: "",
			},
		],
	},
];
