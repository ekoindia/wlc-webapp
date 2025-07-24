/**
 * next-i18next configuration for internationalization
 *
 * CRITICAL: This file must remain in CommonJS format (.cjs extension) because:
 * 1. next-i18next library requires CommonJS modules for configuration
 * 2. Our project uses ES modules ("type": "module" in package.json)
 * 3. .js files are treated as ES modules, causing ERR_REQUIRE_ESM errors
 *
 * USAGE PATTERN:
 * Since symbolic links still cause ES module conflicts, we use explicit imports:
 *
 * ```javascript
 * import nextI18NextConfig from "../../next-i18next.config.cjs";
 *
 * export async function getStaticProps({ locale }) {
 *   return {
 *     props: {
 *       ...(await serverSideTranslations(locale, ["common"], nextI18NextConfig)),
 *     },
 *   };
 * }
 * ```
 *
 * MAINTENANCE:
 * - Import this file explicitly in pages that use serverSideTranslations
 * - Pass the config as the third parameter to serverSideTranslations
 * - DO NOT create next-i18next.config.js - it will cause ES module errors
 * @see https://github.com/i18next/next-i18next
 */
const path = require("path");

module.exports = {
	// Next.js i18n configuration
	i18n: {
		// Default language when no locale is specified
		defaultLocale: "en",
		// Supported locales: English, Hindi, Gujrati
		locales: ["en", "hi", "gu"],
		// Disable automatic locale detection since we handle it manually
		localeDetection: false,
	},
	// Fallback language when translation is missing
	fallbackLng: "en",
	// Path to translation files
	localePath: path.resolve("./public/locales"),
	// Reload translations on prerender in development
	reloadOnPrerender: process.env.NODE_ENV === "development",
	// React configuration - disable Suspense for better compatibility
	react: { useSuspense: false },
};
