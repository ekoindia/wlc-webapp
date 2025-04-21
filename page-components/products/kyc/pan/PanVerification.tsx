import { InfoTileGrid } from "components";

/**
 * List of PAN Verification Sub-Products
 */
const PanSubProducts: {
	label: string;
	desc: string;
	icon?: string;
	url: string;
}[] = [
	{
		label: "PAN Basic",
		desc: "Verify a PAN number and view basic details",
		icon: "search",
		url: "pan/basic",
	},
	{
		label: "PAN Lite",
		desc: "Verify PAN with name and DOB matching",
		icon: "description",
		url: "pan/lite",
	},
	{
		label: "PAN Advanced",
		desc: "Get detailed PAN information including address",
		icon: "verified-user",
		url: "pan/advanced",
	},
	{
		label: "Bulk PAN Verification",
		desc: "Verify multiple PAN numbers in a batch",
		icon: "view-list",
		url: "pan/bulk",
	},
];

export const PanVerification = (): JSX.Element => {
	return <InfoTileGrid list={PanSubProducts} />;
};
