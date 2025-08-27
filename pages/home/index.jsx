import { PaddingBox } from "components";
import { useFeatureFlag } from "hooks";
import { Home } from "page-components";
import { Dashboard } from "page-components/Admin";

const HomePage = () => {
	const [showAdminDashboard] = useFeatureFlag(
		"ADMIN_DASHBOARD_FOR_SUBNETWORK"
	);

	return (
		<PaddingBox>{showAdminDashboard ? <Dashboard /> : <Home />}</PaddingBox>
	);
};

HomePage.pageMeta = {
	title: "Home",
};

export default HomePage;
