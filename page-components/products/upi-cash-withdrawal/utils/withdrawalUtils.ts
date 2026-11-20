/**
 * Pure helpers for the withdrawal flow — amount validation, location sanity, and the
 * daily maintenance-window check. Kept pure (no hooks) so they're unit-testable.
 */

import { UPI_CASH_AMOUNT, UPI_CASH_MAINTENANCE_WINDOW } from "../constants";

export interface AmountValidation {
	/** True only when the amount is submittable. */
	valid: boolean;
	/** Parsed whole-rupee amount, or null when not parseable. */
	amount: number | null;
	/** User-facing error (empty string when the field is simply empty). */
	error: string;
}

/**
 * Validate a withdrawal amount: ₹100–5000, in multiples of ₹100, whole rupees only
 * (no paise). Runs before submit (the backend validates too).
 * @param {string} raw - Raw input value.
 * @returns {AmountValidation} The validation result.
 */
export const validateWithdrawalAmount = (
	raw: string | null | undefined
): AmountValidation => {
	const value = `${raw ?? ""}`.trim();
	if (!value) return { valid: false, amount: null, error: "" };

	// Whole rupees only — reject decimals/paise and any non-digit.
	if (!/^\d+$/.test(value)) {
		return {
			valid: false,
			amount: null,
			error: "Enter a whole rupee amount (no paise)",
		};
	}

	const amount = Number(value);
	if (amount < UPI_CASH_AMOUNT.MIN) {
		return {
			valid: false,
			amount,
			error: `Minimum amount is ₹${UPI_CASH_AMOUNT.MIN}`,
		};
	}
	if (amount > UPI_CASH_AMOUNT.MAX) {
		return {
			valid: false,
			amount,
			error: `Maximum amount is ₹${UPI_CASH_AMOUNT.MAX}`,
		};
	}
	if (amount % UPI_CASH_AMOUNT.STEP !== 0) {
		return {
			valid: false,
			amount,
			error: `Amount must be in multiples of ₹${UPI_CASH_AMOUNT.STEP}`,
		};
	}
	return { valid: true, amount, error: "" };
};

/**
 * Whether the device has a real (non-placeholder) fix. Rejects null coordinates and
 * the (0,0) null-island placeholder so we never submit a stale/zero location (AC-3.2).
 * @param {number | null} latitude - Latitude.
 * @param {number | null} longitude - Longitude.
 * @returns {boolean} True when both coordinates are present and not (0,0).
 */
export const hasRealLocation = (
	latitude: number | null,
	longitude: number | null
): boolean => {
	if (latitude == null || longitude == null) return false;
	if (latitude === 0 && longitude === 0) return false;
	return true;
};

/**
 * Whether `date` falls in the daily maintenance window (23:30–00:05 local) when new
 * withdrawals aren't accepted — a normal business state (AC-3.5).
 * @param {Date} [date] - The time to test (defaults to now).
 * @returns {boolean} True inside the window.
 */
export const isWithdrawalMaintenanceWindow = (date = new Date()): boolean => {
	const minutes = date.getHours() * 60 + date.getMinutes();
	return (
		minutes >= UPI_CASH_MAINTENANCE_WINDOW.START_MIN ||
		minutes <= UPI_CASH_MAINTENANCE_WINDOW.END_MIN
	);
};
