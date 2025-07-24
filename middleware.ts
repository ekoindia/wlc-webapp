import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ["en", "hi", "gu"];

/**
 * Middleware for handling locale-based redirects
 * Redirects users based on their preferred locale cookie
 * @param {NextRequest} req - The incoming request
 * @returns {NextResponse} Response or redirect
 */
export function middleware(req: NextRequest) {
	const { pathname, locale } = req.nextUrl;

	// Skip middleware for Next.js internals, API routes, and static files
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		PUBLIC_FILE.test(pathname)
	) {
		return NextResponse.next();
	}

	// Check if we have an unsupported locale in the URL
	if (locale && !SUPPORTED_LOCALES.includes(locale)) {
		// Redirect to the default locale version
		const redirectUrl = new URL(pathname, req.url);
		return NextResponse.redirect(redirectUrl);
	}

	// Handle English default locale with preference detection
	if (locale === "en") {
		const preferred = req.cookies.get("NEXT_LOCALE")?.value;
		if (
			preferred &&
			preferred !== "en" &&
			SUPPORTED_LOCALES.includes(preferred)
		) {
			const redirectUrl = new URL(`/${preferred}${pathname}`, req.url);
			return NextResponse.redirect(redirectUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
