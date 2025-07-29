import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Regular expression to match static file extensions
 * Used to skip middleware processing for public assets
 */
const PUBLIC_FILE = /\.(.*)$/;

/**
 * Array of supported locale codes for internationalization
 * Currently supports English, Hindi, and Gujarati
 */
const SUPPORTED_LOCALES = ["en", "hi", "gu"] as const;

/**
 * Default locale used as fallback when no valid locale is detected
 */
const DEFAULT_LOCALE = "en";

/**
 * Type definition for supported locale strings
 */
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Validates if a given locale string is supported by the application
 * @param {string} locale - Locale string to validate
 * @returns {locale is SupportedLocale} True if locale is supported, false otherwise
 */
const isLocaleValid = (locale: string): locale is SupportedLocale => {
	return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
};

/**
 * Extract preferred locale from Accept-Language header
 * Parses the Accept-Language header and finds the first supported locale
 * @param {string} acceptLanguage - Accept-Language header value from the request
 * @returns {SupportedLocale | null} First supported locale found or null if none are supported
 */
const getPreferredLocale = (acceptLanguage: string): SupportedLocale | null => {
	const preferredLocale = acceptLanguage
		.split(",") // Split multiple language preferences
		.map((lang) => lang.split(";")[0].trim().split("-")[0]) // Extract base language code (en-US -> en)
		.find((lang) => isLocaleValid(lang)); // Find first supported locale

	return preferredLocale ?? null;
};

/**
 * Create redirect response with locale cookie update
 * Constructs a new URL with the locale prefix and sets the locale cookie
 * @param {string} url - Original request URL
 * @param {SupportedLocale} locale - Target locale to redirect to
 * @param {string} pathname - Current pathname without locale prefix
 * @returns {NextResponse} NextResponse with redirect and updated locale cookie
 */
const createLocaleRedirect = (
	url: string,
	locale: SupportedLocale,
	pathname: string
): NextResponse => {
	const newUrl = new URL(url);
	newUrl.pathname = `/${locale}${pathname}`;
	const response = NextResponse.redirect(newUrl);
	response.cookies.set("NEXT_LOCALE", locale);
	return response;
};

/**
 * Middleware for handling locale-based redirects and internationalization
 *
 * Implements sophisticated locale detection with the following priority chain:
 * 1. URL locale (if valid) - takes precedence, updates cookie if needed
 * 2. Cookie locale (if valid) - redirects to cookie locale with URL prefix
 * 3. Accept-Language header (if contains supported locale) - uses browser preference
 * 4. Default locale - fallback when no other valid locale is found
 *
 * Flow:
 * - Skips processing for static files, API routes, and Next.js internals
 * - Extracts locale from URL, cookie, and Accept-Language header
 * - Follows priority chain to determine the appropriate locale
 * - Redirects to localized URL when necessary
 * - Updates locale cookie to maintain consistency
 * @param {NextRequest} req - The incoming Next.js request object
 * @returns {NextResponse} NextResponse with either a redirect to the appropriate locale or continuation to the page
 */
export function middleware(req: NextRequest): NextResponse {
	// Extract locale information from different sources
	const { locale: urlLocale, pathname } = req.nextUrl;
	const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
	const acceptLanguage = req.headers.get("accept-language");

	// Debug logging for development
	console.log("[i18n] middleware pathname:", pathname);
	console.log("[i18n] middleware cookieLocale:", cookieLocale);

	// Skip middleware for Next.js internals, API routes, and static files
	// These routes don't need internationalization processing
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		PUBLIC_FILE.test(pathname)
	) {
		console.log("[i18n] Skipping middleware for static/internal route");
		return NextResponse.next();
	}

	// Priority 1: Valid URL locale
	// If URL contains a valid locale, use it and ensure cookie is synchronized
	if (urlLocale && isLocaleValid(urlLocale)) {
		// Update cookie if it differs from URL locale to maintain consistency
		if (cookieLocale !== urlLocale) {
			const response = NextResponse.next();
			response.cookies.set("NEXT_LOCALE", urlLocale);
			return response;
		}
		// Cookie matches URL locale, continue without changes
		return NextResponse.next();
	}
	// Priority 2: Valid cookie locale
	// If no valid URL locale but valid cookie locale exists, redirect to cookie locale
	else if (cookieLocale && isLocaleValid(cookieLocale)) {
		return createLocaleRedirect(req.url, cookieLocale, pathname);
	}
	// Priority 3: Valid Accept-Language locale
	// Check browser's language preferences for supported locales
	else if (acceptLanguage) {
		const preferredLocale = getPreferredLocale(acceptLanguage);
		if (preferredLocale) {
			return createLocaleRedirect(req.url, preferredLocale, pathname);
		}
	}

	// Fallback: Default locale
	// When no valid locale is found through any method, use default
	return createLocaleRedirect(req.url, DEFAULT_LOCALE, pathname);
}

/**
 * Middleware configuration
 * Defines which routes should be processed by the middleware
 * Excludes API routes, Next.js static files, and favicon
 */
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
