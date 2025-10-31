import withBundleAnalyzer from "@next/bundle-analyzer";
// import packageJson from "./package.json" assert { type: "json" };
// const { version } = packageJson;

// Extract domain from URL (remove protocol and path)
const getDomainFromUrl = (url) => {
	if (!url) return null;
	return new URL(url).hostname;
};

const isProd = process.env.NEXT_PUBLIC_ENV === "production";
const isDev = process.env.NEXT_PUBLIC_ENV === "development";
const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === "true";

// Feature flag to enable/disable security headers (CSP, etc.)
const ENABLE_SECURITY_HEADERS =
	process.env.NEXT_PUBLIC_ENABLE_SECURITY_HEADERS === "true";

/**
 * Check if the build is running inside a Docker container to generate the standalone build.
 * This envoirnment variable can be passed in the Dockerfile.
 */
const isDockerBuild = process.env.DOCKER_BUILD === "true";

// Domain Constants for CSP organized by directive type
const SELF = "'self'";

// Create array of dynamic domains, filtering out null values
const EKO_DOMAINS = [
	getDomainFromUrl(process.env.NEXT_PUBLIC_API_BASE_URL),
	getDomainFromUrl(process.env.NEXT_PUBLIC_CONNECT_WIDGET_URL),
].filter(Boolean);

// --- CSP Domains organized by directive type ---

// Domains for script-src directive (JavaScript execution)
const SCRIPT_SRC_DOMAINS = [
	SELF,
	"'unsafe-inline'", // Required for inline scripts (GTM, etc.)
	"data:", // Required for data: URIs in scripts
	"*.eko.in", // Eko platform scripts
	"accounts.google.com", // Google authentication scripts
	"www.google-analytics.com", // Google Analytics scripts
	"cdnjs.cloudflare.com", // CDN scripts
	"cdn.jsdelivr.net", // CDN scripts (MediaPipe, etc.)
	"www.youtube.com", // YouTube embed scripts
	...EKO_DOMAINS,
	...(isDev ? ["'unsafe-eval'"] : []),
].filter(Boolean);

// Domains for style-src directive (CSS styles)
const STYLE_SRC_DOMAINS = [
	SELF,
	"'unsafe-inline'", // Required for inline styles
	"accounts.google.com", // Google authentication styles
];

// Domains for img-src directive (images)
const IMG_SRC_DOMAINS = [
	SELF,
	"blob:", // Required for blob URLs
	"data:", // Required for data: URIs
	"*.eko.in", // Eko platform images
	"files.eko.co.in", // Eko file server
	"img.youtube.com", // YouTube thumbnails
];

// Domains for font-src directive (fonts)
const FONT_SRC_DOMAINS = [SELF];

// Domains for connect-src directive (XHR, fetch, WebSocket)
const CONNECT_SRC_DOMAINS = [
	SELF,
	"*.eko.in", // Eko platform APIs
	"files.eko.co.in", // Eko file server
	"*.digitaloceanspaces.com", // DigitalOcean CDN
	"www.youtube.com", // YouTube API
	"api.cloud.copilotkit.ai", // CopilotKit API
	"cdn.jsdelivr.net", // CDN for MediaPipe WASM/model files
	...EKO_DOMAINS,
].filter(Boolean);

// Domains for frame-src directive (iframes)
const FRAME_SRC_DOMAINS = [
	SELF,
	"accounts.google.com", // Google authentication iframe
	"www.bing.com", // Bing maps iframe
	"zfrmz.in", // Zoho forms iframe
	"forms.zohopublic.in", // Zoho public forms iframe
	"www.youtube.com", // YouTube embed iframe
	...EKO_DOMAINS,
].filter(Boolean);

// Domains for base-uri directive (base tag restrictions)
const BASE_URI_DOMAINS = [SELF, ...EKO_DOMAINS];
// Content Security Policy (CSP) for multi-tenant environment
// NOTE: 'unsafe-inline' in script-src is required due to inline <Script> usage (e.g., Google Tag Manager). To improve security, migrate all inline scripts to use a nonce/hash or load as external files. See pages/_app.tsx for GTM example. Remove 'unsafe-inline' if/when all inline scripts are eliminated.
const cspHeaders = [
	// Only allow resources from the same origin by default. Blocks all external sources unless explicitly allowed below.
	`default-src ${SELF}`,
	// Allow JavaScript execution from trusted domains. 'unsafe-inline' is present due to inline <Script> usage (e.g., Google Tag Manager).
	`script-src ${SCRIPT_SRC_DOMAINS.join(" ")}`,
	// Allow styles from self and trusted domains. 'unsafe-inline' allows inline styles (required for some libraries).
	`style-src ${STYLE_SRC_DOMAINS.join(" ")}`,
	// Allow images from self, blob, data, and trusted domains (e.g., for logos and static assets).
	`img-src ${IMG_SRC_DOMAINS.join(" ")}`,
	// Allow fonts from self only.
	`font-src ${FONT_SRC_DOMAINS.join(" ")}`,
	// Allow XHR/fetch/WebSocket connections to trusted domains.
	`connect-src ${CONNECT_SRC_DOMAINS.join(" ")}`,
	// Allow embedding widgets and trusted iframes. Blocks other external iframes.
	`frame-src ${FRAME_SRC_DOMAINS.join(" ")}`,
	// Block all plugins and object/embed elements for security.
	"object-src 'none'",
	// Allow base URI to be set to self or trusted domains. Prevents base tag abuse from other origins.
	`base-uri ${BASE_URI_DOMAINS.join(" ")}`,
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
	// env: {
	// 	NEXT_PUBLIC_APP_VERSION: version, // Expose app version from package.json to the client
	// },
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

	/**
	 * Conditionally applies security headers to all application routes.
	 *
	 * This function checks the `ENABLE_SECURITY_HEADERS` environment variable.
	 * - If `true`, it applies the `securityHeaders` array to all routes (`/(.*)`).
	 * - If `false`, it returns an empty array, effectively disabling all custom security headers.
	 *
	 * Note: Next.js does not apply security headers like CSP by default. Disabling this
	 * in production will expose the application to common web vulnerabilities. Standard
	 * HTTP headers required for responses (e.g., `Content-Type`) will still be applied
	 * even if this function returns an empty array.
	 * @returns {Promise<Array<{source: string, headers: Array<{key: string, value: string}>}>>} A promise that resolves to an array of header objects.
	 */
	async headers() {
		if (ENABLE_SECURITY_HEADERS) {
			return [
				{
					// Apply security headers to all routes to fix security vulnerabilities
					source: "/(.*)",
					headers: securityHeaders,
				},
			];
		}

		return []; // Disable security headers by default
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
