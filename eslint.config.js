import jsdoc from "eslint-plugin-jsdoc";
import prettier from "eslint-plugin-prettier";

export default [
	// Register plugins
	{
		plugins: {
			jsdoc: jsdoc,
			prettier: prettier,
			// storybook: storybook,
		},
	},

	// Apply recommended configurations from plugins
	jsdoc.configs["flat/recommended"],
	// TODO include core-web-vitals & storybook
	// next.configs["core-web-vitals"],
	// storybook.configs["recommended"],

	// Global configuration
	{
		ignores: ["**/*.BAK.*", "**/*.stories.*", "**/*.mocks.*", "**/*.min.*"],

		files: ["**/*.{ts,tsx,jsx,js}"],

		languageOptions: {
			globals: {
				React: "readonly",
				describe: "readonly",
				it: "readonly",
				expect: "readonly",
				JSX: "readonly",
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},

		rules: {
			"prettier/prettier": "error",
			"comma-spacing": ["error", { before: false, after: true }],
			"jsdoc/require-description": "warn",
			"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
			semi: ["error", "always", { omitLastInOneLineBlock: true }],
			"no-unused-vars": [
				"error",
				{
					vars: "all",
					args: "after-used",
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					ignoreRestSiblings: true,
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"no-warning-comments": [
				"warn",
				{
					terms: ["todo", "fixme"],
					decoration: ["/", "*", "["],
				},
			],
		},
	},

	// Specific overrides for particular files
	{
		files: ["*.stories.@(ts|tsx|js|jsx|mjs|cjs)"],
		rules: {
			"storybook/hierarchy-separator": "error",
		},
	},
];
