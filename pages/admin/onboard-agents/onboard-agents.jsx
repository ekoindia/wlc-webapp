import { BreadcrumbsWrapper, PaddingBox } from "components";
import { OnboardAgentObject } from "constants";
import { OnboardAgents } from "page-components/Admin";

const OnboardAgentsPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={OnboardAgentObject}>
				<OnboardAgents />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

OnboardAgentsPage.pageMeta = {
	title: "Onboard Agents | Admin",
	reduceBottomAppBarAnimation: true,
};

export default OnboardAgentsPage;
