/**
 * Types for Passport verification requests and responses
 */

/**
 * Request parameters for passport verification API
 */
export interface PassportRequestParams {
	/** The unique alphanumeric code that identifies an individual's passport application */
	file_number: string;
	/** The date of birth of the passport holder in YYYY-MM-DD format */
	dob: string;
	/** The name of the passport holder (optional) */
	name?: string;
}

/**
 * Complete passport verification response data
 */
export interface PassportResponseData {
	/** Unique alphanumeric code identifying the passport application */
	file_number: string;
	/** Name of the passport holder */
	name: string;
	/** Date of birth of the passport holder */
	dob: string;
	/** Type of passport application */
	application_type: string;
	/** Date when the passport application was received */
	application_received_date: string;
}

/**
 * Form values for the passport verification form
 */
export interface PassportFormValues {
	fileNumber: string;
	dob: string;
	name?: string;
}
