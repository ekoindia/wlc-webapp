/**
 * KYC Verification - Results page route.
 * Displays verification progress and results.
 */

import { Breadcrumb, PaddingBox } from "components";
import { generateBreadcrumbs } from "components/BreadcrumbWrapper/breadcrumbUtils";
import { VerificationResultsPage } from "features/kyc-verification";
import { useRouter } from "next/router";

const VerificationResultsRoute = (): JSX.Element => {
	const router = useRouter();

	const labelOverrides = {
		products: "Products",
		"kyc-verification": "KYC & Verification",
		results: "Results",
	};

	const omitPaths = ["/products"];

	const crumbs = generateBreadcrumbs(
		router.asPath,
		labelOverrides,
		omitPaths
	);

	return (
		<PaddingBox>
			<Breadcrumb crumbs={crumbs} />
			<VerificationResultsPage />
		</PaddingBox>
	);
};

VerificationResultsRoute.pageMeta = {
	title: "KYC & Verification | Results",
	isBeta: true,
	isSubPage: true,
	isFixedBottomAppBar: true,
};

export default VerificationResultsRoute;
