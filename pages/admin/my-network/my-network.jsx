import { BreadcrumbsWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { Network } from "page-components/Admin";

const MyNetwork = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<Network />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

MyNetwork.pageMeta = {
	title: "My Network | Admin",
};

export default MyNetwork;
