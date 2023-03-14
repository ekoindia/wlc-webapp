/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	env: {
		production: process.env.PRODUCTION,
		development: process.env.DEVELOPMENT,
		client_id: process.env.CLIENT_ID,
	},
};

module.exports = nextConfig;
