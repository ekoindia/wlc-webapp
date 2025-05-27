import { BreadcrumbWrapper, PaddingBox } from "components";
import { EmploymentForm } from "page-components/products/kyc/employment/EmploymentForm";

/**
 * Page for verifying employee details
 */
const EmploymentVerifyPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/employment": "Employee Verification",
				}}
				hideHome
			>
				<EmploymentForm />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

export default EmploymentVerifyPage;
