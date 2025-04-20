// filepath: /Users/abhi/DEV/eko_github/wlc-webapp/pages/products/kyc/vehicle-rc/index.tsx
import { BreadcrumbsWrapper, PaddingBox } from "components";
import { VehicleRcForm } from "page-components/products/kyc/vehicle-rc/VehicleRcForm";

const VehicleRcPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/vehicle-rc": "Vehicle RC Verification",
				}}
			>
				<VehicleRcForm />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default VehicleRcPage;
