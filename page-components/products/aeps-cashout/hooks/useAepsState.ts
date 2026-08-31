import { useMemo, useReducer } from "react";
import type {
	AepsInteractionResponse,
	AepsOtpContext,
	AepsPaymentModeId,
	AepsProviderId,
	AepsStepId,
} from "../contracts";

export interface AepsState {
	step: AepsStepId;
	provider: AepsProviderId | null;
	clientRefId: string;
	latLong: string | null;

	// Daily Authentication (interaction 594) — the AGENT's own identity.
	agentAadhaar: string;
	agentBankCode: string;
	agentPidBlock: string | null;

	// Complete-KYC chain (614 -> 615 -> 616) — see contracts.ts's
	// VerifyKycOtpPayload/CompleteKycBiometricPayload for why these are
	// carried in state rather than re-collected/re-encrypted at each step.
	kycEncryptedAadhaar: string | null;
	kycOtp: string;
	kycOtpRefId: string | null;
	kycReferenceTid: string | null;
	kycBankCode: string;
	kycPidBlock: string | null;

	// Payment Mode (catalog 9001, local/no-API step).
	paymentMode: AepsPaymentModeId | null;

	// Search Customer (interaction 150).
	customerId: string;

	// Cashout (interaction 344) — the CUSTOMER's fields, captured at this step.
	bankCode: string;
	amount: string;
	customerAadhaar: string;
	pidBlock: string | null;
	smsReceiptOptIn: boolean;

	searchResponse: AepsInteractionResponse | null;
	cashoutResponse: AepsInteractionResponse | null;
	txnRefId: string | null;
	otpAttempts: number;
	/** Which backend call `submitOtp` should make — see AepsOtpContext in contracts.ts. */
	otpContext: AepsOtpContext | null;
	/**
	 * Which flow reached the shared "result" step — the KYC chain
	 * (614->615->616) can land here too, not just Cashout, so ResultScreen
	 * needs to know which copy/routing to show. Defaults to "cashout" since
	 * that's the original/majority path.
	 */
	resultContext: "cashout" | "kyc";
	status: "idle" | "loading" | "error" | "success" | "pending" | "retry";
	error: string | null;
}

export type AepsAction =
	| { type: "SET_STEP"; payload: AepsStepId }
	| { type: "SET_PROVIDER"; payload: AepsProviderId }
	| { type: "SET_LOCATION"; payload: string }
	| { type: "SET_AGENT_AADHAAR"; payload: string }
	| { type: "SET_AGENT_BANK_CODE"; payload: string }
	| { type: "SET_AGENT_PID_BLOCK"; payload: string | null }
	| { type: "SET_KYC_ENCRYPTED_AADHAAR"; payload: string | null }
	| { type: "SET_KYC_OTP"; payload: string }
	| { type: "SET_KYC_OTP_REF_ID"; payload: string | null }
	| { type: "SET_KYC_REFERENCE_TID"; payload: string | null }
	| { type: "SET_KYC_BANK_CODE"; payload: string }
	| { type: "SET_KYC_PID_BLOCK"; payload: string | null }
	| { type: "SET_PAYMENT_MODE"; payload: AepsPaymentModeId }
	| { type: "SET_CUSTOMER_ID"; payload: string }
	| { type: "SET_BANK_CODE"; payload: string }
	| { type: "SET_AMOUNT"; payload: string }
	| { type: "SET_CUSTOMER_AADHAAR"; payload: string }
	| { type: "SET_PID_BLOCK"; payload: string | null }
	| { type: "SET_SMS_RECEIPT_OPT_IN"; payload: boolean }
	| { type: "SET_SEARCH_RESPONSE"; payload: AepsInteractionResponse | null }
	| { type: "SET_CASHOUT_RESPONSE"; payload: AepsInteractionResponse | null }
	| { type: "SET_TXN_REF_ID"; payload: string | null }
	| { type: "SET_OTP_CONTEXT"; payload: AepsOtpContext | null }
	| { type: "SET_RESULT_CONTEXT"; payload: AepsState["resultContext"] }
	| { type: "INCREMENT_OTP_ATTEMPTS" }
	| { type: "SET_STATUS"; payload: AepsState["status"] }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "RESET" };

