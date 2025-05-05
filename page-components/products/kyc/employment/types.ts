/**
 * Types for Employee Details verification requests and responses
 */

/**
 * Request parameters for employee details verification API
 * At least one field is mandatory for successful verification
 */
export interface EmploymentRequestParams {
	/** Phone number of the employee (conditional mandatory) */
	phone?: string;
	/** PAN card number of the employee (conditional mandatory) */
	pan?: string;
	/** Universal Account Number from EPFO (conditional mandatory) */
	uan?: string;
	/** Date of birth in YYYY-MM-DD format (conditional mandatory) */
	dob?: string;
	/** Name of the employee (conditional mandatory) */
	employee_name?: string;
	/** Name of the employer (conditional mandatory) */
	employer_name?: string;
}

/**
 * Basic details for employee in UAN verification response
 */
export interface UanBasicDetails {
	/** Employee name */
	employee_name?: string;
	/** Date of birth */
	dob?: string;
	/** Gender */
	gender?: string;
	/** Phone number */
	phone?: string;
	/** Employee confidence score */
	employee_confidence_score?: number;
	/** Whether Aadhaar is verified */
	aadhaar_verified?: boolean;
}

/**
 * Employment details in UAN verification response
 */
export interface UanEmploymentDetails {
	/** Member ID */
	member_id?: string;
	/** Establishment ID */
	establishment_id?: string;
	/** Establishment name */
	establishment_name?: string;
	/** Date of joining */
	joining_date?: string;
	/** Date of exit */
	exit_date?: string;
	/** Reason for leaving */
	leave_reason?: string;
	/** Employer confidence score */
	employer_confidence_score?: number;
}

/**
 * Additional details in UAN verification response
 */
export interface UanAdditionalDetails {
	/** Aadhaar number (masked) */
	aadhaar?: string;
	/** Email address */
	email?: string;
	/** PAN card number */
	PAN?: string;
	/** Relative's name */
	relative_name?: string;
	/** Relationship type */
	relation?: string;
	/** Bank account number */
	bank_account?: string;
	/** IFSC code */
	ifsc?: string;
	/** Bank address */
	bank_address?: string;
}

/**
 * UAN details in the employee verification response
 */
export interface UanDetails {
	/** UAN number */
	uan?: string;
	/** Data source */
	source?: string;
	/** Source confidence score */
	source_score?: number;
	/** Employee basic details */
	basic_details?: UanBasicDetails;
	/** Employment details */
	employment_details?: UanEmploymentDetails;
	/** Additional information */
	additional_details?: UanAdditionalDetails;
}

/**
 * EPFO status information
 */
export interface EpfoStatus {
	/** Whether data is recent */
	recent?: boolean;
	/** Whether name is unique */
	name_unique?: boolean;
	/** Whether PF filing details are available */
	pf_filings_details?: boolean;
}

/**
 * PF Filing details
 */
export interface PfFilingDetail {
	/** Wage month in YYYY-MM format */
	wage_month?: string;
	/** Number of employees */
	employees_count?: number;
	/** Total amount filed */
	total_amount?: number;
}

/**
 * Employee details in the verification response
 */
export interface EmployeeDetails {
	/** Member ID */
	member_id?: string;
	/** Employee UAN number */
	uan?: string;
	/** Date of joining the company */
	joining_date?: string;
	/** Date of exit from the company */
	exit_date?: string;
	/** Whether employee is currently employed */
	employed?: boolean;
	/** Whether employee name matches with input */
	employee_name_match?: boolean;
	/** Whether exit date is marked */
	exit_date_marked?: boolean;
	/** EPFO status information */
	epfo?: EpfoStatus;
}

/**
 * Employer details in the verification response
 */
export interface EmployerDetails {
	/** Establishment ID */
	establishment_id?: string;
	/** Employer/company name */
	establishment_name?: string;
	/** Date of setup/establishment */
	setup_date?: string;
	/** Type of ownership */
	ownership_type?: string;
	/** Employer confidence score */
	employer_confidence_score?: number;
	/** Whether employer name matches with input */
	employer_name_match?: boolean;
	/** PF filing details */
	pf_filing_details?: PfFilingDetail[];
}

/**
 * Recent employment details in the verification response
 */
export interface RecentEmploymentDetails {
	/** Employee details */
	employee_details?: EmployeeDetails;
	/** Employer details */
	employer_details?: EmployerDetails;
}

/**
 * Complete employment verification response data
 */
export interface EmploymentResponseData {
	/** Input parameters provided for verification */
	input?: EmploymentRequestParams;
	/** UAN details retrieved from EPFO */
	uan_details?: UanDetails[];
	/** Recent employment information */
	recent_employment_details?: RecentEmploymentDetails;
}

/**
 * Form values for the employment verification form
 */
export interface EmploymentFormValues {
	phone?: string;
	pan?: string;
	uan?: string;
	dob?: string;
	employeeName?: string;
	employerName?: string;
}
