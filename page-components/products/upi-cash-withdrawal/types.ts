/**
 * Shared types for the UPI Cash Withdrawal product page.
 */

/**
 * Workflow steps, encoded as route slugs under `/products/upi-cash-withdrawal`.
 * - `gate`    — default landing; checks enablement/registration and routes (T-1).
 * - `onboarding` — self-onboarding entry (T-2).
 * - `withdrawal` — amount + location + QR (T-3) and status/cash-gate (T-4).
 */
export type UpiCashStep = "gate" | "onboarding" | "withdrawal";

/**
 * `data` payload from a successful Initiate (1108) response.
 * Field names mirror the connect-api contract verbatim.
 */
export interface UpiCashInitiateData {
	/** Transaction id — used to poll Status (1109) in T-4. */
	tid: string;
	/** QR image as a base64 PNG (may or may not carry a data: URI prefix). */
	qr_string: string;
	/** Seconds the QR is valid for (~60). */
	qr_expiry_in: number;
	/** Delay before the first status poll. */
	status_check_start_in: number;
	/** Gap between status polls. */
	status_check_gap: number;
	/** Max number of status polls. */
	status_check_attempts: number;
	/** Agent commission for this withdrawal (optional). */
	commission?: number;
	/** TDS on the commission (optional). */
	tds?: number;
}

/** Backend-returned poll schedule, normalised for the UI/T-4. */
export interface UpiCashPollSchedule {
	startIn: number;
	gap: number;
	attempts: number;
}

/**
 * The active QR/withdrawal issued by Initiate. `null` until generated; cleared when
 * the amount changes (a new amount means a new QR — AC-3.4).
 */
export interface UpiCashQr {
	/** Transaction id for status polling (T-4). */
	tid: string;
	/** base64 PNG payload. */
	qrString: string;
	/** The exact amount this QR was issued for (single-use & amount-specific). */
	amount: number;
	/** QR validity in seconds. */
	expirySeconds: number;
	/** Status-poll schedule for T-4. */
	schedule: UpiCashPollSchedule;
	commission?: number;
	tds?: number;
}

/**
 * `data` payload from a Status (1109) response.
 */
export interface UpiCashStatusData {
	/** Human-readable status description (display only — never branched on). */
	txstatus_desc?: string;
	/** Bank reference number — present ONLY when paid. */
	bank_ref_num?: string;
}

/**
 * Terminal/non-terminal outcome of status polling. The cash CTA is enabled ONLY for
 * `"paid"` — every other value (including `"unknown"`: pending-after-last-poll,
 * timeout, connection error, or an unrecognised status) means DO NOT hand over cash.
 */
export type UpiCashPollStatus =
	| "idle"
	| "pending"
	| "paid"
	| "failed"
	| "unknown";

/**
 * Resolved enablement/registration status used by the gate to decide routing.
 */
export interface UpiCashStatus {
	/** Profile still loading — show a spinner, decide nothing yet. */
	isLoading: boolean;
	/**
	 * Org/agent is enabled for the product (optional staged-rollout flag on top of
	 * the backend role-gated menu). A non-enabled agent must never reach the flow.
	 */
	isEnabled: boolean;
	/**
	 * Agent has completed Fingpay merchant self-onboarding. `false` → route to
	 * onboarding (T-2); `true` → route to withdrawal (T-3).
	 */
	isRegistered: boolean;
}
