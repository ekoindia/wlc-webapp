import { useEpsV3Fetch } from "hooks";
import { DK_BASE } from "../constants";

interface VerifySenderOtpPayload {
	otp: string;
	otp_ref_id: string;
}

interface VerifyDeleteRecipientOtpPayload {
	otp: string;
	otp_ref_id: string;
	recipient_id: number;
}

/**
 * All DigiKhata API calls, each backed by an independent useEpsV3Fetch instance.
 * @param mobile - The logged-in user's mobile number (customer_id)
 */
export const useDigiKhataApi = (mobile: string) => {
	const base = `${DK_BASE}/sender/${mobile}`;
	const senderProfileBase = `/customer/profile/${mobile}/ppi-digikhata`;
	const consentDetailsBase = `${base}/aadhaar/consent/details`;

	// ── Customer Account ─────────────────────────────────────────────────────
	const [createCustomerAccountCall, isCreatingCustomerAccount] =
		useEpsV3Fetch(`/customer/account/${mobile}`, {
			method: "POST",
		});

	// ── Sender Profile / Verification ────────────────────────────────────────
	const [generateSenderOtp, isGeneratingSenderOtp] = useEpsV3Fetch(
		senderProfileBase,
		{
			method: "GET",
		}
	);
	const [verifySenderOtpCall, isVerifyingSenderOtp] = useEpsV3Fetch(
		`${base}/otp/verify`,
		{
			method: "POST",
		}
	);

	const [verifySenderBankOtpCall, isVerifyingSenderBankOtp] = useEpsV3Fetch(
		`${base}/recipient/bank/otp/verify`,
		{
			method: "POST",
		}
	);

	// ── Consent ──────────────────────────────────────────────────────────────
	const [getConsentLanguagesCall, isGettingConsentLanguages] = useEpsV3Fetch(
		`${base}/aadhaar/consent/languages`,
		{ method: "GET" }
	);
	const [getConsentDetailsCall, isGettingConsentDetails] = useEpsV3Fetch(
		consentDetailsBase,
		{
			method: "GET",
		}
	);

	// ── Aadhaar ───────────────────────────────────────────────────────────────
	const [generateAadhaarOtpCall, isGeneratingAadhaarOtp] = useEpsV3Fetch(
		`${base}/aadhaar/otp`,
		{
			method: "POST",
		}
	);
	const [validateAadhaarOtpCall, isValidatingAadhaarOtp] = useEpsV3Fetch(
		`${base}/aadhaar/otp/verify`,
		{
			method: "POST",
		}
	);
	const [validateAadhaarBiometricCall, isValidatingAadhaarBiometric] =
		useEpsV3Fetch(`${base}/kyc/biometric`, {
			method: "POST",
		});

	// ── PAN ───────────────────────────────────────────────────────────────────
	const [validatePanCall, isValidatingPan] = useEpsV3Fetch(`${base}/pan`, {
		method: "POST",
	});

	const [createWalletCall, isCreatingWallet] = useEpsV3Fetch(
		`${base}/wallet/createwallet`,
		{
			method: "POST",
		}
	);

	// ── Wallet ────────────────────────────────────────────────────────────────
	const [loadWalletCall, isLoadingWallet] = useEpsV3Fetch(
		`${base}/wallet/loadwallet`,
		{
			method: "POST",
		}
	);

	// ── Recipients ────────────────────────────────────────────────────────────
	const [getRecipientsCall, isGettingRecipients] = useEpsV3Fetch(
		`${base}/recipients`,
		{
			method: "GET",
		}
	);
	const [sendDeleteRecipientOtpCall, isSendingDeleteRecipientOtp] =
		useEpsV3Fetch(`${base}/recipient/delete/otp`, { method: "POST" });

	const [verifyDeleteRecipientOtpCall, isVerifyingDeleteRecipientOtp] =
		useEpsV3Fetch(`${base}/recipient/delete/otp/verify`, {
			method: "POST",
		});
	const [sendAddRecipientOtpCall, isSendingAddRecipientOtp] = useEpsV3Fetch(
		`${base}/recipient`,
		{ method: "POST" }
	);

	const [sendRecipientBankOtpCall, isSendingRecipientBankOtp] = useEpsV3Fetch(
		`${base}/recipient/bank/otp`,
		{
			method: "POST",
		}
	);

	const [addRecipientCall, isAddingRecipient] = useEpsV3Fetch(
		`${base}/recipient`,
		{
			method: "POST",
		}
	);

	// ── Transaction ───────────────────────────────────────────────────────────
	const [sendTransactionOtpCall, isSendingTransactionOtp] = useEpsV3Fetch(
		`${DK_BASE}/otp`,
		{ method: "POST" }
	);
	const [initiateTransactionCall, isInitiatingTransaction] = useEpsV3Fetch(
		DK_BASE,
		{
			method: "POST",
		}
	);

	// ── Bound API functions ───────────────────────────────────────────────────

	const createCustomerAccount = (body: Record<string, unknown>) =>
		createCustomerAccountCall({
			body,
		});

	const verifySenderOtp = (body: VerifySenderOtpPayload) =>
		verifySenderOtpCall({
			body: {
				...body,
				service_code: 80,
				intent_id: 19,
			},
		});

	const verifySenderBankOtp = (body: VerifySenderOtpPayload) =>
		verifySenderBankOtpCall({
			body: {
				...body,
				service_code: 80,
				intent_id: 21,
			},
		});

	const getConsentLanguages = () => getConsentLanguagesCall();

	const getConsentDetails = (consentlangId: string) =>
		getConsentDetailsCall({
			headers: {
				"tf-req-uri": `${consentDetailsBase}?consent_language=${consentlangId}`,
			},
		});

	const generateAadhaarOtp = (body: Record<string, unknown>) =>
		generateAadhaarOtpCall({
			body,
		});

	const validateAadhaarOtp = (body: Record<string, unknown>) =>
		validateAadhaarOtpCall({
			body,
		});

	const validateAadhaarBiometric = (body: Record<string, unknown>) =>
		validateAadhaarBiometricCall({
			body,
		});

	const validatePan = (body: Record<string, unknown>) =>
		validatePanCall({
			body,
		});

	const createWallet = (body: Record<string, unknown>) =>
		createWalletCall({
			body,
		});

	const loadWallet = (body: Record<string, unknown>) =>
		loadWalletCall({
			body,
		});

	const getRecipients = () => getRecipientsCall();

	const sendDeleteRecipientOtp = (beneficiaryId: number) =>
		sendDeleteRecipientOtpCall({ body: { beneficiary_id: beneficiaryId } });

	const verifyDeleteRecipientOtp = (body: VerifyDeleteRecipientOtpPayload) =>
		verifyDeleteRecipientOtpCall({ body });

	const sendAddRecipientOtp = (body: Record<string, unknown>) =>
		sendAddRecipientOtpCall({
			body,
		});

	const addRecipient = (body: Record<string, unknown>) =>
		addRecipientCall({
			body,
		});

	const sendRecipientBankOtp = (body: Record<string, unknown>) =>
		sendRecipientBankOtpCall({
			body,
		});

	const sendTransactionOtp = (body: Record<string, unknown>) =>
		sendTransactionOtpCall({
			body,
		});

	const initiateTransaction = (body: Record<string, unknown>) =>
		initiateTransactionCall({
			body,
		});

	return {
		createCustomerAccount,
		isCreatingCustomerAccount,
		generateSenderOtp,
		isGeneratingSenderOtp,
		verifySenderOtp,
		isVerifyingSenderOtp,
		verifySenderBankOtp,
		isVerifyingSenderBankOtp,
		getConsentLanguages,
		isGettingConsentLanguages,
		getConsentDetails,
		isGettingConsentDetails,
		generateAadhaarOtp,
		isGeneratingAadhaarOtp,
		validateAadhaarOtp,
		isValidatingAadhaarOtp,
		validateAadhaarBiometric,
		isValidatingAadhaarBiometric,
		validatePan,
		isValidatingPan,
		createWallet,
		isCreatingWallet,
		loadWallet,
		isLoadingWallet,
		getRecipients,
		isGettingRecipients,
		sendDeleteRecipientOtp,
		isSendingDeleteRecipientOtp,
		verifyDeleteRecipientOtp,
		isVerifyingDeleteRecipientOtp,
		sendAddRecipientOtp,
		isSendingAddRecipientOtp,
		addRecipient,
		isAddingRecipient,
		sendRecipientBankOtp,
		isSendingRecipientBankOtp,
		sendTransactionOtp,
		isSendingTransactionOtp,
		initiateTransaction,
		isInitiatingTransaction,
	};
};
