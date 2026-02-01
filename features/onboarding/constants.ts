import { TransactionIds } from "constants/EpsTransactions";
import { ParamType } from "constants/trxnFramework";
import { UserTypeLabel } from "constants/UserTypes";
import type { OnboardingStateHook } from "./hooks/useOnboardingState";

// Applicant types as defined in the OaaS Widget configuration. Note, it is not the same as EPS's user-type-id
export const APPLICANT_TYPES = {
	RETAILER: 0,
	DISTRIBUTOR: 2,
	ENTERPRISE: 3,
};

// Configuration for which user types are visible in different onboarding contexts
// NOTE: The OaaS widget configration (getBaseRoleData) uses wrong merchantType values (1,2,3)
export const visibleAgentTypes = {
	assistedOnboarding: [APPLICANT_TYPES.RETAILER],
	selfOnboarding: [APPLICANT_TYPES.RETAILER, APPLICANT_TYPES.DISTRIBUTOR],
};

/**
 * API Response Status Codes
 * Used throughout the onboarding process to handle API responses
 */
export const ONBOARDING_API_STATUS = {
	SUCCESS: 0,
	ONBOARDING_REDIRECTION_ERROR: 1709,
} as const;

/**
 * Onboarding Step IDs
 * These IDs match the step.id values from the backend API and are used
 * to identify specific steps in the onboarding flow
 */
export const ONBOARDING_STEP_IDS = {
	WELCOME: 1,
	SELECTION_SCREEN: 2,
	LOCATION_CAPTURE: 3,
	AADHAAR_VERIFICATION: 4,
	AADHAAR_CONSENT: 5,
	CONFIRM_AADHAAR_NUMBER: 6,
	AADHAAR_NUMBER_OTP_VERIFY: 7,
	PAN_VERIFICATION: 8,
	BUSINESS: 9,
	SECRET_PIN: 10,
	VIDEO_KYC: 11,
	SIGN_AGREEMENT: 12,
	ACTIVATION_PLAN: 13,
	ONBOARDING_STATUS: 14,
	PAN_AADHAAR_MATCH: 15,
	PAN_VERIFICATION_DISTRIBUTOR: 16,
	DIGILOCKER_REDIRECTION: 20,
	ADD_BANK_ACCOUNT: 25,
} as const;

/**
 * Step Status Values
 * Represents the current state of an onboarding step
 */
export const ONBOARDING_STEP_STATUS = {
	NOT_STARTED: 0,
	IN_PROGRESS: 1,
	COMPLETED: 2,
	FAILED: 3,
	SKIPPED: 4,
} as const;

// Type exports for TypeScript support
export type OnboardingApiStatus =
	(typeof ONBOARDING_API_STATUS)[keyof typeof ONBOARDING_API_STATUS];
export type OnboardingStepId =
	(typeof ONBOARDING_STEP_IDS)[keyof typeof ONBOARDING_STEP_IDS];
export type OnboardingStepStatusType =
	(typeof ONBOARDING_STEP_STATUS)[keyof typeof ONBOARDING_STEP_STATUS];

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
 * API pipeline step configuration
 */
export interface ApiPipelineStep {
	/** Unique identifier for this API call within the pipeline */
	id: string;
	/** Type of API call */
	type: "form" | "upload";
	/** Transaction interaction type ID for form submissions */
	interactionTypeId?: number;
	/** Document type ID for file uploads */
	docType?: number;
	/** If true, pipeline stops if this step fails */
	continueOnSuccess?: boolean;
	/** Only execute if the specified step succeeded */
	dependsOn?: string;
	/**
	 * Maps form data paths to backend-expected file keys.
	 * Example: { "aadhaarImages.front": "front", "aadhaarImages.back": "back" }
	 * If not specified, files are named file1, file2, etc.
	 */
	fileKeyMapping?: Record<string, string>;
	/**
	 * Maps form field names to API field names.
	 * Example: { "panNumber": "doc_id", "shopType": "shop_type" }
	 * If a field is not in the mapping, it passes through with its original key.
	 */
	fieldMapping?: Record<string, string>;
}

/**
 * Local renderer configuration for steps rendered by this project
 */
