import { BreadcrumbsWrapper, PaddingBox } from "components";
import { OnboardingBreadcrumbData } from "constants";
import { Onboarding } from "page-components/Admin";

const OnboardingPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={OnboardingBreadcrumbData}>
				<Onboarding />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

OnboardingPage.pageMeta = {
	title: "Onboard Sellers & Distributors | Admin",
};

export default OnboardingPage;
