import { BreadcrumbsWrapper, PaddingBox, PageTitle } from "components";
import { DrivingLicenseForm } from "page-components/products/kyc/driving-license/DrivingLicenseForm";

const DrivingLicensePage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
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
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default DrivingLicensePage;
