/**
 * Note: This file is used to enable or disable features in the application.
 * Can be used to enable or disable features based on user roles or environment.
 *
 * To check for a feature-flag, use the "useFeatureFlag" hook.
 * @example
 * 	import { useFeatureFlag } from "hooks";
 * 	const isFeatureEnabled = useFeatureFlag("FEATURE_NAME");
 */
export const FeatureFlags: Record<string, FeatureFlagType> = {
	// Beta (WIP) feature to Raise Issues...
	RAISE_ISSUE: {
		enabled: true,
		forEnv: ["development"],
		forAdminOnly: true,
	},

	// Experimental LLM conversational UI for financial transactions and queries.
	GPT_CHAT: {
		enabled: true,
		forUserId: [],
		forEnv: ["development"],
	},

	// Expression editor for generating custom expressions using a GUI.
	// To be used by developers only for inserting custom expressions
	//   in interaction-framework configuration database.
	EXPRESSION_EDITOR: {
		enabled: true,
		forEnv: ["development"],
	},

	// A test page ("/test" or "/admin/test") to quickly check
	// components, hooks, etc, during the development.
	// Note: ONLY FOR DEVELOPMENT ENVIRONMENT.
	TEST_PAGE: {
		enabled: true,
		forEnv: ["development"],
	},
};

/**
 * Type definition for a feature flag configuration.
 */
export type FeatureFlagType = {
	/**
	 * Whether the feature is enabled or not.
	 * If false, the feature will not be available in the application.
	 * If true, the feature will be available in the application, based on other conditions.
	 * Default: false
	 */
	enabled: boolean;

	/**
	 * List of environments for which the feature is enabled.
	 * If the list is empty, the feature is enabled for all environments.
	 * Possible values: "development", "staging", "production"
	 * Note: The environment is read from process.env.NEXT_PUBLIC_ENV
	 */
	forEnv?: string[];

	/**
	 * List of user-types for which the feature is enabled.
	 * If the list is empty, the feature is enabled for all user-types.
	 * Example: [1, 2, 3]
	 */
	forUserType?: number[];

	/**
	 * List of user-IDs for which the feature is enabled.
	 * If the list is empty, the feature is enabled for all users.
	 * Example: ["123", "456", "789"]
	 */
	forUserId?: string[];

	/**
	 * Whether the feature is enabled for Admin only.
	 * If true, the feature is enabled only for Admin users.
	 * Default: false
	 */
	forAdminOnly?: boolean;
};
