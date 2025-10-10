import { parseOrgIds } from "utils/envUtils";

// Few pre-defined org-ids for configuring feature flags on production
// NOTE: The production org-ids must be read from environment variables
const ORG_ID = {
	EKOSTORE: Number(process.env.NEXT_PUBLIC_ORG_IDS_EKOSTORE),
	EKOTESTS: parseOrgIds(process.env.NEXT_PUBLIC_ORG_IDS_EKOTESTS),
	SBIKIOSK: Number(process.env.NEXT_PUBLIC_ORG_IDS_SBIKIOSK),
	AI_TEST: parseOrgIds(process.env.NEXT_PUBLIC_ORG_IDS_AI_TEST),
	DYNAMIC_PRICING: parseOrgIds(
		process.env.NEXT_PUBLIC_ORG_IDS_DYNAMIC_PRICING
	),
	DASHBOARD_V2: parseOrgIds(process.env.NEXT_PUBLIC_ORG_IDS_DASHBOARD_V2),
};

/**
 * Note: This file is used to enable or disable features in the application.
 * Can be used to enable or disable features based on user roles or environment.
 *
 * To add a feature-flag, add a new entry in the `FeatureFlags` object below.
 * The key should be the name of the feature-flag (eg: "CHAT").
 *
 * To check for a feature-flag, use the "useFeatureFlag" hook.
 * @example
 * 	import { useFeatureFlag } from "hooks";
 * 	const [isFeatureEnabled] = useFeatureFlag("FEATURE_NAME");
 *  const [isNotFeatureEnabled] = useFeatureFlag("!FEATURE_NAME"); // To check for "feature not enabled"
 */
