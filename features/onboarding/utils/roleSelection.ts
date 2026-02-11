import { TransactionIds } from "constants/EpsTransactions";
import { UserTypeLabel } from "constants/UserTypes";
import {
	APPLICANT_TYPES,
	RESPONSE_TYPE_IDS,
	type OnboardingStep,
} from "../constants";

/**
 * Role interface representing different user types in the onboarding process
 */
export interface Role {
	/** Unique identifier for the role */
	id: number;
	/** Type of applicant (0: retailer, 2: distributor, 3: enterprise) */
	applicant_type: number;
	/** Display label for the role */
	label: string;
	/** Description of the role */
	description: string;
	/** Icon path for the role */
	icon: string;
	/** Whether this role option is visible in the UI */
	isVisible: boolean;
	/** Optional array of user types associated with this role */
	user_type?: Array<{ key: number; name: string }>;
}

/**
 * Configuration for generating role data
 */
export interface RoleConfig {
	/** Whether to show/hide specific merchant types */
	visibleAgentTypes?: number[];
	/** Custom labels for roles (optional override) */
	labelMap?: Partial<Record<number, string>>;
	/** Custom descriptions for roles (optional override) */
	descriptionMap?: Partial<Record<number, string>>;
	/** Custom user type labels mapping (e.g., {1: "Distributor", 2: "Agent"}) */
	userTypeLabel?: Record<number, string>;
}

// Configuration for which user types are visible in different onboarding contexts
export const visibleAgentTypes = {
	assistedOnboarding: [APPLICANT_TYPES.RETAILER],
	selfOnboarding: [APPLICANT_TYPES.RETAILER, APPLICANT_TYPES.DISTRIBUTOR],
};

/**
 * Base role data containing all possible roles with default labels
 * Labels will be dynamically replaced based on organization configuration
 * @param userTypeLabel
 */
const getBaseRoleData = (
	userTypeLabel: Record<number, string> = UserTypeLabel
): Role[] => [
	{
		id: 1,
		applicant_type: APPLICANT_TYPES.RETAILER,
		label: `I'm a ${userTypeLabel[2] || "Retailer"}`,
		description: "",
		// description: "I serve customers from my shop",
		icon: "../assets/icons/user_merchant.png",
		isVisible: true,
		user_type: [
			{ key: 3, name: "I Merchant" },
			{ key: 2, name: "Merchant" },
		],
	},
	{
		id: 2,
		applicant_type: APPLICANT_TYPES.DISTRIBUTOR,
		label: `I'm a ${userTypeLabel[1] || "Distributor"}`,
		description: `I have a network of ${userTypeLabel[2] || "Retailer"} and I want to serve them`,
		icon: "../assets/icons/user_distributor.png",
		isVisible: true,
		user_type: [{ key: 1, name: "Distributor" }],
	},
	{
		id: 3,
		applicant_type: APPLICANT_TYPES.ENTERPRISE,
		label: `I'm an ${userTypeLabel[23] || "Enterprise Partner"}`,
		description:
			"I want to use API and other solutions to make my own service",
		icon: "../assets/icons/user_enterprise.png",
		isVisible: true,
		user_type: [{ key: 23, name: "Partner" }],
	},
];

/**
 * Generates role data based on configuration parameters
 * @param config
 */
export const generateRoleData = (config: RoleConfig = {}): Role[] => {
	const { visibleAgentTypes, labelMap, descriptionMap, userTypeLabel } =
		config;

	const effectiveUserTypeLabel = userTypeLabel || UserTypeLabel;
	const baseRoleData = getBaseRoleData(effectiveUserTypeLabel);

	return baseRoleData
		.filter((role) => {
			if (visibleAgentTypes && visibleAgentTypes.length > 0) {
				return visibleAgentTypes.includes(role.applicant_type);
			}
			return role.isVisible;
		})
		.map((role) => ({
			...role,
			label: labelMap?.[role.applicant_type] || role.label,
			description:
				descriptionMap?.[role.applicant_type] || role.description,
			isVisible: true,
		}));
};

/**
 * Creates a role selection step with configurable roles based on agent types
 * @param agentTypes
 * @param config
 */
export const createRoleSelectionStep = (
	agentTypes: number[],
	config: RoleConfig = {}
): { label: string; primaryCTAText: string; form_data: { roles: Role[] } } => {
	const roles = generateRoleData({
		...config,
		visibleAgentTypes: agentTypes,
	});

	return {
		label: "Tell us who you are?",
		primaryCTAText: "Continue",
		form_data: {
			roles,
		},
	};
};

/**
 * Role selection step configuration with API pipeline.
 * Self-contained configuration for the RoleSelection component.
 */
export const ROLE_SELECTION_STEP_CONFIG: OnboardingStep = {
	id: 2, // SELECTION_SCREEN
	name: "ROLE_SELECTION",
	label: "Tell us who you are?",
	isRequired: true,
	isVisible: false,
	stepStatus: 0,
	primaryCTAText: "Continue",
	description: "Select your role to begin the onboarding process.",
	form_data: {},
	preSubmit: {
		inject: {
			csp_id: "state.mobile",
		},
	},
	api: {
		pipeline: [
			{
				id: "submit",
				type: "form",
				interactionTypeId: TransactionIds.CREATE_PARTIAL_ACCOUNT,
				successResponseTypeIds: [RESPONSE_TYPE_IDS.SELECTION_SCREEN],
			},
		],
	},
	postSubmit: {
		refreshProfile: true,
	},
};
