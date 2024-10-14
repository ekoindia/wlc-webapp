// Few pre-defined org-ids for configuring feature flags:
// eslint-disable-next-line no-unused-vars
const ORG_ID = {
	EKOSTORE: 1,
	EKOTEST: 101, // SuperPay (Production UAT)
	SBIKIOSK: 287,
};

/**
 * Note: This file is used to enable or disable features in the application.
 * Can be used to enable or disable features based on user roles or environment.
 *
 * To check for a feature-flag, use the "useFeatureFlag" hook.
 * @example
 * 	import { useFeatureFlag } from "hooks";
 * 	const [isFeatureEnabled] = useFeatureFlag("FEATURE_NAME");
 */
export const FeatureFlags: Record<string, FeatureFlagType> = {
	// UAT: Feature to show Portal Configurations like Landing Page, Theme, etc to Admin.
	PORTAL_CONFIG: {
		enabled: true,
		forAdminOnly: true,
		envConstraints: {
			production: {
				forOrgId: [ORG_ID.EKOSTORE, ORG_ID.EKOTEST],
			},
		},
	},

	// Theme selection from predefined themes (free tier)
	THEME_PICKER: {
		enabled: true,
	},

	// Custom theme support for paid tier
	CUSTOM_THEME_CREATOR: {
		enabled: true,
		forRoles: [],
		forEnv: ["development"],
	},

	// Feature to show a custom Landing Page that can be fully configured by Admins.
	CMS_LANDING_PAGE: {
		enabled: true,
		forEnv: ["development"],
	},

	// Feature to Raise Issues...
	RAISE_ISSUE: {
		enabled: true,
		forAdminOnly: true,
	},

	// Face detector for images, videos, and live streams.
	FACE_DETECTOR: {
		enabled: true,
		// forEnv: ["development", "staging"],
	},

	// Face detector for images, videos, and live streams.
	TEXT_CLASSIFIER: {
		enabled: true,
		forEnv: ["development"],
	},

	// Experimental LLM conversational UI for financial transactions and queries.
	GPT_CHAT: {
		enabled: true,
		forEnv: ["development"],
		envConstraints: {
			production: {
				forUserId: [],
			},
		},
	},

	// Expression editor for generating custom expressions using a GUI.
	// To be used by developers only for inserting custom expressions
	//   in interaction-framework configuration database.
	EXPRESSION_EDITOR: {
		enabled: true,
		forEnv: ["development"],
	},

	// Eloka Gateway for redirection-based transaction processing.
	ELOKA_GATEWAY: {
		enabled: true,
		forEnv: ["development"],
	},

	// A test page ("/test" or "/admin/test") to quickly check
	// components, hooks, etc, during the development.
	// Note: DO NOT CHANGE. ONLY FOR DEVELOPMENT ENVIRONMENT.
	TEST_PAGE: {
		enabled: true,
		forEnv: ["development"], // DO NOT CHANGE
	},
};

// Type definition for environments
type EnvTypes = "development" | "staging" | "production" | string;

// Type definition for specific constraints for each envoirnment
type EnvConstraints = {
	/**
	 * List of org-ids for which the feature is enabled.
	 * If the list is empty, the feature is enabled for all orgs.
	 * Example: [1, 2, 3]
	 */
	forOrgId?: number[];

	/**
	 * List of user-IDs for which the feature is enabled.
	 * If the list is empty, the feature is enabled for all users.
	 * Example: ["123", "456", "789"]
	 */
	forUserId?: string[];
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
	forEnv?: EnvTypes[];

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
	// forUserId?: string[];

	/**
	 * List of roles for which the feature is enabled.
	 * If the list is empty, then roles have no effect on the availability of the feature.
	 */
	forRoles?: string[];

	/**
	 * Whether the feature is enabled for Admin only.
	 * If true, the feature is enabled only for Admin users.
	 * Default: false
	 */
	forAdminOnly?: boolean;

	/**
	 * Specific constraints for each environment.
	 */
	envConstraints?: Record<EnvTypes, EnvConstraints>;
};
