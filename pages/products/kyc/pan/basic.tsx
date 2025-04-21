import { BreadcrumbsWrapper, PaddingBox } from "components";
import { PanBasicForm } from "page-components/products/kyc/pan/PanBasicForm";

const PanBasicPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/pan": "PAN Verification",
					"/products/kyc/pan/basic": "PAN Basic",
				}}
				hideHome
			>
				<PanBasicForm />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default PanBasicPage;
