import { BreadcrumbsWrapper, PaddingBox } from "components";
import { GstinVerifyForm } from "page-components/products/kyc/gstin/GstinVerifyForm";

const GstinVerifyPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/gstin": "GSTIN Verification",
					"/products/kyc/gstin/verify": "Verify GSTIN",
				}}
			>
				<GstinVerifyForm />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default GstinVerifyPage;
