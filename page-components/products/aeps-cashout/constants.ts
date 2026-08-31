import type {
	AepsOutcomeAction,
	AepsPaymentModeOption,
	AepsProviderOption,
} from "./contracts";

/**
 * Card 252 ("AePS Cashout") is a grid/menu whose `group_interaction_ids`
 * ("993,992,175") list these 3 child cards in connect-api's catalog:
 * 993 = "Fingpay (Instant Activation)", 992 = "Fino Payments Bank",
 * 175 = "Fund Settlement". Only the Fingpay chain has been built out
 * natively so far — the other two are shown for parity with the legacy
 * widget's menu but are not yet wired up.
 *
 * 993 itself is an `interaction_behavior_id=2` ("Link/Flow") row — it fires
 * no request of its own. Selecting it just jumps to its
 * `flow_start_interaction_id`, **991** ("Fingpay Status"), which is the real
 * first API call in this chain (see AEPS_INTERACTION.FINGPAY_STATUS below).
 */
export const AEPS_PROVIDERS: AepsProviderOption[] = [
	{
		id: "fingpay",
		catalogId: 993,
		label: "Fingpay",
		description: "Instant activation · Aadhaar-based cashout",
		iconName: "fingerprint",
		enabled: true,
	},
	{
		id: "fino",
		catalogId: 992,
		label: "Fino Payments Bank",
		description: "Coming soon",
		iconName: "account-balance-wallet",
		enabled: false,
	},
	{
		id: "fund_settlement",
		catalogId: 175,
		label: "Fund Settlement",
		description: "Coming soon",
		iconName: "cash",
		enabled: false,
	},
];

/**
 * interaction_type_id values for the AePS/Fingpay chain — the values
 * actually sent in the request body (what the backend switches on), NOT the
 * catalog/card ids (252/993/991/994/9001/482/483/485) shown in the widget's
 * UI. Kept here (not in the global `constants/EpsTransactions.js`
 * TransactionTypes map) since this mapping is specific to the AePS/Fingpay
 * chain.
 *
 *   catalog 991 "Fingpay Status"            -> interaction_type_id 391
 *   catalog 994 "AePS Daily Authentication" -> interaction_type_id 594
 *   catalog 482 "Search Customer"           -> interaction_type_id 150
 *   catalog 483 "AePS Cashout"              -> interaction_type_id 344
 *   catalog 485 "Verify Customer OTP"       -> interaction_type_id 103
 */
export const AEPS_INTERACTION = {
	/**
	 * Card 252 is a UI-only grid/menu (bank/device picker: Fingpay / Fino /
	 * Fund Settlement). Not a wire value; kept only for documentation.
	 */
	SETUP_DEVICE: 252,
	/**
	 * Catalog 991 — checks whether the *agent* has completed today's
	 * mandatory Fingpay biometric re-verification yet.
	 */
	FINGPAY_STATUS: 391,
	/**
	 * Catalog 994 — the agent's own daily biometric re-authentication. Only
	 * reachable when FINGPAY_STATUS_OUTCOME routes here (response 1965,
	 * "Daily KYC pending"). See DailyAuthPayload in contracts.ts. The success
	 * path (`response?.status === 0`) still needs an end-to-end test with a
	 * real fingerprint capture.
	 */
	DAILY_AUTH: 594,
	SEARCH_CUSTOMER: 150,
	CASHOUT: 344,
	/**
	 * Catalog 485 "Verify Customer OTP". This verifies a *customer*
	 * (reachable from Search Customer's 339 "not verified" outcome below) —
	 * it is NOT a bank-side high-value-cashout OTP. No such cashout-OTP
	 * interaction id exists in the connect-api catalog for 483; if the bank
	 * ever requires OTP for cashout amounts, it comes back as a distinct
	 * response on interaction 344 itself, not a separate call.
	 */
	OTP_VERIFY: 103,
	/**
	 * The bank-side cashout-amount OTP resubmission call. UNCONFIRMED — no
	 * working value for `txnOtpRequestId` on retry has been found (the failed
	 * call's own `tid` does not satisfy the backend). Do not guess a value
	 * here — leave `null` until backend confirms either a real
	 * `txnOtpRequestId` source or a distinct verify interaction_type_id.
	 * `submitOtp`/`OtpVerification` gate on this being set before allowing a
	 * cashout-OTP submission.
	 */
	CASHOUT_OTP_VERIFY: null as number | null,
	/**
	 * Catalog 614 "Complete Your KYC" — reachable from Fingpay Status's 1601
	 * outcome ("Merchant eKYC pending") and from Search Customer's 309
	 * outcome. Shares the same Aadhaar RSA key as 483/994. This is step 1 of
	 * 3 — see VERIFY_KYC_OTP/COMPLETE_KYC_BIOMETRIC below for the rest of the
	 * chain. See CompleteKycPayload in contracts.ts for a known backend issue
	 * on this specific call.
	 */
	COMPLETE_KYC: 540,
	/**
	 * Catalog 615 "Verify OTP" — step 2 of the Complete-KYC chain (614's
	 * schema chains its `1600` response here). Verifies the OTP sent by
	 * step 1.
	 */
	VERIFY_KYC_OTP: 542,
	/**
	 * Catalog 616 "Complete Biometric Process" — step 3 (final) of the
	 * Complete-KYC chain (615's schema chains its `1604` response here).
	 * Needs a bank selection (same `api_interaction_type_id: 155` list as
	 * Daily Auth) and a real fingerprint scan.
	 */
	COMPLETE_KYC_BIOMETRIC: 543,
};

