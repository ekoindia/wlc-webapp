import nextJest from "next/jest.js";

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
		"^page-components/(.*)$": "<rootDir>/page-components/$1",
		"^tf-components/(.*)$": "<rootDir>/tf-components/$1",
		"^layout-components/(.*)$": "<rootDir>/layout-components/$1",
		"^pages/(.*)$": "<rootDir>/pages/$1",
		// "^features/(.*)$": "<rootDir>/features/$1",
		"^constants/(.*)$": "<rootDir>/constants/$1",
		"^contexts/(.*)$": "<rootDir>/contexts/$1",
		"^hooks/(.*)$": "<rootDir>/hooks/$1",
		"^public/(.*)$": "<rootDir>/public/$1",
		"^styles/(.*)$": "<rootDir>/styles/$1",
		"^utils/(.*)$": "<rootDir>/utils/$1",
		"^tests/(.*)$": "<rootDir>/__tests__/$1",
		"^@/pages/(.*)$": "<rootDir>/pages/$1",
	},
	testEnvironment: "jest-environment-jsdom",
	fakeTimers: { enableGlobally: true },
	collectCoverage: true,
	coverageThreshold: {
		global: {
			// branches: 80,
			// functions: 80,
			lines: 60,
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
		"<rootDir>/page-components/**/{!(index),}.{js,ts,jsx,tsx}",
		"<rootDir>/tf-components/**/{!(index),}.{js,ts,jsx,tsx}",
		"<rootDir>/layout-components/**/{!(index),}.{js,ts,jsx,tsx}",
		"<rootDir>/contexts/**/{!(index),}.{js,ts,jsx,tsx}",
		"<rootDir>/hooks/**/{!(index),}.{js,ts,jsx,tsx}",
		"<rootDir>/utils/**/{!(index),}.{js,ts,jsx,tsx}",
		"<rootDir>/helpers/**/{!(index),}.{js,ts,jsx,tsx}",
		// "<rootDir>/features/**/{!(index),}.{js,ts,jsx,tsx}",
		"!<rootDir>/**/*.stories.{js,ts,jsx,tsx,mdx}",
		"!<rootDir>/**/*.mocks.{js,ts}",
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

// createJestConfig is exported as a default export
export default createJestConfig(customJestConfig);
