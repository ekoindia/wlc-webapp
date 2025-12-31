/**
 * Admin KYC Verification - Results page route.
 * Displays verification progress and results.
 */

import { PaddingBox } from "components";
import { VerificationResultsPage } from "features/kyc-verification";

const AdminVerificationResultsRoute = (): JSX.Element => {
	return (
		<PaddingBox>
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
