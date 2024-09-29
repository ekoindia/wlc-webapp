import { useMemo } from "react";
import { BreadcrumbsWrapper, PaddingBox } from "components";
import { PricingCommissionObject, product_slug_map } from "constants";
import { useRouter } from "next/router";
import { PricingForm } from "page-components/Admin";

// Map template to the component name
const TemplateComponent = {
	fileupload: "FormFileUpload",
};

const PricingFormPage = () => {
	const router = useRouter();
	const { slug } = router.query;
	const { label, comp, note, template, meta } = product_slug_map[slug] ?? {};

	const componentName = useMemo(() => {
		if (template && template in TemplateComponent) {
			return TemplateComponent[template];
		}
		return comp;
	}, [template]);

	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={PricingCommissionObject}>
				<PricingForm {...{ label, comp: componentName, note, meta }} />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

PricingFormPage.pageMeta = {
	title: `Pricing & Commissions`,
	isSubPage: true,
	isFixedBottomAppBar: true,
};

export default PricingFormPage;
