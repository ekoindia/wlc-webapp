import { BreadcrumbsWrapper, PaddingBox, PageTitle } from "components";
import { PanVerification } from "page-components/products/kyc/pan/PanVerification";

const PanPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/pan": "PAN Verification",
				}}
				hideHome
			>
				<PageTitle title="PAN Verification" />
				<PanVerification />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default PanPage;