export interface LocalRendererConfig {
	/** Type of local rendering */
	type: "form" | "custom";
	/** Component name for custom rendering (e.g., 'SignAgreementPage') */
	component?: string;
	/** Form fields for Form.jsx rendering (parameter_list format) */
	formFields?: Array<{
		name: string;
		label: string;
		parameter_type_id?: number;
		required?: boolean;
		validations?: Record<string, any>;
		[key: string]: any;
	}>;
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

	// === Rendering Configuration ===
	/** Where this step should be rendered: 'widget' (oaas-widget) or 'local' (this project) */
	renderSource?: "widget" | "local";
	/** Configuration for local rendering (only used when renderSource is 'local') */
	localRenderer?: LocalRendererConfig;

	// === NEW: API Pipeline ===
	/** API pipeline configuration for step execution */
	api?: {
		pipeline: ApiPipelineStep[];
	};

	// === NEW: Data Transforms ===
	/** Pre-submit data transformations */
	preSubmit?: {
		/** Fields to inject from state (e.g., { latlong: 'state.latLong' }) */
		inject?: Record<string, string>;
	};

	// === NEW: Post Actions ===
	/** Post-submit actions */
	postSubmit?: {
		/** Whether to refresh the user profile after this step */
		refreshProfile?: boolean;
	};

	// === NEW: Callbacks ===
	/** Third-party integration callbacks */
	callbacks?: {
		/** Type of callback integration */
		type: "esign" | "digilocker" | "pintwin" | "permission";
		/** Methods available for this callback */
		methods: string[];
	};

