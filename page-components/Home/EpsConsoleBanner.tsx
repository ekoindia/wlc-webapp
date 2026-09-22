import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { Button } from "components";
import { UserType } from "constants/UserTypes";
import { useUser } from "contexts";

/** Org whose Enterprise Partners are nudged to EPS Console */
const EPS_ORG_ID = 1;

interface EpsConsoleBannerProps extends FlexProps {}

/**
 * Build the EPS Console URL with the user's mobile, or null if the
 * NEXT_PUBLIC_EPS_CONSOLE_URL env is missing/invalid.
 * @param {string} [mobile] Logged-in user's mobile number
 * @returns {string|null} Console URL
 */
const getEpsConsoleUrl = (mobile?: string): string | null => {
	const baseUrl = process.env.NEXT_PUBLIC_EPS_CONSOLE_URL?.trim();
	if (!baseUrl) return null;
	try {
		const url = new URL(baseUrl);
		if (url.protocol !== "https:" && url.protocol !== "http:") return null;
		if (mobile) url.searchParams.set("mobile", String(mobile));
		return url.toString();
	} catch (error) {
		console.error(
			"[EpsConsoleBanner] Invalid NEXT_PUBLIC_EPS_CONSOLE_URL",
			error
		);
		return null;
	}
};

/**
 * Full-width banner nudging EPS partners (org 1, user-type 23) to EPS Console.
 * Renders nothing unless NEXT_PUBLIC_EPS_CONSOLE_URL is set.
 * Spans all columns when placed inside the Home widget grid.
 * @param {EpsConsoleBannerProps} props Extra Flex props
 * @returns {JSX.Element|null} Banner, or null when not applicable
 * @example `<EpsConsoleBanner />`
 */
const EpsConsoleBanner = (props: EpsConsoleBannerProps) => {
	const { userData } = useUser();
	const { user_type, org_id, mobile } = userData?.userDetails ?? {};

	const isEpsPartner =
		Number(org_id) === EPS_ORG_ID &&
		Number(user_type) === UserType.ENTERPRISE_PARTNER_ADMIN;

	const consoleUrl = isEpsPartner ? getEpsConsoleUrl(mobile) : null;

	if (!consoleUrl) return null;

	// ponytail: plain window.open (not useAppLink) so the mobile-bearing URL isn't logged
	const openConsole = () =>
		window.open(consoleUrl, "_blank", "noopener,noreferrer");

	return (
		<Flex
			gridColumn="1 / -1"
			direction={{ base: "column", md: "row" }}
			align={{ base: "flex-start", md: "center" }}
			justify="space-between"
			gap={{ base: 4, md: 8 }}
			w="100%"
			p={{ base: 5, md: 8 }}
			borderRadius="10px"
			bgGradient="linear(to-r, primary.dark, primary.light)"
			color="white"
			boxShadow="md"
			{...props}
		>
			<Flex direction="column" gap={2}>
				<Text fontSize={{ base: "xl", md: "3xl" }} fontWeight="bold">
					Manage your API business on EPS Console
				</Text>
				<Text fontSize={{ base: "sm", md: "lg" }} opacity={0.9}>
					Your EPS partner account is best managed on the new EPS
					Console.
				</Text>
			</Flex>
			<Button
				variant="accent"
				size="lg"
				flexShrink={0}
				w={{ base: "100%", md: "auto" }}
				onClick={openConsole}
			>
				Go to EPS Console
			</Button>
		</Flex>
	);
};

export { EpsConsoleBanner };
