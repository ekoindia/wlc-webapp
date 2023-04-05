const isProd = process.env.NEXT_PUBLIC_ENV === "production";

/** @type {import('next').NextConfig} */

const { IgnorePlugin } = require("webpack");

const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	//webpack: (config) => {
	// Exclude Storybook from being compiled in production builds
	//if (isProd) {
	// config.plugins.push(
	// 	new IgnorePlugin({
	// 		resourceRegExp: /\/stories\//,
	// 	})
	// );
	/* another */
	// config.module.rules.push({
	// 	test: /\.stories\.(js|jsx|ts|tsx)$/,
	// 	loader: "ignore-loader",
	// });
	// }
	// return config;
	//},
	compiler: {
		removeConsole: isProd ? { exclude: ["error"] } : false,
	},
};

module.exports = nextConfig;
