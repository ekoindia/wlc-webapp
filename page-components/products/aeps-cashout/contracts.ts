/**
 * Shared type contracts for the AePS cashout flow.
 * See docs/aeps-cashout-flow.md for the interaction map this mirrors.
 */

export type AepsStepId =
	| "provider"
	| "fingpayStatus"
	| "chooseDevice"
	| "completeKyc"
	| "verifyKycOtp"
	| "completeKycBiometric"
	| "dailyAuth"
	| "paymentMode"
	| "search"
	| "otp"
	| "cashout"
	| "result";

export interface AepsServices {
	accessToken: string;
	generateNewToken?: (_logoutOnFailure?: boolean) => boolean;
	userCode: string;
	initiatorId: string;
	orgId: string;
	realSourceIp?: string;
}

/** Fields common to every `ekoicici/v2/request` call (doc §2). */
export interface AepsEnvelopeInput {
	interactionTypeId: string | number;
	customerId?: string;
	latLong?: string;
	clientRefId?: string;
}

export interface AepsInteractionResponse<T = Record<string, unknown>> {
	status?: number;
	response_type_id?: number;
	response_status_id?: number;
	message?: string;
	data?: T;
	[key: string]: unknown;
}

/**
 * Interaction 150 (Search Customer) only needs the customer's mobile number,
 * which already travels as `customerId` on the shared envelope — confirmed
 * via `request_structure` for catalog id 482 (no amount/aadhar/bank_code).
 * `otp_ref_id` is a fixed/empty field on first search per the DB row.
 */
export interface SearchCustomerPayload {
	otp_ref_id?: string;
}

/**
 * Interaction 594 ("AePS Daily Authentication") — the AGENT re-verifies
 * their own* identity once/day before Fingpay will process any customer
 * transaction. Do not confuse `aadhar`/`piddata` here with the customer's.
 * SECURITY: `aadhar` here must be RSA-encrypted client-side before this
 * payload is built — confirmed live that `request_structure.enc_pub_key` is
 * populated for this field (catalog 994), delivered via
 * `getAadhaarPublicKey()` (services/aepsService.ts) and applied via
 * `utils/rsaEncrypt.ts`; callers (AepsContext.submitDailyAuth) must never
 * put the plaintext Aadhaar number into this field.
 */
export interface DailyAuthPayload {
	aadhar: string;
	bank_code: string;
	piddata: string;
	isirisauth?: string;
	isfaceauth?: string;
	is_face_auth_available?: string;
}

/**
 * Catalog 614 ("Complete Your KYC", reachable from Fingpay Status's 1601
 * outcome and from Search Customer's 309 outcome — wire interaction_type_id
 * 540). Only needs the AGENT's own Aadhaar + location, no piddata/bank_code
 * (fields: service_code, latlong, aadhar, customer_id[auto-injected]).
 * SECURITY: same RSA-encryption requirement as DailyAuthPayload/CashoutPayload
 * - never put the plaintext Aadhaar number into this field.
 *
 * NOT actually a one-shot completion despite the label — its real endpoint
 * is `GET /aeps/otp` (it just SENDS an OTP), and its only documented
 * response (1600) auto-chains to catalog 615 "Verify OTP" -> 616 "Complete
 * Biometric Process". See VerifyKycOtpPayload/CompleteKycBiometricPayload
 * below for the rest of this chain. `submitCompleteKyc` treats
 * `response_type_id === 1600` specifically as success (not a bare non-error
 * status), and hands off `otp_ref_id`/`reference_tid` from that response
 * into step 2.
 *
 * KNOWN BACKEND ISSUE: live testing of 540 across multiple accounts and
 * Aadhaar values consistently hits `response_type_id 461`,
 * `data.reason: 'For input string: "<char>"'` — a NumberFormatException that
 * is only a secondary symptom. The root cause, confirmed via SimpliBank's own
 * server log, is `javax.crypto.BadPaddingException: Padding error in
 * decryption` inside `ApiRequestAction.decryptSecureData` — i.e. the
 * server-side RSA decryption of `aadhar` fails outright, and the exception
 * handler doesn't abort cleanly; it falls through to code that tries to
 * parse the still-encrypted ciphertext as a plain number, producing the
 * NumberFormatException actually surfaced to the client.
 *
 * A BadPaddingException on decrypt means the ciphertext was encrypted with a
 * public key that doesn't pair with whatever private key the server used to
 * decrypt. The public key connect-api serves for catalog 614 is
 * byte-identical to catalog 994's (Daily Auth, a working endpoint), which
 * rules out a connect-api key-serving bug or a client-side encryption bug.
 * This points at a keystore/config mismatch specific to the `/aeps/otp`
 * handler on SimpliBank's side — not fixable from the client, and not
 * something steps 2/3 below can work around, since 540 never reaches a real
 * 1600 response for them to receive. The UI surfaces the raw reason verbatim
 * (rather than a generic message) on purpose, for exactly this diagnostic
 * value.
 */
export interface CompleteKycPayload {
	aadhar: string;
}

