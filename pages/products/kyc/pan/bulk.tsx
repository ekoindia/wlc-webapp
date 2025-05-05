import { BreadcrumbsWrapper, PaddingBox } from "components";
import { PanBulkForm } from "page-components/products/kyc/pan/PanBulkForm";

const PanBulkPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/pan": "PAN Verification",
					"/products/kyc/pan/bulk": "Bulk PAN Verification",
				}}
				hideHome
			>
				<PanBulkForm />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default PanBulkPage;
