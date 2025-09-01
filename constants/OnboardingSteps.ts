/**
 * Role interface representing different user types in the onboarding process
 */
export interface Role {
	/** Unique identifier for the role */
	id: number;
	/** Type of merchant (1: retailer, 2: enterprise, 3: distributor) */
	merchant_type: number;
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
	/** Optional role identifier associated with this step */
	role?: number;
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
 * Selection step data for role capture during user onboarding.
 * This step allows users to select their role (Retailer, Distributor, or Enterprise).
 * Used in the initial onboarding flow to determine the appropriate steps for each user type.
 * 
 * TODO:
 * - Extract form_data.roles into a separate function to return this data structure. It should take label-map (to rename user types), and hide/show user types.
 * - In the OaaS widget project, if only one usertype is visible, auto-select and proceed.
 */
export const selectionStepData: OnboardingStep = {
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
		roles: [
			{
				id: 1,
				merchant_type: 1,
				applicant_type: 0,
				label: "I'm a Retailer",
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
				merchant_type: 3,
				applicant_type: 2,
				label: "I'm a Distributor",
				description:
					"I have a network of retailer and i want to serve them",
				icon: "../assets/icons/user_distributor.png",
				isVisible: true,
				user_type: [{ key: 1, name: "Distributor" }],
			},
			{
				id: 3,
				merchant_type: 2,
				applicant_type: 1,
				label: "I'm an Enterprise",
				description:
					"I want to use API and other solutions to make my own service",
				icon: "../assets/icons/user_enterprise.png",
				isVisible: false,
				user_type: [{ key: 23, name: "Partner" }],
			},
		],
	},
};

/**
 * Onboarding steps data for distributor.
 * Some steps are disabled by marking `isVisible` as `false`.
 * Key steps include:
 * - LocationCapture: Initial step to capture user's location (role: 13000)
 * - AadhaarVerification: Upload Aadhaar documents for identity verification (role: 12400)
 * - Aadhaar Consent: User consent for Aadhaar verification (role: 24000)
 * - BusinessDetails: Business information collection (role: 13300)
 * - SecretPin: 4-digit PIN setup for security (role: 12600)
 * - Sign Agreement: Legal agreement signing (role: 12800)
 * - PanVerification: PAN document verification (role: 12300/13000)
 */
export const distributorStepsData: OnboardingStep[] = [
	{
		id: 3,
		name: "LocationCapture",
		label: "Location Capturing",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 13000,
		primaryCTAText: "Start Location Capture",
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
		primaryCTAText: "Verify Aadhaar",
		description:
			"Upload your Aadhaar Copy front and back to verify yourself. Accepted formats are",
		form_data: {},
		success_message: "Aadhaar uploaded successfully.",
	},
	{
		id: 5,
		name: "Aadhaar Consent",
		label: "Aadhaar Consent",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Verify Consent",
		description: "",
		form_data: {},
		success_message: "Aadhaar consent taken.",
	},
	{
		id: 6,
		name: "Confirm Aadhaar Number",
		label: "Confirm Aadhaar Number",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Proceed",
		description: "",
		form_data: {},
		success_message: "Aadhaar number confirmed.",
	},

	{
		id: 7,
		name: "ConfirmAadhaarOTP",
		label: "Confirm Aadhaar OTP",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Confirm",
		description: "",
		form_data: {},
		success_message: "Aadhaar confirmed successfully.",
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
		primaryCTAText: "Next",
		description: "",
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
		primaryCTAText: "Sign Agreement",
		description: "",
		form_data: {},
		success_message: "Agreement signed successfully.",
	},
	{
		id: 8,
		name: "PanVerification",
		label: "Pan Verification",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12300,
		primaryCTAText: "Verify PAN",
		description:
			"Upload your PAN copy to verify your business. Accepted formats are",
		form_data: {},
		success_message: "PAN verified successfully.",
	},

	{
		id: 16,
		name: "PanVerification",
		label: "Pan Verification",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 13000,
		primaryCTAText: "Verify PAN",
		description: "Enter your PAN Number to verify your business.",
		form_data: {},
		success_message: "PAN verified successfully.",
	},

	{
		id: 13,
		name: "Activation Plans",
		label: "Activation Plans",
		isSkipable: false,
		isRequired: true,
		isVisible: false,
		stepStatus: 0,
		role: 13400,
		primaryCTAText: "Sign Agreement",
		description: "Select Plans To See Details",
		form_data: {},
		success_message: "Agreement signed successfully.",
	},
	{
		id: 14,
		name: "OnboardingStatus",
		label: "Onboarding Status",
		isSkipable: false,
		isRequired: false,
		isVisible: false,
		stepStatus: 0,
		primaryCTAText: "Submit",
		description: "",
		form_data: {},
	},
	{
		id: 15,
		name: "PANAadhaarMatching",
		label: "PAN - Aadhaar Matching",
		isSkipable: false,
		isRequired: false,
		isVisible: false,
		stepStatus: 0,
		primaryCTAText: "Start Matching",
		description: "",
		form_data: {},
	},
];

