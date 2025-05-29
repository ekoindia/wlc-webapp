import { BreadcrumbWrapper, PaddingBox } from "components";
import { BusinessSettingsBreadcrumbs } from "constants/BreadcrumbsData";
import { useRouter } from "next/router";
import { PricingForm } from "page-components/Admin";

const BusinessSettingSubpage = () => {
	const router = useRouter();
	const { slug } = router.query;

	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={BusinessSettingsBreadcrumbs}
				slug={slug}
			>
				<PricingForm slug={slug} />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

BusinessSettingSubpage.pageMeta = {
	title: "Configure Business Settings",
	isFixedBottomAppBar: true,
};

export default BusinessSettingSubpage;
