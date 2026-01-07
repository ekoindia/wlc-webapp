import { BreadcrumbWrapper, PaddingBox } from "components";
import { PanLiteForm } from "page-components/products/kyc/pan/PanLiteForm";

const PanLitePage = (): React.ReactNode => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/pan": "PAN Verification",
					"/products/kyc/pan/lite": "PAN Lite",
				}}
				hideHome
			>
				<PanLiteForm />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

export default PanLitePage;
