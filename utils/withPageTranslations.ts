import { GetStaticProps, GetStaticPropsContext } from "next";
import type { UserConfig } from "next-i18next";

interface TranslationConfig {
	namespaces?: string[];
	additionalProps?: Record<string, any>;
}

/**
 * Higher-order function that creates getStaticProps with translation support
 * Only available in server-side context
 * @param {TranslationConfig} config - Translation configuration options
 * @returns {GetStaticProps} getStaticProps function with internationalization
 */
export const withPageTranslations = (
	config: TranslationConfig = {}
): GetStaticProps => {
	// Ensure this only runs on server
	if (typeof window !== "undefined") {
		throw new Error("withPageTranslations can only be used server-side");
	}

	const { namespaces = ["common"], additionalProps = {} } = config;

	return async (context: GetStaticPropsContext) => {
		const { locale = "en" } = context;

		console.log(`[Page] locale: ${locale}`);

		try {
			// Dynamic import to avoid client-side bundling
			const { serverSideTranslations } = await import(
				"next-i18next/serverSideTranslations"
			);
			const nextI18nextConfig = await import(
				"../next-i18next.config.cjs"
			);

			return {
				props: {
					...(await serverSideTranslations(
						locale,
						namespaces,
						(nextI18nextConfig.default ||
							nextI18nextConfig) as UserConfig
					)),
					...additionalProps,
				},
			};
		} catch (error) {
			console.error("Translation loading error:", error);
			return {
				props: {
					...additionalProps,
				},
			};
		}
	};
};
