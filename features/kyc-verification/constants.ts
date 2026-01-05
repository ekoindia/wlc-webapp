/**
 * Constants for the KYC Verification feature.
 */

/** LocalStorage key for multi-service state */
export const KYC_MULTI_SERVICE_STORAGE_KEY = "kyc_multi_service_state";

/** Default category value for "All" tab */
export const ALL_CATEGORIES_VALUE = "all";

/** Default category label for "All" tab */
export const ALL_CATEGORIES_LABEL = "All";

/** Category for services without a category */
export const UNCATEGORIZED_VALUE = "other";
export const UNCATEGORIZED_LABEL = "Other";

/** Icon mapping for services without icons (based on category or service name) */
export const DEFAULT_SERVICE_ICONS: Record<string, string> = {
	// By category
	Identity: "fingerprint",
	Financial: "account-balance",
	Employment: "badge",
	Vehicle: "directions-car",
	DigiLocker: "folder-shared",
	Utility: "settings",
	// By common service names
	PAN: "credit-card",
	GSTIN: "business-center",
	"Driving License": "directions-car",
	Passport: "book",
	"Voter ID": "how-to-vote",
	"Vehicle RC": "directions-car",
	CIN: "domain",
	"Bank Account": "account-balance",
	Employee: "badge",
};

/** Default icon when no match is found */
export const DEFAULT_ICON = "verified";

/** API interaction type ID for fetching KYC services */
export const KYC_SERVICES_INTERACTION_ID = 1041;

/** API interaction type ID for downloading KYC verification report */
export const KYC_REPORT_DOWNLOAD_INTERACTION_ID = 1042;

/** Response type ID indicating successful bulk upload */
export const BULK_UPLOAD_SUCCESS_RESPONSE_TYPE_ID = "2406";

/** Session timeout for multi-service state (30 minutes) */
export const MULTI_SERVICE_SESSION_TIMEOUT_MS = 30 * 60 * 1000;
