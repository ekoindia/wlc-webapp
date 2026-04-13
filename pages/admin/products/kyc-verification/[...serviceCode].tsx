/**
 * Admin KYC Verification - Service form route (catch-all).
 * Handles both single service (/pan-lite) and multi-service (/pan-lite/verify-gstin) routes.
 * Uses slugified service names for SEO-friendly URLs.
 */

import { Breadcrumb, PaddingBox } from "components";
import { BreadcrumbItem } from "components/BreadcrumbWrapper/breadcrumbUtils";
import {
	KycServicesProvider,
	ServiceFormPage,
	useKycServices,
} from "features/kyc-verification";
import { useRouter } from "next/router";
import { useMemo } from "react";

/**
 * Inner component that uses the KYC services context.
 * @returns {JSX.Element} Admin service form route content
 */
const AdminServiceFormRouteInner = (): JSX.Element => {
	const router = useRouter();
	const { getCodesBySlugs, getServicesBySlugs } = useKycServices();

	// Extract service slugs from catch-all route
	const { serviceCode: serviceSlugs } = router.query;
	console.log("[AdminServiceFormRoute] serviceSlugs", serviceSlugs);

	// Ensure we have an array of slugs (memoized to avoid recreating on every render)
	const slugs: string[] = useMemo(
		() =>
			Array.isArray(serviceSlugs)
				? serviceSlugs
				: serviceSlugs
					? [serviceSlugs]
					: [],
		[serviceSlugs]
	);

	// Convert slugs to service codes for the form
	const serviceCodes = useMemo(
		() => getCodesBySlugs(slugs),
		[getCodesBySlugs, slugs]
	);

	// Get service objects for breadcrumb labels
	const serviceObjects = useMemo(
		() => getServicesBySlugs(slugs),
		[getServicesBySlugs, slugs]
	);

	// Build breadcrumbs - show "Verify X Services" for multi-service, service name for single
	const crumbs: BreadcrumbItem[] = useMemo(() => {
		const baseCrumbs: BreadcrumbItem[] = [
			{
				href: "/admin/products/kyc-verification",
				label: "KYC & Verification",
				isCurrent: false,
			},
		];

		if (serviceObjects.length > 1) {
			// Multi-service mode: show "Verify X Services"
			baseCrumbs.push({
				href: router.asPath,
				label: `Verify ${serviceObjects.length} Services`,
				isCurrent: true,
			});
		} else if (serviceObjects.length === 1) {
			// Single service: show service name
			baseCrumbs.push({
				href: router.asPath,
				label: serviceObjects[0].name,
				isCurrent: true,
			});
		}

		return baseCrumbs;
	}, [serviceObjects, router.asPath]);

	// Guard: If the first slug is "workflows", this route should not handle it
	// Let the specific workflows/[id] route handle it instead
	if (slugs.length > 0 && slugs[0] === "workflows") {
		return <></>;
	}

	return (
		<>
			<Breadcrumb crumbs={crumbs} />
			<ServiceFormPage
				serviceCodes={serviceCodes}
				basePath="/admin/products/kyc-verification"
			/>
		</>
	);
};

const AdminServiceFormRoute = (): JSX.Element => {
	return (
		<PaddingBox>
			<KycServicesProvider>
				<AdminServiceFormRouteInner />
			</KycServicesProvider>
		</PaddingBox>
	);
};

AdminServiceFormRoute.pageMeta = {
	title: "KYC & Verification | Service Form",
	isBeta: true,
	isSubPage: true,
	isFixedBottomAppBar: true,
};

export default AdminServiceFormRoute;
