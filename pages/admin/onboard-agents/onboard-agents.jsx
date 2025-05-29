import { BreadcrumbWrapper, PaddingBox } from "components";
import { OnboardAgents } from "page-components/Admin";

const OnboardAgentsPage = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper
				breadcrumbsData={{
					"/admin/onboard-agents": "Onboard Agents",
				}}
			>
				<OnboardAgents />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

OnboardAgentsPage.pageMeta = {
	title: "Onboard Agents | Admin",
	isFixedBottomAppBar: true,
};

export default OnboardAgentsPage;
