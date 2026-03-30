/**
 * DigiKhata Wallet & Fund Transfer — State Types
 */

/** All navigable steps in the DigiKhata product flow */
export type DigiKhataStep =
	| "initial" // WalletCard + Fetch Balance CTA
	| "aadhaar-consent" // Aadhaar KYC consent screen
	| "aadhaar-verify" // Aadhaar number + OTP
	| "pan-verify" // PAN entry & validation
	| "wallet-dashboard" // Loaded wallet with Load/Transfer options
	| "load-wallet" // Load wallet form
	| "recipients" // Recipient list
	| "add-recipient" // Add recipient form
	| "fund-transfer"; // Fund transfer amount + OTP confirm

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
	const { customer_profile, wallet_token, is_registered } = data;

	// Extract chart data for limits
	const chartData = customer_profile.chart?.[0]?.data;
	const consumed = chartData?.used ?? 0;
	const remaining = chartData?.remaining ?? 0;
	const totalLimit = parseFloat(customer_profile.total_monthly_limit || "0");

	return {
		walletAcOpened: is_registered === 1,
		walletAcOpeningInProgress: false,
		walletHolderName: customer_profile.name || data.sender_name || "",
		accountStatus: customer_profile.kyc_state === 1 ? "Active" : "Inactive",
		walletToBankLimitAvailable: remaining,
		walletToBankLimitConsumed: consumed,
		totalMonthlyLimit: totalLimit,
		token: wallet_token || "",
		walletCurrentBalance: parseFloat(customer_profile.balance || "0"),
		walletKYCDocStatus: {
			aadharVerified: customer_profile.digital_ekyc === 1,
			pancardVerified: customer_profile.kyc_type === "PAN",
		},
		lastUpdatedAt: new Date().toISOString(),
	};
};

/** A registered recipient / beneficiary for fund transfer */
export interface Recipient {
	/** 0 = not yet registered with bank, must re-register before transfer */
	beneficiary_id: number;
	name: string;
	accountNumber: string;
	ifsc: string;
	bankName: string;
	/** Transient flag — true right after adding, triggers highlight animation */
	isNew?: boolean;
}

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
	recipients: Recipient[];
	selectedRecipient: Recipient | null;
	isLoading: boolean;
	error: string | null;
	/** true once wallet has been fetched at least once — controls button label */
	hasFetchedWallet: boolean;
}

/** All reducer action types */
export type Action =
	| { type: "SET_STEP"; step: DigiKhataStep }
	| { type: "SET_WALLET_DATA"; payload: WalletData }
	| { type: "SET_OTP_REF_ID"; payload: string | null }
	| { type: "SET_CONSENT_ID"; payload: string }
	| { type: "SET_CONSENT_LANG_ID"; payload: string }
	| { type: "SET_AADHAAR_NUMBER"; payload: string }
	| { type: "SET_RECIPIENTS"; payload: Recipient[] }
	| { type: "ADD_RECIPIENT"; payload: Recipient }
	| { type: "SET_SELECTED_RECIPIENT"; payload: Recipient | null }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "RESET_ERROR" };

/** Default initial state */
export const initialState: DigiKhataState = {
	step: "initial",
	walletData: null,
	otpRefId: null,
	consentId: null,
	consentLangId: null,
	aadhaarNumber: "",
	recipients: [],
	selectedRecipient: null,
	isLoading: false,
	error: null,
	hasFetchedWallet: false,
};
