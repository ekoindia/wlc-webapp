/**
 * Mock data for KYC Verification services.
 * Used for development and testing without backend API dependency.
 * Set NEXT_PUBLIC_USE_MOCK_KYC=true in .env.local to enable.
 */

import type { KycServicesResponse, VerificationService } from "../types";

/**
 * Check if mock data should be used.
 */
export const USE_MOCK_DATA =
	process.env.NEXT_PUBLIC_USE_MOCK_KYC === "true" ||
	process.env.NODE_ENV === "test";

/**
 * Mock KYC verification services with Form-compatible requestParams.
 */
export const MOCK_KYC_SERVICES: VerificationService[] = [
	{
		serviceCode: "27355",
		name: "PAN Lite",
		label: "Cashfree - Pan Lite",
		category: "Identity",
		description: "Verify PAN with name and DOB matching",
		icon: "credit-card",
		endpointPath: "/tools/kyc/pan-lite",
		requestParams: [
			{
				is_required: 1,
				name: "pan_number",
				label: "PAN Number",
				type: "string",
				placeholder: "Enter PAN Number (e.g., ABCDE1234F)",
				validations: {
					pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
					minLength: 10,
					maxLength: 10,
				},
			},
			{
				is_required: 1,
				name: "name",
				label: "Full Name",
				type: "string",
				placeholder: "Enter full name as per PAN",
				validations: {
					minLength: 3,
					maxLength: 100,
				},
			},
			{
				is_required: 1,
				name: "dob",
				label: "Date of Birth",
				type: "date",
				placeholder: "YYYY-MM-DD",
			},
		],
		supports_bulk_verification: true,
	},
	{
		serviceCode: "30985",
		name: "Verify GSTIN",
		label: "Cashfree - Verify GSTIN",
		category: "Financial",
		description: "Verify GSTIN and view business details",
		icon: "business-center",
		endpointPath: "/tools/kyc/gstin",
		requestParams: [
			{
				is_required: 1,
				name: "gstin",
				label: "GSTIN",
				type: "string",
				placeholder: "Enter 15-digit GSTIN",
				validations: {
					pattern:
						"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
					minLength: 15,
					maxLength: 15,
				},
			},
			{
				is_required: 1,
				name: "business_name",
				label: "Business Name",
				type: "string",
				placeholder: "Enter business name to verify",
				validations: {
					minLength: 3,
					maxLength: 200,
				},
			},
		],
		supports_bulk_verification: true,
	},
	{
		serviceCode: "98916",
		name: "Vehicle RC",
		label: "Cashfree - Vehicle RC",
		category: "Vehicle",
		description: "Verify vehicle details and registration information",
		icon: "directions-car",
		endpointPath: "/tools/kyc/vehicle-rc",
		requestParams: [
			{
				is_required: 1,
				name: "vehicle_number",
				label: "Vehicle Number",
				type: "string",
				placeholder: "Enter vehicle registration number",
				validations: {
					pattern: "^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$",
					minLength: 8,
					maxLength: 12,
				},
			},
		],
		supports_bulk_verification: true,
	},
	{
		serviceCode: "00881",
		name: "Driving License",
		label: "Cashfree - Driving License",
		category: "Identity",
		description:
			"Verify driving license details including validity and vehicle classes",
		icon: "directions-car",
		endpointPath: "/tools/kyc/driving-license",
		requestParams: [
			{
				is_required: 1,
				name: "dl_number",
				label: "DL Number",
				type: "string",
				placeholder: "Enter driving license number",
				validations: {
					minLength: 10,
					maxLength: 20,
				},
			},
			{
				is_required: 1,
				name: "dob",
				label: "Date of Birth",
				type: "date",
				placeholder: "YYYY-MM-DD",
			},
		],
		supports_bulk_verification: true,
	},
	{
		serviceCode: "84398",
		name: "Voter ID",
		label: "Cashfree - Voter ID",
		category: "Identity",
		description:
			"Verify voter ID details including constituency information",
		icon: "how-to-vote",
		endpointPath: "/tools/kyc/voter-id",
		requestParams: [
			{
				is_required: 1,
				name: "epic_number",
				label: "EPIC Number",
				type: "string",
				placeholder: "Enter EPIC number from Voter ID",
				validations: {
					pattern: "^[A-Z]{3}[0-9]{7}$",
					minLength: 10,
					maxLength: 10,
				},
			},
			{
				is_required: 1,
				name: "name",
				label: "Full Name",
				type: "string",
				placeholder: "Enter name as per Voter ID",
				validations: {
					minLength: 3,
					maxLength: 100,
				},
			},
		],
	},
	{
		serviceCode: "87043",
		name: "Passport",
		label: "Cashfree - Passport",
		category: "Identity",
		description: "Verify Indian passport details using file number and DOB",
		icon: "book",
		endpointPath: "/tools/kyc/passport",
		requestParams: [
			{
				is_required: 1,
				name: "file_number",
				label: "File Number",
				type: "string",
				placeholder: "Enter passport file number",
				validations: {
					minLength: 10,
					maxLength: 20,
				},
			},
			{
				is_required: 1,
				name: "dob",
				label: "Date of Birth",
				type: "date",
				placeholder: "YYYY-MM-DD",
			},
			{
				is_required: 1,
				name: "name",
				label: "Full Name",
				type: "string",
				placeholder: "Enter name as per passport",
				validations: {
					minLength: 3,
					maxLength: 100,
				},
			},
		],
		supports_bulk_verification: true,
	},
	{
		serviceCode: "70979",
		name: "CIN",
		label: "Cashfree - CIN",
		category: "Financial",
		description:
			"Verify Corporate Identification Number including business and director info",
		icon: "domain",
		endpointPath: "/tools/kyc/cin",
		requestParams: [
			{
				is_required: 1,
				name: "cin",
				label: "CIN",
				type: "string",
				placeholder: "Enter 21-character CIN",
				validations: {
					pattern:
						"^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$",
					minLength: 21,
					maxLength: 21,
				},
			},
		],
	},
	{
		serviceCode: "78302",
		name: "Employee Details",
		label: "Cashfree - Employee Details",
		category: "Employment",
		description:
			"Verify employee employment details including UAN and company information",
		icon: "badge",
		endpointPath: "/tools/kyc/employment",
		requestParams: [
			{
				is_required: 1,
				name: "uan",
				label: "UAN",
				type: "string",
				placeholder: "Enter 12-digit UAN",
				validations: {
					pattern: "^[0-9]{12}$",
					minLength: 12,
					maxLength: 12,
				},
			},
			{
				is_required: 1,
				name: "employee_name",
				label: "Employee Name",
				type: "string",
				placeholder: "Enter employee name",
				validations: {
					minLength: 3,
					maxLength: 100,
				},
			},
			{
				is_required: 1,
				name: "employer_name",
				label: "Employer Name",
				type: "string",
				placeholder: "Enter employer/company name",
				validations: {
					minLength: 3,
					maxLength: 200,
				},
			},
			{
				is_required: 1,
				name: "dob",
				label: "Date of Birth",
				type: "date",
				placeholder: "YYYY-MM-DD",
			},
			{
				is_required: 1,
				name: "phone",
				label: "Phone Number",
				type: "string",
				placeholder: "Enter 10-digit phone number",
				validations: {
					pattern: "^[6-9][0-9]{9}$",
					minLength: 10,
					maxLength: 10,
				},
			},
		],
	},
	{
		serviceCode: "86064",
		name: "Bank Account Verification",
		label: "Cashfree - Bank Account Verification",
		category: "Financial",
		description: "Verify bank account details with IFSC code",
		icon: "account-balance",
		endpointPath: "/tools/kyc/dummy-bank-account",
		requestParams: [
			{
				is_required: 1,
				name: "bank_account",
				label: "Bank Account Number",
				type: "string",
				placeholder: "Enter bank account number",
				validations: {
					pattern: "^[0-9]{9,18}$",
					minLength: 9,
					maxLength: 18,
				},
			},
			{
				is_required: 1,
				name: "ifsc",
				label: "IFSC Code",
				type: "string",
				placeholder: "Enter 11-character IFSC code",
				validations: {
					pattern: "^[A-Z]{4}0[A-Z0-9]{6}$",
					minLength: 11,
					maxLength: 11,
				},
			},
		],
		supports_bulk_verification: true,
	},
	{
		serviceCode: "35227",
		name: "IP Verification",
		label: "Cashfree - IP Verification",
		category: "Utility",
		description: "Get details about an IP address",
		icon: "language",
		endpointPath: "/tools/kyc/dummy-ip-verification",
		requestParams: [
			{
				is_required: 1,
				name: "ip_address",
				label: "IP Address",
				type: "string",
				placeholder: "Enter IP address (e.g., 192.168.1.1)",
				validations: {
					pattern:
						"^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
				},
			},
		],
	},
	{
		serviceCode: "80557",
		name: "Name Match",
		label: "Cashfree - Name Match",
		category: "Utility",
		description: "Compare two names to check if they match",
		icon: "compare",
		endpointPath: "/tools/kyc/dummy-name-match",
		requestParams: [
			{
				is_required: 1,
				name: "name_1",
				label: "Name 1",
				type: "string",
				placeholder: "Enter first name",
				validations: {
					minLength: 2,
					maxLength: 100,
				},
			},
			{
				is_required: 1,
				name: "name_2",
				label: "Name 2",
				type: "string",
				placeholder: "Enter second name to compare",
				validations: {
					minLength: 2,
					maxLength: 100,
				},
			},
		],
	},
	{
		serviceCode: "40768",
		name: "Reverse Geocoding",
		label: "Cashfree - Reverse Geocoding",
		category: "Utility",
		description: "Get address from latitude and longitude coordinates",
		icon: "location-on",
		endpointPath: "/tools/kyc/dummy-reverse-geocoding",
		requestParams: [
			{
				is_required: 1,
				name: "latitude",
				label: "Latitude",
				type: "string",
				placeholder: "Enter latitude (e.g., 28.6139)",
				validations: {
					pattern: "^-?([1-8]?[0-9]\\.\\d+|90\\.0+)$",
				},
			},
			{
				is_required: 1,
				name: "longitude",
				label: "Longitude",
				type: "string",
				placeholder: "Enter longitude (e.g., 77.2090)",
				validations: {
					pattern: "^-?((1[0-7][0-9]|[1-9]?[0-9])\\.\\d+|180\\.0+)$",
				},
			},
		],
	},
];

/**
 * Mock API response structure.
 */
export const MOCK_KYC_SERVICES_RESPONSE: KycServicesResponse = {
	response_status_id: 0,
	data: {
		verification_service_list: MOCK_KYC_SERVICES,
	},
	response_type_id: 2435,
	message: "Verification Services list fetch success",
	status: 0,
};

/**
 * Get a mock service by its code.
 * @param serviceCode
 */
export const getMockServiceByCode = (
	serviceCode: string
): VerificationService | undefined => {
	return MOCK_KYC_SERVICES.find((s) => s.serviceCode === serviceCode);
};

/**
 * Get mock services by their codes.
 * @param serviceCodes
 */
export const getMockServicesByCodes = (
	serviceCodes: string[]
): VerificationService[] => {
	return MOCK_KYC_SERVICES.filter((s) =>
		serviceCodes.includes(s.serviceCode)
	);
};
