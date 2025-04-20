// filepath: /Users/abhi/DEV/eko_github/wlc-webapp/pages/products/kyc/index.tsx
import { Text } from "@chakra-ui/react";
import { PaddingBox } from "components";
import { KycVerificationTools } from "page-components/products/kyc/KycVerificationTools";

const KycPage = (): JSX.Element => {
	return (
		<PaddingBox>
			<Text fontSize="2xl" fontWeight="bold" mb={6}>
				KYC Verification Tools
			</Text>
			<KycVerificationTools />
		</PaddingBox>
	);
};

export default KycPage;
