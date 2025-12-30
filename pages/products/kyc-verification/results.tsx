/**
 * KYC Verification - Results page route.
 * Displays verification progress and results.
 */

import { PaddingBox } from "components";
import { VerificationResultsPage } from "features/kyc-verification";

const VerificationResultsRoute = (): JSX.Element => {
	return (
		<PaddingBox>
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
