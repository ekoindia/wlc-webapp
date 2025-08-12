import withBundleAnalyzer from "@next/bundle-analyzer";

const isProd = process.env.NEXT_PUBLIC_ENV === "production";
const isDev = process.env.NEXT_PUBLIC_ENV === "development";
const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === "true";

/**
 * Check if the build is running inside a Docker container to generate the standalone build.
 * This envoirnment variable can be passed in the Dockerfile.
 */
const isDockerBuild = process.env.DOCKER_BUILD === "true";

// Enhanced Content Security Policy for multi-tenant environment
const getConnectSrcDomains = () => {
	const baseDomains = [
		"'self'",
		"https://*.eko.in",
		"https://files.eko.co.in",
		"https://accounts.google.com",
		"https://*.googleapis.com",
		"https://maps.google.com",
		"https://chatgpt.com",
		"https://zfrmz.in",
		"https://forms.zohopublic.in",
		"https://www.youtube.com",
		"https://contracting-v2-preproduction.signzy.app",
		"https://cdnjs.cloudflare.com",
		"https://fonts.googleapis.com",
		"https://fonts.gstatic.com",
		"https://www.googletagmanager.com",
		"https://www.gstatic.com",
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
	"default-src 'self'", // Only allow resources from the same origin. Blocks all external sources by default.
	// 'unsafe-inline' is present due to inline <Script> usage (e.g., Google Tag Manager). To remove 'unsafe-inline', migrate all inline <Script> to use a nonce/hash or load as external files. See pages/_app.tsx for GTM example.
	isProd
		? "script-src 'self' 'unsafe-inline' data: https://connect.eko.in https://*.eko.in https://accounts.google.com https://www.gstatic.com https://cdnjs.cloudflare.com" // Added cdnjs and data: for webcomponents polyfill
		: "script-src 'self' 'unsafe-inline' 'unsafe-eval' data: https://connect.eko.in https://*.eko.in https://accounts.google.com https://www.gstatic.com https://cdnjs.cloudflare.com", // Added cdnjs and data: for webcomponents polyfill

	"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com", // Allows styles from self, Google Fonts, and Google accounts. 'unsafe-inline' allows inline styles.
	"img-src 'self' blob: data: https://*.eko.in https://eko.in https://files.eko.co.in", // Added https://eko.in for logo and static assets
	"font-src 'self' https://fonts.gstatic.com", // Allows fonts from self and Google Fonts CDN.
	`connect-src ${[...getConnectSrcDomains(), "https://api.cloud.copilotkit.ai"].join(" ")}`, // Added copilotkit cloud API
	"frame-src 'self' https://connect.eko.in https://accounts.google.com", // Allows embedding widgets and Google auth iframes. Blocks other external iframes.
	"object-src 'none'", // Blocks all plugins and object/embed elements for security.
	"base-uri 'self' https://beta.ekoconnect.in https://connect.eko.in/", // Allows base URI to be set to self or beta.ekoconnect.in or connect.eko.in for widget compatibility. Prevents base tag abuse from other origins.
	"form-action 'self'", // Only allows forms to be submitted to self. Blocks data exfiltration via forms.
	"frame-ancestors 'none'", // Prevents the site from being embedded in any iframe. Protects against clickjacking.
].join("; ");

// Security headers for production
const securityHeaders = [
	{
		key: "X-DNS-Prefetch-Control",
		value: "on", // Enables DNS prefetching for faster external resource loading.
	},
	{
		key: "X-Frame-Options",
		value: "SAMEORIGIN", // Only allows the site to be framed by itself. Blocks clickjacking from other origins.
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff", // Prevents browsers from MIME-sniffing a response away from the declared content-type. Blocks some XSS attacks.
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
		value: "max-age=31536000; includeSubDomains", // Forces HTTPS for 1 year on all subdomains. Blocks downgrade attacks.
	},
	{
		key: "Permissions-Policy",
		value: "camera=(self), microphone=(self), geolocation=(self), payment=(self), usb=(), bluetooth=(), serial=()", // Allows only self to access camera, mic, geolocation, payment. Blocks USB, Bluetooth, Serial APIs.
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
