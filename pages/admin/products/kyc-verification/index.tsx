/**
 * KYC Verification - Main listing page route.
 * Displays all verification services with filtering and search.
 */

import { PaddingBox } from "components";
import { KycVerificationPage } from "features/kyc-verification";

const KycVerificationRoute = (): JSX.Element => {
	return (
		<PaddingBox>
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
