const path = require("path");

module.exports = {
	stories: [
		"../stories/**/*.stories.mdx",
		"../stories/**/*.stories.@(js|jsx|ts|tsx)",
		"../components/**/*.stories.mdx",
		"../components/**/*.stories.@(js|jsx|ts|tsx)",
		"../pages/**/*.stories.mdx",
		"../pages/**/*.stories.@(js|jsx|ts|tsx)",
		"../page-components/**/*.stories.mdx",
		"../page-components/**/*.stories.@(js|jsx|ts|tsx)",
		"../tf-components/**/*.stories.mdx",
		"../tf-components/**/*.stories.@(js|jsx|ts|tsx)",
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		// "@storybook/addon-postcss",
		"@chakra-ui/storybook-addon",
		// {
		// 	name: "@storybook/addon-storysource",
		// 	// See all options here:
		// 	//   https://github.com/storybookjs/storybook/blob/main/lib/source-loader/README.md#options
		// 	options: {
		// 		rule: {
		// 			// test: [/\.stories\.jsx?$/], This is default
		// 			include: [
		// 				path.resolve(__dirname, "../components"),
		// 				path.resolve(__dirname, "../pages"),
		// 				path.resolve(__dirname, "../page-components"),
		// 				path.resolve(__dirname, "../tf-components"),
		// 				// path.resolve(__dirname, "../features"),
		// 			], // You can specify directories
		// 		},
		// 		loaderOptions: {
		// 			prettierConfig: { printWidth: 80, singleQuote: false },
		// 		},
		// 	},
		// },
	],
	features: {
		emotionAlias: false,
	},
	framework: "@storybook/react",
	core: {
		builder: "@storybook/builder-webpack5",
	},
	staticDirs: ["../public"],
	docs: {
		autodocs: true,
	},
	webpackFinal: async (config) => {
		config.resolve.alias["components"] = path.resolve(
			__dirname,
			"../components"
		);
		config.resolve.alias["pages"] = path.resolve(__dirname, "../pages");
		config.resolve.alias["page-components"] = path.resolve(
			__dirname,
			"../page-components"
		);
		config.resolve.alias["tf-components"] = path.resolve(
			__dirname,
			"../tf-components"
		);
		// config.resolve.alias["features"] = path.resolve(
		// 	__dirname,
		// 	"../features"
		// );
		config.resolve.alias["constants"] = path.resolve(
			__dirname,
			"../constants"
		);
		config.resolve.alias["helpers"] = path.resolve(__dirname, "../helpers");
		config.resolve.alias["hooks"] = path.resolve(__dirname, "../hooks");
		config.resolve.alias["styles"] = path.resolve(__dirname, "../styles");
		config.resolve.alias["contexts"] = path.resolve(
			__dirname,
			"../contexts"
		);
		config.resolve.alias["utils"] = path.resolve(__dirname, "../utils");
		config.resolve.alias["libs"] = path.resolve(__dirname, "../libs");
		config.module.rules.push({
			test: /\.mjs$/,
			include: /node_modules/,
			type: "javascript/auto",
		});
		return config;
	},
	// typescript: {
	// 	check: false,
	// 	checkOptions: {},
	// 	reactDocgen: false
	// },
};
