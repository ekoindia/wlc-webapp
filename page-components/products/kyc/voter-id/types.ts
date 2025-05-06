// filepath: /Users/abhi/DEV/eko_github/wlc-webapp/page-components/products/kyc/voter-id/types.ts
/**
 * Types for Voter ID verification responses
 */

/**
 * Request parameters for voter ID verification API
 */
export interface VoterIdRequestParams {
	/** The unique identification number assigned to each voter ID */
	epic_number: string;
	/** The name of the voter ID card holder (optional) */
	name?: string;
}

/**
 * Address information in voter ID response
 */
export interface SplitAddress {
	/** Names of the districts in the address information */
	district: string[];
	/** Names of the states in the address information */
	state: string[][];
	/** Names of the cities in the address information */
	city: string[];
	/** PIN code as present in the voter ID card */
	pincode: string;
	/** Names of the countries in the address information */
	country: string[];
	/** Address information as present in the voter ID card */
	address_line: string;
}

/**
 * Complete voter ID verification response data
 */
export interface VoterIdResponseData {
	/** Name of the individual as present in the voter ID card */
	name: string;
	/** Name of the individual in the individual's regional language */
	name_in_regional_lang: string;
	/** Age of the voter ID holder */
	age: string;
	/** Type of the relationship with the parent/guardian */
	relation_type: string;
	/** Name of the parent/guardian */
	relation_name: string;
	/** Name of the parent/guardian in the individual's regional language */
	relation_name_in_regional_lang: string;
	/** Father's name of the individual */
	father_name: string;
	/** Date of birth of the individual */
	dob: string;
	/** Gender of the individual */
	gender: string;
	/** Address of the individual */
	address: string;
	/** Address information broken down into components */
	split_address: SplitAddress;
	/** EPIC number of the individual */
	epic_number: string;
	/** Name of the state */
	state: string;
	/** Number associated with the assembly constituency */
	assembly_constituency_number: string;
	/** Name of the assembly constituency */
	assembly_constituency: string;
	/** Number associated with the parliamentary constituency */
	parliamentary_constituency_number: string;
	/** Name of the parliamentary constituency */
	parliamentary_constituency: string;
	/** Part number in the electoral roll */
	part_number: string;
	/** Part name in the electoral roll */
	part_name: string;
	/** Serial number as present in the voter ID card */
	serial_number: string;
	/** Place where the individual cast votes during elections */
	polling_station: string;
}
