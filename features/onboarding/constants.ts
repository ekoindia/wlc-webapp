import { TransactionIds } from "constants/EpsTransactions";
import { ParamType } from "constants/trxnFramework";
import type { OnboardingStateHook } from "./hooks/useOnboardingState";
import type { Role } from "./utils/roleSelection";

// Applicant types as defined in the OaaS Widget configuration. Note, it is not the same as EPS's user-type-id
export const APPLICANT_TYPES = {
	RETAILER: 0,
	DISTRIBUTOR: 2,
	ENTERPRISE: 3,
};

/**
 * Response Type IDs for step success validation
 * Used by components to determine if a step should advance
 */
export const RESPONSE_TYPE_IDS = {
	/* Role Selection Screen */
	SELECTION_SCREEN: 1566,

	/* Location Capture */
	LOCATION_CAPTURE: 1076,

	/* Aadhaar Verification */
	AADHAAR_VERIFICATION: 1569,

	/* Digilocker redirection success response */
	DIGILOCKER_REDIRECTION: 1621,

	/* PAN Verification */
	PAN_VERIFICATION: 1569,

	/* Video KYC */
	VIDEO_KYC: 1569,

	/* Business Details Submission */
	BUSINESS: 1567,

	/* Bank Account Verification */
	BANK_VERIFICATION: 1445,
	UPLOAD_PASSBOOK_IMAGE: 1569,

	/* Secret Pin Creation */
	SECRET_PIN: 9,

	/* Sign Agreement */
	SIGN_AGREEMENT: 1615,
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
 * Onboarding Step Status Values
 * Represents the current state of an onboarding step
 */
export const ONBOARDING_STEP_STATUS = {
	NOT_STARTED: 0,
	IN_PROGRESS: 1,
	COMPLETED: 2,
	FAILED: 3,
	SKIPPED: 4,
} as const;

export type OnboardingStepStatusType =
	(typeof ONBOARDING_STEP_STATUS)[keyof typeof ONBOARDING_STEP_STATUS];

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
	/**
	 * Explicit mapping from form field names to API parameter names.
	 * Example: { "aadhaar_front_image": "file1", "aadhaar_back_image": "file2" }
	 * For upload calls: maps to file keys (file1, file2, etc.)
	 * For form calls: maps to API body parameter names
	 * If mapping exists for a field, uses the mapped name; otherwise uses the original field name.
	 */
	fieldMapping?: Record<string, string>;
	/**
	 * Response type IDs that indicate success for this API.
	 * Pipeline validates response.response_type_id against this list.
	 * @default [0]
	 */
	successResponseTypeIds?: number[];
	/**
	 * Whether presence of invalid_params in response should fail this API call.
	 * @default true
	 */
	checkInvalidParams?: boolean;
	/**
	 * Mapping for file upload keys (for 'upload' type)
	 * Example: { "selfie_image": "file1" }
	 */
	fileKeyMapping?: Record<string, string>;
}

/**
 * Result of a single API call in the pipeline
 */
export interface ApiCallResponse {
	/** Pipeline step id (e.g., "verify", "upload") */
	id: string;
	/** Transaction interaction type ID for reference */
	interactionTypeId?: number;
	/** Execution status */
	status: "success" | "failed" | "skipped";
	/** API response or error object */
	response?: any;
}

/**
 * Result of executing a full pipeline
 */
export interface PipelineResult {
	/** Overall pipeline status */
	status: "success" | "failed";
	/** List of all API call responses in execution order */
	list: ApiCallResponse[];
}

/**
 * State of a pipeline execution (map of step ID to result)
 * Used by useStepExecutor to track progress
 */
export type PipelineState = Record<
	string,
	{
		status: "success" | "failed" | "skipped";
		response?: any;
	}
>;

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

	// === Local Rendering Configuration ===
	/** Configuration for local rendering */
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
 * Filters step data based on onboarding step roles and sorts by API order.
 *
 * IMPORTANT: This function preserves the order from the API's onboarding_steps,
 * NOT the master list order. This ensures the UI step order matches the backend's
 * expected progression, preventing status synchronization bugs.
 * @param {OnboardingStep[]} stepData - Array of all possible onboarding steps
 * @param {Array<{ role: number; label?: string }>} onboardingSteps - Array of onboarding step configurations with roles from API
 * @returns {OnboardingStep[]} Filtered and sorted array of onboarding steps relevant to the user's roles
 */
