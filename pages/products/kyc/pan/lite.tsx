import { BreadcrumbsWrapper, PaddingBox } from "components";
import { PanLiteForm } from "page-components/products/kyc/pan/PanLiteForm";

const PanLitePage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/pan": "PAN Verification",
					"/products/kyc/pan/lite": "PAN Lite",
				}}
				hideHome
			>
				<PanLiteForm />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default PanLitePage;
