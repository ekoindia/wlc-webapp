import { BreadcrumbWrapper, PaddingBox } from "components";
import { PanLiteForm } from "page-components/products/kyc/pan/PanLiteForm";

const PanLitePage = (): JSX.Element => {
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
