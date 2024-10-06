import { BreadcrumbsWrapper, PaddingBox } from "components";
import { PricingCommissionObject } from "constants";
import { useRouter } from "next/router";
import { PricingForm } from "page-components/Admin";

const PricingFormPage = () => {
	const router = useRouter();
	const { slug } = router.query;

	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={PricingCommissionObject}>
				<PricingForm slug={slug} />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

PricingFormPage.pageMeta = {
	title: `Configure Pricing & Commissions`,
	isSubPage: true,
	isFixedBottomAppBar: true,
};

export default PricingFormPage;
