import { PaddingBox } from "components";
import { Dashboard } from "page-components/Admin";

const DashboardPage = () => {
	return (
		<PaddingBox>
			<Dashboard />
		</PaddingBox>
	);
};

DashboardPage.pageMeta = {
	title: "Dashboard | Admin",
};

export default DashboardPage;
