import { PaddingBox } from "components";
import { product_slug_map } from "constants";
import { useRouter } from "next/router";
import { PricingForm } from "page-components/Admin";

const PricingFormPage = () => {
	const router = useRouter();
	const { slug } = router.query;
	const { label, comp } = product_slug_map[slug] ?? {};

	return (
		<PaddingBox>
			<PricingForm {...{ label, comp }} />
		</PaddingBox>
	);
};

PricingFormPage.pageMeta = {
	title: `Pricing & Commissions`,
	isSubPage: true,
};

export default PricingFormPage;
