import { Box, Button, Select, Text, VStack } from "@chakra-ui/react";
import { PaddingBox } from "components";
import { useLocale } from "contexts";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../../next-i18next.config.cjs";

/**
 * Sample internationalization demonstration page
 * Shows how to use translations and locale switching
 * @returns {JSX.Element} The i18n sample page component
 */
const I18nSamplePage = () => {
	const { t } = useTranslation(["common", "dashboard"]);
	const { locale, changeLocale } = useLocale();

	const handleLocaleChange = (event) => {
		changeLocale(event.target.value);
	};

	return (
		<PaddingBox>
			<VStack spacing={6} align="stretch" maxW="600px" mx="auto">
				<Box>
					<Text fontSize="2xl" fontWeight="bold" mb={4}>
						{t("common:app_name")}
					</Text>
					<Text fontSize="lg" color="gray.600">
						{t("dashboard:welcome_title")}
					</Text>
				</Box>

				<Box>
					<Text mb={2} fontWeight="semibold">
						{t("common:language")}:
					</Text>
					<Select
						value={locale}
						onChange={handleLocaleChange}
						maxW="200px"
					>
						<option value="en">English</option>
						<option value="hi">हिंदी</option>
						<option value="gu">ગુજરાતી</option>
					</Select>
				</Box>

				<Box>
					<Text mb={4} fontWeight="semibold">
						{t("dashboard:quick_actions")}:
					</Text>
					<VStack spacing={3} align="stretch">
						<Button colorScheme="primary" size="lg">
							{t("common:dashboard")}
						</Button>
						<Button variant="outline" size="lg">
							{t("common:profile")}
						</Button>
						<Button variant="ghost" size="lg">
							{t("common:settings")}
						</Button>
					</VStack>
				</Box>

				<Box p={4} bg="gray.50" borderRadius="md">
					<Text fontWeight="semibold" mb={2}>
						{t("dashboard:statistics")}
					</Text>
					<VStack spacing={2} align="stretch">
						<Text>{t("dashboard:balance_label")}: ₹10,000</Text>
						<Text>{t("dashboard:total_users")}: 1,250</Text>
						<Text>{t("dashboard:monthly_revenue")}: ₹50,000</Text>
					</VStack>
				</Box>
			</VStack>
		</PaddingBox>
	);
};

I18nSamplePage.pageMeta = {
	title: "I18n Sample",
	description: "Internationalization demonstration page",
};

/**
 * Get static props for internationalization
 * @param {object} context - Next.js context
 * @param {string} context.locale - The current locale
 * @returns {object} Props containing translations
 */
export async function getStaticProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(
				locale,
				["common", "dashboard"],
				nextI18NextConfig
			)),
		},
	};
}

export default I18nSamplePage;
