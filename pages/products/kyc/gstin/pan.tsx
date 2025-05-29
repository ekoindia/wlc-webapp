import { BreadcrumbWrapper, PaddingBox } from "components";
import { GstinPanForm } from "page-components/products/kyc/gstin/GstinPanForm";

const GstinPanPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/gstin": "GSTIN Verification",
					"/products/kyc/gstin/pan": "PAN Lookup",
				}}
				hideHome
			>
				<GstinPanForm />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

export default GstinPanPage;
