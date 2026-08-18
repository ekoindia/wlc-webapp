import {
	KycServicesProvider,
	KycVerificationPage,
	ServiceFormPage,
	useKycServices,
	VerificationResultsPage,
} from "features/kyc-verification";
import { useMemo } from "react";

/** Base path used for all in-product navigation inside the gateway, so the flow never escapes to the full /products/* app shell. */
const KYC_GATEWAY_BASE = "/gateway/products/kyc-verification";

/**
 * Service form for gateway sub-paths (e.g. /gateway/products/kyc-verification/pan-lite).
 * Mirrors pages/products/kyc-verification/[...serviceCode].tsx: slugs → service codes.
 * Must render inside KycServicesProvider (uses its context).
 * @param {object} props - Component props
 * @param {string[]} props.slugs - Service slugs from the URL sub-path
 */
const KycGatewayServiceForm = ({ slugs }: { slugs: string[] }): JSX.Element => {
	const { getCodesBySlugs } = useKycServices();
	const serviceCodes = useMemo(
		() => getCodesBySlugs(slugs),
		[getCodesBySlugs, slugs]
	);
	return (
		<ServiceFormPage
			serviceCodes={serviceCodes}
			basePath={KYC_GATEWAY_BASE}
		/>
	);
};

/**
 * KYC & Verification product family inside the gateway. Routes the sub-path
 * under /gateway/products/kyc-verification/* the same way the normal
 * /products/kyc-verification/* pages do, with `basePath` pointed back at the
 * gateway so every internal navigation stays contained.
 * @param {object} props - Component props
 * @param {string[]} props.subPath - Path segments after the product key
 */
const KycVerificationGateway = ({
	subPath,
}: {
	subPath: string[];
}): JSX.Element => {
	let content: JSX.Element;
	if (subPath.length === 0) {
		// Listing. Tools (Bulk Upload / Builder / Manage) navigate outside the
		// gateway or manage the agent network — not for embedded callers.
		content = <KycVerificationPage basePath={KYC_GATEWAY_BASE} hideTools />;
	} else if (subPath[0] === "results") {
		content = (
			<VerificationResultsPage
				basePath={KYC_GATEWAY_BASE}
				hideHomeButton
			/>
		);
	} else {
		content = <KycGatewayServiceForm slugs={subPath} />;
	}

	return <KycServicesProvider>{content}</KycServicesProvider>;
};

/**
 * Allowlist of product pages exposable via /gateway/products/<key>/<...subPath>.
 *
 * Keyed by the first path segment under /gateway/products/. An unlisted key
 * renders a "product not available" screen — this list is deliberately an
 * allowlist, not a passthrough to every /products/* page, and doubles as the
 * source for the backend's product → API scope mapping (Mode A).
 * See docs/features/gateway/gateway-v2-frontend-plan.md (Phase 4).
 *
 * v1 scope: KYC & Verification family only.
 */
export const GATEWAY_PRODUCT_PAGES: Record<
	string,
	{
		label: string;
		component: React.ComponentType<{ subPath: string[] }>;
	}
> = {
	"kyc-verification": {
		label: "KYC & Verification",
		component: KycVerificationGateway,
	},
};
