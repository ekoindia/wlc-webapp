import { BreadcrumbsWrapper, PaddingBox } from "components";
import { BusinessSettingsBreadcrumbs } from "constants/BreadcrumbsData";
import { useRouter } from "next/router";
import { PricingForm } from "page-components/Admin";

const BusinessSettingSubpage = () => {
	const router = useRouter();
	const { slug } = router.query;

	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={BusinessSettingsBreadcrumbs}
				slug={slug}
			>
				<PricingForm slug={slug} />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

BusinessSettingSubpage.pageMeta = {
	title: "Configure Business Settings",
	isSubPage: true,
	isFixedBottomAppBar: true,
};

export default BusinessSettingSubpage;
