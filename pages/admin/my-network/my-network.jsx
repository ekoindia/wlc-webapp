import { BreadcrumbWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { Network } from "page-components/Admin";
import { withPageTranslations } from "../../../utils/withPageTranslations";

const MyNetwork = () => {
	return (
		<PaddingBox>
			<BreadcrumbWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<Network />
			</BreadcrumbWrapper>
		</PaddingBox>
	);
};

MyNetwork.pageMeta = {
	title: "My Network | Admin",
};

export const getStaticProps = withPageTranslations({
	namespaces: ["common", "network"],
});

export default MyNetwork;
