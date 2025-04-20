import { BreadcrumbsWrapper, PaddingBox } from "components";
import { GstinPanForm } from "page-components/products/kyc/gstin/GstinPanForm";

const GstinPanPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/gstin": "GSTIN Verification",
					"/products/gstin/pan": "PAN Lookup",
				}}
			>
				<GstinPanForm />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default GstinPanPage;
