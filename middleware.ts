import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ["en", "hi", "gu"] as const;
const DEFAULT_LOCALE = "en";

/**
 * Extract locale from pathname using improved regex pattern
 * Uses positive lookahead for more precise matching
 * @param pathname - The URL pathname to extract locale from
 * @returns The extracted locale or null if not found/unsupported
 */
function extractLocaleFromPath(pathname: string): string | null {
	const match = pathname.match(/^\/([a-zA-Z-]+)(?=\/|$)/);
	return match && SUPPORTED_LOCALES.includes(match[1] as any)
		? match[1]
		: null;
}

/**
 * Parse Accept-Language header and find best matching locale
 * Handles language codes with regions and quality values
 * @param acceptLanguage - Raw Accept-Language header value
 * @returns Best matching locale or null if no supported language found
 */
function parseAcceptLanguage(acceptLanguage: string | null): string | null {
	if (!acceptLanguage) return null;

	// Parse Accept-Language header with quality values
	const languages = acceptLanguage
		.split(",")
		.map((lang) => {
			const [language, quality = "1"] = lang.trim().split(";q=");
			return {
				language: language.split("-")[0], // Extract base language code
				quality: parseFloat(quality),
			};
		})
		.sort((a, b) => b.quality - a.quality); // Sort by quality (highest first)

	console.log("[i18n] Parsed Accept-Language:", languages);

	// Find first supported locale
	for (const { language } of languages) {
		if (SUPPORTED_LOCALES.includes(language as any)) {
			console.log(
				"[i18n] Found supported language in Accept-Language:",
				language
			);
			return language;
		}
	}

	console.log("[i18n] No supported language found in Accept-Language");
	return null;
}

/**
 * Determine the target locale using unified fallback chain
 * Priority: URL locale > Cookie locale > Accept-Language > Default locale
 * @param urlLocale - Locale extracted from URL path
 * @param cookieLocale - Locale from NEXT_LOCALE cookie
 * @param acceptLanguage - Accept-Language header value
 * @returns The target locale to use
 */
function determineTargetLocale(
	urlLocale: string | null,
	cookieLocale: string | null,
	acceptLanguage: string | null
): string {
	// If URL has a valid locale, use it (highest priority)
	if (urlLocale && SUPPORTED_LOCALES.includes(urlLocale as any)) {
		console.log("[i18n] Using URL locale:", urlLocale);
		return urlLocale;
	}

	// If URL has invalid locale, log and continue with fallback
	if (urlLocale && !SUPPORTED_LOCALES.includes(urlLocale as any)) {
		console.log(
			"[i18n] Invalid URL locale, falling back to cookie/accept-language"
		);
	}

	// Check cookie preference (second priority)
	if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as any)) {
		console.log("[i18n] Using cookie locale:", cookieLocale);
		return cookieLocale;
	}

	// Fallback to Accept-Language header (third priority)
	if (acceptLanguage) {
		const matched = parseAcceptLanguage(acceptLanguage);
		if (matched) {
			console.log("[i18n] Using Accept-Language:", matched);
			return matched;
		}
	}

	// Final fallback to default locale
	console.log("[i18n] Using default locale:", DEFAULT_LOCALE);
	return DEFAULT_LOCALE;
}

/**
 * Build the desired path with proper locale handling
 * Handles edge cases like root paths and prevents double slashes
 * @param pathname - Original pathname
 * @param targetLocale - The target locale to use
 * @returns The properly formatted path with locale
 */
function buildDesiredPath(pathname: string, targetLocale: string): string {
	// Strip any existing locale prefix using improved regex
	const cleanedPath = pathname.replace(/^\/[a-zA-Z-]+(?=\/|$)/, "");

	if (targetLocale === DEFAULT_LOCALE) {
		// For default locale, use clean path (no prefix)
		return cleanedPath || "/";
	} else {
		// For non-default locale, add prefix and handle root path edge case
		return `/${targetLocale}${cleanedPath === "/" ? "" : cleanedPath}`;
	}
}

/**
 * Middleware for handling locale-based redirects
 * Implements sophisticated locale detection with fallback chain
 * @param req - The incoming Next.js request
 * @returns NextResponse with redirect or continuation
 */
export function middleware(req: NextRequest): NextResponse {
	const { pathname } = req.nextUrl;
	const urlLocale = extractLocaleFromPath(pathname);
	const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
	const acceptLanguage = req.headers.get("accept-language");

	console.log("[i18n] middleware pathname:", pathname);
	console.log("[i18n] middleware urlLocale:", urlLocale);
	console.log("[i18n] middleware cookieLocale:", cookieLocale);

	// Skip middleware for Next.js internals, API routes, and static files
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		PUBLIC_FILE.test(pathname)
	) {
		console.log("[i18n] Skipping middleware for static/internal route");
		return NextResponse.next();
	}

	// Determine target locale using unified fallback logic
	const targetLocale = determineTargetLocale(
		urlLocale,
		cookieLocale,
		acceptLanguage
	);

	// Build desired path with proper handling
	const desiredPath = buildDesiredPath(pathname, targetLocale);

	// Avoid redundant redirects
	if (pathname === desiredPath) {
		console.log("[i18n] Path already correct, continuing");
		return NextResponse.next();
	}

	// Perform redirect with cookie update
	const url = req.nextUrl.clone();
	url.pathname = desiredPath;
	const response = NextResponse.redirect(url);

	// Update cookie only if locale changed
	if (cookieLocale !== targetLocale) {
		console.log(
			"[i18n] Updating locale cookie from",
			cookieLocale,
			"to",
			targetLocale
		);
		response.cookies.set("NEXT_LOCALE", targetLocale, {
			path: "/",
			maxAge: 31536000, // 1 year
			httpOnly: false,
			sameSite: "lax",
		});
	}

	console.log("[i18n] Redirecting to:", url.pathname);
	return response;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
