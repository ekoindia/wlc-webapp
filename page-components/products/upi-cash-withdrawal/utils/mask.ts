/**
 * Masking helpers for sensitive identifiers (REQ-2026-004 invariant: mask
 * PAN / Aadhaar / bank on display; never log them in clear).
 *
 * These keep the last few characters visible for the agent to recognise the value
 * while hiding the rest. Use them at every display surface that echoes a collected
 * identifier back (onboarding review, status/receipt screens). Never pass a raw
 * value to `console.*`.
 */

/**
 * Mask all but the last `visible` characters of a value.
 * @param {string | null | undefined} value - The raw value to mask.
 * @param {number} [visible] - Count of trailing characters to keep visible.
 * @returns {string} The masked value (empty string for empty input).
 */
export const maskValue = (
	value: string | null | undefined,
	visible = 4
): string => {
	if (!value) return "";
	const trimmed = `${value}`.trim();
	if (trimmed.length <= visible) return "•".repeat(trimmed.length);
	return `${"•".repeat(trimmed.length - visible)}${trimmed.slice(-visible)}`;
};

/**
 * Mask a PAN, keeping the last 4 characters (e.g. `••••••234F`).
 * @param pan
 */
export const maskPan = (pan: string | null | undefined): string =>
	maskValue(pan, 4);

/**
 * Mask an Aadhaar number, keeping the last 4 digits (e.g. `••••••••1234`).
 * @param aadhaar
 */
export const maskAadhaar = (aadhaar: string | null | undefined): string =>
	maskValue(`${aadhaar ?? ""}`.replace(/\s+/g, ""), 4);

/**
 * Mask a bank account number, keeping the last 4 digits.
 * @param account
 */
export const maskBankAccount = (account: string | null | undefined): string =>
	maskValue(account, 4);
