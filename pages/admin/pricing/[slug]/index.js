import { BreadcrumbWrapper, PaddingBox } from "components";
import { PricingCommissionBreadcrumbs } from "constants";
import { useRouter } from "next/router";
import { PricingForm } from "page-components/Admin";

const PricingFormPage = () => {
	const router = useRouter();
	const { slug } = router.query;

	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={PricingCommissionBreadcrumbs}
				slug={slug}
			>
				<PricingForm slug={slug} />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

PricingFormPage.pageMeta = {
	title: `Configure Pricing & Commissions`,
	isFixedBottomAppBar: true,
};

export default PricingFormPage;
