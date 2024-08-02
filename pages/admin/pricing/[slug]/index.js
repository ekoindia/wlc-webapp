import { BreadcrumbsWrapper, PaddingBox } from "components";
import { PricingCommissionObject, product_slug_map } from "constants";
import { useRouter } from "next/router";
import { PricingForm } from "page-components/Admin";

const PricingFormPage = () => {
	const router = useRouter();
	const { slug } = router.query;
	const { label, comp, note } = product_slug_map[slug] ?? {};

	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={PricingCommissionObject}>
				<PricingForm {...{ label, comp, note }} />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

PricingFormPage.pageMeta = {
	title: `Pricing & Commissions`,
	isSubPage: true,
	reduceBottomAppBarAnimation: true,
};

export default PricingFormPage;
