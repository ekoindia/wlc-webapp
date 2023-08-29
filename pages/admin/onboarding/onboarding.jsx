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
	title: "Onboard Agents | Admin",
};

export default OnboardingPage;
