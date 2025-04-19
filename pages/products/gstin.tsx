import { Text } from "@chakra-ui/react";
import { BreadcrumbsWrapper, PaddingBox } from "components";
import { GstinVerification } from "page-components/products/gstin/GstinVerification";

// TODO: Confirm role

const GstinPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/products/gstin": "GSTIN Verification",
				}}
			>
				<Text fontSize="2xl" fontWeight="bold" mb={6}>
					GSTIN Verification
				</Text>
				<GstinVerification />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

export default GstinPage;
