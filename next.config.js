/** @type {import('next').NextConfig} */
const { RegExpIgnorePlugin } = require("webpack");

const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	webpack: (config, { isServer }) => {
		// Exclude Storybook from being compiled in production builds
		if (!isServer && process.env.NODE_ENV === "production") {
			config.plugins.push(
				new RegExpIgnorePlugin([
					// Ignore Storybook files
					/stories\//,
				])
			);
		}

		return config;
	},
};

module.exports = nextConfig;
