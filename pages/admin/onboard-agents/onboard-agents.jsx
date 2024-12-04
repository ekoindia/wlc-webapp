import { BreadcrumbsWrapper, PaddingBox } from "components";
import { OnboardAgents } from "page-components/Admin";

const OnboardAgentsPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper
				breadcrumbsData={{
					"/admin/onboard-agents": "Onboard Agents",
				}}
			>
				<OnboardAgents />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

OnboardAgentsPage.pageMeta = {
	title: "Onboard Agents | Admin",
	isFixedBottomAppBar: true,
};

export default OnboardAgentsPage;
