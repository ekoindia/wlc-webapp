// filepath: /Users/abhi/DEV/eko_github/wlc-webapp/pages/products/kyc/index.tsx
import { PaddingBox, PageTitle } from "components";
import { KycVerificationTools } from "page-components/products/kyc/KycVerificationTools";

const KycPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<PageTitle title="KYC Verification Tools" isBeta />
			<KycVerificationTools />
		</PaddingBox>
	);
};

export default KycPage;
