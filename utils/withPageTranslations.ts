import { GetStaticProps, GetStaticPropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// @ts-ignore - Config file type compatibility
import nextI18nextConfig from "../next-i18next.config.cjs";

interface TranslationConfig {
	namespaces?: string[];
	additionalProps?: Record<string, any>;
}

/**
 * Higher-order function that creates getStaticProps with translation support
 * @param {TranslationConfig} config - Translation configuration options
 * @returns {GetStaticProps} getStaticProps function with internationalization
 */
export const withPageTranslations = (
	config: TranslationConfig = {}
): GetStaticProps => {
	const { namespaces = ["common"], additionalProps = {} } = config;

	return async (context: GetStaticPropsContext) => {
		const { locale = "en" } = context;

		console.log(`[Page] locale: ${locale}`);

		return {
			props: {
				...(await serverSideTranslations(
					locale,
					namespaces,
					nextI18nextConfig as any
				)),
				...additionalProps,
			},
		};
	};
};

/**
 * App Router translation helper (future migration)
 * @param {string} locale - Current locale
 * @param {TranslationConfig} config - Translation configuration
 * @returns {Promise<any>} Translation props for App Router
 */
export const getAppTranslations = async (
	locale: string,
	config: TranslationConfig = {}
) => {
	const { namespaces = ["common"] } = config;

	return await serverSideTranslations(
		locale,
		namespaces,
		nextI18nextConfig as any
	);
};
