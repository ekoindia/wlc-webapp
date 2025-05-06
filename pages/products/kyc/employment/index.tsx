import { BreadcrumbsWrapper, PaddingBox } from "components";
import { EmploymentForm } from "page-components/products/kyc/employment/EmploymentForm";

/**
 * Page for verifying employee details
 */
const EmploymentVerifyPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/employment": "Employee Verification",
				}}
				hideHome
			>
				<EmploymentForm />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default EmploymentVerifyPage;
