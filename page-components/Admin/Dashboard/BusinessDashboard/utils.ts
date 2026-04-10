/**
 * Generates a consistent cache key for dashboard API responses.
 * @param prefix - Unique identifier for Cache Key (e.g. "successRate", "usageAnalytics")
 * @param dateFrom - Start date string (ISO format). Only the date portion (YYYY-MM-DD) is used.
 * @param dateTo - End date string (ISO format). Only the date portion (YYYY-MM-DD) is used.
 * @returns A deterministic cache key string.
 * @example
 * getDashboardCacheKey("successRate", "2024-01-01T00:00:00", "2024-01-31T00:00:00")
 * // → "successRate-2024-01-01-2024-01-31"
 */
export const getCacheKey = (
	prefix: string,
	dateFrom: string,
	dateTo: string
): string =>
	`${prefix}-${dateFrom.substring(0, 10)}-${dateTo.substring(0, 10)}`;
