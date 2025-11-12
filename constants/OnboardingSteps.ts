import { UserTypeLabel } from "./UserTypes";

// MerchantTypes as defined in the OaaS Widget configuration. Note, it is not the same as EPS's user-type-id
const MERCHANT_TYPES = {
	RETAILER: 0,
	DISTRIBUTOR: 2,
	ENTERPRISE: 3,
};

// Configuration for which user types are visible in different onboarding contexts
// NOTE: The OaaS widget configration (getBaseRoleData) uses wrong merchantType values (1,2,3)
export const visibleAgentTypes = {
	assistedOnboarding: [MERCHANT_TYPES.RETAILER],
	selfOnboarding: [MERCHANT_TYPES.RETAILER, MERCHANT_TYPES.DISTRIBUTOR],
};

/**
 * Role interface representing different user types in the onboarding process
 */
export interface Role {
	/** Unique identifier for the role */
	id: number;
	/** Type of applicant (0: retailer, 1: enterprise, 2: distributor) */
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

/**
 * OnboardingStep interface representing a single step in the user onboarding process
 */
export interface OnboardingStep {
	/** Unique identifier for the step */
	id: number;
	/** Internal name of the step */
	name: string;
	/** Display label for the step */
	label: string;
	/** Whether this step can be skipped */
	isSkipable: boolean;
	/** Whether this step is required to complete onboarding */
	isRequired: boolean;
	/** Whether this step is visible in the UI */
	isVisible: boolean;
	/** Current status of the step (0: not started, 1: in progress, 2: completed) */
	stepStatus: number;
	/** Optional role identifier associated with this step (primary role for backward compatibility) */
	role?: number;
	/** Optional array of all role IDs this step applies to (for steps used across multiple user types) */
	applicableRoles?: number[];
	/** Text for the primary call-to-action button */
	primaryCTAText: string;
	/** Description or instructions for the step */
	description: string;
	/** Form data and configuration for the step */
	form_data: {
		/** Optional roles data for role selection steps */
		roles?: Role[];
		/** Additional form data properties */
		[key: string]: any;
	};
	/** Optional success message to display when step is completed */
	success_message?: string;
}

/**
 * NOTE: This function is not a constant - it generates data dynamically.
 * Base role data containing all possible roles with default labels
 * Labels will be dynamically replaced based on organization configuration
 * @param {Record<number, string>} userTypeLabel - User type labels mapping
 * @returns {Role[]} Array of role data
 */
const getBaseRoleData = (
	userTypeLabel: Record<number, string> = UserTypeLabel
): Role[] => [
	{
		id: 1,
		applicant_type: MERCHANT_TYPES.RETAILER,
		label: `I'm a ${userTypeLabel[2] || "Retailer"}`,
		description: "I serve customers from my shop",
		icon: "../assets/icons/user_merchant.png",
		isVisible: true,
		user_type: [
			{ key: 3, name: "I Merchant" },
			{ key: 2, name: "Merchant" },
		],
	},
	{
		id: 2,
		applicant_type: MERCHANT_TYPES.DISTRIBUTOR,
		label: `I'm a ${userTypeLabel[1] || "Distributor"}`,
		description: "I have a network of retailer and i want to serve them",
		icon: "../assets/icons/user_distributor.png",
		isVisible: true,
		user_type: [{ key: 1, name: "Distributor" }],
	},
	{
		id: 3,
		applicant_type: MERCHANT_TYPES.ENTERPRISE,
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
 * @param {RoleConfig} config - Configuration for filtering and customizing roles
 * @returns {Role[]} Array of configured roles
 */
export const generateRoleData = (config: RoleConfig = {}): Role[] => {
	const { visibleAgentTypes, labelMap, descriptionMap, userTypeLabel } =
		config;

	// Use custom user type labels or fall back to defaults
	const effectiveUserTypeLabel = userTypeLabel || UserTypeLabel;
	const baseRoleData = getBaseRoleData(effectiveUserTypeLabel);

	return baseRoleData
		.filter((role) => {
			// If visibleAgentTypes is specified, only show those merchant types
			if (visibleAgentTypes && visibleAgentTypes.length > 0) {
				return visibleAgentTypes.includes(role.applicant_type);
			}
			// Otherwise, show all roles that are marked as visible
			return role.isVisible;
		})
		.map((role) => ({
			...role,
			label: labelMap?.[role.applicant_type] || role.label,
			description:
				descriptionMap?.[role.applicant_type] || role.description,
			isVisible: true, // All filtered roles should be visible
		}));
};

/**
 * Creates a role selection step with configurable roles based on agent types
 * @param {number[]} visibleAgentTypes - Array of merchant types to include (e.g., [1, 3] for Retailer and Distributor)
 * @param {RoleConfig} [config] - Optional configuration for labels and descriptions
 * @returns {OnboardingStep} The configured role selection step
 */
export const createRoleSelectionStep = (
	visibleAgentTypes: number[],
	config: RoleConfig = {}
): OnboardingStep => {
	const roles = generateRoleData({
		...config,
		visibleAgentTypes,
	});

	return {
		id: 0,
		name: "RoleCapture",
		label: "Tell us who you are?",
		isSkipable: false,
		isRequired: false,
		isVisible: false,
		stepStatus: 0,
		primaryCTAText: "Continue",
		description: "",
		form_data: {
			roles,
		},
	};
};

/**
 * Filters step data based on onboarding step roles
 * @param {OnboardingStep[]} stepData - Array of all possible onboarding steps
 * @param {Array<{ role: number; label?: string }>} onboardingSteps - Array of onboarding step configurations with roles from API
 * @returns {OnboardingStep[]} Filtered array of onboarding steps relevant to the user's roles
 */
export const filterOnboardingStepsByRoles = (
	stepData: OnboardingStep[],
	onboardingSteps: Array<{ role: number; label?: string }>
): OnboardingStep[] => {
	// Extract role IDs from API response
	const apiRoles = onboardingSteps?.map((step) => step.role) ?? [];

	// Filter steps based on applicableRoles array
	return stepData.filter((step) => {
		return step.applicableRoles?.some((role) => apiRoles.includes(role));
	});
};

/**
 * Default role selection step data for role capture during user onboarding.
 * This step allows users to select their role (Retailer, Distributor, or Enterprise).
 * Used in the initial onboarding flow to determine the appropriate steps for each user type.
 * @deprecated Use createRoleSelectionStep() with appropriate agent types instead
 */
export const roleSelectionStepData: OnboardingStep = createRoleSelectionStep(
	[MERCHANT_TYPES.RETAILER, MERCHANT_TYPES.DISTRIBUTOR] // Default: Retailer and Distributor
);

/**
 * Master list of all possible onboarding steps across all user types.
 * Steps are filtered at runtime based on the API response (onboarding_steps).
 * Each step can have multiple applicable roles via the applicableRoles array.
 *
 * Key concepts:
 * - `id`: Unique step identifier used for API routing logic (handlers check this)
 * - `role`: Primary role ID for backward compatibility
 * - `applicableRoles`: Array of all role IDs this step applies to (for multi-user-type steps)
 *
 * The filtering logic matches steps where ANY role in applicableRoles appears in the API response.
 */
export const masterOnboardingSteps: OnboardingStep[] = [
	{
		id: 3,
		name: "LocationCapture",
		label: "Location Capturing",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12400, // Primary role (used by retailer)
		applicableRoles: [13000, 12400], // Both distributor (13000) and retailer (12400)
		primaryCTAText: "Capture Location",
		description: "",
		form_data: {},
		success_message: "Location captured successfully.",
	},
	{
		id: 4,
		name: "AadhaarVerification",
		label: "Aadhaar Verification",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12400,
		applicableRoles: [12400],
		primaryCTAText: "Verify Aadhaar",
		description:
			"Upload your Aadhaar Copy front and back to verify yourself. Accepted formats are",
		form_data: {},
		success_message: "Aadhaar uploaded successfully.",
	},
	// {
	// 	id: 5,
	// 	name: "Aadhaar Consent",
	// 	label: "Aadhaar Consent",
	// 	isSkipable: false,
	// 	isRequired: true,
	// 	isVisible: true,
	// 	stepStatus: 0,
	// 	role: 24000,
	// 	applicableRoles: [24000],
	// 	primaryCTAText: "Verify Consent",
	// 	description: "",
	// 	form_data: {},
	// 	success_message: "Aadhaar consent taken.",
	// },
	// {
	// 	id: 6,
	// 	name: "Confirm Aadhaar Number",
	// 	label: "Confirm Aadhaar Number",
	// 	isSkipable: false,
	// 	isRequired: true,
	// 	isVisible: true,
	// 	stepStatus: 0,
	// 	role: 24000,
	// 	applicableRoles: [24000],
	// 	primaryCTAText: "Proceed",
	// 	description: "",
	// 	form_data: {},
	// 	success_message: "Aadhaar number confirmed.",
	// },
	// {
	// 	id: 7,
	// 	name: "ConfirmAadhaarOTP",
	// 	label: "Confirm Aadhaar OTP",
	// 	isSkipable: false,
	// 	isRequired: true,
	// 	isVisible: false,
	// 	stepStatus: 0,
	// 	role: 24000,
	// 	applicableRoles: [24000],
	// 	primaryCTAText: "Confirm",
	// 	description: "",
	// 	form_data: {},
	// 	success_message: "Aadhaar confirmed successfully.",
	// },
	{
		id: 20,
		name: "Digilocker Verification",
		label: "Digilocker Verification",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		applicableRoles: [24000],
		primaryCTAText: "Proceed",
		description: "Verify your Aadhaar using your Digilocker account.",
		form_data: {},
		success_message: "Digilocker verification successful.",
	},
	{
		id: 8,
		name: "PanVerification",
		label: "PAN Verification",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12300,
		applicableRoles: [12300, 13000], // Shared step with multiple role variants
		primaryCTAText: "Verify PAN",
		description:
			"Upload your PAN copy to verify your business. Accepted formats are",
		form_data: {},
		success_message: "PAN verified successfully.",
	},
	{
		id: 11,
		name: "SelfieKYC",
		label: "Selfie KYC",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12500,
		applicableRoles: [12500],
		primaryCTAText: "Next",
		description:
			"Thanks for completing your personal and address verification. Take a clear selfie to complete the eKYC process.",
		form_data: {},
		success_message: "KYC completed.",
	},
	{
		id: 9,
		name: "BusinessDetails",
		label: "Business Details",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 13300,
		applicableRoles: [13300], // Distributor only
		primaryCTAText: "Next",
		description: "",
		form_data: {},
	},
	{
		id: 25,
		name: "addBankAccount",
		label: "Add Bank Account",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 51700,
		applicableRoles: [51700], // Retailer only
		primaryCTAText: "Next",
		description: "Add your bank account",
		form_data: {},
	},
	{
		id: 10,
		name: "SecretPin",
		label: "Secret Pin",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12600,
		applicableRoles: [12600],
		primaryCTAText: "Next",
		description: "Set Your 4-Digit Secret Pin",
		form_data: {},
	},
	{
		id: 12,
		name: "Sign Agreement",
		label: "Sign Agreement",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12800,
		applicableRoles: [12800],
		primaryCTAText: "Sign Agreement",
		description: "",
		form_data: {},
		success_message: "Agreement signed successfully.",
	},
];
