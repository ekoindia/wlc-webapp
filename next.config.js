const isProd = process.env.NEXT_PUBLIC_ENV === "production";

/** @type {import('next').NextConfig} */
const { RegExpIgnorePlugin } = require("webpack");

const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	webpack: (config, { isServer }) => {
		// Exclude Storybook from being compiled in production builds
		if (!isServer && isProd) {
			config.plugins.push(
				new RegExpIgnorePlugin([
					// Ignore Storybook files
					/stories\//,
				])
			);
		}
		return config;
	},
	compiler: {
		removeConsole: isProd ? { exclude: ["error"] } : false,
	},
};

module.exports = nextConfig;
