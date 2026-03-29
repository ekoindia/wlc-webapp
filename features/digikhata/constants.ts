/**
 * DigiKhata — Colocated constants
 */

/** Base URL segment for all DigiKhata APIs */
export const DK_BASE = "/customer/payment/ppi-digikhata";

/** Steps where the KYC Stepper should be shown */
export const KYC_STEPS = new Set([
	"aadhaar-consent",
	"aadhaar-verify",
	"pan-verify",
]);

/** Animation durations */
export const ANIMATION = {
	WALLET_CARD_IN: "0.22s",
	STEP_IN: "0.2s",
	STEP_IN_DELAY: "0.06s",
	CTA_DELAY: "0.1s",
	EASING: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
	BALANCE_COUNT_UP_MS: 1200,
	NEW_RECIPIENT_PULSE_MS: 2000,
} as const;

/** OTP modal title variants */
export const OTP_MODAL_TITLES = {
	SENDER_VERIFY: "Verify Your Identity",
	AADHAAR: "Aadhaar OTP Verification",
	ADD_RECIPIENT: "Verify Recipient Addition",
	TRANSFER: "Confirm Fund Transfer",
} as const;
