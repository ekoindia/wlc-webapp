// Few pre-defined org-ids for configuring feature flags:
const ORG_ID = {
	EKOSTORE: 1,
	EKOTESTS: [101, 259], // 101: SuperPay (Production UAT), 259: VijayPay (Production UAT)
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
	// ------------------------------------------------------------------------
	// MARK: 🚩Dev Flags
	// Put all in-development flags in this section.

	// Custom theme support (paid tier)
	CUSTOM_THEME_CREATOR: {
		enabled: true,
		forEnv: ["development"],
	},

	// Feature to show a custom Landing Page that can be fully configured by Admins.
	CMS_LANDING_PAGE: {
		enabled: true,
		forEnv: ["development"],
	},

	// Eloka Gateway for redirection-based transaction processing.
	ELOKA_GATEWAY: {
		enabled: true,
		forEnv: ["development"],
	},

	// Custom Flag for collapsable(compact) Sidebar (Left-Menu)
	COMPACT_SIDEBAR: {
		enabled: true,
		forEnv: ["development"],
	},

	// ------------------------------------------------------------------------
	// MARK: 🚩BETA Flags
	// Put all UAT/Beta testing flags in this section.

	// Feature to Raise Issues...
	RAISE_ISSUE: {
		enabled: true,
		forAdminOnly: true, // TODO: Enable for all users
	},

	// Feature to show Tree-view in Network Management.
	NETWORK_TREE_VIEW: {
		enabled: true,
		forAdminOnly: true,
		envConstraints: {
			production: {
				forOrgId: [
					ORG_ID.EKOSTORE,
					ORG_ID.SBIKIOSK,
					...ORG_ID.EKOTESTS,
					10,
				], // 10 = MobyPay
			},
		},
	},

	// Option to expand an issue in query-center to show detailed options and perform operations such as: Add Comment, Escalate, Close, etc.
	QUERY_CENTER_DETAILED_OPTIONS: {
		enabled: true,
		forAdminOnly: true,
		envConstraints: {
			production: {
				forOrgId: [
					ORG_ID.EKOSTORE,
					ORG_ID.SBIKIOSK,
					...ORG_ID.EKOTESTS,
				],
			},
		},
	},

	// Basic Landing Page customization where Admins can upload a custom image.
	// This flag is to show the image on the landing/login page.
	CMS_IMAGE_THEME: {
		enabled: true,
		envConstraints: {
			production: {
				forOrgId: [
					ORG_ID.EKOSTORE,
					ORG_ID.SBIKIOSK,
					...ORG_ID.EKOTESTS,
					10,
				], // 10 = MobyPay
			},
		},
	},

	// MANUALLY CONFIGURE CUSTOM IMAGE FOR LANDING/LOGIN PAGE...
	// This flag is to show the image-upload option to Admins for configuring the landing page
	//   where the request goes to the DevOps team for manual configuration.
	// TODO: Remove this after we are able to auto-upload images on file server for configuring the landing page (CMS).
	MANUAL_LANDING_PAGE_IMAGE_SETUP: {
		enabled: true,
		forAdminOnly: true,
		envConstraints: {
			production: {
				forOrgId: [
					ORG_ID.EKOSTORE,
					ORG_ID.SBIKIOSK,
					...ORG_ID.EKOTESTS,
					10,
				], // 10 = MobyPay
			},
		},
	},

	// Custom flag for enabling Real Time Network Transactions for Admins
	NETWORK_STATEMENT: {
		enabled: true,
		forAdminOnly: true,
		envConstraints: {
			production: {
				forOrgId: [ORG_ID.EKOSTORE, ...ORG_ID.EKOTESTS, 59], // 59 =  MoneyBnk
			},
		},
	},

	// ------------------------------------------------------------------------
	// MARK: 🚩Production Flags
	// Put all production flags (visible to all relevant users) in this section.

	// Feature for Admins to toggle services for their network (Business Settings > Enable/Disable Services)
	TOGGLE_SERVICES: {
		enabled: true,
	},

	// ChatGPT agent for SBI Kiosk Agents...
	CHATGPT_AGENT: {
		enabled: true,
		envConstraints: {
			production: {
				forOrgId: [ORG_ID.SBIKIOSK, ...ORG_ID.EKOTESTS],
			},
		},
	},

	// Custom flag for enabling raise issue only for SBI Kiosk _Agents_
	RAISE_ISSUE_SBIKIOSK: {
		enabled: true,
		envConstraints: {
			development: {
				forOrgId: [1],
			},
			staging: {
				forOrgId: [1],
			},
			production: {
				forOrgId: [ORG_ID.SBIKIOSK],
			},
		},
	},

	// Theme selection from predefined themes (free tier)
	THEME_PICKER: {
		enabled: true,
	},

	// Face detector for images, videos, and live streams.
	FACE_DETECTOR: {
		enabled: true,
	},

	// ------------------------------------------------------------------------
	// MARK: ⚠️Test-Only Flags
	// Put all experimental or developer testing-only flags in this section.

	// Face detector for images, videos, and live streams.
	TEXT_CLASSIFIER: {
		enabled: true,
		forEnv: ["development"],
	},

	// Experimental LLM conversational UI for financial transactions and queries.
	GPT_CHAT: {
		enabled: false,
		forEnv: ["development"],
		// envConstraints: {
		// 	production: {
		// 		forUserId: [],
		// 	},
		// },
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

// MARK: ⚙️ Types

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