export interface AepsStateHook {
	state: AepsState;
	dispatch: (_action: AepsAction) => void;
	actions: {
		setStep: (_step: AepsStepId) => void;
		setProvider: (_provider: AepsProviderId) => void;
		setLocation: (_latLong: string) => void;
		setAgentAadhaar: (_aadhaar: string) => void;
		setAgentBankCode: (_bankCode: string) => void;
		setAgentPidBlock: (_pidBlock: string | null) => void;
		setKycEncryptedAadhaar: (_aadhaar: string | null) => void;
		setKycOtp: (_otp: string) => void;
		setKycOtpRefId: (_otpRefId: string | null) => void;
		setKycReferenceTid: (_referenceTid: string | null) => void;
		setKycBankCode: (_bankCode: string) => void;
		setKycPidBlock: (_pidBlock: string | null) => void;
		setPaymentMode: (_mode: AepsPaymentModeId) => void;
		setCustomerId: (_customerId: string) => void;
		setBankCode: (_bankCode: string) => void;
		setAmount: (_amount: string) => void;
		setCustomerAadhaar: (_aadhaar: string) => void;
		setPidBlock: (_pidBlock: string | null) => void;
		setSmsReceiptOptIn: (_optIn: boolean) => void;
		setSearchResponse: (_response: AepsInteractionResponse | null) => void;
		setCashoutResponse: (_response: AepsInteractionResponse | null) => void;
		setTxnRefId: (_txnRefId: string | null) => void;
		setOtpContext: (_context: AepsOtpContext | null) => void;
		setResultContext: (_context: AepsState["resultContext"]) => void;
		incrementOtpAttempts: () => void;
		setStatus: (_status: AepsState["status"]) => void;
		setError: (_error: string | null) => void;
		reset: () => void;
	};
}

const generateClientRefId = (): string =>
	// Reused across every call within one flow (doc §5.2).
	`${Date.now()}${Math.floor(Math.random() * 10000)}`;

const buildInitialState = (): AepsState => ({
	step: "provider",
	provider: null,
	clientRefId: generateClientRefId(),
	latLong: null,
	agentAadhaar: "",
	agentBankCode: "",
	agentPidBlock: null,
	kycEncryptedAadhaar: null,
	kycOtp: "",
	kycOtpRefId: null,
	kycReferenceTid: null,
	kycBankCode: "",
	kycPidBlock: null,
	paymentMode: null,
	customerId: "",
	bankCode: "",
	amount: "",
	customerAadhaar: "",
	pidBlock: null,
	smsReceiptOptIn: false,
	searchResponse: null,
	cashoutResponse: null,
	txnRefId: null,
	otpAttempts: 0,
	otpContext: null,
	resultContext: "cashout",
	status: "idle",
	error: null,
});

/**
 *
 * @param state
 * @param action
 */
function aepsReducer(state: AepsState, action: AepsAction): AepsState {
	switch (action.type) {
		case "SET_STEP":
			return { ...state, step: action.payload };
		case "SET_PROVIDER":
			return { ...state, provider: action.payload };
		case "SET_LOCATION":
			return { ...state, latLong: action.payload };
		case "SET_AGENT_AADHAAR":
			return { ...state, agentAadhaar: action.payload };
		case "SET_AGENT_BANK_CODE":
			return { ...state, agentBankCode: action.payload };
		case "SET_AGENT_PID_BLOCK":
			return { ...state, agentPidBlock: action.payload };
		case "SET_KYC_ENCRYPTED_AADHAAR":
			return { ...state, kycEncryptedAadhaar: action.payload };
		case "SET_KYC_OTP":
			return { ...state, kycOtp: action.payload };
		case "SET_KYC_OTP_REF_ID":
			return { ...state, kycOtpRefId: action.payload };
		case "SET_KYC_REFERENCE_TID":
			return { ...state, kycReferenceTid: action.payload };
		case "SET_KYC_BANK_CODE":
			return { ...state, kycBankCode: action.payload };
		case "SET_KYC_PID_BLOCK":
			return { ...state, kycPidBlock: action.payload };
		case "SET_PAYMENT_MODE":
			return { ...state, paymentMode: action.payload };
		case "SET_CUSTOMER_ID":
			return { ...state, customerId: action.payload };
		case "SET_BANK_CODE":
			return { ...state, bankCode: action.payload };
		case "SET_AMOUNT":
			return { ...state, amount: action.payload };
		case "SET_CUSTOMER_AADHAAR":
			return { ...state, customerAadhaar: action.payload };
		case "SET_PID_BLOCK":
			return { ...state, pidBlock: action.payload };
		case "SET_SMS_RECEIPT_OPT_IN":
			return { ...state, smsReceiptOptIn: action.payload };
		case "SET_SEARCH_RESPONSE":
			return { ...state, searchResponse: action.payload };
		case "SET_CASHOUT_RESPONSE":
			return { ...state, cashoutResponse: action.payload };
		case "SET_TXN_REF_ID":
			return { ...state, txnRefId: action.payload };
		case "SET_OTP_CONTEXT":
			return { ...state, otpContext: action.payload };
		case "SET_RESULT_CONTEXT":
			return { ...state, resultContext: action.payload };
		case "INCREMENT_OTP_ATTEMPTS":
			return { ...state, otpAttempts: state.otpAttempts + 1 };
		case "SET_STATUS":
			return { ...state, status: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload };
		case "RESET":
			return buildInitialState();
		default:
			return state;
	}
}

