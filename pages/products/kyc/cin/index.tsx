// filepath: /Users/abhi/DEV/eko_github/wlc-webapp/pages/products/kyc/cin/index.tsx
import { BreadcrumbsWrapper, PaddingBox } from "components";
import { CinForm } from "page-components/products/kyc/cin/CinForm";

/**
 * Page for verifying Corporate Identification Number (CIN) details
 */
const CinVerifyPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/cin": "CIN Verification",
				}}
				hideHome
			>
				<CinForm />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default CinVerifyPage;