/**
 * Catalog 615 "Verify OTP" (wire interaction_type_id 542, `GET
 * /aeps/otp/verify`) — step 2 of the Complete-KYC chain, reached only after
 * 614/540 returns `1600`. `otp_ref_id` and `reference_tid` come from that
 * 1600 response (exact field names unconfirmed until 540 succeeds end to
 * end — `submitVerifyKycOtp` defensively checks a few likely field names,
 * see its comment). `aadhar` must be the SAME already-encrypted string sent
 * in step 1 — the schema's own chain definition marks `aadhar` as forwarded
 * automatically (`source_id: 2, is_value_hidden: "1"`), not re-collected
 * from the user, so this flow keeps the step-1 ciphertext in state and
 * reuses it verbatim rather than re-encrypting.
 */
export interface VerifyKycOtpPayload {
	otp: string;
	otp_ref_id: string;
	reference_tid: string;
	aadhar: string;
	geolocation?: string;
}

/**
 * Catalog 616 "Complete Biometric Process" (wire interaction_type_id 543,
 * `GET /aeps/kyc`) — step 3 (final) of the Complete-KYC chain, reached only
 * after 615/542 returns `1604`. Needs a bank selection (same
 * `api_interaction_type_id: 155` bank-list mechanism as DailyAuthPayload's
 * `bank_code`) and a real fingerprint scan (`piddata`, same UIDAI RD-service
 * flow as DailyAuth/Cashout). `otp_ref_id`/`reference_tid`/`aadhar` are
 * forwarded the same way as in VerifyKycOtpPayload above - carried in state
 * from steps 1/2, not re-collected here.
 */
export interface CompleteKycBiometricPayload {
	bank_code: string;
	piddata: string;
	otp_ref_id: string;
	reference_tid: string;
	aadhar: string;
}

/**
 * Interaction 344 (AePS Cashout) — confirmed request fields (12-field
 * `request_structure` row set for catalog id 483). `aadhar` here is the
 * customer's* typed Aadhaar number (a plain numeric field, distinct from
 * `piddata`, the customer's biometric capture taken fresh at this step).
 * SECURITY: must be RSA-encrypted client-side before being put into this
 * payload — see DailyAuthPayload's note above; same mechanism, same
 * `getAadhaarPublicKey()`/`rsaEncrypt()` helpers, different catalog id (483).
 */
export interface CashoutPayload {
	amount: string;
	aadhar: string;
	bank_code: string;
	piddata: string;
	/** SMS receipt opt-in ("1"/"0") — adds a ₹0.50 charge per the DB's param description. */
	config_value?: string;
	otp_ref_id?: string;
	/**
	 * Required — live-confirmed by directly calling interaction_type_id 344:
	 * omitting this field (or sending "" / "1") returns a bare
	 * `{"message":"No key for Response"}` with no `response_type_id` at all,
	 * so it can't even be routed by `CASHOUT_OUTCOME`. "2" (Cash Withdrawal)
	 * is the only value confirmed working so far.
	 */
	type: string;
}

/**
 * Which OTP flow is currently active when `state.step === "otp"` — this
 * single step/component is shared by two unrelated backend calls:
 * - "customerVerify": interaction 103 (catalog 485), reached from Search
 *   Customer's 339 ("not verified") outcome. Confirmed working.
 * - "cashoutThreshold": bank-side OTP required on the cashout amount itself
 *   (signalled via `data.comment` on a 344/1464 response — see
 *   `OTP_THRESHOLD_COMMENT_PATTERN` in constants.ts). The resubmission
 *   mechanism (`AEPS_INTERACTION.CASHOUT_OTP_VERIFY`/`txnOtpRequestId`) is
 *   NOT confirmed yet — this context exists so `submitOtp` doesn't
 *   accidentally call interaction 103 for what is actually a bank-OTP case.
 */
export type AepsOtpContext = "customerVerify" | "cashoutThreshold";

export interface OtpPayload {
	otp: string;
	/**
	 * Optional — only meaningful if a bank-side cashout-OTP mechanism (distinct
	 * from customer-verification OTP, interaction 485/type 103) is confirmed later.
	 * Not required for interaction 485/103, which resolves the OTP via
	 * `customer_id` already present in the shared envelope.
	 */
	txn_ref_id?: string;
}

/** Ids of the bank/device options under the card-252 "AePS Cashout" menu. */
export type AepsProviderId = "fingpay" | "fino" | "fund_settlement";

export interface AepsProviderOption {
	id: AepsProviderId;
	/** Reference only — connect-api's `group_interaction_ids` for card 252. */
	catalogId: number;
	label: string;
	description: string;
	iconName: string;
	/** Whether this native flow has this provider's chain implemented yet. */
	enabled: boolean;
}

/**
 * "Payment Mode" (catalog id 9001) options — a Local/no-API step (param 856's
 * `list_elements`). Ids 1 (Cash Deposit) and 5 (Aadhaar-to-Aadhaar) are
 * hidden in the DB and excluded here; only Cash Withdrawal is wired up.
 */
export type AepsPaymentModeId = 2 | 3 | 4;

export interface AepsPaymentModeOption {
	id: AepsPaymentModeId;
	label: string;
	enabled: boolean;
}

/** Where a given response/outcome code should route the flow to next. */
export type AepsOutcomeAction =
	| { next: "chooseDevice" }
	| { next: "verifyKycOtp" }
	| { next: "completeKycBiometric" }
	| { next: "dailyAuth" }
	| { next: "paymentMode" }
	| { next: "cashout" }
	| { next: "otp" }
	| { next: "search" }
	| { next: "result"; result: "success" | "failure" | "pending" | "retry" }
	| { next: "unknown" };
