import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { UserType } from "constants/UserTypes";
import { useUser } from "contexts";

/** Org whose Enterprise Partners are nudged to EPS Console */
const EPS_ORG_ID = 1;

interface EpsConsoleBannerProps extends FlexProps {
	consoleUrl: string;
}

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
 * EPS Console URL for the logged-in user, or null when the user isn't an
 * EPS partner (org 1, user-type 23) or NEXT_PUBLIC_EPS_CONSOLE_URL is unset.
 * @returns {string|null} Console URL
 */
const useEpsConsoleUrl = (): string | null => {
	const { userData } = useUser();
	const { user_type, org_id, mobile } = userData?.userDetails ?? {};

	const isEpsPartner =
		Number(org_id) === EPS_ORG_ID &&
		Number(user_type) === UserType.ENTERPRISE_PARTNER_ADMIN;

	return isEpsPartner ? getEpsConsoleUrl(mobile) : null;
};

/**
 * Full-width banner telling EPS partners their dashboard moved to EPS Console.
 * Spans all columns when placed inside the Home widget grid.
 * @param {EpsConsoleBannerProps} props Properties passed to the component
 * @param {string} props.consoleUrl EPS Console URL (from useEpsConsoleUrl)
 * @returns {JSX.Element} Banner
 * @example `<EpsConsoleBanner consoleUrl={url} />`
 */
const EpsConsoleBanner = ({ consoleUrl, ...rest }: EpsConsoleBannerProps) => {
	// ponytail: plain window.open (not useAppLink) so the mobile-bearing URL isn't logged
	const openConsole = () =>
		window.open(consoleUrl, "_blank", "noopener,noreferrer");

	return (
		<Flex
			gridColumn="1 / -1"
			direction={{ base: "column", md: "row" }}
			align={{ base: "flex-start", md: "center" }}
			gap={{ base: 6, md: 10 }}
			w="100%"
			minH={{ base: "auto", md: "320px" }}
			px={{ base: 6, md: 12 }}
			py={{ base: 8, md: 14 }}
			borderRadius="10px"
			bgGradient="linear(to-r, primary.dark, primary.light)"
			color="white"
			boxShadow="md"
			{...rest}
		>
			<Icon
				name="open-in-new"
				size={{ base: "56px", md: "96px" }}
				flexShrink={0}
				opacity={0.9}
			/>
			<Flex direction="column" gap={{ base: 4, md: 6 }}>
				<Text fontSize={{ base: "xl", md: "3xl" }} fontWeight="bold">
					Manage your API business on EPS Console
				</Text>
				<Text
					fontSize={{ base: "md", md: "xl" }}
					opacity={0.9}
					lineHeight="1.5"
				>
					Your dashboard, API credentials, and developer tools have
					now permanently moved to eps.eko.in. Please login to the EPS
					console.
				</Text>
				<Button
					variant="accent"
					size="lg"
					icon="arrow-forward"
					iconPosition="right"
					alignSelf="flex-start"
					w={{ base: "100%", md: "auto" }}
					onClick={openConsole}
				>
					Login to eps.eko.in
				</Button>
			</Flex>
		</Flex>
	);
};

export { EpsConsoleBanner, useEpsConsoleUrl };
