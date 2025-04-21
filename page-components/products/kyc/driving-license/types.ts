/**
 * Types for Driving License verification responses
 */

/**
 * Request params for driving license verification API
 */
export interface DrivingLicenseRequestParams {
	/** The driving license number to verify */
	dl_number: string;
	/** Date of birth in YYYY-MM-DD format */
	dob: string;
}

/**
 * Address information in driving license response
 */
export interface DrivingLicenseAddress {
	/** Complete address string */
	complete_address: string;
	/** Type of address (e.g., "Permanent") */
	type: string;
	/** Address broken down into components */
	split_address?: {
		district?: string[];
		state?: string[][];
		city?: string[];
		pincode?: string;
		country?: string[];
		address_line?: string;
	};
}

/**
 * Vehicle class information
 */
export interface ClassOfVehicle {
	/** The class of vehicle the license holder is allowed to drive */
	class_of_vehicle: string;
}

/**
 * Badge details information
 */
export interface BadgeDetail {
	/** Date when the badge was issued */
	badge_issue_date: string;
	/** Badge identification number */
	badge_no: string;
	/** Classes of vehicle associated with the badge */
	class_of_vehicle: string[];
}

/**
 * Details of the driving license
 */
export interface DrivingLicenseDetails {
	/** Date when the license was issued */
	date_of_issue: string;
	/** Date of the last transaction on the license */
	date_of_last_transaction: string;
	/** Current status of the license */
	status: string;
	/** When the license was last transacted */
	last_transacted_at: string;
	/** Name of the license holder */
	name: string;
	/** Father's or husband's name of the license holder */
	father_or_husband_name: string;
	/** List of addresses associated with the license holder */
	address_list: DrivingLicenseAddress[];
	/** URL to the license holder's photo */
	photo?: string;
	/** Details of classes of vehicles the license holder can drive */
	cov_details: ClassOfVehicle[];
}

/**
 * License validity information
 */
export interface LicenseValidity {
	/** Non-transport validity period */
	non_transport: {
		/** Start date of validity */
		from: string;
		/** End date of validity */
		to: string;
	};
	/** Date until which the license is valid for hazardous materials */
	hazardous_valid_till: string;
	/** Transport validity period */
	transport: {
		/** Start date of validity */
		from: string;
		/** End date of validity */
		to: string;
	};
	/** Date until which the license is valid for hill driving */
	hill_valid_till: string;
}

/**
 * Complete driving license verification response data
 */
export interface DrivingLicenseResponseData {
	/** Driving license number */
	dl_number: string;
	/** Date of birth of the license holder */
	dob: string;
	/** Whether the license is valid */
	status: string;
	/** Details of badges associated with the license */
	badge_details?: BadgeDetail[];
	/** License validity information */
	dl_validity: LicenseValidity;
	/** Detailed information about the driving license */
	details_of_driving_licence: DrivingLicenseDetails;
}
