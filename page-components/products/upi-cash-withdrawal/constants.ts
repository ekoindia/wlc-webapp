/**
 * UPI Cash Withdrawal (Eloka) — shared constants for the whole REQ-2026-004 feature.
 *
 * Everything the product's four tasks share lives here so the contract stays in one
 * place: interaction-type ids, the amount rules, and — critically — the
 * `response_status_id` convention that ALL outcome branching keys off (never
 * `tx_status` / message text; the internal convention differs from the partner doc).
 */

/** Base route for the custom product page (plural — `/products/upi-cash-withdrawal`). */
export const UPI_CASH_BASE_PATH = "/products/upi-cash-withdrawal";

/**
 * Optional staged-rollout feature flag (see `constants/featureFlags.ts`). The
 * product's primary gate is the backend role-gated menu (`/transactions/wlc`); this
 * flag lets us dark-launch to specific orgs on top of that.
 */
export const UPI_CASH_FEATURE_FLAG = "UPI_CASH_WITHDRAWAL";

/**
 * Interaction type ids for the eloka-webapp → connect-api contract (v1).
 * connect-api injects `initiator_id` / `user_code` / `client_ref_id` from the JWT;
 * the app only sends `source:"WLC"` (via `helpers/apiHelper`) + `interaction_type_id`.
 */
export const UPI_CASH_INTERACTION = {
	/** Initiate a withdrawal → returns the QR + status-poll schedule. */
	INITIATE: 1108,
	/** Poll a withdrawal's status by `tid`. */
	STATUS: 1109,
	/** Self-onboarding (Fingpay merchant) via the onboarding pipeline. */
	ONBOARDING: 365,
} as const;

/**
 * Outcome branching keys off `response_status_id` ONLY (internal convention).
 * For Status (1109): 0 = paid (e-value credited), 1 = failed, 2 = pending.
 * For Initiate (1108): 0 = ok, 1 = fail.
 */
export const RESPONSE_STATUS = {
	/** Paid / OK — the ONLY state that may enable the "hand over cash" CTA. */
	PAID: 0,
	OK: 0,
	FAILED: 1,
	PENDING: 2,
} as const;

/**
 * Amount rules (whole rupees, no paise). Validated client-side before submit;
 * the backend validates too.
 */
export const UPI_CASH_AMOUNT = {
	MIN: 100,
	MAX: 5000,
	/** Allowed in multiples of ₹100. */
	STEP: 100,
} as const;

/**
 * Fingpay merchant role code for UPI Cash Withdrawal self-onboarding (interaction
 * 365). Assigned by the backend; when this role is present in the profile's
 * `onboarding_steps`, the agent still has to self-onboard (not yet registered).
 * T-2 reuses this as the onboarding step's `applicableRoles`.
 */
export const UPI_CASH_MERCHANT_ROLE = 51800;

/** QR defaults. Initiate returns `qr_expiry_in` (~60s); this is the fallback. */
export const UPI_CASH_QR = {
	DEFAULT_EXPIRY_SECONDS: 60,
} as const;

/**
 * Daily settlement/maintenance window (minutes-of-day, local time) during which the
 * provider does not accept new withdrawals — a normal business state, shown as an
 * informative message (AC-3.5). Covers 23:30 → 00:05.
 */
export const UPI_CASH_MAINTENANCE_WINDOW = {
	/** 23:30 = 1410 minutes past midnight. */
	START_MIN: 23 * 60 + 30,
	/** 00:05 = 5 minutes past midnight. */
	END_MIN: 5,
} as const;