/**
 * Reducer-backed state for the AePS cashout flow. Mirrors the
 * `useOnboardingState` pattern (features/onboarding/hooks/useOnboardingState.ts).
 */
export const useAepsState = (): AepsStateHook => {
	const [state, dispatch] = useReducer(
		aepsReducer,
		undefined,
		buildInitialState
	);

	// Memoized so consumers get stable function references across renders —
	// e.g. LocationCapture's `onCaptured` effect dep re-fires whenever that
	// callback's identity changes, which without this would loop forever
	// (dispatch -> new `actions` object -> new callback identity -> effect
	// fires -> dispatch...). `dispatch` itself is stable per React's
	// useReducer contract, so an empty dep array is correct here.
	const actions: AepsStateHook["actions"] = useMemo(
		() => ({
			setStep: (step) => dispatch({ type: "SET_STEP", payload: step }),
			setProvider: (provider) =>
				dispatch({ type: "SET_PROVIDER", payload: provider }),
			setLocation: (latLong) =>
				dispatch({ type: "SET_LOCATION", payload: latLong }),
			setAgentAadhaar: (aadhaar) =>
				dispatch({ type: "SET_AGENT_AADHAAR", payload: aadhaar }),
			setAgentBankCode: (bankCode) =>
				dispatch({ type: "SET_AGENT_BANK_CODE", payload: bankCode }),
			setAgentPidBlock: (pidBlock) =>
				dispatch({ type: "SET_AGENT_PID_BLOCK", payload: pidBlock }),
			setKycEncryptedAadhaar: (aadhaar) =>
				dispatch({
					type: "SET_KYC_ENCRYPTED_AADHAAR",
					payload: aadhaar,
				}),
			setKycOtp: (otp) => dispatch({ type: "SET_KYC_OTP", payload: otp }),
			setKycOtpRefId: (otpRefId) =>
				dispatch({ type: "SET_KYC_OTP_REF_ID", payload: otpRefId }),
			setKycReferenceTid: (referenceTid) =>
				dispatch({
					type: "SET_KYC_REFERENCE_TID",
					payload: referenceTid,
				}),
			setKycBankCode: (bankCode) =>
				dispatch({ type: "SET_KYC_BANK_CODE", payload: bankCode }),
			setKycPidBlock: (pidBlock) =>
				dispatch({ type: "SET_KYC_PID_BLOCK", payload: pidBlock }),
			setPaymentMode: (mode) =>
				dispatch({ type: "SET_PAYMENT_MODE", payload: mode }),
			setCustomerId: (customerId) =>
				dispatch({ type: "SET_CUSTOMER_ID", payload: customerId }),
			setBankCode: (bankCode) =>
				dispatch({ type: "SET_BANK_CODE", payload: bankCode }),
			setAmount: (amount) =>
				dispatch({ type: "SET_AMOUNT", payload: amount }),
			setCustomerAadhaar: (aadhaar) =>
				dispatch({ type: "SET_CUSTOMER_AADHAAR", payload: aadhaar }),
			setPidBlock: (pidBlock) =>
				dispatch({ type: "SET_PID_BLOCK", payload: pidBlock }),
			setSmsReceiptOptIn: (optIn) =>
				dispatch({ type: "SET_SMS_RECEIPT_OPT_IN", payload: optIn }),
			setSearchResponse: (response) =>
				dispatch({ type: "SET_SEARCH_RESPONSE", payload: response }),
			setCashoutResponse: (response) =>
				dispatch({ type: "SET_CASHOUT_RESPONSE", payload: response }),
			setTxnRefId: (txnRefId) =>
				dispatch({ type: "SET_TXN_REF_ID", payload: txnRefId }),
			setOtpContext: (context) =>
				dispatch({ type: "SET_OTP_CONTEXT", payload: context }),
			setResultContext: (context) =>
				dispatch({ type: "SET_RESULT_CONTEXT", payload: context }),
			incrementOtpAttempts: () =>
				dispatch({ type: "INCREMENT_OTP_ATTEMPTS" }),
			setStatus: (status) =>
				dispatch({ type: "SET_STATUS", payload: status }),
			setError: (error) =>
				dispatch({ type: "SET_ERROR", payload: error }),
			reset: () => dispatch({ type: "RESET" }),
		}),
		[]
	);

	return { state, dispatch, actions };
};
