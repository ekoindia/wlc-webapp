/**
 * Gateway route exposing pre-built product pages to external callers (popup /
 * new-tab embedding). Mode B (direct access_token) only, for now:
 * `/gateway/products/<product>?access_token=<token>` silently logs in with the
 * token and renders the product page. Mode A (one-time `?code=` redeem) will be
 * added once the EPS backend endpoints exist.
 * See docs/features/gateway/gateway-v2-frontend-plan.md.
 */

import { Center, Heading, Text, VStack } from "@chakra-ui/react";
import { PageLoader, PaddingBox } from "components";
import { useUser } from "contexts";
import { GATEWAY_PRODUCT_PAGES } from "features/gateway/registry";
import { useGatewayDirectLogin } from "features/gateway/useGatewayDirectLogin";
import { useFeatureFlag } from "hooks";
import { LayoutGateway } from "layout-components";
import { useRouter } from "next/router";

/**
 * Full-screen dead-end message for gateway sessions. No navigation offered —
 * the caller (partner app) owns the window; the user closes it and restarts
 * from there.
 * @param {object} props - Component props
 * @param {string} props.title - Short heading
 * @param {string} props.message - One-line explanation
 */
const GatewayDeadEnd = ({
	title,
	message,
}: {
	title: string;
	message: string;
}): JSX.Element => (
	<Center minH="100vh" px="4">
		<VStack spacing="2" textAlign="center">
			<Heading size="md">{title}</Heading>
			<Text color="gray.500">{message}</Text>
		</VStack>
	</Center>
);

const GatewayProductRoute = (): JSX.Element | null => {
	const router = useRouter();
	const [isGatewayAllowed] = useFeatureFlag("ELOKA_GATEWAY");
	const status = useGatewayDirectLogin(isGatewayAllowed);
	const { isLoggedIn } = useUser();

	// Wait for hydration & the feature flag (both resolve client-side; the flag
	// stays false when the gateway is disabled — render nothing, like the
	// existing /gateway/[...id] route does).
	if (!router.isReady || !isGatewayAllowed) return null;

	if (status === "pending") return <PageLoader />;

	if (!isLoggedIn) {
		return status === "no_credential" ? (
			<GatewayDeadEnd
				title="Missing credentials"
				message="This page must be opened with an access_token. Close this window and restart from the app that sent you here."
			/>
		) : (
			<GatewayDeadEnd
				title="Could not sign in"
				message="The access token is invalid or expired. Close this window and restart from the app that sent you here."
			/>
		);
	}

	const path = router.query.path as string[] | undefined;
	const product = path?.[0] ? GATEWAY_PRODUCT_PAGES[path[0]] : undefined;

	if (!product) {
		return (
			<GatewayDeadEnd
				title="Product not available"
				message="This product is not available through the gateway."
			/>
		);
	}

	const ProductPage = product.component;

	return (
		<PaddingBox>
			<ProductPage subPath={path!.slice(1)} />
		</PaddingBox>
	);
};

// Minimal chrome: no header, no sidebar, no breadcrumbs.
GatewayProductRoute.getLayout = LayoutGateway;

export default GatewayProductRoute;
