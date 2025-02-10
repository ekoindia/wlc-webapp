import { BreadcrumbsWrapper, PaddingBox } from "components";
import { MyNetworkBreadcrumbs } from "constants";
import { ChangeRole } from "page-components/Admin";

const ChangeRolePage = () => {
	return (
		<PaddingBox>
			<BreadcrumbsWrapper breadcrumbsData={MyNetworkBreadcrumbs}>
				<ChangeRole />
			</BreadcrumbsWrapper>
		</PaddingBox>
	);
};

ChangeRolePage.pageMeta = {
	title: "My Network > Change Role | Admin",
	isSubPage: true,
	isFixedBottomAppBar: true,
};

export default ChangeRolePage;
