const isProd = process.env.NEXT_PUBLIC_ENV === "production";
const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === "true";

// Config for removing console logs in production
const excludeLogTypes = ["error"];
if (isDebugMode) {
	excludeLogTypes.push("debug");
}
const removeConsoleOptions = isProd ? { exclude: excludeLogTypes } : false;

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
	openAnalyzer: true,
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withBundleAnalyzer({
	/* config options here */
	reactStrictMode: isProd ? false : true,
	poweredByHeader: false,
	swcMinify: true,
	eslint: {
		dirs: [
			"components",
			"page-components",
			"tf-components",
			"pages",
			"features",
			"libs",
			"utils",
			"helpers",
			"hooks",
			"contexts",
			"constants",
		],
	},
	compiler: {
		reactRemoveProperties: true, // removes ^data-test properties in build
		removeConsole: removeConsoleOptions,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.eko.in",
			},
		],
	},
	async rewrites() {
		return [
			{
				// Dynamic manifest.json for each organization
				source: "/manifest.json",
				destination: "/api/manifest-proxy",
			},
		];
	},
});

module.exports = nextConfig;