/**
 * Free-text pattern SimpliBank embeds in a 344 response's `data.comment`
 * field when the cashout amount exceeds the bank-side OTP threshold, e.g.
 * "Amount 5500.0 exceeds OTP threshold 5000.0 and no txnOtpRequestId was
 * provided". This is generated dynamically by SimpliBank at request time, so
 * it has no corresponding static row in connect-api's schema — the pattern
 * match below is the only way to detect it.
 */
export const OTP_THRESHOLD_COMMENT_PATTERN = /exceeds OTP threshold/i;

/**
 * Catalog (not interaction_type_id) ids, needed specifically for
 * `getAadhaarPublicKey()` — connect-api's `POST /transactions/:id` schema
 * endpoint is keyed by the catalog id (e.g. 483), not the wire
 * interaction_type_id (344).
 */
export const AEPS_CATALOG = {
	CASHOUT: 483,
	DAILY_AUTH: 994,
	COMPLETE_KYC: 614,
};

/**
 * response_type_id values returned by interaction 391 (Fingpay Status), for
 * catalog id 991. Only the outcomes this native flow implements are mapped —
 * the rest (fund-settlement onboarding, address/bank pending) lead to a
 * separate merchant-onboarding form (catalog 1152) that isn't built here, so
 * they fail safe to a result screen instead of silently mis-routing.
 */
export const FINGPAY_STATUS_OUTCOME: Record<number, AepsOutcomeAction> = {
	1965: { next: "dailyAuth" }, // Daily KYC pending — agent must re-authenticate (994)
	1969: { next: "paymentMode" }, // Daily KYC already done today — proceed to transact
	1601: { next: "chooseDevice" }, // Merchant eKYC pending -> Complete-KYC chain (626 -> 614)
	1320: { next: "result", result: "failure" }, // Fund Settlement onboarding pending — out of scope
	2109: { next: "result", result: "failure" }, // Address/Bank details pending — out of scope
	/**
	 * Not a documented outcome for interaction 991 in connect-api's catalog.
	 * The same code is reused for unrelated generic failures elsewhere in the
	 * catalog (PAN upload, add-beneficiary, profile update) — reads as a
	 * generic upstream "temporary failure, retry" wrapper, so it's treated as
	 * retryable rather than a hard dead-end.
	 */
	461: { next: "result", result: "retry" },
};

/**
 * response_type_id values for catalog 614 "Complete Your KYC" itself (step 1
 * of the chain). `1600` is the only response documented in 614's own schema
 * — everything else falls through to `submitCompleteKyc`'s generic error
 * handling rather than being listed here.
 */
export const COMPLETE_KYC_OUTCOME: Record<number, AepsOutcomeAction> = {
	1600: { next: "verifyKycOtp" },
};

/**
 * response_type_id values for catalog 615 "Verify OTP" (step 2). `1604` is
 * the only response documented in 615's own schema.
 */
export const VERIFY_KYC_OTP_OUTCOME: Record<number, AepsOutcomeAction> = {
	1604: { next: "completeKycBiometric" },
};

/**
 * response_type_id values for catalog 616 "Complete Biometric Process"
 * (step 3, final). `1605` is the only response documented in 616's own
 * schema — its chain has no further `next_interaction_id`, so this is
 * treated as the terminal success outcome.
 */
export const COMPLETE_KYC_BIOMETRIC_OUTCOME: Record<number, AepsOutcomeAction> =
	{
		1605: { next: "result", result: "success" },
	};

