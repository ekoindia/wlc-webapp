import { fetchOrgDetails } from "helpers/fetchOrgDetailsHelper";

/**
 * Get dynamic manifest data for the given (sub)domain
 * @param req
 * @param res
 */
export default async function proxy(req, res) {
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Cache-Control", "max-age=86400");

	const org_details = await fetchOrgDetails(req?.headers?.host, false);
	const org = org_details?.props?.data;
	const theme = org?.metadata?.theme ?? {};

	// console.log(
	// 	"\n\n\n\n>>>>>>>>> MANIFEST >>>>>>>> ",
	// 	req?.headers?.host,
	// 	org_details
	// );

	const manifestTemplate = {
		name: org?.app_name || "",
		short_name: org?.app_name || "",
		id: "/org" + org?.org_id,
		// lang: "en-US",
		start_url: "/",
		scope: "/",
		background_color: theme?.primary || "#ffffff",
		theme_color: theme?.primary_light || "#ffffff",
		display: "standalone",
		categories: ["finance", "shopping"],
		// TODO:  "description": "A simple, secure and fast way to pay your bills and recharge your mobile phone.",
		// TODO: "screenshots": [{src, sizes, type, form_factor, label}],
		icons: [
			{
				src: "/favicon.svg",
				sizes: "48x48 72x72 96x96 128x128 144x144 152x152 167x167 180x180 192x192 512x512 1024x1024",
			},
			{
				src: "/maskable_favicon_128.png",
				type: "png",
				sizes: "128x128",
				purpose: "maskable",
			},
			// {
			// 	src: org?.logo,
			// 	//type: "png",
			// 	sizes: "48x48 72x72 76x76 96x96 120x120 144x144 152x152 167x167 180x180 192x192 512x512 1024x1024",
			// },
		],
	};

	res.send(manifestTemplate);
}
