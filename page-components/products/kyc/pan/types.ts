/**
 * PAN Basic API response data structure
 */
export interface PanBasicResponseData {
	pan_number: string;
	aadhaar_seeding_status: string;
	gender: string;
	pan_returned_name: string;
	last_name: string;
	aadhaar_seeding_status_code: string;
	middle_name: string;
	title: string;
	first_name: string;
}

/**
 * PAN Lite API response data structure
 */
export interface PanLiteResponseData {
	pan: string;
	name: string;
	dob: string;
	name_match: string;
	dob_match: string;
	pan_status: string;
	status: string;
	aadhaar_seeding_status: string;
	aadhaar_seeding_status_desc: string;
}

/**
 * PAN address structure for Advanced API
 */
export interface PanAddress {
	full_address: string;
	street?: string;
	city?: string;
	state?: string;
	pincode?: number;
	country?: string;
}

/**
 * PAN Advanced API response data structure
 */
export interface PanAdvancedResponseData {
	pan: string;
	name_provided: string;
	registered_name: string;
	name_pan_card: string;
	first_name: string;
	last_name: string;
	type: string;
	gender: string;
	date_of_birth: string;
	masked_aadhaar_number?: string;
	email?: string;
	mobile_number?: string;
	aadhaar_linked: boolean;
	address?: PanAddress;
}

/**
 * Bulk PAN Entry structure
 */
export interface BulkPanEntry {
	pan: string;
	name?: string;
}

/**
 * Bulk PAN Verification response data structure
 */
export interface BulkPanResponseData {
	reference_id: number;
}

/**
 * Bulk PAN Status Entry structure
 */
export interface BulkPanStatusEntry {
	pan: string;
	type: string;
	reference_id: string;
	name_provided: string;
	registered_name: string;
	valid: string;
	father_name?: string;
	message: string;
	name_match_score?: string;
	name_match_result?: string;
	aadhaar_seeding_status?: string;
	last_updated_at: string;
	name_pan_card?: string;
	pan_status: string;
	aadhaar_seeding_status_desc?: string;
}

/**
 * Bulk PAN Status response data structure
 */
export interface BulkPanStatusResponseData {
	count: number;
	entries: BulkPanStatusEntry[];
}
