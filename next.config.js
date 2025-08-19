import withBundleAnalyzer from "@next/bundle-analyzer";

const isProd = process.env.NEXT_PUBLIC_ENV === "production";
const isDev = process.env.NEXT_PUBLIC_ENV === "development";
const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === "true";

/**
 * Check if the build is running inside a Docker container to generate the standalone build.
 * This envoirnment variable can be passed in the Dockerfile.
 */
const isDockerBuild = process.env.DOCKER_BUILD === "true";

// Content Security Policy (CSP) for multi-tenant environment
// NOTE: 'unsafe-inline' in script-src is required due to inline <Script> usage (e.g., Google Tag Manager). To improve security, migrate all inline scripts to use a nonce/hash or load as external files. See pages/_app.tsx for GTM example. Remove 'unsafe-inline' if/when all inline scripts are eliminated.
const getConnectSrcDomains = () => {
	const baseDomains = [
		"'self'",
		"https://*.eko.in",
		"https://files.eko.co.in",
		"https://www.youtube.com",
		"https://cdnjs.cloudflare.com",
		"https://*.digitaloceanspaces.com",
		// Form embedding domains (not needed in connect-src)
		// "https://zfrmz.in",
		// "https://forms.zohopublic.in",
		// Google domains (commented as requested)
		// "https://*.googleapis.com",
		// "https://maps.google.com",
		// "https://contracting-v2-preproduction.signzy.app",
		// "https://fonts.googleapis.com",
		// "https://fonts.gstatic.com",
		// "https://www.googletagmanager.com",
		// "https://www.gstatic.com",
	];

	if (isProd) {
		return [
			...baseDomains,
			"https://api.connect.eko.in",
			"https://eko.connect.in",
		];
	} else {
		return [
			...baseDomains,
			"https://api.beta.ekoconnect.in",
			"https://beta.ekoconnect.in",
			"http://localhost:3000",
			"http://localhost:8001",
		];
	}
};

const cspHeaders = [
	// Only allow resources from the same origin by default. Blocks all external sources unless explicitly allowed below.
	"default-src 'self'",
	// 'unsafe-inline' is present due to inline <Script> usage (e.g., Google Tag Manager). Remove 'unsafe-inline' if all inline scripts are migrated to nonce/hash or external files.
	isProd
		? "script-src 'self' 'unsafe-inline' data: https://connect.eko.in https://*.eko.in https://accounts.google.com https://cdnjs.cloudflare.com https://www.google-analytics.com https://www.youtube.com"
		: "script-src 'self' 'unsafe-inline' 'unsafe-eval' data: https://connect.eko.in https://*.eko.in https://accounts.google.com https://cdnjs.cloudflare.com https://www.google-analytics.com https://www.youtube.com https://beta.ekoconnect.in",
	// Allows styles from self and Google accounts. 'unsafe-inline' allows inline styles (required for some libraries, but should be avoided if possible).
	"style-src 'self' 'unsafe-inline' https://accounts.google.com",
	// Allow images from self, blob, data, and trusted domains (e.g., for logos and static assets).
	"img-src 'self' blob: data: https://*.eko.in https://files.eko.co.in https://img.youtube.com",
	// Allow fonts from self only.
	"font-src 'self'",
	// Allow XHR/fetch/WebSocket connections to trusted domains (see getConnectSrcDomains for dynamic domains).
	`connect-src ${[...getConnectSrcDomains(), "https://api.cloud.copilotkit.ai"].join(" ")}`,
	// Allow embedding widgets and Google auth iframes. Blocks other external iframes.
	"frame-src 'self' https://connect.eko.in https://accounts.google.com https://www.bing.com https://www.youtube.com/ https://zfrmz.in https://forms.zohopublic.in",
	// Block all plugins and object/embed elements for security.
	"object-src 'none'",
	// Allow base URI to be set to self or trusted widget domains. Prevents base tag abuse from other origins.
	"base-uri 'self' https://beta.ekoconnect.in https://connect.eko.in",
	// Only allow forms to be submitted to self. Blocks data exfiltration via forms.
	"form-action 'self'",
	// Prevent the site from being embedded in any iframe. Protects against clickjacking.
	"frame-ancestors 'none'",
].join("; ");

// Security headers for all routes (applied in Next.js custom headers)
// These headers help mitigate common web vulnerabilities and enforce best practices.
const securityHeaders = [
	{
		key: "X-DNS-Prefetch-Control",
		value: "on", // Enables DNS prefetching for faster external resource loading.
	},
	{
		key: "X-Frame-Options",
		value: "SAMEORIGIN", // Prevents clickjacking by only allowing the site to be framed by itself.
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff", // Prevents browsers from MIME-sniffing a response away from the declared content-type.
	},
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin", // Sends only the origin as referrer to other origins. Protects user privacy.
	},
	{
		key: "Content-Security-Policy",
		value: cspHeaders, // Applies the above CSP rules to all responses.
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains", // Forces HTTPS for 1 year on all subdomains.
	},
	{
		key: "Permissions-Policy",
		value: "camera=(self), microphone=(self), geolocation=(self), payment=(self), usb=(), bluetooth=(), serial=()", // Restricts access to sensitive APIs to self only.
	},
];

/*
// ORIGINAL COMMENTED SECURITY HEADERS (kept for reference)
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
			{
				protocol: "https",
				hostname: "files.eko.co.in",
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

			// Dynamic sitemap.xml for each organization (not needed for now)
			// {
			// 	source: "/sitemap.xml",
			// 	destination: "/api/sitemap-proxy",
			// },
		];
	},
	// Enable security headers to fix vulnerabilities
	async headers() {
		return [
			{
				// Apply security headers to all routes to fix security vulnerabilities
				source: "/(.*)",
				headers: securityHeaders,
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
