// build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
// ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
// docs: Documentation only changes
// feat: A new feature
// fix: A bug fix
// perf: A code change that improves performance
// refactor: A code change that neither fixes a bug nor adds a feature
// style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
// test: Adding missing tests or correcting existing tests

export default {
	extends: ["@commitlint/config-conventional"],
	/*
	 * Custom URL to show upon failure
	 */
	helpUrl:
		"https://github.com/conventional-changelog/commitlint/#what-is-commitlint",
	/*
	 * Custom rules to enforce. [Doc](https://commitlint.js.org/reference/rules.html)
	 * - 0: Disable the rule
	 * - 1: Warn about the rule
	 * - 2: Error about the rule (enforce the rule)
	 * - "always": Enforce the rule (normal behavior)
	 * - "never": Inverts the rule
	 */
	rules: {
		"body-leading-blank": [1, "always"],
		"body-max-line-length": [2, "always", 100],
		"footer-leading-blank": [1, "always"],
		"footer-max-line-length": [2, "always", 100],
		"header-max-length": [2, "always", 100],
		"scope-case": [2, "always", "lower-case"],
		"subject-case": [
			2,
			"never",
			["start-case", "pascal-case", "upper-case"],
		],
		"subject-empty": [2, "never"],
		"subject-min-length": [2, "always", 5],
		"subject-max-length": [2, "always", 150],
		"subject-full-stop": [2, "never", "."],
		"type-case": [2, "always", "lower-case"],
		"type-empty": [2, "never"],
		"type-enum": [
			2,
			"always",
			[
				"build",
				"chore",
				"ci",
				"docs",
				"feat",
				"fix",
				"perf",
				"refactor",
				"revert",
				"style",
				"test",
				"translation",
				"security",
				"changeset",
				"ui",
				"i18n",
				"a11y",
				"config",
				"wip",
			],
		],
	},
};
