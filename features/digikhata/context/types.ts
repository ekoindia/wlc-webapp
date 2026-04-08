/**
 * DigiKhata Wallet & Fund Transfer — State Types
 */

/** All navigable steps in the DigiKhata product flow */
export type DigiKhataStep =
	| "initial" // WalletCard + Fetch Balance CTA
	| "customer-onboarding" // Customer name entry for onboarding
	| "aadhaar-consent" // Aadhaar KYC consent screen
	| "aadhaar-verify" // Aadhaar number + OTP
	| "pan-verify" // PAN entry & validation
	| "wallet-dashboard" // Loaded wallet with Load/Transfer options
	| "load-wallet" // Load wallet form
	| "recipients" // Recipient list
	| "add-recipient" // Add recipient form
	| "fund-transfer" // Fund transfer amount + OTP confirm
	| "search-customer"; // Search/verify customer in assisted mode

/** KYC document verification statuses */
export interface WalletKYCDocStatus {
	aadharVerified: boolean;
	pancardVerified: boolean;
}

/** Raw API response from DigiKhata profile endpoint */
export interface DigiKhataApiResponse {
	response_status_id: number;
	data: {
		customer_profile: {
			total_monthly_limit: string;
			mobile: string;
			kyc_id: string;
			ekyc_enabled: number;
			kyc_validity: string;
			kyc_remark: string;
			kyc_type: string;
			balance: string;
			next_allowed_limit: string;
			name: string;
			digital_ekyc: number;
			chart: Array<{
				data_type_id: number;
				data: {
					unavailable: number;
					used: number;
					remaining: number;
				};
				label: string;
			}>;
			email: string;
			kyc_state: number;
		};
		wallet_token: string;
		id_proof_type_id: string;
		is_registered: number;
		id_proof: string;
		sender_name: string;
		next_allowed_limit: number;
		account: string;
		kyc_state: number;
	};
	response_type_id: number;
	message: string;
	status: number;
}

/** Wallet data returned from DigiKhata Verify Sender OTP API */
export interface WalletData {
	walletAcOpened: boolean;
	walletAcOpeningInProgress: boolean;
	walletHolderName: string;
	accountStatus: string;
	walletToBankLimitAvailable: number;
	walletToBankLimitConsumed: number;
	/** Total monthly transaction limit */
	totalMonthlyLimit: number;
	/** DigiKhata JWT token — stored for subsequent API calls */
	token: string;
	walletCurrentBalance: number;
	walletKYCDocStatus: WalletKYCDocStatus;
	/** ISO timestamp of when wallet data was last fetched */
	lastUpdatedAt: string;
}

/**
 * Transforms raw DigiKhata API response to WalletData interface
 * @param apiResponse
 */
export const transformToWalletData = (
	apiResponse: DigiKhataApiResponse
): WalletData => {
	const { data } = apiResponse;
	const { customer_profile, wallet_token, kyc_state } = data ?? {};

	// Extract chart data for limits
	const chartData = customer_profile?.chart?.[0]?.data;
	const consumed = chartData?.used ?? 0;
	const remaining = chartData?.remaining ?? 0;
	const totalLimit = parseFloat(customer_profile?.total_monthly_limit || "0");

	return {
		walletAcOpened: kyc_state == 0,
		// walletAcOpened: is_registered === 1,
		walletAcOpeningInProgress: false,
		walletHolderName: customer_profile?.name || data?.sender_name || "",
		accountStatus: customer_profile?.kyc_state == 0 ? "Active" : "Inactive", // TODO: This is not the correct status, need to confirm with backend on correct field for account status
		walletToBankLimitAvailable: remaining,
		walletToBankLimitConsumed: consumed,
		totalMonthlyLimit: totalLimit,
		token: wallet_token || "",
		walletCurrentBalance: parseFloat(customer_profile?.balance || "0"),
		walletKYCDocStatus: {
			aadharVerified: customer_profile?.digital_ekyc === 1,
			pancardVerified: customer_profile?.kyc_type === "PAN",
		},
		lastUpdatedAt: new Date().toISOString(),
	};
};

/** Raw recipient data from DigiKhata API */
export interface RecipientApiResponse {
	bank_recipient_id: number | null;
	channel_absolute: number;
	available_channel: number;
	account_type: string;
	ifsc_status: number;
	is_self_account: string;
	channel: number;
	is_imps_scheduled: number;
	recipient_id_type: string;
	imps_inactive_reason: string;
	allowed_channel: number;
	is_verified: number;
	beneficiary_id: number | null;
	bank: string;
	is_otp_required: string;
	recipient_mobile: string | null;
	recipient_name: string;
	ifsc: string;
	account: string;
	pipes: Record<string, { pipe: number; status: number }>;
	recipient_id: number;
	is_rblbc_recipient: number;
}

