/**
 * Get dynamic sitemap.xml for the given domain
 * @param req
 * @param res
 */
export default async function proxy(req, res) {
	res.setHeader("Content-Type", "text/xml");
	res.setHeader("Cache-Control", "public, max-age=0");

	// Convert host to https
	let host = req?.headers?.host;
	if (host.startsWith("http://")) {
		host = host.replace("http://", "https://");
	}

	// Generate the first date of this month (as a dummy lastmod date)
	const today = new Date();
	const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

	const sitemapTemplate = `<?xml version="1.0" encoding="UTF-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
		<url>
			<loc>https://${host}/</loc>
			<lastmod>${firstOfMonth.toISOString()}</lastmod>
			<changefreq>monthly</changefreq>
			<priority>1.0</priority>
		</url>
	</urlset>`;

	res.send(sitemapTemplate);
}
