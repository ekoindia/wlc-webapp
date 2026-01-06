/**
 * Admin KYC Verification - Results page route.
 * Displays verification progress and results.
 */

import { Breadcrumb, PaddingBox } from "components";
import { generateBreadcrumbs } from "components/BreadcrumbWrapper/breadcrumbUtils";
import { VerificationResultsPage } from "features/kyc-verification";
import { useRouter } from "next/router";

const AdminVerificationResultsRoute = (): JSX.Element => {
	const router = useRouter();

	const labelOverrides = {
		admin: "Admin",
		products: "Products",
		"kyc-verification": "KYC & Verification",
		results: "Results",
	};

	const omitPaths = ["/admin", "/admin/products"];

	const crumbs = generateBreadcrumbs(
		router.asPath,
		labelOverrides,
		omitPaths
	);

	return (
		<PaddingBox>
			<Breadcrumb crumbs={crumbs} />
			<VerificationResultsPage basePath="/admin/products/kyc-verification" />
		</PaddingBox>
	);
};

AdminVerificationResultsRoute.pageMeta = {
	title: "KYC & Verification | Results",
	isBeta: true,
	isSubPage: true,
	isFixedBottomAppBar: true,
};

export default AdminVerificationResultsRoute;
