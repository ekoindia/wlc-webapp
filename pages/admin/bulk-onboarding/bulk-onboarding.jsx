import { BreadcrumbsWrapper, PaddingBox } from "components";
import { BulkOnboardingBreadcrumbData } from "constants";
import { BulkOnboarding } from "page-components/Admin";

const BulkOnboardingPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				BreadcrumbsObject={BulkOnboardingBreadcrumbData}
			>
				<BulkOnboarding />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

BulkOnboardingPage.pageMeta = {
	title: "Bulk Onboarding | Admin",
};

export default BulkOnboardingPage;