	// === NEW: Pre-submit Hook ===
	/**
	 * Callback executed before step submission.
	 * Use this to update state from form data (e.g., save latlong to state).
	 * @param data - The form data being submitted
	 * @param actions - State actions from useOnboardingState
	 */
	onPreSubmit?: (
		_data: { id: number; form_data?: Record<string, any> },
		_actions: OnboardingStateHook["actions"]
	) => void;
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
		applicant_type: APPLICANT_TYPES.RETAILER,
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
		applicant_type: APPLICANT_TYPES.DISTRIBUTOR,
		label: `I'm a ${userTypeLabel[1] || "Distributor"}`,
		description: "I have a network of retailer and i want to serve them",
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
	[APPLICANT_TYPES.RETAILER, APPLICANT_TYPES.DISTRIBUTOR] // Default: Retailer and Distributor
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
 * - `api.pipeline`: Configuration for the pipeline executor
 *
 * The filtering logic matches steps where ANY role in applicableRoles appears in the API response.
 */
export const masterOnboardingSteps: OnboardingStep[] = [
	{
		id: ONBOARDING_STEP_IDS.SELECTION_SCREEN,
		name: "ROLE_SELECTION",
		label: "Role Selection",
		isRequired: true,
		isVisible: false,
		stepStatus: 0,
		primaryCTAText: "Continue",
		description: "Select your role to begin the onboarding process.",
		form_data: {},
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId: TransactionIds.USER_ONBOARDING_ROLE,
					fieldMapping: {
						applicant_type: "applicant_type",
					},
				},
			],
		},
		preSubmit: {
			inject: {
				csp_id: "state.mobile",
			},
		},
	},
	{
		id: ONBOARDING_STEP_IDS.LOCATION_CAPTURE,
		name: "LOCATION_CAPTURE",
		label: "Location Capturing",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12400,
		applicableRoles: [13000, 12400],
		primaryCTAText: "Capture Location",
		description:
			"Allow us to capture your business location for verification purposes. This helps us serve you better.",
		form_data: {},
		success_message: "Location captured successfully.",
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId:
						TransactionIds.USER_ONBOARDING_GEO_LOCATION_CAPTURE,
				},
			],
		},
		// NOTE: latlong is passed directly from widget's form_data, no injection needed
		callbacks: {
			type: "permission",
			methods: ["requestLocationPermission"],
		},
		onPreSubmit: (data, actions) => {
			// Save location to state for subsequent steps
			if (data?.form_data?.latlong) {
				actions.setLocation(data.form_data.latlong);
			}
		},
	},
	{
		id: ONBOARDING_STEP_IDS.AADHAAR_VERIFICATION,
		name: "AADHAAR_VERIFICATION",
		label: "Aadhaar Verification",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12400,
		applicableRoles: [12400],
		primaryCTAText: "Verify Aadhaar",
		description:
			"Upload clear photos of both front and back of your Aadhaar card. Accepted formats: JPG, PNG, PDF",
		form_data: {},
		success_message: "Aadhaar uploaded successfully.",
		renderSource: "local",
		localRenderer: {
			type: "form",
			formFields: [
				{
					name: "aadhaarFront",
					label: "Aadhaar Front Image",
					parameter_type_id: ParamType.FILE,
					required: true,
					meta: { accept: "image/jpeg,image/png" },
				},
				{
					name: "aadhaarBack",
					label: "Aadhaar Back Image",
					parameter_type_id: ParamType.FILE,
					required: true,
					meta: { accept: "image/jpeg,image/png" },
				},
			],
		},
		api: {
			pipeline: [
				{
					id: "upload",
					type: "upload",
					docType: 1, // Aadhaar document
					interactionTypeId: TransactionIds.USER_ONBOARDING_AADHAR,
					fileKeyMapping: {
						aadhaarFront: "file1",
						aadhaarBack: "file2",
					},
				},
			],
		},
	},
	{
		id: ONBOARDING_STEP_IDS.AADHAAR_CONSENT,
		name: "AADHAAR_CONSENT",
		label: "Aadhaar Consent",
		isRequired: true,
		isVisible: false,
		stepStatus: 0,
		role: 24000,
		applicableRoles: [24000],
		primaryCTAText: "Verify Consent",
		description:
			"Please provide your consent to use Aadhaar for identity verification as per UIDAI guidelines.",
		form_data: {},
		success_message: "Aadhaar consent taken.",
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId: TransactionIds.USER_AADHAR_CONSENT,
				},
			],
		},
		preSubmit: {
			inject: {
				latlong: "state.latLong",
				company_name: "state.mobile", // Legacy uses mobile as company_name
			},
		},
	},
	{
		id: ONBOARDING_STEP_IDS.CONFIRM_AADHAAR_NUMBER,
		name: "CONFIRM_AADHAAR_NUMBER",
		label: "Confirm Aadhaar Number",
		isRequired: true,
		isVisible: false,
		stepStatus: 0,
		role: 24000,
		applicableRoles: [24000],
		primaryCTAText: "Proceed",
		description:
			"Please verify that your Aadhaar number is entered correctly before proceeding.",
		form_data: {},
		success_message: "Aadhaar number confirmed.",
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId:
						TransactionIds.USER_AADHAR_NUMBER_CONFIRM,
				},
			],
		},
	},
	{
		id: ONBOARDING_STEP_IDS.AADHAAR_NUMBER_OTP_VERIFY,
		name: "AADHAAR_NUMBER_OTP_VERIFY",
		label: "Confirm Aadhaar OTP",
		isRequired: true,
		isVisible: false,
		stepStatus: 0,
		role: 24000,
		applicableRoles: [24000],
		primaryCTAText: "Confirm",
		description:
			"Enter the OTP sent to your Aadhaar-registered mobile number to verify your identity.",
		form_data: {},
		success_message: "Aadhaar confirmed successfully.",
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId: TransactionIds.USER_AADHAR_OTP_CONFIRM,
				},
			],
		},
	},
	{
		id: ONBOARDING_STEP_IDS.DIGILOCKER_REDIRECTION,
		name: "DIGILOCKER_REDIRECTION",
		label: "Digilocker Verification",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		applicableRoles: [24000],
		primaryCTAText: "Proceed",
		description: "Verify your Aadhaar using your Digilocker account.",
		form_data: {},
		success_message: "Digilocker verification successful.",
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId: TransactionIds.USER_AADHAR_OTP_CONFIRM, // reused for digilocker
				},
			],
		},
		callbacks: {
			type: "digilocker",
			methods: ["initiateDigilocker", "handleDigilockerCallback"],
		},
	},
	{
		id: ONBOARDING_STEP_IDS.PAN_VERIFICATION,
		name: "PAN_VERIFICATION",
		label: "PAN Verification",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12300,
		applicableRoles: [12300, 13000],
		primaryCTAText: "Verify PAN",
		description:
			"Upload a clear photo of your PAN card for business verification. Accepted formats: JPG, PNG, PDF",
		form_data: {},
		success_message: "PAN verified successfully.",
		renderSource: "local",
		localRenderer: {
			type: "form",
			formFields: [
				{
					name: "panNumber",
					label: "PAN Number",
					parameter_type_id: ParamType.TEXT,
					required: true,
					validations: {
						pattern: {
							value: /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/,
							message: "Invalid PAN format (e.g., ABCDE1234F)",
						},
						minLength: {
							value: 10,
							message: "PAN must be 10 characters",
						},
						maxLength: {
							value: 10,
							message: "PAN must be 10 characters",
						},
					},
				},
				{
					name: "panImage",
					label: "PAN Card Image",
					parameter_type_id: ParamType.FILE,
					required: true,
					meta: { accept: "image/jpeg,image/png" },
				},
			],
		},
		api: {
			pipeline: [
				{
					id: "upload",
					type: "upload",
					docType: 2, // PAN document
					interactionTypeId: TransactionIds.USER_ONBOARDING_AADHAR,
					fileKeyMapping: {
						panImage: "file1",
					},
					fieldMapping: {
						panNumber: "doc_id",
					},
				},
			],
		},
	},
	{
		id: ONBOARDING_STEP_IDS.VIDEO_KYC,
		name: "VIDEO_KYC",
		label: "Selfie KYC",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12500,
		applicableRoles: [12500],
		primaryCTAText: "Next",
		description:
			"Take a clear selfie in good lighting to complete your identity verification. Ensure your face is clearly visible.",
		form_data: {},
		success_message: "KYC completed.",
		api: {
			pipeline: [
				{
					id: "upload",
					type: "upload",
					interactionTypeId: TransactionIds.USER_ONBOARDING_AADHAR,
					docType: 3, // Video/Selfie document
				},
			],
		},
	},
	{
		id: ONBOARDING_STEP_IDS.BUSINESS,
		name: "BUSINESS",
		label: "Business Details",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 13300,
		applicableRoles: [13300],
		primaryCTAText: "Next",
		description:
			"Provide your business information including name, type, and registration details to complete your profile.",
		form_data: {},
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId: TransactionIds.USER_ONBOARDING_BUSINESS,
				},
			],
		},
	},
	{
		id: ONBOARDING_STEP_IDS.ADD_BANK_ACCOUNT,
		name: "ADD_BANK_ACCONT",
		label: "Add Bank Account",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12500,
		applicableRoles: [12500],
		primaryCTAText: "Next",
		description:
			"Please provide your bank account details to proceed with the onboarding process.",
		form_data: {},
		renderSource: "local",
		localRenderer: {
			type: "custom",
			component: "AddBankAccountStep",
		},
		api: {
			pipeline: [
				{
					id: "verify",
					type: "form",
					interactionTypeId: TransactionIds.ADD_BANK_ACCOUNT,
					continueOnSuccess: true,
				},
				{
					id: "upload",
					type: "upload",
					docType: 7, // Bank passbook document
					dependsOn: "verify",
				},
			],
		},
		postSubmit: {
			refreshProfile: true,
		},
	},
	{
		id: ONBOARDING_STEP_IDS.SECRET_PIN,
		name: "SECRET_PIN",
		label: "Secret Pin",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12600,
		applicableRoles: [12600],
		primaryCTAText: "Next",
		description:
			"Create a secure 4-digit PIN for transaction authorization. Keep it confidential and don't share with anyone.",
		form_data: {},
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId:
						TransactionIds.USER_ONBOARDING_SECRET_PIN,
				},
			],
		},
		callbacks: {
			type: "pintwin",
			methods: ["fetchBookletNumber", "fetchBookletKeys"],
		},
	},
	{
		id: ONBOARDING_STEP_IDS.SIGN_AGREEMENT,
		name: "SIGN_AGREEMENT",
		label: "Sign Agreement",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12800,
		applicableRoles: [12800],
		primaryCTAText: "Sign Agreement",
		description:
			"Review and digitally sign the terms and conditions to activate your account and start using our services.",
		form_data: {},
		success_message: "Agreement signed successfully.",
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId:
						TransactionIds.USER_ONBOARDING_SUBMIT_SIGN_AGREEMENT,
				},
			],
		},
		callbacks: {
			type: "esign",
			methods: ["initializeEsign", "handleEsignCallback"],
		},
	},
];