export const filterOnboardingStepsByRoles = (
	stepData: OnboardingStep[],
	onboardingSteps: Array<{ role: number; label?: string }>
): OnboardingStep[] => {
	// Extract role IDs from API response
	const apiRoles = onboardingSteps?.map((step) => step.role) ?? [];

	// Create a role-to-index map for sorting based on API order
	const roleOrderMap = new Map<number, number>();
	onboardingSteps?.forEach((step, index) => {
		roleOrderMap.set(step.role, index);
	});

	// Filter steps based on applicableRoles array
	const filteredSteps = stepData.filter((step) => {
		return step.applicableRoles?.some((role) => apiRoles.includes(role));
	});

	// Sort by API order (using the first matching applicable role's position)
	// Steps with the same role maintain their relative master list order (stable sort)
	return filteredSteps.sort((a, b) => {
		const aIndex = Math.min(
			...(a.applicableRoles
				?.map((role) => roleOrderMap.get(role) ?? Infinity)
				.filter((idx) => idx !== Infinity) ?? [Infinity])
		);
		const bIndex = Math.min(
			...(b.applicableRoles
				?.map((role) => roleOrderMap.get(role) ?? Infinity)
				.filter((idx) => idx !== Infinity) ?? [Infinity])
		);
		return aIndex - bIndex;
	});
};

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
/**
 * Master list of KYC onboarding steps.
 * NOTE: Role selection is handled separately by the RoleSelection component.
 */
