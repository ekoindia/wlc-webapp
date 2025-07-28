import { PaddingBox } from "components";
import { Dashboard } from "page-components/Admin";
import { withPageTranslations } from "../../utils/withPageTranslations";

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

export const getStaticProps = withPageTranslations({
	namespaces: ["common", "dashboard"],
});

export default DashboardPage;
