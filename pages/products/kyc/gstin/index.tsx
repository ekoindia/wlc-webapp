import { BreadcrumbsWrapper, PaddingBox, PageTitle } from "components";
import { GstinVerification } from "page-components/products/kyc/gstin/GstinVerification";

// TODO: Confirm role

const GstinPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/gstin": "GSTIN Verification",
				}}
			>
				<PageTitle title="GSTIN Verification" />
				<GstinVerification />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default GstinPage;
