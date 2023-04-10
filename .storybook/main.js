const path = require("path");

module.exports = {
	stories: [
		// "./*.stories.@(js,jsx,mdx)",
		// "./*.stories.@(js,jsx,mdx)",
		"../stories/**/*.stories.mdx",
		"../stories/**/*.stories.@(js|jsx|ts|tsx)",
		"../components/**/*.stories.mdx",
		"../components/**/*.stories.@(js|jsx|ts|tsx)",
		// "../features/**/*.stories.mdx",
		// "../features/**/*.stories.@(js|jsx|ts|tsx)",
		"../pages/**/*.stories.mdx",
		"../pages/**/*.stories.@(js|jsx|ts|tsx)",
		"../components/**/*.stories.mdx",
		"../components/**/*.stories.@(js|jsx|ts|tsx)",
		// "../features/**/*.stories.mdx",
		// "../features/**/*.stories.@(js|jsx|ts|tsx)",
		"../pages/**/*.stories.mdx",
		"../pages/**/*.stories.@(js|jsx|ts|tsx)",
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-postcss",
		"@chakra-ui/storybook-addon",
		{
			name: "@storybook/addon-storysource",
			// See all options here:
			//   https://github.com/storybookjs/storybook/blob/main/lib/source-loader/README.md#options
			options: {
				rule: {
					// test: [/\.stories\.jsx?$/], This is default
					include: [
						path.resolve(__dirname, "../components"),
						path.resolve(__dirname, "../pages"),
						// path.resolve(__dirname, "../features"),
					], // You can specify directories
				},
				loaderOptions: {
					prettierConfig: { printWidth: 80, singleQuote: false },
				},
			},
		},
	],
	features: {
		emotionAlias: false,
	},
	framework: "@storybook/react",
	core: {
		builder: "@storybook/builder-webpack5",
	},
	staticDirs: ["../public"],
	webpackFinal: async (config) => {
		config.resolve.alias["components"] = path.resolve(
			__dirname,
			"../components"
		);
		config.resolve.alias["pages"] = path.resolve(__dirname, "../pages");
		// config.resolve.alias["features"] = path.resolve(
		// 	__dirname,
		// 	"../features"
		// );
		config.resolve.alias["constants"] = path.resolve(
			__dirname,
			"../constants"
		);
		config.resolve.alias["hooks"] = path.resolve(__dirname, "../hooks");
		config.resolve.alias["contexts"] = path.resolve(
			__dirname,
			"../contexts"
		);
		config.resolve.alias["utils"] = path.resolve(__dirname, "../utils");
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
