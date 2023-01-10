const nextJest = require("next/jest");

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
	// Add more setup options before each test is run
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	// if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
	moduleDirectories: ["node_modules", "__tests__/test-utils", "<rootDir>/"],
	moduleNameMapper: {
		// Handle module aliases (this will be automatically configured for you soon)
		"^components/(.*)$": "<rootDir>/components/$1",
		"^pages/(.*)$": "<rootDir>/pages/$1",
		// "^features/(.*)$": "<rootDir>/features/$1",
		"^constants/(.*)$": "<rootDir>/constants/$1",
		"^context/(.*)$": "<rootDir>/context/$1",
		"^hooks/(.*)$": "<rootDir>/hooks/$1",
		"^public/(.*)$": "<rootDir>/public/$1",
		"^styles/(.*)$": "<rootDir>/styles/$1",
		"^utils/(.*)$": "<rootDir>/utils/$1",
		"^tests/(.*)$": "<rootDir>/__tests__/$1",
		"^@/pages/(.*)$": "<rootDir>/pages/$1",
	},
	testEnvironment: "jest-environment-jsdom",
	collectCoverage: true,
	coverageThreshold: {
		global: {
			// branches: 80,
			// functions: 80,
			lines: 80,
			// statements: -10,
		},
	},
	coverageReporters: [
		"json",
		[
			"text",
			{
				skipFull: true, // Set to false to see full list of components being tested
			},
		],
		"text-summary",
	],
	collectCoverageFrom: [
		"<rootDir>/pages/**/{!(_app),}.{js,ts,jsx,tsx}",
		"<rootDir>/components/**/{!(index),}.{js,ts,jsx,tsx}",
		"<rootDir>/context/**/{!(index),}.{js,ts,jsx,tsx}",
		"<rootDir>/hooks/**/{!(index),}.{js,ts,jsx,tsx}",
		"<rootDir>/utils/**/{!(index),}.{js,ts,jsx,tsx}",
		// "<rootDir>/features/**/{!(index),}.{js,ts,jsx,tsx}",
		"!<rootDir>/pages/**/*.stories.{js,ts,jsx,tsx,mdx}",
		"!<rootDir>/components/**/*.stories.{js,ts,jsx,tsx,mdx}",
		"!<rootDir>/components/**/*.mocks.{js,ts}",
		// "!<rootDir>/features/**/*.stories.{js,ts,jsx,tsx,mdx}",
		// "!<rootDir>/features/**/*.mocks.{js,ts}",
		"!<rootDir>/pages/**/*.mocks.{js,ts}",
	],
	coveragePathIgnorePatterns: [
		"<rootDir>/__tests__/test-utils/",
		".stories.{js,ts,jsx,tsx,mdx}",
		".mocks.{js,ts}",
	],
	testPathIgnorePatterns: [
		"<rootDir>/__tests__/test-utils/",
		".stories.{js,ts,jsx,tsx,mdx}",
		".mocks.{js,ts}",
	],
	verbose: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
