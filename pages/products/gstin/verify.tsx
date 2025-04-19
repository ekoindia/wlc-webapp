import { BreadcrumbsWrapper, PaddingBox } from "components";
import { GstinVerifyForm } from "page-components/products/gstin/GstinVerifyForm";

const GstinVerifyPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/gstin": "GSTIN Verification",
					"/products/gstin/verify": "Verify GSTIN",
				}}
			>
				<GstinVerifyForm />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default GstinVerifyPage;
