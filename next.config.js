import withBundleAnalyzer from "@next/bundle-analyzer";

const isProd = process.env.NEXT_PUBLIC_ENV === "production";
const isDev = process.env.NEXT_PUBLIC_ENV === "development";
const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === "true";

/**
 * Check if the build is running inside a Docker container to generate the standalone build.
 * This envoirnment variable can be passed in the Dockerfile.
 */
const isDockerBuild = process.env.DOCKER_BUILD === "true";

/*
// Default Content Security Policy
const cspHeaders = [
	// "default-src 'self';",
	// "script-src * 'unsafe-inline';", // 'unsafe-eval' is not recommended
	// "style-src 'self' 'unsafe-inline';",
	// "img-src 'self' blob: data:;",
	// "font-src 'self';",
	// "object-src 'self';",
	// "base-uri 'self';",
	// "form-action 'self';",	// 'self' or *
	"frame-src *;",
	"frame-ancestors 'none';",
	// "upgrade-insecure-requests;",
];

// Security headers
const securityHeaders = [
	{
		//
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	{
		// Prevent clickjacking by ensuring that their content is not embedded into other sites. To allow embedding, use "ALLOW-FROM https://example.com". To allow embedding into any site, use "ALLOW-FROM *".
		key: "X-Frame-Options",
		value: "SAMEORIGIN",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "X-XSS-Protection",
		value: "1; mode=block",
	},
	{
		key: "Referrer-Policy",
		value: "origin-when-cross-origin",
	},
	{
		key: "Content-Security-Policy",
		value: cspHeaders.join(" "),
	},
];
*/

// Config for removing console logs in production
const excludeLogTypes = ["error", "info"];
if (isDebugMode) {
	excludeLogTypes.push("debug");
}
const removeConsoleOptions = isProd ? { exclude: excludeLogTypes } : false;

const bundleAnalyzer = withBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
	openAnalyzer: true,
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	/* config options here */
	reactStrictMode: isDev ? true : false,
	poweredByHeader: false,
	swcMinify: true,
	eslint: {
		dirs: [
			"components",
			"page-components",
			"tf-components",
			"layout-components",
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

			{
				// Redirect internal "_files" subdirectory to https://files.eko.in for file downloads.
				// This is to hide the actual file server URL from the client, and use their domain instead.
				source: "/_files/:path*",
				destination: "https://files.eko.co.in/:path*",
			},

			{
				// Admin: Redirect internal "_files" subdirectory to https://files.eko.in for file downloads.
				// This is to hide the actual file server URL from the client, and use their domain instead.
				source: "/admin/_files/:path*",
				destination: "https://files.eko.co.in/:path*",
			},

			// URL Rewrites to fix Connect Widget bug of invalid partial paths (Eg: 'images/brands/...')
			{
				source: "/transaction/images/brands/:path*", // :path* is a catch-all
				destination: "/images/brands/:path*",
			},
			{
				source: "/transaction/locale/:path*", // :path* is a catch-all
				destination: "https://connect.eko.in/locale/:path*",
			},
			{
				source: "/transaction/script/:path*", // :path* is a catch-all
				destination: "https://connect.eko.in/script/:path*",
			},
			{
				source: "/admin/transaction/images/brands/:path*", // :path* is a catch-all
				destination: "/images/brands/:path*",
			},
			{
				source: "/admin/transaction/locale/:path*", // :path* is a catch-all
				destination: "https://connect.eko.in/locale/:path*",
			},
			{
				source: "/admin/transaction/script/:path*", // :path* is a catch-all
				destination: "https://connect.eko.in/script/:path*",
			},
		];
	},
	// async headers() {
	// 	return [
	// 		{
	// 			// Allow the /gateway/ route to be embedded in an iframe from any site
	// 			source: "/gateway/(.*)",
	// 			headers: [
	// 				{
	// 					// Allow embedding the /gateway/ route in iframe from any site
	// 					key: "X-Frame-Options",
	// 					value: "ALLOW-FROM *",
	// 				},
	// 				{
	// 					key: "Content-Security-Policy",
	// 					value: `frame-ancestors *`,
	// 				},
	// 			],
	// 		},
	// 		{
	// 			source: "/(.*)",
	// 			headers: securityHeaders,
	// 		},
	// 	];
	// },
};

// Add standalone build config for Docker
if (isDockerBuild) {
	nextConfig.output = "standalone";
}

export default bundleAnalyzer(nextConfig);
