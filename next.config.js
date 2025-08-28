import withBundleAnalyzer from "@next/bundle-analyzer";

const isProd = process.env.NEXT_PUBLIC_ENV === "production";
const isDev = process.env.NEXT_PUBLIC_ENV === "development";
const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === "true";

/**
 * Check if the build is running inside a Docker container to generate the standalone build.
 * This envoirnment variable can be passed in the Dockerfile.
 */
const isDockerBuild = process.env.DOCKER_BUILD === "true";

// --- Domain Constants for CSP ---
const SELF = "'self'";
const LOCALHOST_DOMAINS = {
	WEBAPP: "http://localhost:3000",
	API: "http://localhost:8001",
};

// Core Eko Domains
const EKO_DOMAINS = { GENERIC: "*.eko.in", FILES: "files.eko.co.in" };
const EKO_CONNECT_PROD = {
	API: "api.connect.eko.in",
	APP: "connect.eko.in",
};
const EKO_CONNECT_DEV = {
	API: "api.beta.ekoconnect.in",
	APP: "beta.ekoconnect.in",
};

// Third-Party Domains
const CDN_DOMAINS = {
	CLOUDFLARE: "cdnjs.cloudflare.com",
	DIGITALOCEAN: "*.digitaloceanspaces.com",
};
const GOOGLE_DOMAINS = {
	ACCOUNTS: "accounts.google.com",
	ANALYTICS: "www.google-analytics.com",
};
const YOUTUBE_DOMAINS = {
	DEFAULT: "www.youtube.com",
	IMG: "img.youtube.com",
};
const IFRAME_DOMAINS = {
	BING: "www.bing.com",
	ZOHO_FORMS: "zfrmz.in",
	ZOHO_PUBLIC_FORMS: "forms.zohopublic.in",
};

// Misc Domains
const MISC_DOMAINS = { COPILOT_KIT: "api.cloud.copilotkit.ai" };

// --- Environment-Specific Configuration ---
const envConfig = {
	production: {
		connectDomains: Object.values(EKO_CONNECT_PROD),
		scriptSrcUnsafe: [],
	},
	development: {
		connectDomains: [
			...Object.values(EKO_CONNECT_DEV),
			...Object.values(LOCALHOST_DOMAINS),
		],
		scriptSrcUnsafe: ["'unsafe-eval'"],
	},
};

const currentConfig = isProd ? envConfig.production : envConfig.development;
// --- End of Configuration ---

// Content Security Policy (CSP) for multi-tenant environment
// NOTE: 'unsafe-inline' in script-src is required due to inline <Script> usage (e.g., Google Tag Manager). To improve security, migrate all inline scripts to use a nonce/hash or load as external files. See pages/_app.tsx for GTM example. Remove 'unsafe-inline' if/when all inline scripts are eliminated.
const getConnectSrcDomains = () => {
	const baseDomains = [
		SELF,
		...Object.values(EKO_DOMAINS),
		...Object.values(CDN_DOMAINS),
		YOUTUBE_DOMAINS.DEFAULT,
	];
	return [...baseDomains, ...currentConfig.connectDomains];
};

const cspHeaders = [
	// Only allow resources from the same origin by default. Blocks all external sources unless explicitly allowed below.
	`default-src ${SELF}`,
	// 'unsafe-inline' is present due to inline <Script> usage (e.g., Google Tag Manager). Remove 'unsafe-inline' if all inline scripts are migrated to nonce/hash or external files.
	`script-src ${[
		SELF,
		"'unsafe-inline'",
		"data:",
		...Object.values(EKO_DOMAINS),
		...Object.values(GOOGLE_DOMAINS),
		...currentConfig.scriptSrcUnsafe,
		...currentConfig.connectDomains.filter(
			(d) => !Object.values(LOCALHOST_DOMAINS).includes(d)
		), // Exclude localhost from script-src
		CDN_DOMAINS.CLOUDFLARE,
		YOUTUBE_DOMAINS.DEFAULT,
	].join(" ")}`,
	// Allows styles from self and Google accounts. 'unsafe-inline' allows inline styles (required for some libraries, but should be avoided if possible).
	`style-src ${SELF} 'unsafe-inline' ${GOOGLE_DOMAINS.ACCOUNTS}`,
	// Allow images from self, blob, data, and trusted domains (e.g., for logos and static assets).
	`img-src ${SELF} blob: data: ${[
		...Object.values(EKO_DOMAINS),
		YOUTUBE_DOMAINS.IMG,
	].join(" ")}`,
	// Allow fonts from self only.
	`font-src ${SELF}`,
	// Allow XHR/fetch/WebSocket connections to trusted domains (see getConnectSrcDomains for dynamic domains).
	`connect-src ${[
		...getConnectSrcDomains(),
		...Object.values(MISC_DOMAINS),
	].join(" ")}`,
	// Allow embedding widgets and Google auth iframes. Blocks other external iframes.
	`frame-src ${SELF} ${[
		...Object.values(EKO_CONNECT_PROD),
		...Object.values(EKO_CONNECT_DEV),
		GOOGLE_DOMAINS.ACCOUNTS,
		...Object.values(IFRAME_DOMAINS),
		YOUTUBE_DOMAINS.DEFAULT,
	].join(" ")}`,
	// Block all plugins and object/embed elements for security.
	"object-src 'none'",
	// Allow base URI to be set to self or trusted widget domains. Prevents base tag abuse from other origins.
	`base-uri ${SELF} ${[
		...Object.values(EKO_CONNECT_PROD),
		...Object.values(EKO_CONNECT_DEV),
	].join(" ")}`,
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
	// "script-src * 'unsafe-inline';" // 'unsafe-eval' is not recommended
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