export const masterOnboardingSteps: OnboardingStep[] = [
	{
		id: ONBOARDING_STEP_IDS.LOCATION_CAPTURE,
		name: "LOCATION_CAPTURE",
		label: "Location Capturing",
		isRequired: true,
		isVisible: false,
		stepStatus: 0,
		applicableRoles: [12400, 13000],
		primaryCTAText: "Capture Location",
		description:
			"Allow us to capture your business location for verification purposes. This helps us serve you better.",
		form_data: {},
		success_message: "Location captured successfully.",
		onPreSubmit: (data, actions) => {
			// Save location to state for subsequent steps
			if (data?.form_data?.latlong) {
				actions.setLocation(data.form_data.latlong);
			}
		},
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId:
						TransactionIds.USER_ONBOARDING_GEO_LOCATION_CAPTURE,
					successResponseTypeIds: [
						RESPONSE_TYPE_IDS.LOCATION_CAPTURE,
					],
				},
			],
		},
		postSubmit: {
			refreshProfile: false,
		},
	},
	{
		id: ONBOARDING_STEP_IDS.AADHAAR_VERIFICATION,
		name: "AADHAAR_VERIFICATION",
		label: "Aadhaar Verification",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		applicableRoles: [12400],
		primaryCTAText: "Verify Aadhaar",
		description:
			"Upload clear photos of both front and back of your Aadhaar card. Accepted formats: JPG, PNG, PDF",
		form_data: {},
		success_message: "Aadhaar uploaded successfully.",
		localRenderer: {
			type: "form",
			formFields: [
				{
					name: "aadhaar_front_image",
					label: "Aadhaar Front Image",
					parameter_type_id: ParamType.FILE,
					required: true,
					meta: { accept: "image/jpeg,image/png" },
				},
				{
					name: "aadhaar_back_image",
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
					interactionTypeId: TransactionIds.UPLOAD_DOCUMENT,
					fieldMapping: {
						aadhaar_front_image: "file1",
						aadhaar_back_image: "file2",
					},
					successResponseTypeIds: [
						RESPONSE_TYPE_IDS.AADHAAR_VERIFICATION,
					],
				},
			],
		},
		postSubmit: {
			refreshProfile: true,
		},
	},
	{
		id: ONBOARDING_STEP_IDS.DIGILOCKER_REDIRECTION,
		name: "DIGILOCKER_REDIRECTION",
		label: "Digilocker Verification",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		applicableRoles: [24000],
		primaryCTAText: "Proceed",
		description:
			"Please complete the verification process through Digilocker to continue with your onboarding.",
		form_data: {},
		success_message: "Digilocker verification successful.",
		localRenderer: {
			type: "custom",
			component: "DigilockerRedirectionStep",
		},
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId: TransactionIds.USER_AADHAR_OTP_CONFIRM, // reused for digilocker
					successResponseTypeIds: [
						RESPONSE_TYPE_IDS.DIGILOCKER_REDIRECTION,
					],
				},
			],
		},
		postSubmit: {
			refreshProfile: true,
		},
	},
	{
		id: ONBOARDING_STEP_IDS.PAN_VERIFICATION,
		name: "PAN_VERIFICATION",
		label: "PAN Verification",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		applicableRoles: [12300, 13000],
		primaryCTAText: "Proceed",
		description:
			"Upload a clear photo of your PAN card for business verification. Accepted formats: JPG, PNG, PDF",
		form_data: {},
		success_message: "PAN verified successfully.",
		localRenderer: {
			type: "form",
			formFields: [
				{
					name: "doc_id",
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
					name: "pan_image",
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
					interactionTypeId: TransactionIds.UPLOAD_DOCUMENT,
					fieldMapping: {
						pan_image: "file1",
					},
					successResponseTypeIds: [
						RESPONSE_TYPE_IDS.PAN_VERIFICATION,
					],
				},
			],
		},
		postSubmit: {
			refreshProfile: false,
		},
	},
	{
		id: ONBOARDING_STEP_IDS.VIDEO_KYC,
		name: "VIDEO_KYC",
		label: "Selfie KYC",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		applicableRoles: [12500],
		primaryCTAText: "Proceed",
		description:
			"Take a clear selfie in good lighting to complete your identity verification. Ensure your face is clearly visible.",
		form_data: {},
		success_message: "KYC completed.",
		localRenderer: {
			type: "form",
			formFields: [
				{
					name: "selfie_image",
					label: "Take a live photo with ID proof",
					parameter_type_id: ParamType.FILE,
					required: true,
					meta: {
						accept: "image/jpeg,image/png",
						cameraOnly: true,
						watermark: true,
						options: {
							detectFace: true,
							minFaceCount: 1,
							maxFaceCount: 1,
						},
					},
				},
			],
		},
		api: {
			pipeline: [
				{
					id: "upload",
					type: "upload",
					interactionTypeId: TransactionIds.UPLOAD_DOCUMENT,
					docType: 3, // Video/Selfie document
					fieldMapping: {
						selfie_image: "file1",
					},
					successResponseTypeIds: [RESPONSE_TYPE_IDS.VIDEO_KYC],
				},
			],
		},
		postSubmit: {
			refreshProfile: false,
		},
	},
	{
		id: ONBOARDING_STEP_IDS.BUSINESS,
		name: "BUSINESS",
		label: "Business Details",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		applicableRoles: [13300],
		primaryCTAText: "Proceed",
		description:
			"Provide your business information including name, type, and registration details to complete your profile.",
		form_data: {},
		localRenderer: {
			type: "custom",
			component: "BusinessDetailsStep",
		},
		preSubmit: {
			inject: {
				latlong: "state.latLong",
			},
		},
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId: TransactionIds.USER_ONBOARDING_BUSINESS,
					successResponseTypeIds: [RESPONSE_TYPE_IDS.BUSINESS],
				},
			],
		},
		postSubmit: {
			refreshProfile: false,
		},
	},
	{
		id: ONBOARDING_STEP_IDS.ADD_BANK_ACCOUNT,
		name: "ADD_BANK_ACCONT",
		label: "Add Bank Account",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		applicableRoles: [12500],
		primaryCTAText: "Proceed",
		description:
			"Please provide your bank account details to proceed with the onboarding process.",
		form_data: {},
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
					successResponseTypeIds: [
						RESPONSE_TYPE_IDS.BANK_VERIFICATION,
					],
				},
				{
					id: "upload",
					type: "upload",
					docType: 7, // Bank passbook document
					interactionTypeId: TransactionIds.UPLOAD_DOCUMENT,
					successResponseTypeIds: [
						RESPONSE_TYPE_IDS.UPLOAD_PASSBOOK_IMAGE,
					],
				},
			],
		},
		postSubmit: {
			refreshProfile: false,
		},
	},
	{
		id: ONBOARDING_STEP_IDS.SECRET_PIN,
		name: "SECRET_PIN",
		label: "Secret Pin",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		applicableRoles: [12600],
		primaryCTAText: "Proceed",
		description:
			"Create a secure 4-digit PIN for transaction authorization. Keep it confidential and don't share with anyone.",
		form_data: {},
		localRenderer: {
			type: "custom",
			component: "SecretPinStep",
		},
		preSubmit: {
			inject: {
				latlong: "state.latLong",
			},
		},
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId:
						TransactionIds.USER_ONBOARDING_SECRET_PIN,
					successResponseTypeIds: [RESPONSE_TYPE_IDS.SECRET_PIN],
				},
			],
		},
		postSubmit: {
			refreshProfile: false,
		},
	},
	{
		id: ONBOARDING_STEP_IDS.SIGN_AGREEMENT,
		name: "SIGN_AGREEMENT",
		label: "Sign Agreement",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		applicableRoles: [12800],
		primaryCTAText: "Sign Agreement",
		description:
			"Review and digitally sign the terms and conditions to activate your account and start using our services.",
		form_data: {},
		success_message: "Agreement signed successfully.",
		localRenderer: {
			type: "custom",
			component: "SignAgreementStep",
		},
		api: {
			pipeline: [
				{
					id: "submit",
					type: "form",
					interactionTypeId:
						TransactionIds.USER_ONBOARDING_SUBMIT_SIGN_AGREEMENT,
					successResponseTypeIds: [RESPONSE_TYPE_IDS.SIGN_AGREEMENT],
				},
			],
		},
		postSubmit: {
			refreshProfile: true,
		},
	},
];