export const FeatureFlags: Record<string, FeatureFlagType> = {
	// ------------------------------------------------------------------------
	// MARK: 🚩Dev Flags
	// Put all in-development flags in this section.

	// Show Admin Network pages to (Super)Distributors
	ADMIN_NETWORK_PAGES_FOR_SUBNETWORK: {
		enabled: true,
		forUserType: [1, 4, 7], // 4 = (FOS), 7 = (SuperDistributor)
		// forEnv: ["development", "staging"],
		envConstraints: {
			production: {
				forOrgId: [
					ORG_ID.EKOSTORE,
					...ORG_ID.EKOTESTS,
					...ORG_ID.DASHBOARD_V2,
				],
			},
		},
	},

	// Assisted Full Onboarding
	ASSISTED_FULL_ONBOARDING: {
		enabled: true,
		envConstraints: {
			development: {
				forOrgId: [3],
			},
			staging: {
				forOrgId: [3],
			},
		},
		forEnv: ["development", "staging"],
	},

	// Inventory Management for (Super)Distributors
	INVENTORY_MANAGEMENT_FOR_SUBNETWORK: {
		enabled: true,
		forUserType: [1], // 7 = SuperDistributor
		forEnv: ["development", "staging"],
	},

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

	// ------------------------------------------------------------------------
	// MARK: 🚩BETA Flags
	// Feature Enabled only for certain orgs/users in production
	// Put all UAT/Beta testing flags in this section.

	// Show Admin-like (business) dashboard to other sub-network owners like (Super)Distributor
	// TODO: Rename to ADMIN_BUSINESS_DASHBOARD_FOR_SUBNETWORK & introduce another flag for ADMIN_ONBOARDING_DASHBOARD_FOR_SUBNETWORK
	ADMIN_DASHBOARD_FOR_SUBNETWORK: {
		enabled: true,
		forUserType: [1, 7], // 1 = Dist, 7 = SuperDistributor, 4 = FOS
		envConstraints: {
			production: {
				forOrgId: [
					ORG_ID.EKOSTORE,
					...ORG_ID.EKOTESTS,
					...ORG_ID.DASHBOARD_V2,
				],
			},
		},
	},

	// Feature to Raise Generic Issues (from Top-Right  Menu)...
	RAISE_ISSUE_GENERIC: {
		enabled: true,
		forAdminOnly: true, // TODO: Enable for all users
		requiredFeatures: ["RAISE_ISSUE"],
	},

	// [MASTER FLAG] Experimental AI Features
	// Disabling this will disable all other AI-related features.
	AI_MASTER_FLAG: {
		enabled: true,
		forAdminOnly: true,
		// forEnv: ["development"],
		envConstraints: {
			development: {
				forOrgId: [3],
			},
			staging: {
				forOrgId: [3],
			},
			production: {
				forOrgId: [...ORG_ID.EKOTESTS, ...ORG_ID.AI_TEST], // 306=Kunal Chand, 186=HI TECH RECHARGE SOLUTION, 10=RAMSON TECHNOVATIONS PVT LTD, 344=PROWESS FINTECH PRIVATE LIMITED, 331=AJ ENTERPRISES
			},
		},
	},

	// Experimental LLM conversational UI for financial transactions and queries.
	AI_CHATBOT: {
		enabled: true,
		forAdminOnly: true,
		requiredFeatures: ["AI_MASTER_FLAG"],
	},

	// Feature to initiate AI Text Chatbot popup from KBar.
	// It is only allowed if the AI_MASTER_FLAG feature is also enabled.
	AI_CHATBOT_KBAR: {
		enabled: true,
		forAdminOnly: true,
		requiredFeatures: ["AI_CHATBOT"],
	},

	// Feature to show AI Text Chatbot on Home or Dashboard page.
	// It is only allowed if the AI_MASTER_FLAG feature is also enabled.
	AI_CHATBOT_HOME: {
		enabled: true,
		forAdminOnly: true,
		requiredFeatures: ["AI_CHATBOT"],
	},

	// Feature to enable AI Voice Chat.
	// It is only allowed if the AI_MASTER_FLAG feature is also enabled.
	AI_VOICEBOT: {
		enabled: true,
		forAdminOnly: true,
		forEnv: ["development", "staging"],
		requiredFeatures: ["AI_MASTER_FLAG"],
	},

	// Feature to enable AI Copilot.
	AI_COPILOT: {
		enabled: true,
		forAdminOnly: true,
		forEnv: ["development"],
		requiredFeatures: ["AI_MASTER_FLAG"],
	},

	// Config-driven Pricing & Commission.
	DYNAMIC_PRICING_COMMISSION: {
		enabled: true,
		forAdminOnly: true,
		envConstraints: {
			production: {
				forOrgId: [
					ORG_ID.EKOSTORE,
					...ORG_ID.EKOTESTS,
					...ORG_ID.DYNAMIC_PRICING,
				],
			},
		},
	},

	// ------------------------------------------------------------------------
	// MARK: 🚩Production Flags
	// Put all production flags (visible to all relevant users) in this section.

	// New Dashboard Features (Graphs & updated UI)
	// TODO: Remove this flag after the new dashboard is fully rolled out to all users.
	DASHBOARD_V2: {
		enabled: true,
	},

	// Open ChatGPT Agent in new tab
	// To answer Admin's queries related to Eloka products and features.
	CHATGPT_AGENT_LINK: {
		enabled: true,
	},

	// Custom Flag for collapsable(compact) Sidebar (Left-Menu)
	COMPACT_SIDEBAR: {
		enabled: true,
	},

	// Custom flag for enabling Real Time Network Transactions for Admins
	NETWORK_STATEMENT: {
		enabled: true,
		forAdminOnly: true,
	},

	// Feature for Admins to toggle services for their network (Business Settings > Enable/Disable Services)
	TOGGLE_SERVICES: {
		enabled: true,
		forAdminOnly: true,
	},

	// Option to expand an issue in query-center to show detailed options and perform operations such as: Add Comment, Escalate, Close, etc.
	QUERY_CENTER_DETAILED_OPTIONS: {
		enabled: true,
		forAdminOnly: true,
	},

	// Feature to show Tree-view in Network Management.
	NETWORK_TREE_VIEW: {
		enabled: true,
	},

	// Basic Landing Page customization where Admins can upload a custom image.
	// This flag is to show the image on the landing/login page.
	CMS_IMAGE_THEME: {
		enabled: true,
	},

	// MANUALLY CONFIGURE CUSTOM IMAGE FOR LANDING/LOGIN PAGE...
	// This flag is to show the image-upload option to Admins for configuring the landing page
	//   where the request goes to the DevOps team for manual configuration.
	// TODO: Remove this after we are able to auto-upload images on file server for configuring the landing page (CMS).
	MANUAL_LANDING_PAGE_IMAGE_SETUP: {
		enabled: true,
		forAdminOnly: true,
	},

	// Feature to Raise Issues (Generic + Trxn History)...
	RAISE_ISSUE: {
		enabled: true,
	},

	// Custom flag for enabling raise issue only for SBI Kiosk _Agents_
	RAISE_ISSUE_GENERIC_SBIKIOSK: {
		enabled: true,
		requiredFeatures: ["RAISE_ISSUE"],
		envConstraints: {
			development: {
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
	// MARK: 🧪Test-Only Flags
	// Put all experimental or developer testing-only flags in this section.

	// Face detector for images, videos, and live streams.
	TEXT_CLASSIFIER: {
		enabled: true,
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
	// Note: DO NOT CHANGE. ONLY FOR DEVELOPMENT ENVIRONMENT.
	TEST_PAGE: {
		enabled: true,
		forEnv: ["development"], // DO NOT CHANGE
	},
};

// ------------------------------------------------------------------------
// MARK: ⚙️ Types

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

	/**
	 * An array of feature_flags that are required for this feature to be enabled.
	 * If any of the required features are not enabled, this feature will not be available.
	 * Each feature flagmust be one of the keys in the FeatureFlags object.
	 * Example: ["FEATURE_A", "FEATURE_B"]
	 */
	requiredFeatures?: (keyof typeof FeatureFlags)[];
};