/**
 * Onboarding steps data for retailers.
 * Similar to distributor steps but with specific role configurations for retailers.
 * Key differences from distributor onboarding:
 * - LocationCapture uses role 12400 instead of 13000
 * - Does not include Business Details step (removed for retailers)
 * - Includes all KYC verification steps (Aadhaar, PAN, Selfie)
 * - Secret PIN setup and agreement signing are included
 * Some steps are disabled by marking `isVisible` as `false`.
 */
export const retailerStepsData: OnboardingStep[] = [
	{
		id: 3,
		name: "LocationCapture",
		label: "Location Capturing",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12400,
		primaryCTAText: "Start Location Capture",
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
		primaryCTAText: "Verify Aadhaar",
		description:
			"Upload your Aadhaar Copy front and back to verify yourself. Accepted formats are",
		form_data: {},
		success_message: "Aadhaar uploaded successfully.",
	},
	{
		id: 5,
		name: "Aadhaar Consent",
		label: "Aadhaar Consent",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Verify Consent",
		description: "",
		form_data: {},
		success_message: "Aadhaar consent taken.",
	},
	{
		id: 20,
		name: "Digilocker Redirection",
		label: "Digilocker Redirection",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Proceed",
		description: "Redirecting to Digilocker for Aadhaar verification.",
		form_data: {},
		success_message: "Digilocker redirection successful.",
	},
	{
		id: 6,
		name: "Confirm Aadhaar Number",
		label: "Confirm Aadhaar Number",
		isSkipable: false,
		isRequired: true,
		isVisible: false,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Proceed",
		description: "",
		form_data: {},
		success_message: "Aadhaar number confirmed.",
	},
	{
		id: 7,
		name: "ConfirmAadhaarOTP",
		label: "Confirm Aadhaar OTP",
		isSkipable: false,
		isRequired: true,
		isVisible: false,
		stepStatus: 0,
		role: 24000,
		primaryCTAText: "Confirm",
		description: "",
		form_data: {},
		success_message: "Aadhaar confirmed successfully.",
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
		primaryCTAText: "Next",
		description:
			"Thanks for completing your personal and address verification. Take a clear selfie to complete the eKYC process.",
		form_data: {},
		success_message: "KYC completed.",
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
		primaryCTAText: "Sign Agreement",
		description: "",
		form_data: {},
		success_message: "Agreement signed successfully.",
	},
	{
		id: 8,
		name: "PanVerification",
		label: "Pan Verification",
		isSkipable: false,
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		role: 12300,
		primaryCTAText: "Verify PAN",
		description:
			"Upload your PAN copy to verify your business. Accepted formats are",
		form_data: {},
		success_message: "PAN verified successfully.",
	},
	{
		id: 13,
		name: "Activation Plans",
		label: "Activation Plans",
		isSkipable: false,
		isRequired: true,
		isVisible: false,
		stepStatus: 0,
		role: 13400,
		primaryCTAText: "Sign Agreement",
		description: "Select Plans To See Details",
		form_data: {},
		success_message: "Agreement signed successfully.",
	},
	{
		id: 14,
		name: "OnboardingStatus",
		label: "Onboarding Status",
		isSkipable: false,
		isRequired: false,
		isVisible: false,
		stepStatus: 0,
		primaryCTAText: "Submit",
		description: "",
		form_data: {},
	},
	{
		id: 15,
		name: "PANAadhaarMatching",
		label: "PAN - Aadhaar Matching",
		isSkipable: false,
		isRequired: false,
		isVisible: false,
		stepStatus: 0,
		primaryCTAText: "Start Matching",
		description: "",
		form_data: {},
	},
];
