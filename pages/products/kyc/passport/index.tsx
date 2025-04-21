import { BreadcrumbsWrapper, PaddingBox } from "components";
import { PassportForm } from "page-components/products/kyc/passport/PassportForm";

/**
 * Page for verifying Indian passport details
 */
const PassportVerifyPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/passport": "Passport Verification",
				}}
				hideHome
			>
				<PassportForm />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default PassportVerifyPage;
