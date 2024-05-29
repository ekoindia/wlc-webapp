import jsdoc from "eslint-plugin-jsdoc";
import prettier from "eslint-plugin-prettier";

export default [
	// Register plugins
	{
		plugins: {
			// next: next,
			jsdoc: jsdoc,
			prettier: prettier,
			// storybook: storybook,
		},
	},

	// Apply recommended configurations from plugins
	// TODO include core-web-vitals
	// next.configs["core-web-vitals"],
	jsdoc.configs["flat/recommended"],
	// storybook.configs["recommended"],

	// Global configuration
	{
		ignores: ["**/*.BAK.*", "**/*.stories.*", "**/*.mocks.*", "**/*.min.*"],

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
			"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
			"jsdoc/require-description": "warn",
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
