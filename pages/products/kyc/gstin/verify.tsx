import { BreadcrumbWrapper, PaddingBox } from "components";
import { GstinVerifyForm } from "page-components/products/kyc/gstin/GstinVerifyForm";

const GstinVerifyPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/gstin": "GSTIN Verification",
					"/products/kyc/gstin/verify": "Verify GSTIN",
				}}
				hideHome
			>
				<GstinVerifyForm />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

export default GstinVerifyPage;