/**
 * response_type_id values returned by interaction 150 (Search Customer),
 * for catalog id 482.
 *
 * `309` ("customer exists") is NOT a flat single-destination outcome — its
 * own schema documents two chains (483 Cashout AND 614 Complete Your KYC),
 * disambiguated by the `ekyc_enabled` field the response itself carries.
 * `submitSearchCustomer` branches on `data.ekyc_enabled` directly for this
 * code rather than through this map. This is a second entry point into the
 * Complete-KYC chain, distinct from Fingpay Status's 1601 path (which goes
 * through the `chooseDevice`/626 screen first; this one goes straight to
 * 614, matching 482's own chain definition).
 */
export const SEARCH_CUSTOMER_OUTCOME: Record<number, AepsOutcomeAction> = {
	0: { next: "cashout" }, // success — customer already verified, proceed to cashout
	339: { next: "otp" }, // "Customer not verified." -> verify-customer-OTP (103/485), then back to cashout
	308: { next: "result", result: "failure" }, // "Customer Not Enrolled" -> enroll flow (484), out of scope for now
	319: { next: "result", result: "failure" }, // "Click below to sign up as a customer" — no chain defined, dead end
};

/**
 * response_type_id values returned by interaction 344 (AePS Cashout),
 * confirmed as the genuine Fingpay cash-withdrawal outcomes for catalog id
 * 483 (response_status_id legend: 0 = Successful, 1 = Failed, 2 = Initiated).
 * Deliberately narrow — 344 is shared by other non-Fingpay callers with
 * their own response codes (balance enquiry, mini statement, other banks),
 * which are excluded here to avoid mis-routing on a code that isn't
 * reachable from this chain.
 *
 * There is no static "OTP required" response_type_id for 344/483 — the
 * bank returns a plain `1464` ("Transaction Fail") with the real reason only
 * in `data.comment` (see `OTP_THRESHOLD_COMMENT_PATTERN`). That comment text
 * is generated dynamically per-request, so it can't be a static map entry.
 * `AepsContext.submitCashout` checks `1464` responses against that pattern
 * before falling through to this map, so the plain 1464 entry below only
 * fires for genuinely other failure reasons.
 *
 * OPEN ITEM: the resubmission mechanism after OTP entry (`txnOtpRequestId`)
 * is still unconfirmed — see `CASHOUT_OTP_VERIFY`.
 */
export const CASHOUT_OUTCOME: Record<number, AepsOutcomeAction> = {
	1463: { next: "result", result: "success" }, // Cash withdrawal success — Fingpay
	1464: { next: "result", result: "failure" }, // Cash withdrawal failure — Fingpay
	1465: { next: "result", result: "pending" }, // Cash withdrawal awaited — Fingpay
};

/**
 * "Payment Mode" (catalog 9001) is a Local/no-API step (`interaction_behavior_id=3`)
 * — its options come from param 856's `list_elements`, and its routing (which
 * option leads to Search Customer vs. elsewhere) is pure client-side
 * JSON-logic on `{type, ekyc_flag}` (response 770), not a server call. Only
 * "Cash Withdrawal" is wired to continue into Search Customer here; the
 * others are shown, disabled, for menu parity.
 */
export const AEPS_PAYMENT_MODES: AepsPaymentModeOption[] = [
	{ id: 2, label: "Cash Withdrawal", enabled: true },
	{ id: 3, label: "Request Balance", enabled: false },
	{ id: 4, label: "Mini Statement", enabled: false },
];

export const AEPS_STEP_ORDER = [
	"provider",
	"fingpayStatus",
	"dailyAuth",
	"paymentMode",
	"search",
	"otp",
	"cashout",
	"result",
] as const;

/** Cashout amounts at/above this threshold are expected to require bank-side OTP. */
export const OTP_REQUIRED_AMOUNT_THRESHOLD = 5000;

export const AEPS_ENVELOPE_DEFAULTS = {
	bc: "1",
	source: "NEWCONNECT",
	locale: "en",
	lang: "null",
	version: "v2",
	communication: "1",
};

/**
 * Fixed fields shared by the Daily Authentication (594) call.
 * `product_id` is documented as "Product Id for fingpay Aeps and Aadhar Pay
 * Daily KYC Charges", implying this may carry its own fee; no amount is
 * collected client-side for it.
 */
export const FINGPAY_FIXED_FIELDS = {
	service_code: "43",
	operation_type: "2",
	product_id: "747",
	isirisauth: "0",
	isfaceauth: "0",
	is_face_auth_available: "0",
};