/** A registered recipient / beneficiary for fund transfer */
export interface Recipient {
	/** Unique recipient identifier */
	recipient_id: number;
	/** Bank beneficiary ID if registered with bank */
	bank_recipient_id: number | null;
	/** Recipient display name */
	name: string;
	/** Masked bank account number */
	accountNumber: string;
	/** IFSC code */
	ifsc: string;
	/** Bank name */
	bankName: string;
	/** Account type (Bank Account, etc.) */
	accountType: string;
	/** Whether recipient is verified */
	isVerified: boolean;
	/** Recipient mobile number (masked) */
	mobile: string | null;
	/** Type of recipient ID (acc_ifsc, mobile_number) */
	recipientIdType: string;
	/** Transient flag — true right after adding, triggers highlight animation */
	isNew?: boolean;
	/** Original beneficiary_id for backwards compatibility */
	beneficiary_id: number | null;
}

/**
 * Transforms raw recipient API data to Recipient interface
 * @param apiRecipient
 */
export const transformToRecipient = (
	apiRecipient: RecipientApiResponse
): Recipient => ({
	recipient_id: apiRecipient.recipient_id,
	bank_recipient_id: apiRecipient.bank_recipient_id,
	name: apiRecipient.recipient_name,
	accountNumber: apiRecipient.account,
	ifsc: apiRecipient.ifsc,
	bankName: apiRecipient.bank,
	accountType: apiRecipient.account_type,
	isVerified: apiRecipient.is_verified === 1,
	mobile: apiRecipient.recipient_mobile,
	recipientIdType: apiRecipient.recipient_id_type,
	beneficiary_id: apiRecipient.beneficiary_id,
});

/**
 * Transforms raw recipient list from API to Recipient array
 * @param apiResponse
 * @param apiResponse.recipient_list
 */
export const transformRecipientList = (apiResponse: {
	recipient_list: RecipientApiResponse[];
}): Recipient[] => {
	return (apiResponse.recipient_list ?? []).map(transformToRecipient);
};

/** Aadhaar consent language entry returned by the consent languages API */
export interface ConsentLanguage {
	pkid: string;
	consentLanguage: string;
}

/** Consent details returned by the consent details API */
export interface ConsentDetails {
	consent: string;
	consentContent: string;
	audioUrl: string;
	consentId: string;
}

/** Full DigiKhata product state */
export interface DigiKhataState {
	step: DigiKhataStep;
	walletData: WalletData | null;
	otpRefId: string | null;
	consentId: string | null;
	consentLangId: string | null;
	aadhaarNumber: string;
	/** intent_id from generateAadhaarOtp response, needed for validateAadhaarOtp */
	aadhaarIntentId: number | null;
	/** otp_ref_id from generateAadhaarOtp response, needed for validateAadhaarOtp */
	aadhaarOtpRefId: string | null;
	recipients: Recipient[];
	selectedRecipient: Recipient | null;
	isLoading: boolean;
	error: string | null;
	/** true once wallet has been fetched at least once — controls button label */
	hasFetchedWallet: boolean;
	/** Flow mode — "self" for agent's own wallet, "assisted" for customer wallet */
	mode: "self" | "assisted";
	/** Mobile number used for all API calls (agent's own in self mode, customer's in assisted mode) */
	activeMobile: string;
	/** Aadhaar KYC flow selected by user: Via OTP or Via Biometrics */
	aadhaarKycMethod: "otp" | "biometrics" | null;
}

/** All reducer action types */
export type Action =
	| { type: "SET_STEP"; step: DigiKhataStep }
	| { type: "SET_WALLET_DATA"; payload: WalletData }
	| { type: "SET_OTP_REF_ID"; payload: string | null }
	| { type: "SET_CONSENT_ID"; payload: string }
	| { type: "SET_CONSENT_LANG_ID"; payload: string }
	| { type: "SET_AADHAAR_NUMBER"; payload: string }
	| {
			type: "SET_AADHAAR_OTP_DATA";
			payload: { intentId: number; otpRefId: string };
	  }
	| { type: "SET_RECIPIENTS"; payload: Recipient[] }
	| { type: "ADD_RECIPIENT"; payload: Recipient }
	| { type: "REMOVE_RECIPIENT"; payload: number }
	| { type: "SET_SELECTED_RECIPIENT"; payload: Recipient | null }
	| {
			type: "UPDATE_RECIPIENT_BENEFICIARY";
			payload: { recipient_id: number; beneficiary_id: number };
	  }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "RESET_ERROR" }
	| { type: "SET_MODE"; payload: "self" | "assisted" }
	| { type: "SET_ACTIVE_MOBILE"; payload: string }
	| { type: "SET_AADHAAR_KYC_METHOD"; payload: "otp" | "biometrics" | null };

/** Default initial state */
export const initialState: DigiKhataState = {
	step: "initial",
	walletData: null,
	otpRefId: null,
	consentId: null,
	consentLangId: null,
	aadhaarNumber: "",
	aadhaarIntentId: null,
	aadhaarOtpRefId: null,
	recipients: [],
	selectedRecipient: null,
	isLoading: false,
	error: null,
	hasFetchedWallet: false,
	mode: "self",
	activeMobile: "",
	aadhaarKycMethod: null,
};
