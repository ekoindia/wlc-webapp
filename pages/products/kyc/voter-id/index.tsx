// filepath: /Users/abhi/DEV/eko_github/wlc-webapp/pages/products/kyc/voter-id/verify.tsx
import { BreadcrumbWrapper, PaddingBox } from "components";
import { VoterIdForm } from "page-components/products/kyc/voter-id/VoterIdForm";

const VoterIdVerifyPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/products/kyc": "KYC Verification Tools",
					"/products/kyc/voter-id": "Voter ID Verification",
				}}
				hideHome
			>
				<VoterIdForm />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

export default VoterIdVerifyPage;
