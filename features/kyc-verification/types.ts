/**
 * Types for KYC Verification feature.
 * Used across components, hooks, and API calls.
 */

import { ParamType } from "constants/trxnFramework";

/**
 * Validation rules for a request parameter.
 * Applied to form fields during user input validation.
 * @interface RequestParamValidation
 * @property {string} [pattern] - Regex pattern for input validation
 * @property {number} [minLength] - Minimum string length
 * @property {number} [maxLength] - Maximum string length
 * @property {number} [min] - Minimum numeric value
 * @property {number} [max] - Maximum numeric value
 */
export interface RequestParamValidation {
	pattern?: string;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

/**
 * A single request parameter for a KYC verification service.
 * This structure is compatible with the Form component's parameter_list.
 * @interface RequestParam
 * @property {0|1} is_required - Whether this parameter is required (1 = required, 0 = optional)
 * @property {string} name - Parameter name (used as form field name)
 * @property {string} label - Display label for the parameter
 * @property {ParamType} type - Parameter type ID from the ParamType enum (e.g., 12 for TEXT, 15 for MOBILE)
 * @property {RequestParamValidation} [validations] - Validation rules
 * @property {string} [placeholder] - Placeholder text
 * @property {string} [helperText] - Helper text shown below the field
 */
export interface RequestParam {
	/** Whether this parameter is required (1 = required, 0 = optional) */
	is_required: 0 | 1;
	/** Parameter name (used as form field name) */
	name: string;
	/** Display label for the parameter */
	label: string;
	/** Parameter type ID from the ParamType enum (e.g., 12 for TEXT, 15 for MOBILE, 14 for DATETIME) */
	type: ParamType;
	/** Validation rules */
	validations?: RequestParamValidation;
	/** Placeholder text */
	placeholder?: string;
	/** Helper text shown below the field */
	helperText?: string;
}

/**
 * A single KYC verification service configuration.
 * Contains all metadata and parameters needed to render the verification form.
 * @interface VerificationService
 * @property {string} serviceCode - Unique service code identifier
 * @property {string} name - Service name (e.g., "PAN Lite")
 * @property {string} label - Provider label (e.g., "Cashfree - Pan Lite")
 * @property {string} [category] - Category for filtering (e.g., "Identity", "Financial")
 * @property {string} [description] - Short description of the service
 * @property {string} [icon] - Icon name from the icon library
 * @property {string} endpointPath - API endpoint path for verification
 * @property {RequestParam[]} requestParams - List of request parameters for the form
 * @property {boolean} [supports_bulk_verification] - Whether this service supports bulk file uploads
 */
export interface VerificationService {
	/** Unique service code identifier */
	serviceCode: string;
	/** Service name (e.g., "PAN Lite") */
	name: string;
	/** Provider label (e.g., "Cashfree - Pan Lite") */
	label: string;
	/** Category for filtering (e.g., "Identity", "Financial") */
	category?: string;
	/** Short description of the service */
	description?: string;
	/** Icon name from the icon library */
	icon?: string;
	/** API endpoint path for verification (e.g., "/tools/kyc/pan-lite") */
	endpointPath: string;
	/** List of request parameters for the form */
	requestParams: RequestParam[];
	/** Whether this service supports bulk verification uploads */
	supports_bulk_verification?: boolean;
	/** Whether this service is enabled for the agent */
	is_enabled: boolean;
}

/**
 * API response structure for fetching KYC services.
 * @interface KycServicesResponse
 * @property {number} response_status_id - Response status identifier
 * @property {object} data - Response data payload
 * @property {VerificationService[]} data.verification_service_list - Array of available services
 * @property {number} response_type_id - Response type identifier
 * @property {string} message - Human-readable response message
 * @property {number} status - HTTP-like status code
 */
export interface KycServicesResponse {
	response_status_id: number;
	data: {
		verification_service_list: VerificationService[];
	};
	response_type_id: number;
	message: string;
	status: number;
}

/**
 * A verification service with enabled status for agent management.
 * Extends VerificationService with is_enabled flag from API 1043.
 * @interface AgentService
 */
export interface AgentService extends VerificationService {
	/** Whether this service is enabled for the agent */
	is_enabled: boolean;
}

/**
 * API response structure for fetching agent services (interaction_type_id: 1043).
 * @interface AgentServicesResponse
 */
export interface AgentServicesResponse {
	response_status_id: number;
	data: {
		service_list: AgentService[];
	};
	message: string;
	status: number;
}

/**
 * State for multi-service selection mode.
 * Persisted to maintain selection across page navigation.
 * @interface MultiServiceState
 * @property {boolean} isMultiModeEnabled - Whether multi-service selection is enabled
 * @property {string[]} selectedServices - Array of selected service codes
 * @property {number} timestamp - Timestamp for session management and expiry
 */
export interface MultiServiceState {
	/** Whether multi-service selection is enabled */
	isMultiModeEnabled: boolean;
	/** Array of selected service codes */
	selectedServices: string[];
	/** Timestamp for session management */
	timestamp: number;
}

/**
 * Form field structure compatible with tf-components/Form.
 * Maps RequestParam to Form component's parameter_list item.
 * @interface FormField
 * @property {string} name - Field name (used as form key)
 * @property {string} label - Display label for the field
 * @property {boolean} required - Whether field is required
 * @property {ParamType} parameter_type_id - Parameter type ID for Form component rendering
 * @property {object} [validations] - Validation rules for react-hook-form
 * @property {string} [helperText] - Helper text shown below the field
 * @property {string} [placeholder] - Placeholder text
 * @property {string[]} [requiredBy] - Service codes that require this field (for multi-service form)
 */
export interface FormField {
	/** Field name */
	name: string;
	/** Display label */
	label: string;
	/** Whether field is required */
	required: boolean;
	/** Parameter type ID for Form component */
	parameter_type_id: ParamType;
	/** Validation rules for react-hook-form */
	validations?: {
		required?: boolean | string;
		pattern?: {
			value: RegExp;
			message: string;
		};
		minLength?: {
			value: number;
			message: string;
		};
		maxLength?: {
			value: number;
			message: string;
		};
		min?: {
			value: number;
			message: string;
		};
		max?: {
			value: number;
			message: string;
		};
	};
	/** Helper text */
	helperText?: string;
	/** Placeholder text */
	placeholder?: string;
	/** Service(s) that require this field (for multi-service form) */
	requiredBy?: string[];
}

/**
 * Category filter option for the CategoryTabs component.
 * @interface CategoryOption
 * @property {string} value - Category ID/value used for filtering
 * @property {string} label - Display label shown in the tab
 * @property {number} [count] - Number of services in this category
 */
export interface CategoryOption {
	/** Category ID/value */
	value: string;
	/** Display label */
	label: string;
	/** Number of services in this category */
	count?: number;
}

// ============================================
// Verification Result Types
// ============================================

/**
 * Status of a single verification request.
 * @typedef {'pending' | 'in_progress' | 'success' | 'failed'} VerificationStatus
 * @description
 * - `pending`: Not yet started, waiting in queue
 * - `in_progress`: API call currently in progress
 * - `success`: Verification completed successfully
 * - `failed`: Verification failed with an error
 */
export type VerificationStatus =
	| "pending"
	| "in_progress"
	| "success"
	| "failed";

/**
 * Result of a single service verification.
 * Contains request, response, and status information for display.
 * @interface VerificationResult
 * @property {string} serviceCode - Unique service code identifier
 * @property {string} serviceName - Human-readable service name for display
 * @property {string} endpointPath - API endpoint that was called
 * @property {VerificationStatus} status - Current status of this verification
 * @property {Record<string, unknown>} requestData - Request data sent to the API
 * @property {Record<string, unknown>} [responseData] - Response data received from API (if successful)
 * @property {string} [error] - Error message (if failed)
 * @property {string} [timestamp] - Formatted timestamp when verification completed
 */
export interface VerificationResult {
	/** Service code identifier */
	serviceCode: string;
	/** Human-readable service name */
	serviceName: string;
	/** API endpoint that was called */
	endpointPath: string;
	/** Current status of this verification */
	status: VerificationStatus;
	/** Request data sent to the API */
	requestData: Record<string, unknown>;
	/** Response data received from API (if successful or partially successful) */
	responseData?: Record<string, unknown>;
	/** Error message (if failed) */
	error?: string;
	/** Timestamp when verification completed */
	timestamp?: string;
	/** Transaction ID from API response (used for downloading reports) */
	tid?: string;
}

/**
 * Overall state of the verification process.
 * Tracks batch progress and all individual results.
 * @interface VerificationState
 * @property {'idle' | 'submitting' | 'in_progress' | 'completed'} status - Overall batch status
 * @property {VerificationResult[]} results - Array of verification results (one per service)
 * @property {number} currentIndex - Index of currently processing service (0-based)
 * @property {number} totalCount - Total number of services to verify
 * @property {Record<string, unknown>} [formData] - Form data used for verification
 * @property {VerificationService[]} [services] - Original services for retry functionality
 * @property {number[]} [retryingIndices] - Indices of services currently being retried
 */
export interface VerificationState {
	/** Overall status of verification batch */
	status: "idle" | "submitting" | "in_progress" | "completed";
	/** Array of verification results (one per service) */
	results: VerificationResult[];
	/** Index of currently processing service (0-based) */
	currentIndex: number;
	/** Total number of services to verify */
	totalCount: number;
	/** Form data used for verification */
	formData?: Record<string, unknown>;
	/** Original services for retry functionality */
	services?: VerificationService[];
	/** Indices of services currently being retried */
	retryingIndices?: number[];
}

/**
 * Filter options for verification results list.
 * @interface VerificationFilterOptions
 * @property {VerificationStatus | 'all'} [status] - Filter by verification status
 * @property {string} [searchQuery] - Search query for service name filtering
 * @property {string} [category] - Filter by service category
 */
export interface VerificationFilterOptions {
	/** Filter by status */
	status?: VerificationStatus | "all";
	/** Search query for service name */
	searchQuery?: string;
	/** Filter by category */
	category?: string;
}

/**
 * Data stored in sessionStorage for retry functionality.
 * Allows form page to prefill values from previous attempt.
 * @interface RetryData
 * @property {Record<string, unknown>} formData - Previous form data to prefill
 * @property {string[]} failedServiceCodes - Service codes that failed and need retry
 * @property {boolean} isRetryMode - Flag indicating this is a retry attempt
 * @property {number} timestamp - Timestamp for session expiry
 */
export interface RetryData {
	/** Previous form data to prefill */
	formData: Record<string, unknown>;
	/** Service codes that failed and need retry */
	failedServiceCodes: string[];
	/** Flag indicating this is a retry attempt */
	isRetryMode: boolean;
	/** Timestamp for session expiry */
	timestamp: number;
}
