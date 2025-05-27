import { BreadcrumbWrapper, PaddingBox } from "components";
import { PanBulkForm } from "page-components/products/kyc/pan/PanBulkForm";

const PanBulkPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/pan": "PAN Verification",
					"/products/kyc/pan/bulk": "Bulk PAN Verification",
				}}
				hideHome
			>
				<PanBulkForm />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

export default PanBulkPage;
