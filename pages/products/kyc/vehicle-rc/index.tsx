// filepath: /Users/abhi/DEV/eko_github/wlc-webapp/pages/products/kyc/vehicle-rc/index.tsx
import { BreadcrumbWrapper, PaddingBox } from "components";
import { VehicleRcForm } from "page-components/products/kyc/vehicle-rc/VehicleRcForm";

const VehicleRcPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/vehicle-rc": "Vehicle RC Verification",
				}}
				hideHome
			>
				<VehicleRcForm />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

export default VehicleRcPage;
