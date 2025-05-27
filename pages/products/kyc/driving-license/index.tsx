import { BreadcrumbWrapper, PaddingBox, PageTitle } from "components";
import { DrivingLicenseForm } from "page-components/products/kyc/driving-license/DrivingLicenseForm";

const DrivingLicensePage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/driving-license":
						"Driving License Verification",
				}}
				hideHome
			>
				<PageTitle
					title="Driving License Verification"
					isBeta
					hideBackIcon
				/>
				<DrivingLicenseForm />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

export default DrivingLicensePage;
