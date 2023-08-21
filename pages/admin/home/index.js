import { PaddingBox } from "components";
import { Home } from "page-components";

const AgentViewHomePage = () => {
	return (
		<PaddingBox>
			<Home />
		</PaddingBox>
	);
};

AgentViewHomePage.pageMeta = {
	title: "Agent Homepage | Admin",
};

export default AgentViewHomePage;
