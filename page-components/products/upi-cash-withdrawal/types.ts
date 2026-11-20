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
