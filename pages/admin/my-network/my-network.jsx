import { BreadcrumbsWrapper, PaddingBox } from "components";
import { NetworkObject } from "constants";
import { Network } from "page-components/Admin";

const MyNetwork = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper BreadcrumbsObject={NetworkObject}>
				<Network />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

MyNetwork.pageMeta = {
	title: "My Network | Admin",
	isSubPage: true,
};

export default MyNetwork;
