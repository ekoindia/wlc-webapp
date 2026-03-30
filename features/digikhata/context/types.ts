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

/** Wallet data returned from DigiKhata Verify Sender OTP API */
export interface WalletData {
	walletAcOpened: boolean;
	walletAcOpeningInProgress: boolean;
	walletHolderName: string;
	accountStatus: string;
	walletToBankLimitAvailable: number;
	walletToBankLimitConsumed: number;
	/** DigiKhata JWT token — stored for subsequent API calls */
	token: string;
	walletCurrentBalance: number;
	walletKYCDocStatus: WalletKYCDocStatus;
	/** ISO timestamp of when wallet data was last fetched */
	lastUpdatedAt: string;
}

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
