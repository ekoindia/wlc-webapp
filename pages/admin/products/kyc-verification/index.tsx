/**
 * KYC Verification - Main listing page route.
 * Displays all verification services with filtering and search.
 */

import { Breadcrumb, PaddingBox } from "components";
import { generateBreadcrumbs } from "components/BreadcrumbWrapper/breadcrumbUtils";
import { KycVerificationPage } from "features/kyc-verification";
import { useRouter } from "next/router";

const KycVerificationRoute = (): JSX.Element => {
	const router = useRouter();

	const labelOverrides = {
		admin: "Admin",
		products: "Products",
		"kyc-verification": "KYC & Verification",
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
			<KycVerificationPage basePath="/admin/products/kyc-verification" />
		</PaddingBox>
	);
};

KycVerificationRoute.pageMeta = {
	title: "KYC & Verification",
	isBeta: true,
	isSubPage: false,
};

export default KycVerificationRoute;
