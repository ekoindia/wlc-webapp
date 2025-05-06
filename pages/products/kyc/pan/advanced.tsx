import { BreadcrumbsWrapper, PaddingBox } from "components";
import { PanAdvancedForm } from "page-components/products/kyc/pan/PanAdvancedForm";

const PanAdvancedPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/pan": "PAN Verification",
					"/products/kyc/pan/advanced": "PAN Advanced",
				}}
				hideHome
			>
				<PanAdvancedForm />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default PanAdvancedPage;
