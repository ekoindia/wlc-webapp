import { BreadcrumbsWrapper, PaddingBox } from "components";
import { GstinPanForm } from "page-components/products/kyc/gstin/GstinPanForm";

const GstinPanPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/gstin": "GSTIN Verification",
					"/products/kyc/gstin/pan": "PAN Lookup",
				}}
			>
				<GstinPanForm />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default GstinPanPage;
