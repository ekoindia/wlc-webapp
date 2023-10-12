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

OnboardAgents.pageMeta = {
	title: "Onboard Agents | Admin",
};

export default OnboardAgentsPage;
