import { TransactionIds } from "constants/EpsTransactions";
import { UserTypeLabel } from "constants/UserTypes";
import {
	APPLICANT_TYPES,
	parseBusinessVertical,
	RESPONSE_TYPE_IDS,
	type OnboardingStep,
} from "../constants";

/**
 * Role ids used by the role-selection UI and the `role` URL query param.
 * Sequential and intuitive — distinct from APPLICANT_TYPES (the OaaS
 * applicant_type sent to the API) and from EPS user-type ids.
 */
export const ROLE_IDS = {
	RETAILER: 1,
	DISTRIBUTOR: 2,
	ENTERPRISE: 3,
} as const;

/**
 * Resolve the `allowedRoleIds` filter from the raw `role` and `bv` query values.
 *
 * - Explicit `role` always wins: a CSV of ids (`?role=1,2,3`) or a duplicated
 *   param (`?role=1&role=2`, arriving as an array) is parsed to a numeric list;
 *   non-numeric entries are dropped.
 * - `role` absent BUT a valid `bv` (eloka/eps/sbi_kiosk/enterprise) present →
 *   default to Enterprise (`ROLE_IDS.ENTERPRISE`).
 * - Otherwise `undefined` (no role filter; RoleSelection uses its own defaults).
 * @param {string | string[] | undefined} rawRole - Raw `router.query.role`.
 * @param {string | string[] | undefined} rawBv - Raw `router.query.bv`.
 * @returns {number[] | undefined} Allowed role ids, or `undefined` for no filter.
 */
export const resolveAllowedRoleIds = (
	rawRole: string | string[] | undefined,
	rawBv: string | string[] | undefined
): number[] | undefined => {
	if (!rawRole) {
		return parseBusinessVertical(rawBv) ? [ROLE_IDS.ENTERPRISE] : undefined;
	}
	const roleStr = Array.isArray(rawRole) ? rawRole.join(",") : rawRole;
	const parsed = roleStr
		.split(",")
		.map((s) => Number(s.trim()))
		.filter((n) => !isNaN(n));
	return parsed.length > 0 ? parsed : undefined;
};

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
}

/**
 * Configuration for generating role data
 */
export interface RoleConfig {
	/** Role `id`s to show (1: Retailer, 2: Distributor, 3: Enterprise) */
	visibleAgentTypes?: number[];
	/** Custom labels for roles (optional override) */
	labelMap?: Partial<Record<number, string>>;
	/** Custom descriptions for roles (optional override) */
	descriptionMap?: Partial<Record<number, string>>;
	/** Custom user type labels mapping (e.g., {1: "Distributor", 2: "Agent"}) */
	userTypeLabel?: Record<number, string>;
}

// Configuration for which roles are visible in different onboarding contexts.
// Values are role `id`s (see ROLE_IDS) — the same sequential scheme accepted by
// the `role` URL query param — NOT applicant_type.
export const visibleAgentTypes = {
	assistedOnboarding: [ROLE_IDS.RETAILER],
	selfOnboarding: [ROLE_IDS.RETAILER, ROLE_IDS.DISTRIBUTOR],
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
		id: ROLE_IDS.RETAILER,
		applicant_type: APPLICANT_TYPES.RETAILER,
		label: `I'm a ${userTypeLabel[2] || "Retailer"}`,
		description: "",
		// description: "I serve customers from my shop",
		icon: "../assets/icons/user_merchant.png",
		isVisible: true,
	},
	{
		id: ROLE_IDS.DISTRIBUTOR,
		applicant_type: APPLICANT_TYPES.DISTRIBUTOR,
		label: `I'm a ${userTypeLabel[1] || "Distributor"}`,
		description: `I have a network of ${userTypeLabel[2] || "Retailer"} and I want to serve them`,
		icon: "../assets/icons/user_distributor.png",
		isVisible: true,
	},
	{
		id: ROLE_IDS.ENTERPRISE,
		applicant_type: APPLICANT_TYPES.ENTERPRISE,
		label: `I'm an ${userTypeLabel[23] || "Enterprise Partner"}`,
		description:
			"I want to use API and other solutions to make my own service",
		icon: "../assets/icons/user_enterprise.png",
		isVisible: true,
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
			// Filter by role `id` (1: Retailer, 2: Distributor, 3: Enterprise),
			// the intuitive sequential scheme. applicant_type is NOT used here —
			// its values (0, 2, 3) are non-sequential and only relevant at submit.
			if (visibleAgentTypes && visibleAgentTypes.length > 0) {
				return visibleAgentTypes.includes(role.id);
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
